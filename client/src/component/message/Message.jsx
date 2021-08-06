import "./message.css";
import {format} from 'timeago.js';

export default function Message({ message, own }) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img
                    src="https://i.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
                    alt="Sample_User_Icon"
                    className="messageImage" />
                <p className="messageText">{message?.message}</p>
            </div>
            <div className="messageBottom">{format(message?.createdAt)}</div>
        </div>
    )
}
