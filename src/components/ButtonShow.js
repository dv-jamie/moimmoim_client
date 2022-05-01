function ButtonShow ({ clubsById, joinInfoByClubId, joinInfoByClubAndUserIds ,onApplyBtnClick }) {
    const status = !joinInfoByClubAndUserIds || joinInfoByClubAndUserIds.length === 0
        ? ""
        : joinInfoByClubAndUserIds[0].status

    switch(status) {
        case "APPLIED" :
            return <button className="club-detail-btn complete-btn"><span>{bottonText.applied}</span></button>
        case "JOINED" :
            return <button className="club-detail-btn complete-btn"><span>{bottonText.joined}</span></button>
        case "REJECTED" :
            return <button className="club-detail-btn complete-btn"><span>{bottonText.rejected}</span></button>
        default :
            if(joinInfoByClubId.length < clubsById.capacity) {
                return (
                    <button className="club-detail-btn sign-up-btn" onClick={() => { onApplyBtnClick(clubsById.clubs_id) }}>
                        <span>{bottonText.default}</span>
                    </button>
                )
            } else {
                return (
                <button className="club-detail-btn complete-btn">
                    <span>{bottonText.fullCapacity}</span>
                </button>
                )
            }
    }
}

export default ButtonShow

const bottonText = {
    applied: "신청 완료",
    joined: "가입 중인 모임입니다",
    rejected: "가입이 거절된 모임입니다",
    default: "가입 신청",
    fullCapacity: "모집 완료"
}