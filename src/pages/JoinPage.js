import axios from "axios"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./JoinPage.css"

function JoinPage () {
    const navi = useNavigate()
    const uidRef = useRef()
    const upwRef = useRef()
    const nameRef = useRef()

    const onJoinBtnClick = async () => {
        await axios.post(`${process.env.REACT_APP_URL}/users/join`, {
            uid: uidRef.current.value,
            upw: upwRef.current.value,
            name: nameRef.current.value
        })

        navi("/")
    }

    return (
        <div>
            <div className="join-content-wrap">
                <h1>회원가입</h1>
                <div className="join-content">
                    <div className="join-row">
                        <label htmlFor="uid">아이디</label>
                        <input type="text" id="uid" maxLength="20" ref={uidRef} />
                    </div>
                    <div className="join-row">
                        <label htmlFor="upw">비밀번호</label>
                        <input type="password" id="upw1" maxLength="20" ref={upwRef} />
                    </div>
                    <div className="join-row">
                        <label htmlFor="upw">비밀번호 확인</label>
                        <input type="password" id="upw2" maxLength="20" />
                    </div>
                    <div className="join-row">
                        <label htmlFor="name">이름(별명)</label>
                        <input type="text" id="name" maxLength="20" ref={nameRef} />
                    </div>
                    <button className="join-btn" onClick={onJoinBtnClick}>회원가입</button>
                </div>
            </div>
        </div>
    )
}

export default JoinPage