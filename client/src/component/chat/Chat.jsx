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
        socket.current.on("getUsers", (users) => {
            console.log("users", users)
            // setOnlineUsers(
            //   user.followings.filter((f) => users.some((u) => u.userId === f))
            // );
        });
    }, [state.userDetails]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(Constants.CONVERSATION_URL  + state.userDetails._id);
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
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={state.userDetails._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}