import "./message.css";
// import { format } from 'timeago.js';
import { dateConvert, timeConvert } from "../../utils/common";

export default function Message({ message, own, isShowDay }) {
    return (
        <div className={own ? "message own" : "message"}>
            {isShowDay && <div style={{ textAlign: "center", display: "flex", alignSelf: "center" }}>{dateConvert(message.createdAt)}</div>}
            <div className="messageTop">
                {message.message.substring(0, 7) === "upload/" ?
                    message.message.substring(message.message.length - 3, message.message.length) === 'mp4' ?
                        <video type="video/mp4"
                            src={`http://localhost:4000/${message.message.split("/")[1]}`}
                            style={{ maxWidth: "200px" }}
                            controls />
                        : <img src={`http://localhost:4000/${message.message.split("/")[1]}`}
                            alt="text" style={{ maxWidth: "200px" }} />
                    : <p className="messageText">{message?.message}</p>
                }
            </div>
            <div className="messageBottom">{timeConvert(message.createdAt)}</div>
            {/* <div className="messageBottom">{message?.createdAt}</div> */}
        </div >
    )
}
