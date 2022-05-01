import Banner from "../components/Banner"
import ClubList from "../components/ClubList"

function HomePage(props) {
    return (
        <div>
            <Banner />
            <ClubList isLogin={props.isLogin} />
        </div>
    )
}

export default HomePage