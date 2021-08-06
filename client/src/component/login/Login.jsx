import { useForm } from "react-hook-form";
import "./login.css";
// import LoginSchema from "../validationSchema/loginSchema";
// import { CircularProgress } from "@material-ui/core";
import axios from 'axios';
import Constants from "../constant/Constants";
import { useHistory } from "react-router";
// import GoogleLogin from 'react-google-login';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const history = useHistory();

    const onSubmit = async (data) => {
        await axios.post(Constants.LOGIN_URL, data).then(res => {
            if (res) localStorage.setItem('user', JSON.stringify(res.data))
            history.push("/chat")
        })
    };

//     const handleGoogleLogin = async (res) => {
//         const googleresponse = {
//             username: res.profileObj.name,
//             email: res.profileObj.email,
//             token: res.googleId,

//         };
//         if (res.profileObj) {
//             await axios.post(Constants.REGISTER_URL, googleresponse)
//             history.push("/chat")
//         }
//    }

    // const handleLoginFailure = () => {

    // }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Let's Make Chat</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleSubmit(onSubmit)}>
                        <input
                            {...register("email")}
                            placeholder="Email"
                            type="email"
                            className="loginInput"
                            required
                        />
                        <p>{errors.email?.message}</p>
                        <input
                            {...register("password")}
                            placeholder="Password"
                            type="password"
                            minLength="6"
                            className="loginInput"
                            required
                        />
                        <p>{errors.password?.message}</p>

                        <button className="loginButton" type="submit">
                        Login
                        </button>
                        <button className="loginRegisterButton" onClick={() => history.push("/register")}>Register</button>

                        {/* <button className="loginButton" type="submit" >
                            Login
                        </button> */}
                        {/* <span className="loginForgot">Forgot Password?</span> */}

                        {/* <div className="row">
                            <button className="loginRegisterButton" onClick={() => history.push("/register")}>
                                Register
                            </button>
                            <GoogleLogin
                                clientId={Constants.GOOGLE_CLIENT_ID}
                                buttonText="Login with google"
                                onSuccess={handleGoogleLogin}
                                onFailure={handleLoginFailure}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div> */}

                    </form>
                </div>
            </div>
        </div>
    );
}
