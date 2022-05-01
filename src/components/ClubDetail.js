import axios from "axios"
import { useState } from "react"
import ButtonShow from "./ButtonShow"
import "./ClubDetail.css"

function ClubDetail(props) {
    const [clickedTab, setClickedTab] = useState(0)

    const onCloseBtnClick = () => {
        props.setIsClubDetailShow(false)
    }

    const onApplyBtnClick = async (clubId) => {
        if(!props.isLogin) {
            alert("로그인이 필요한 서비스입니다")
            return
        }
        
        await axios.post(`${process.env.REACT_APP_URL}/clubs/apply`, {
            id: clubId
        })

        props.setIsClubDetailShow(false)
        alert("가입 신청이 완료되었습니다")
    }

    return (
        <div className={props.isClubDetailShow ? "overlap show" : "overlap"}>
            {props.joinInfoByClubId === null
                ? <div>Loading...</div>
                : <div className="club-detail-modal">
                    <div className="club-detail-header">
                        <h3>
                            <span className="club-name">{props.clubsById.clubs_name}</span>
                            {props.joinInfoByClubId.length < props.clubsById.capacity
                                ? <span className="none-completed">모집중</span>
                                : <span className="completed">모집완료</span>
                            }
                        </h3>

                        <button className="close-btn" onClick={onCloseBtnClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" color="#999">
                                <path fill="currentColor" d="M17.97 19.03a.75.75 0 001.06-1.06l-6.5-6.5a.75.75 0 00-1.06 0l-6.5 6.5a.75.75 0 001.06 1.06L12 13.06l5.97 5.97zM12 10.94L6.03 4.97a.75.75 0 00-1.06 1.06l6.5 6.5a.75.75 0 001.06 0l6.5-6.5a.75.75 0 00-1.06-1.06L12 10.94z"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="club-img-wrap">
                        <img src={props.clubsById.img} />
                    </div>

                    <div className="club-detail-content">
                        <ul className="club-detail-info">
                            <li>
                                <span>카테고리</span>
                                <span>{props.clubsById.categories_name}</span>
                            </li>
                            <li>
                                <span>인원</span>
                                <span>{props.countJoinedUsers}/{props.clubsById.capacity}명</span>
                            </li>
                            <li>
                                <span>장소</span>
                                <span>{props.clubsById.location}</span>
                            </li>
                        </ul>

                        <ul className="club-detail-tab">
                            <li className={clickedTab === 0 ? "clicked-tab" : ""} onClick={() => setClickedTab(0)}>모임 소개</li>
                            <li className={clickedTab === 1 ? "clicked-tab" : ""} onClick={() => setClickedTab(1)}>가입 멤버</li>
                        </ul>

                        {clickedTab === 0
                            ? <p>
                                {props.clubsById.description}
                            </p>
                            : <ul className="club-member-wrap">
                                {props.joinInfoByClubId
                                    .filter(joinInfo => joinInfo.status === "JOINED")
                                    .map(joinedUser => {
                                        return (
                                            joinedUser.status === "JOINED"
                                                ? <li key={joinedUser.id}>
                                                    <div className="member-img-wrap">
                                                        <img src="https://illumesense.com/resources/illumesense/style/img/website/profile-picture-blanks/male-profile.jpg" />
                                                    </div>
                                                    <span>{joinedUser.name}</span>
                                                </li>
                                                : <></>
                                        )
                                })}
                            </ul>
                        }
                    </div>

                    <ButtonShow
                        clubsById={props.clubsById}
                        joinInfoByClubId={props.joinInfoByClubId}
                        joinInfoByClubAndUserIds={props.joinInfoByClubAndUserIds}
                        onApplyBtnClick={() => { onApplyBtnClick(props.clubsById.clubs_id) }}
                    />
                </div>
            }
        </div>
    )
}

export default ClubDetail