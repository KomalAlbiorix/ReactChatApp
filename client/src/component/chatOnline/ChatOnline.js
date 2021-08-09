import { useState, useEffect } from 'react';
import "./chatOnline.css";
import axios from 'axios';
import Constants from '../constant/Constants';

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {

    const [friends, setFriends] = useState([]);
    const [onLineFriend, setOnLineFriend] = useState([])


    useEffect(() => {

        const getFriend = async () => {
            let temp = []
            let res = await axios.get(Constants.CONVERSATION_URL + currentId)
            if (res.data) {
                res.data.map(async list => {
                    let friendsId = list.members.find(item => item !== currentId)
                    if (friendsId !== undefined) {
                        let userList = await axios.get(Constants.GET_USER_URL + friendsId)
                        temp.push(userList.data)
                        setFriends(temp)
                    }
                })
            }
        }
        getFriend()
    }, [])

    useEffect(() => {
            setOnLineFriend( friends.filter(item => onlineUsers.find(i => i.userId === item._id)));

    }, [friends, onlineUsers])
    return (
        <div className="chatOnline">
            {onLineFriend.map(friend => {
               return <div className="chatOnlineFriend">
                    <div className="chatOnlineImgContainer">
                        <img
                            className="chatOnlineImg"
                            src="https://i.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
                            alt="" ></img>
                        <div className="chatOnlineBadge"></div>
                    </div>

                    <div className="chatOnlineName">{friend.username}</div>
                </div>

            })}

        </div>
    )
}
