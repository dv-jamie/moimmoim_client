import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinPage from "./pages/JoinPage";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import Header from "./components/Header";
import axios from "axios";

function App() {
  const [isLogin, setIsLogin] = useState(false)
  
  useEffect(() => {
    const jwtToken = localStorage.getItem("JWT_TOKEN")
  
    if(jwtToken) {
      axios.defaults.headers.common['Authorization'] = jwtToken
      setIsLogin(true)
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <Header isLogin={isLogin} setIsLogin={setIsLogin} />

        <Routes>
          <Route path="/" element={<HomePage isLogin={isLogin} />}></Route>
          <Route path="/join" element={<JoinPage />}></Route>
          <Route path="/mypage" element={<MyPage isLogin={isLogin} />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;