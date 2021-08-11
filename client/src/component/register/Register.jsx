import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";
import { useHistory } from "react-router";
import Constants from "../constant/Constants";
import { Upload, notification, Spin } from 'antd';
import ImgCrop from 'antd-img-crop';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      // const user = {
      //   username: username.current.value,
      //   email: email.current.value,
      //   password: password.current.value,
      //   profilePicture:fileList[0].name
      // };

      const formData = new FormData();
      formData.append("username", username.current.value)
      formData.append("email", email.current.value)
      formData.append("password", password.current.value)
      formData.append("profilePicture", fileList[0].name)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      try {
        setIsLoading(true)
        await axios.post(Constants.REGISTER_URL, formData, config).then(res => {
          setIsLoading(false)
          if (res.data) {
            notification.open({
              message: 'Register successfully',
            });
          }
        })
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <> 
    {/* <Spin style={{ color: '#fff'}} size="large" spinning={isLoading} tip="Loading..." /> */}
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Let's Make Chat</h3>
            <span className="loginDesc">
              Connect with friends and the world around you.
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <input
                placeholder="Username"
                required
                ref={username}
                className="loginInput"
              />
              <input
                placeholder="Email"
                required
                ref={email}
                className="loginInput"
                type="email"
              />
              <input
                placeholder="Password"
                required
                ref={password}
                className="loginInput"
                type="password"
                minLength="6"
              />
              <input
                placeholder="Confirm Password"
                required
                ref={passwordAgain}
                className="loginInput"
                type="password"
              />

              <ImgCrop rotate>
                <Upload
                  style={{ marginLeft: "180px" }}
                  className="profile"
                  listType="picture-card"
                  onChange={onChange}
                  onPreview={onPreview}
                >
                  Upload
                  {/* {fileList.length < 5 && '+ Upload'} */}
                </Upload>
              </ImgCrop>
              <button className="loginButton" type="submit">
                Sign Up
              </button>
              <button className="loginRegisterButton" onClick={() => history.push("/login")}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
