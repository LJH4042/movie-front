import { useState } from "react";
import api from "../../api/AuthAPI";
import { useAuth } from "../../context/AuthContext";
import "../../css/User/Login.css";
import { Navigate } from "react-router-dom";

type LoginData = {
  USER_ID: string; // 유저 아이디
  USER_PW: string; // 유저 패스워드
};

function Login() {
  const { setAccessToken, loading, accessToken } = useAuth(); //인증 관리 Hook

  // 로그인 폼 상태 관리
  const [loginForm, setLoginForm] = useState<LoginData>({
    USER_ID: "",
    USER_PW: "",
  });

  // 로그인 Input 핸들러
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //로그인 Submit 핸들러
  const handleLoginSubmit = async () => {
    try {
      const res = await api.post("/login", loginForm);
      
      if (res.data.success) setAccessToken(res.data.accessToken); //로그인 성공 시 accessToken 저장
      alert(res.data.message); //로그인 성공 시 서버 메시지 표시
      window.location.href = "/"; //로그인 성공 시 홈으로 이동
    } catch (e : any) {
      alert(e);
    }
  };
  
  // 로그인 상태면 마이페이지로 이동
  if (!loading && accessToken) return <Navigate to="/mypage/profile" replace />;

  if (loading) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>로그인</h2>

        <input id="USER_ID" name="USER_ID" type="text" placeholder="Username" value={loginForm.USER_ID} onChange={handleLoginInputChange}/> 

        <input id="USER_PW" name="USER_PW" type="password" placeholder="Password" value={loginForm.USER_PW} onChange={handleLoginInputChange}/>

        <button onClick={handleLoginSubmit}>Login</button>
      </div>
    </div>
  );
}

export default Login;