import "./topbar.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

export default function Topbar() {
  const user = localStorage.getItem('user');
  const history = useHistory();

  const PF = '../server/public/images/download (1)';

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Chat </span>
        </Link>
      </div>

      <div className="topbarRight">
        {user.username}
        {/* <Link to={`/profile/${user.username}`}> */}
        <img
          src={PF}
          alt=""
          className="topbarImg"
        />
        {/* </Link> */}
      </div>

      <button className="logout" onClick={()=>history.push('/login')}>Logout</button>
    </div>
  );
}
