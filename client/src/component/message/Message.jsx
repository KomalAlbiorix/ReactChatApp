import "./message.css";
// import { format } from 'timeago.js';
import { dateConvert, timeConvert } from "../../utils/common";

export default function Message({ message, own, isShowDay }) {
    return (
        <div className={own ? "message own" : "message"}>
            {isShowDay && <div style={{ textAlign: "center", display: "flex", alignSelf: "center" }}>{dateConvert(message.createdAt)}</div>}
            <div className="messageTop">
                <p className="messageText">{message?.message}</p>
            </div>
            <div className="messageBottom">{timeConvert(message.createdAt)}</div>
            {/* <div className="messageBottom">{message?.createdAt}</div> */}
        </div>
    )
}
