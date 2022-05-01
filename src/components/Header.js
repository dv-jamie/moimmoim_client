import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Login from "../components/Login"
import "./Header.css"
import logo from "./moim_logo.png"

function Header(props) {
    const navi = useNavigate()
    const [isLoginModalShow, setIsLoginModalShow] = useState(false)
    
    const onLoginClick = () => {
        setIsLoginModalShow(true)
    }

    const onLogoutClick = () => {
        axios.defaults.headers.common['Authorization'] = "" // *** null 로 하면 오류?
        localStorage.clear()
        props.setIsLogin(false)
        navi("/")
    }

    return (
        <div className="header">
            <h1>
                <Link to="/">
                    <img src={logo} />
                </Link>
            </h1>
            
            {props.isLogin
                ? <ul className="login-ul">
                    <li><Link to="/mypage">마이페이지</Link></li>
                    <li onClick={onLogoutClick}>로그아웃</li>
                </ul>
                : <ul className="login-ul">
                    <li onClick={onLoginClick}>로그인</li>
                    <li><Link to="/join">회원가입</Link></li>
                </ul>
            }

            <Login
                isLoginModalShow={isLoginModalShow}
                setIsLoginModalShow={setIsLoginModalShow}
                isLogin={props.isLogin}
                setIsLogin={props.setIsLogin}
            />
        </div>
    )
}

export default Header