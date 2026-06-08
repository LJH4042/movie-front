import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../css/User/Register.css";
import { Navigate } from "react-router-dom";

type RegisterData = {
  USER_ID: string; // 유저 아이디
  USER_PW: string; // 유저 패스워드
  USER_EMAIL: string; // 유저 이메일
};

function Register() {
    const { loading, accessToken } = useAuth(); //인증 관리 Hook

  // 회원가입 폼 상태 관리
  const [registerForm, setRegisterForm] = useState<RegisterData>({
    USER_ID: "",
    USER_PW: "",
    USER_EMAIL: "",
  })

  // 회원가입 INPUT 핸들러
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회원가입 Submit 핸들러
  const handleRegisterSubmit = async () => {
    try {
      const res = await axios.post("/register", registerForm);
      alert(res.data); //회원가입 성공 시 서버 메시지 표시
      window.location.href = "/login"; //회원가입 성공 시 로그인 페이지로 이동
    } catch (err : any) {
      alert(err.response?.data || "회원가입 실패"); //회원가입 실패 시 서버 메시지 표시
    }
  };

  // 로그인 상태면 마이페이지로 이동
  if (!loading && accessToken) return <Navigate to="/mypage/profile" replace />;

  if (loading) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="register-container">
        <div className="register-box">
          <h2>회원가입</h2>

          <input name="USER_ID" type="text"placeholder="Username" value={registerForm.USER_ID} onChange={handleRegisterInputChange}/>
          <input name="USER_PW" type="password" placeholder="Password" value={registerForm.USER_PW} onChange={handleRegisterInputChange}/>
          <input name="USER_EMAIL" type="email" placeholder="Email" value={registerForm.USER_EMAIL} onChange={handleRegisterInputChange}/>

          <button onClick={handleRegisterSubmit}>Register</button>
        </div>
    </div>
  );
}

export default Register;