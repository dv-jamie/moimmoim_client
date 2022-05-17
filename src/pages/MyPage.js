import axios from "axios"
import Moment from "react-moment"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ClubDetail from "../components/ClubDetail"
import "./MyPage.css"

function MyPage(props) {
    const navi = useNavigate()

    // Get Data
    const [user, setUser] = useState([])
    const [joinedClubsByUser, setJoinedClubsByUser] = useState(null)
    const [likedClubsByUser, setLikedClubsByUser] = useState([])
    const [clubsById, setClubsById] = useState([])
    const [joinInfoByClubId, setJoinInfoByClubId] = useState(null)
    const [joinInfoByClubAndUserIds, setJoinInfoByClubAndUserIds] = useState(null)
    const [countJoinedUsers, setCountJoinedUsers] = useState(null)

    // Boolean
    const [isClubDetailShow, setIsClubDetailShow] = useState(false)

    const getMyPage = async () => {
        const response = await axios.get(`${process.env.REACT_APP_URL}/users/mypage`)

        const mypage = response.data.mypage
        
        setUser(mypage.user)
        setJoinedClubsByUser(mypage.joinedClubsByUser)
        setLikedClubsByUser(mypage.likedClubsByUser)
    }
    
    useEffect(() => {
        if(props.isLogin) {
            getMyPage()
        }
    }, [props.isLogin])

    const onClubListClick = async (clubId) => {
        const response = await axios.get(`${process.env.REACT_APP_URL}/clubs/${clubId}`)
        const data = response.data

        setIsClubDetailShow(true)
        setClubsById(data.getClubsById)
        setJoinInfoByClubId(data.getJoinInfoById.joinInfoByClubId)
        setJoinInfoByClubAndUserIds(data.getJoinInfoById.joinInfoByClubAndUserIds)
        setCountJoinedUsers(data.countJoinedUsers)
    }

    return (
        joinedClubsByUser === null
            ? <div>Loading...</div>
            : <div>
                <div className="wrap">
                    <h2 className="title">프로필</h2>
                    <ul className="profile">
                        <li>
                            <span>아이디</span>
                            <span>{user.uid}</span>
                        </li>
                        <li>
                            <span>닉네임</span>
                            <span>{user.name}</span>
                        </li>
                    </ul>
                </div>
                
                <div className="wrap">
                    <h2 className="title">클럽 리스트</h2>
                    <ul className="club-list">
                        {joinedClubsByUser.map(club => {
                            return (
                                <li key={club.club_id}>
                                    <div className="club-thumb">
                                        <img src={club.club_img} />
                                    </div>
                                    <div className="join-info">
                                        <div className="join-info-header">
                                            <span className={club.status === "JOINED" ? "status status-joined" : "status"}>
                                                {club.status}
                                            </span>
                                            <h3 onClick={() => { onClubListClick(club.club_id) }}>{club.club_name}</h3>
                                        </div>
                                        <ul className="join-info-date">
                                            <li>
                                                <span>신청</span>
                                                {club.apply_at === null
                                                    ? <span>-</span>
                                                    : <Moment format="YYYY-MM-DD">
                                                        {club.apply_at}
                                                    </Moment>
                                                }
                                            </li>
                                            <li>
                                                <span>가입</span>
                                                {club.join_at === null
                                                    ? <span>-</span>
                                                    : <Moment format="YYYY-MM-DD">
                                                        {club.join_at}
                                                    </Moment>
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="wrap">
                    <h2 className="title">좋아요 리스트</h2>
                    <ul className="club-list">
                        {likedClubsByUser.map(club => {
                            return (
                                <li key={club.club_id}>
                                    <div className="club-thumb">
                                        <img src={club.club_img} />
                                    </div>
                                    <div className="join-info">
                                        <div className="join-info-header">
                                            {!club.status
                                                ? null
                                                : <span className={club.status === "JOINED" ? "status status-joined" : "status"}>
                                                    {club.status}
                                                </span>
                                            }
                                            <h3 onClick={() => { onClubListClick(club.club_id) }}>{club.club_name}</h3>
                                        </div>
                                        <ul className="join-info-date">
                                            <li>
                                                <span>신청</span>
                                                {club.apply_at === null
                                                    ? <span>-</span>
                                                    : <Moment format="YYYY-MM-DD">
                                                        <span>{club.apply_at}</span>
                                                    </Moment>
                                                }
                                            </li>
                                            <li>
                                                <span>가입</span>
                                                {club.join_at === null
                                                    ? <span>-</span>
                                                    : <Moment format="YYYY-MM-DD">
                                                        <span>{club.join_at}</span>
                                                    </Moment>
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <ClubDetail
                    isClubDetailShow={isClubDetailShow}
                    setIsClubDetailShow={setIsClubDetailShow}
                    clubsById={clubsById}
                    joinInfoByClubId={joinInfoByClubId}
                    joinInfoByClubAndUserIds={joinInfoByClubAndUserIds}
                    countJoinedUsers={countJoinedUsers}
                />
            </div>
    )
}

export default MyPage
