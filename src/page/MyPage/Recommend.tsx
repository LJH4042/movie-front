import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/AuthAPI";
import { useNavigate } from "react-router-dom";
import "../../css/MyPage/Recommend.css";
import { Navigate } from "react-router-dom";

// 추천 영화 데이터 타입 정의
type RecommendMovieData = {
  id: number;
  title: string;
  poster_path: string;
};

function Recommend() {
  const navigate = useNavigate();

  const { accessToken, loading } = useAuth(); // 인증 상태와 로딩 상태 가져오기
  const [movies, setMovies] = useState<RecommendMovieData[]>([]); // 추천 영화 데이터 상태

  // 추천 영화 데이터 불러오기 함수
  const fetchRecommend = async () => {
    try {
      const res = await api.get("/movie/recommend"); 
      setMovies(res.data.results || []);
    } catch (err) {
      console.error("추천 영화 불러오기 실패", err);
    }
  };

  useEffect(() => {
    if (accessToken) fetchRecommend();
  }, [accessToken]);

  //로그인 안 된 경우 리다이렉트
  if(!loading && !accessToken) return <Navigate to="/login" replace />;

  if (loading) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="recommend-container">
      <div className="mypage-layout">

        {/* 사이드바 */}
        <aside className="sidebar">
          <h3>My Page</h3>
          <ul>
            <li><a href="/mypage/profile">프로필</a></li>
            <li><a href="/mypage/watch">시청기록</a></li>
            <li><a href="/mypage/recommend">추천</a></li>
          </ul>
        </aside>

        <main className="recommend-wrapper">
          <h2>추천 영화</h2>

          {movies.length === 0 ? (
            <p className="empty">검색 결과가 없습니다.</p>
          ) : (
            <div className="recommend-grid">
              {movies.map((item) => (
                <div key={item.id} className="recommend-card" onClick={() => navigate(`/movie/${item.id}`)}>
                  <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.title} />
                  <h4>{item.title}</h4>
                </div>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default Recommend;