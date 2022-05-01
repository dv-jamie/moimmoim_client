import axios from "axios"
import { useState, useEffect} from "react"
import ClubDetail from "./ClubDetail"
import "./Common.css"
import "./ClubList.css"
import LikeIcon from "./LikeIcon"

function ClubList(props) {
    // Get Data
    const [likedClubsById, setLikedClubsById] = useState([])
    const [newClubs, setNewClubs] = useState([])
    const [allClubs, setAllClubs] = useState([])
    const [categories, setCategories] = useState([])
    const [filteredClubs, setFilteredClubs] = useState([])
    const [clubsById, setClubsById] = useState([])
    const [joinInfoByClubId, setJoinInfoByClubId] = useState(null)
    const [joinInfoByClubAndUserIds, setJoinInfoByClubAndUserIds] = useState(null)
    const [countJoinedUsers, setCountJoinedUsers] = useState(null)

    // Boolean
    const [isClubDetailShow, setIsClubDetailShow] = useState(false)
    const [isFiltered, setIsFiltered] = useState()
    const [isSortedNew, setIsSortedNew] = useState(true)

    const getClubs = async () => {
        const response = await axios.get(`${process.env.REACT_APP_URL}/clubs`)
        
        const data = response.data
        const newClubs = data.newClubs
        const allClubs = data.allClubs.clubs
        
        // 가입 인원(countUsers) 배열에 추가
        const countUsersByClubId = {}
        const joinInfos = data.joinInfos
        
        joinInfos.forEach(joinInfo => {
            if(!countUsersByClubId[joinInfo['club_id']]) {
                countUsersByClubId[joinInfo['club_id']] = 0
            }
            countUsersByClubId[joinInfo['club_id']] += 1
        })
        
        newClubs.forEach(club => {
            club['countUsers'] = countUsersByClubId[club.clubs_id] || 0
        })
        
        allClubs.forEach(club => {
            club['countUsers'] = countUsersByClubId[club.clubs_id] || 0
        })
        //
        
        setLikedClubsById(data.likedClubsById)
        setNewClubs(data.newClubs)
        setAllClubs(allClubs)
        setCategories(data.categories)
    }
    
    useEffect(() => {
        getClubs()
    }, [props.isLogin])

    // 좋아요 추가 및 삭제
    const addLike = async (clubId) => {
        if(props.isLogin === false) {
            alert("로그인이 필요한 서비스입니다")
            return
        }
        await axios.post(`${process.env.REACT_APP_URL}/users/${clubId}/likes`)
        const newLikesById = [...likedClubsById, { "club_id": clubId }]
        setLikedClubsById(newLikesById)
    }

    const deleteLike = async (clubId) => {
        await axios.delete(`${process.env.REACT_APP_URL}/users/${clubId}/likes`)
        const newLikesById = likedClubsById.filter(obj => obj.club_id != clubId)
        setLikedClubsById(newLikesById)
    }
    //

    // clubs 정렬 및 필터링
    let clubs = isFiltered ? filteredClubs : allClubs

    const onCategoryClick = (selectedCategoryName) => {
        const filteredClubs = allClubs.filter(v => { return v.categories_name === selectedCategoryName })

        setFilteredClubs(filteredClubs)
    }

    const onSortByNew = () => {
        setIsSortedNew(true)
        clubs.sort((a, b) => a.clubs_id - b.clubs_id)
    }
    
    const onSortByView = () => {
        setIsSortedNew(false)
        clubs.sort((a, b) => b.views - a.views)
    }
    //

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
        <>
            {/* 신규 모임 시작 */}
            <div className="club-list-wrap">
                <h2 className="title">신규 모임을 소개합니다</h2>
                {newClubs.map(club => {
                    const myLikeClubIds = likedClubsById.map(v => Object.values(v)[0])
                    const fill = myLikeClubIds.includes(club.clubs_id)

                    return (
                        <div key={club.clubs_id} className="card">
                            <div className="like">
                                <LikeIcon
                                    fill={fill}
                                    addLike={() => addLike(club.clubs_id)}
                                    deleteLike={() => deleteLike(club.clubs_id)}
                                />
                            </div>
                            <div className="thumb" onClick={() => { onClubListClick(club.clubs_id) }}>
                                <img src={club.img} />
                            </div>
                            <div className="club-list-body" onClick={() => { onClubListClick(club.clubs_id) }}>
                                <div className="club-category-wrap">
                                    <span className="club-category">{club.categories_name}</span>
                                    {club.countUsers >= club.capacity
                                        ? <span className="completed">모집완료</span>
                                        : <span className="none-completed">모집중</span>
                                    }
                                </div>
                                <h3 className="club-name">{club.clubs_name}</h3>
                                <span className="club-desc">{club.countUsers}/{club.capacity}명ㆍ{club.location}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* 신규 모임 끝 */}

            {/* 전체 모임 시작 */}
            <div className="club-list-wrap">
                <h2 className="title">취향에 맞는 모임을 찾아보세요</h2>

                <ul className="filtering">
                    <li>
                        <input type="radio" name="filtering" id="check_all" checked={!isFiltered}
                            onChange={() => {
                                setIsFiltered(false)
                                onCategoryClick(() => setFilteredClubs(clubs))
                            }} />
                        <label htmlFor="check_all">전체</label>
                    </li>
                    {categories.map(category => {
                        return (
                            <li key={category.id}>
                                <input type="radio" name="filtering" id={`check_${category.id}`}
                                    onChange={() => {
                                        setIsFiltered(true)
                                        onCategoryClick(category.name)
                                    }} />
                                <label htmlFor={`check_${category.id}`}>{category.name}</label>
                            </li>
                        )
                    })}
                </ul>

                <ul className="sorting">
                    <li>
                        <input
                            type="radio" name="sorting" id="sorting-new" defaultChecked={isSortedNew}
                            onChange={() => onSortByNew()}
                        />
                        <label htmlFor="sorting-new">
                            <span className="checkbox-icon material-icons">done</span>신규순
                        </label>
                    </li>
                    <li>
                        <input
                            type="radio" name="sorting" id="sorting-view"
                            onChange={() => onSortByView()}
                        />
                        <label htmlFor="sorting-view">
                            <span className="checkbox-icon material-icons">done</span>조회순
                        </label>
                    </li>
                </ul>

                {clubs.map(club => {
                    const myLikeClubIds = likedClubsById.map(v => Object.values(v)[0])
                    const fill = myLikeClubIds.includes(club.clubs_id)

                    return (
                        <div key={club.clubs_id} className="card">
                            <div className="like">
                                <LikeIcon
                                    fill={fill}
                                    addLike={() => addLike(club.clubs_id)}
                                    deleteLike={() => deleteLike(club.clubs_id)}
                                />
                            </div>
                            <div className="thumb" onClick={() => { onClubListClick(club.clubs_id) }}>
                                <img src={club.img} />
                            </div>
                            <div className="club-list-body" onClick={() => { onClubListClick(club.clubs_id) }}>
                                <div className="club-category-wrap">
                                    <span className="club-category">{club.categories_name}</span>
                                    {club.countUsers >= club.capacity
                                        ? <span className="completed">모집완료</span>
                                        : <span className="none-completed">모집중</span>
                                    }
                                </div>
                                <h3 className="club-name">{club.clubs_name}</h3>
                                <span className="club-desc">{club.countUsers}/{club.capacity}명ㆍ{club.location}</span>
                            </div>
                        </div>
                    )
                })}
                {/* 전체 모임 끝 */}

                <ClubDetail
                    isLogin={props.isLogin}
                    isClubDetailShow={isClubDetailShow}
                    setIsClubDetailShow={setIsClubDetailShow}
                    clubsById={clubsById}
                    joinInfoByClubId={joinInfoByClubId}
                    joinInfoByClubAndUserIds={joinInfoByClubAndUserIds}
                    countJoinedUsers={countJoinedUsers}
                />
            </div>
        </>
    )
}

export default ClubList