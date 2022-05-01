function LikeIcon({ fill, addLike, deleteLike }) {
    if(fill) {
        return <span className="material-icons" onClick={deleteLike}>favorite</span>
    } else {
        return <span className="material-icons" onClick={addLike}>favorite_border</span>
    }
}

export default LikeIcon;