
import axios from "axios";
import { useEffect, useState } from "react";
import Constants from "../constant/Constants";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
    const friendId = conversation.members.find(item => item !== currentUser._id)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getFriendList = async () => {
            try {
                axios.get(Constants.GET_USER_URL + friendId).then(res => {
                    if (res) {
                        setUser(res.data)
                    }
                })
            }
            catch (err) {
                return err
            }

        }
        getFriendList()
    }, [friendId])

    
    return (
        <div className="conversation">
        <img
                src="https://i.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
                alt="Sample_User_Icon"
                className="conversationImage" />
            <span className="conversationName">{user?.username}</span>
        </div>
    )
}
