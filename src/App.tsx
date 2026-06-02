import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./page/User/Register";
import Login from "./page/User/Login";
import Profile from "./page/MyPage/Profile";
import { AuthProvider } from "./context/AuthContext";
import List from "./page/Movie/List";
import Detail from "./page/Movie/Detail";
import Watch from "./page/MyPage/Watch";
import Recommend from "./page/MyPage/Recommend";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<List />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage/profile" element={<Profile />} />
          <Route path="/mypage/watch" element={<Watch />} />
          <Route path="/mypage/recommend" element={<Recommend />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
