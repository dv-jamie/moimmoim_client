import axios from "axios"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import logo from "./moim_logo.png"

function Login (props) {
    const navi = useNavigate()
    const uidRef = useRef()
    const upwRef = useRef()

    const onCloseBtnClick = () => {
        props.setIsLoginModalShow(false)
    }
    
    const onLoginBtnClick = async () => {
        const response = await axios.post(`${process.env.REACT_APP_URL}/users/login`, {
            uid: uidRef.current.value,
            upw: upwRef.current.value
        })
        
        if(response.data.login.result === "FAILED") {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.")
            return
        }

        axios.defaults.headers.common['Authorization'] = response.data.login.jwtToken
        localStorage.setItem("JWT_TOKEN", response.data.login.jwtToken)
        props.setIsLogin(true)
        props.setIsLoginModalShow(false)
        uidRef.current.value = ""
        upwRef.current.value = ""
        navi("/")
    }

    return (
        <div className={props.isLoginModalShow ? "overlap show" : "overlap"}>
            <div className="login-modal">
                <div className="modal-header">
                    <img src={logo} />
                    <button className="close-btn" onClick={onCloseBtnClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" color="#999">
                            <path fill="currentColor" d="M17.97 19.03a.75.75 0 001.06-1.06l-6.5-6.5a.75.75 0 00-1.06 0l-6.5 6.5a.75.75 0 001.06 1.06L12 13.06l5.97 5.97zM12 10.94L6.03 4.97a.75.75 0 00-1.06 1.06l6.5 6.5a.75.75 0 001.06 0l6.5-6.5a.75.75 0 00-1.06-1.06L12 10.94z"></path>
                        </svg>
                    </button>
                </div>
                <div className="login-form">
                    <div className="input-row">
                        <label>아이디</label>
                        <input type="text" ref={uidRef} />
                    </div>
                    <div className="input-row">
                        <label>비밀번호</label>
                        <input type="password" ref={upwRef} />
                    </div>
                    <button onClick={onLoginBtnClick}>로그인하기</button>
                </div>
            </div>
        </div>
    )
}

export default Login