
import axios from "axios";
import { useEffect, useState } from "react";
import Constants from "../constant/Constants";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
    let friendId
    const [user, setUser] = useState(null)
    if (conversation._id !== currentUser._id) {
        friendId = conversation._id
    }

    useEffect(() => {
        const getFriendList = async () => {
            try {
                axios.get(Constants.GET_USER_URL + friendId).then(res => {
                    if (res) setUser(res.data)
                })
            }
            catch (err) {
                return err
            }
        }
        getFriendList()
        console.log("friendId", friendId)
    }, [friendId])


    return (
        <div className="conversation">
            <img
                src="avatar.png"
                alt="Sample_User_Icon"
                className="conversationImage" />
            <span className="conversationName">{user?.username}</span>
        </div>
    )
}
