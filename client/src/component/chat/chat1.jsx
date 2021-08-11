import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import ChatOnline from "../chatOnline/ChatOnline";
import Constants from '../constant/Constants';
import Conversation from "../conversations/Conversation";
import Message from "../message/Message";
import Topbar from "../topbar/Topbar";
import "./chat.css";
import { io } from 'socket.io-client';
import { useStateMachine } from 'little-state-machine';

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userList, setUserList] = useState([]);

    const socket = useRef();
    const { actions, state } = useStateMachine({});

    const scrollRef = useRef();

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                senderId: data.senderId,
                message: data.message,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.senderId) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", state.userDetails._id);
        socket.current.on("getUsers", async (users) => {
            console.log("users===>", users)
            await setOnlineUsers(users.filter(i => i.userId !== state.userDetails._id))
        });
        axios.get(Constants.GET_USER_URL).then(res => {
            setUserList(res.data.filter(i => i._id !== state.userDetails._id))
        })
    }, [state.userDetails]);



    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(Constants.CONVERSATION_URL + state.userDetails._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [state.userDetails._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                await axios.get(Constants.MESSAGE_URL + currentChat._id).then(res => {
                    if (res) {
                        setMessages(res.data)
                    }
                })
            }
            catch (err) {
                return err
            }
        }
        getMessages()

    }, [currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            senderId: state.userDetails._id,
            message: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== state.userDetails._id
        );

        socket.current.emit("sendMessage", {
            senderId: state.userDetails._id,
            receiverId,
            message: newMessage,
        });

        try {
            const res = await axios.post(Constants.MESSAGE_URL, message)
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleUserClick = async (list) => {
        let temp = []
        let conversationObj = {
            "senderId": state.userDetails._id,
            "receiverId": list._id
        }
        await axios.post(Constants.CONVERSATION_URL, conversationObj).then(async res => {
            if (res.data) {
                temp.push(res.data)
                if (conversations.length === 0) await setConversations(temp)
                else {
                    for (let index = 0; index < conversations.length; index++) {
                        let isAvailableChat = JSON.stringify(conversations[index].members) === JSON.stringify(res.data.members)
                        if (isAvailableChat) {
                            break;
                        }
                        else {
                            await setConversations([...conversations, res.data])
                        }
                    }
                }
                await setCurrentChat(res.data)
            }
        })
    }
    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={state.userDetails} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.senderId === state.userDetails._id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        className="chatMessageInput"
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="noConversationText">
                                Open a conversation to start a chat.
                            </span>
                        )}
                    </div>
                </div>
                <div className="chatOnline">
                    {console.log("onlineUsers", onlineUsers)}
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={state.userDetails._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="User List" className="chatMenuInput"></input>
                        {userList.map(list => {
                            return <div className="conversation">
                                <div onClick={() => handleUserClick(list)}>
                                    <div className="chatOnlineImgContainer">
                                        <img
                                            className="conversationImage"
                                            src="https://i.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
                                            alt="" ></img>
                                    </div>
                                    <div className="conversationName">{list.username}</div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}