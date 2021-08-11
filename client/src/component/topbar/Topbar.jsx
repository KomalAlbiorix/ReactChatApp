import "./topbar.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useStateMachine } from 'little-state-machine';
// import pic from "./avatar.png";

export default function Topbar() {
  const history = useHistory();
  const { state } = useStateMachine({});


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
      <button className="logout" onClick={() => history.push('/login')}>Logout</button>
      {/* 
      {userDropdown ? <Dropdown overlay={menu} placement="bottomLeft">
        <Button>bottomLeft</Button>
      </Dropdown> : ""} */}
    </div>
  
  );
}
