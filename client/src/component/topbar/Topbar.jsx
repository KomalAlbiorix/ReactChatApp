import "./topbar.css";
import { useRef, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useStateMachine } from 'little-state-machine';
// import pic from "./avatar.png";
import { io } from 'socket.io-client';
import { UpdateLoginStatus } from '../store/actions/updateLoginStatus';

export default function Topbar() {
  const history = useHistory();
  const { actions, state } = useStateMachine({ UpdateLoginStatus });
  const socket = useRef()

  useEffect(() => {
    socket.current = io('ws://localhost:8900')
  }, [])

  const handleLogout = () => {
    socket.current?.emit("removeUserFromSocket", state.userDetails._id)
    actions.UpdateLoginStatus(false)
    history.push('/login')
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Chat </span>
        </Link>
      </div>

      <div className="topbarRight">

        <img
          src="avatar.png"
          alt=""
          className="topbarImg"
        />
        <strong> {state.userDetails.username}</strong>
      </div>
      <button className="logout" onClick={() => handleLogout()}>Logout</button>
      {/* 
      {userDropdown ? <Dropdown overlay={menu} placement="bottomLeft">
        <Button>bottomLeft</Button>
      </Dropdown> : ""} */}
    </div>

  );
}
