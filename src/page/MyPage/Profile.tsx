import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/AuthAPI";
import "../../css/MyPage/Profile.css";
import { Navigate } from "react-router-dom";

type ProfileData = {
  USER_ID: string; // 유저 아이디
  USER_EMAIL: string; // 유저 이메일
  REG_DATE: string; // 가입일
};

function Profile() {
  const { accessToken, loading } = useAuth(); //인증 관리 Hook
  const [profile, setProfile] = useState<ProfileData | null>(null); //프로필 상태 관리

  //로그아웃
  const logout = async () => {
    try {
      await api.post("/logout");
      alert("로그아웃 되었습니다."); //로그아웃 성공 시 메시지 표시
      window.location.href = "/login";
    } catch (e) {
      console.log("로그아웃 요청 실패", e);
      alert("로그아웃에 실패했습니다."); //로그아웃 실패 시 메시지 표시
    }
  };

  //프로필 조회
  const fetchProfile = async () => {
    try {
      const res = await api.get<ProfileData>("/profile");
      setProfile(res.data);
    } catch (e) {
      console.log("프로필 조회 실패", e);
    }
  };

  //프로필 가져오기
  useEffect(() => {
    if (accessToken) fetchProfile();
  }, [accessToken]);

  //로그인 안 된 경우 리다이렉트
  if(!loading && !accessToken) return <Navigate to="/login" replace />;
  
  if (loading) return <div className="loading">불러오는 중...</div>;

  return (
    <main className="profile-container">
      <section className="mypage-layout">
        
        {/* 사이드바 */}
        <aside className="sidebar">
          <h1>My Page</h1>
          <ul>
            <li><a href="/mypage/profile">프로필</a></li>
            <li><a href="/mypage/watch">시청기록</a></li>
            <li><a href="/mypage/recommend">추천</a></li>
          </ul>
        </aside>

        {/* 메인 컨텐츠 */}
        <div className="profile-wrapper">
          <div className="profile-card">
            <h2>My Profile</h2>

            <div className="profile-item">
              <span>아이디</span>
              <p>{profile?.USER_ID}</p>
            </div>

            <div className="profile-item">
              <span>이메일</span>
              <p>{profile?.USER_EMAIL}</p>
            </div>

            <div className="profile-item">
              <span>가입일</span>
              <p>{profile?.REG_DATE.split("T")[0]}</p>
            </div>

            <button className="logout-btn" onClick={logout}>로그아웃</button>
          </div>
        </div>

      </section>
    </main>
  );
}

export default Profile;