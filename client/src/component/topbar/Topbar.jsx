import "./topbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import { useStateMachine } from 'little-state-machine';
import { UserOutlined } from '@ant-design/icons';
import { List, Skeleton } from 'antd';

import axios from "axios";
import Constants from "../constant/Constants";

export default function Topbar() {
  const history = useHistory();
  const { actions, state } = useStateMachine({});
  const [userList, setUserList] = useState([]);
  const [userDropdown, setUserDropdown] = useState(false);
  const PF = '../server/public/images/download (1)';

  useEffect(() => {
  })


  const handleUserList = () => {
    axios.get(Constants.GET_USER_URL).then(res => {
      setUserList(res.data.filter(i => i._id !== state.userDetails._id))
      setUserDropdown(true)
    })
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Chat </span>
        </Link>
      </div>


      <div className="topbarRight">
        {state.userDetails.username}
        <img
          src={PF}
          alt=""
          className="topbarImg"
        />
      </div>


      <div className="topbarIcons">
        {/* <div className="topbarIconItem">
          <Chat />
          <span className="topbarIconBadge">2</span>
        </div> */}

        {/* <UserOutlined onClick={()=>handleUserList()} />
          {userDropdown && (
            <div className="dropdown">
              <div>Red</div>
              <div>Green</div>
              <div>Blue</div>
            </div>
          )}
        */}

        {/* <div className="topbarIconItem">
          <UserOutlined onClick={() => handleUserList()} />
          {userDropdown && userList.map(list => {
            return <List >
                <List.Item.Meta
                  title={list.username}
                />
            </List>
          })

          }
          <span></span>
        </div> */}


      </div>

      <button className="logout" onClick={() => history.push('/login')}>Logout</button>
      {/* 
      {userDropdown ? <Dropdown overlay={menu} placement="bottomLeft">
        <Button>bottomLeft</Button>
      </Dropdown> : ""} */}
    </div>
  );
}
