import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import ChatOnline from "../chatOnline/ChatOnline";
import Constants from '../constant/Constants';
import Conversation from "../conversations/Conversation";
import Message from "../message/Message";
import Topbar from "../topbar/Topbar";
import "./chat.css";
import { io } from 'socket.io-client';

export default function Chat() {

    const user = JSON.parse(localStorage.getItem('user'));
    const [conversationList, setConversationList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                senderId: data.senderId,
                message: data.message,
                createdAt: Date.now()
            })
        })
    }, [])


    useEffect(() => {
        console.log("arrivalMessage",arrivalMessage)
        arrivalMessage && currentChat?.members?.includes(arrivalMessage.senderId) &&
            setMessages((prev)=>[...prev,arrivalMessage]);
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current?.emit("addUser", user._id)
        socket.current?.on("getUser", users => {
        })
    }, [user])

    useEffect(() => {
        const getConversation = async () => {
            await axios.get(Constants.CONVERSATION_URL + user._id).then(res => {
                if (res) {
                    setConversationList(res.data)
                }
            })
        }
        getConversation()

    }, [user._id])


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

    }, [currentChat])


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    /**
     * handle message submit 
     * @param {*} e 
     * @returns 
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const msg = {
            conversationId: currentChat._id,
            senderId: user._id,
            message: newMessage
        }

        const receiverId = currentChat.members.find(list => list !== user._id);
        console.log("receiverId",receiverId)
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId:receiverId,
            message: newMessage
        })

        try {
            const response = await axios.post(Constants.MESSAGE_URL, msg)
            setMessages([...messages, response.data])
            setNewMessage("")
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
                        <input placeholder="Search for friends" className="chatMenuInput"></input>
                        {conversationList.length > 0 && conversationList.map((list) => (
                            <div onClick={() => setCurrentChat(list)}>
                                <Conversation conversation={list} currentUser={user} /></div>
                        ))}
                    </div>
                </div>

                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ?
                            <> <div className="chatBoxTop">
                                {messages.length > 0 && messages.map((msg) => (
                                    <div ref={scrollRef}>
                                        <Message message={msg} own={msg.senderId === user._id} />
                                    </div>
                                ))}
                            </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        placeholder="Write Some thing...."
                                        className="chatMessageInput"
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>
                                    <button className="chatSubmitButton" onClick={(e) => handleSubmit(e)}>Send</button>
                                </div>
                            </>
                            : <span className="noConversationText">Open conversation to start chat</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper"><ChatOnline /></div>
                </div>
            </div >
        </>
    )
}
