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
// import moment from 'moment';

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userList, setUserList] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);

    const socket = useRef();
    const { state } = useStateMachine({});

    const scrollRef = useRef();

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            console.log("data", data)
            setArrivalMessage({
                senderId: data.senderId,
                message: data.message,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?._id === arrivalMessage.senderId &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);


    useEffect(() => {
        socket.current.emit("addUser", state.userDetails._id);
        socket.current.on("getUsers", async (users) => {
            await setOnlineUsers(users.filter(i => i.userId !== state.userDetails._id))
        });
        axios.get(Constants.GET_USER_URL).then(res => {
            setUserList(res.data.filter(i => i._id !== state.userDetails._id))
        })
    }, [state.userDetails]);

    useEffect(() => {
        getConversations();
    }, [state.userDetails._id]);

    /**
     * Get all conversation
     * @returns 
     */
    const getConversations = async () => {
        try {
            const res = await axios.get(Constants.CONVERSATION_URL);
            setConversations(res.data);
            return res.data
        } catch (err) {
            console.log(err);
            return []
        }
    };

    useEffect(() => {
        const getMessages = async () => {
            try {
                await axios.get(Constants.MESSAGE_URL + currentChat._id).then(res => {
                    if (res) setMessages(res.data)
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
            conversationId: currentConversationId,
        };
        socket.current.emit("sendMessage", {
            senderId: state.userDetails._id,
            receiverId: currentChat._id,
            message: newMessage,
        });

        try {
            const res = await axios.post(Constants.MESSAGE_URL, message)
            // let date = convertMessageTime(res.data.createdAt, new Date())
            // res.data.createdAt = date
            //
             setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };

    // const convertMessageTime = (chatTime, currentTime) => {
    //      let time = moment(currentTime).format("h:mm");
    //    let diff= moment.utc(moment(currentTime, "HH:mm:ss").diff(moment(chatTime, "HH:mm:ss"))).format("mm")* 60
     
    // }
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    /**
     * Handle chat conversation
     * @param {*} currentChat 
     */
    const handleConversation = async (selectChat) => {
        const obj = await getConversations();
        await setCurrentChat(selectChat)
        let isChat = await obj.filter(i => i.members.includes(state.userDetails._id) && i.members.includes(selectChat._id));
        if (isChat.length > 0) {
            setCurrentConversationId(isChat[0]._id)
            await getMessages(isChat[0]._id)

        } else {
            let conversationObj = {
                "senderId": state.userDetails._id,
                "receiverId": selectChat._id
            }
            await axios.post(Constants.CONVERSATION_URL, conversationObj).then(async res => {
                if (res) {
                    setCurrentConversationId(res.data._id)
                    await getMessages(selectChat._id)
                }
            })
        }
    }

    /**
     * Get messages
     * @param {*} id 
     * @returns 
     */
    const getMessages = async (id) => {
        try {
            await axios.get(Constants.MESSAGE_URL + id).then(res => {
                              if (res) setMessages(res.data)
            })
        }
        catch (err) {
            return err
        }
    }

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" />
                        {userList.map((list) => (
                            <div onClick={() => {
                                handleConversation(list)
                            }}>
                                <Conversation conversation={list} currentUser={state.userDetails} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatbarContainer">
                        <div className="topbarLeft">
                            {currentChat ?
                                <> <img
                                    src="avatar.png"
                                    alt=""
                                    className="topbarImg"
                                />
                                    <strong> {currentChat?.username}</strong></> : ""}

                            <div className="chatLine"></div>
                        </div>
                    </div>

                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.senderId === state.userDetails._id ? true : false} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        className="chatMessageInput"
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                        onKeyDown={(e) => e.key === 'Enter' ? handleSubmit(e) : ""}
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
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                        // onlineUsers={onlineUsers}
                        // currentId={state.userDetails._id}
                        // setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>

            </div>
        </>
    );
}