import { useState, useEffect } from "react";
import api from "../../api/AuthAPI";
import { useAuth } from "../../context/AuthContext";
import Header from "../Component/Header";
import "../../css/User/Login.css";

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

  // 인증 상태에 따른 리다이렉션 처리
  useEffect(() => {
    if (accessToken) {
      window.location.href = "/mypage/profile";
    }
  }, [accessToken]);

  if (loading) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="login-container">
      <Header />

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