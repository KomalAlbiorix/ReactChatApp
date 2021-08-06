import "./chatOnline.css"

export default function ChatOnline() {
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img
                        className="chatOnlineImg"
                        src="https://i.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
                        alt="" ></img>
                    <div className="chatOnlineBadge"></div>
                </div>

                <div className="chatOnlineName">Komal</div>
            </div>
        </div>
    )
}
