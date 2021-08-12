import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { io } from 'socket.io-client';
import ChatOnline from "../chatOnline/ChatOnline";
import Constants from '../constant/Constants';
import Conversation from "../conversations/Conversation";
import Message from "../message/Message";
import Topbar from "../topbar/Topbar";
import "./chat.css";
import { useStateMachine } from 'little-state-machine';
import { dateConvert } from '../../utils/common';
import { SmileOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';

// import 'emoji-picker-react/dist/universal/style.scss';

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userList, setUserList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const [emojiCounter, setEmojiCounter] = useState(0);

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
        axios.get(Constants.GET_USER_URL).then(async res => {
            await setUserList(res.data.filter(i => i._id !== state.userDetails._id))
            await setFilterList(res.data.filter(i => i._id !== state.userDetails._id))
        })
    }, [state.userDetails, state.isLogin]);

    useEffect(() => {
        getConversations();
    }, [state.userDetails._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


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
                    if (res) {
                        setMessages(res.data)
                        dateConvert(res.data.createdAt)
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
        setIsOpenEmoji(false)
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
            setMessages([...messages, res.data]);
            setNewMessage("");

        } catch (err) {
            console.log(err);
        }
    };


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


    const debounced = useDebouncedCallback(
        (value) => {
            if (value !== "") {
                let filterData = filterList.filter(item => item.username.includes(value))
                setFilterList(filterData)
            }
            else {
                setFilterList(userList)
            }
        },
        500,
        // The maximum time func is allowed to be delayed before it's invoked:
        { maxWait: 2000 }
    );


    /**
     * show day and time in message box
     * @param { } index 
     * @returns 
     */
    const chatDate = (index) => {
        if (index === 0) return true
        else {
            let temp = dateConvert(messages[index].createdAt)
            let temp1 = dateConvert(messages[index - 1].createdAt)
            return temp1 === temp ? false : true
        }
    }

    /**
     * handle emoji click
     * @param {*} event 
     * @param {*} emojiObject 
     */
    const onEmojiClick = (event, emojiObject) => {
        // setChosenEmoji(emojiObject);
        setNewMessage(newMessage + emojiObject.emoji)
    };

    /**
     * Handle Emoji open/close event
     */
    const handleEmojiClickEvent = () => {
        if (emojiCounter === 0) {
            setIsOpenEmoji(true)
            setEmojiCounter(emojiCounter + 1)
        }
        else if(emojiCounter===1){
            setEmojiCounter(emojiCounter - 1)
            setIsOpenEmoji(false)
        }
    }

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" onChange={(e) => debounced(e.target.value)} />
                        {filterList.map((list) => (
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
                                    <strong> {currentChat?.username}</strong>
                                    <div className="chatLine"></div></> : ""}
                        </div>
                    </div>

                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                {console.log("isOpenEmoji", isOpenEmoji)}
                                <div className={isOpenEmoji ? "chatBoxWithEmojiTop" : "chatBoxTop"}>
                                    {/* <div className="chatBoxTop"> */}

                                    {messages.map((m, index) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.senderId === state.userDetails._id ? true : false}
                                                isShowDay={chatDate(index)} />
                                        </div>
                                    ))}
                                </div>

                                {isOpenEmoji ?
                                    <div className="chatEmoji">

                                        <EmojiPicker
                                            pickerStyle={{ width: "90%", height: "90%" }}
                                            onEmojiClick={onEmojiClick} />  </div> : ""}

                                <div className="chatBoxBottom">
                                    <textarea
                                        className="chatMessageInput"
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                        onKeyDown={(e) => e.key === 'Enter' ? handleSubmit(e) : ""}
                                    ></textarea>
                                    <div><SmileOutlined onClick={() => handleEmojiClickEvent()} />
                                    </div>
                                    <button disabled={!newMessage} className="chatSubmitButton" style={{ backgroundColor: newMessage ? "#1877F2" : " #cccccc" }} onClick={handleSubmit}>
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