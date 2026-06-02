import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/AuthAPI";
import { useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import "../../css/MyPage/Watch.css";

//시청 기록 데이터 타입
type WatchHistoryData = {
  HISTORY_NO: number;
  MOVIE_ID: number;
  TITLE: string;
  POSTER_PATH: string;
};

function Watch() {
  const navigate = useNavigate();

  const { accessToken, loading } = useAuth(); //인증 관리 Hook
  const [historyList, setHistoryList] = useState<WatchHistoryData[]>([]); //시청 기록 목록 상태
  const [page, setPage] = useState<number>(1); //페이지 상태
  const [total, setTotal] = useState<number>(0); //총 시청 기록 수 상태

  // 시청 기록 조회
  const fetchWatchHistory = async (pageNum = 1) => {
    try {
      const res = await api.get(`/watch/list?page=${pageNum}`);
      setHistoryList(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
      console.error("시청 기록 불러오기 실패", error);
    }
  };

  //로그인 안 된 경우 리다이렉트
  useEffect(() => {
    if (!loading && !accessToken) window.location.href = "/login";
  }, [accessToken, loading]);

  //시청기록 가져오기
  useEffect(() => {
    if (accessToken) fetchWatchHistory(page);
  }, [accessToken, page]);

  if (loading) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="watch-container">
      <Header />

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

        {/* 메인 영역 */}
        <div className="watch-wrapper">
          <h2>시청 기록</h2>

          {/* 목록 */}
          {historyList.length === 0 ? (
            <p className="empty">불러오는 중...</p>
          ) : (
            <div className="watch-grid">
              {historyList.map((item) => (
                <div key={item.HISTORY_NO} className="watch-card" onClick={() => navigate(`/movie/${item.MOVIE_ID}`)}>
                  <img src={`https://image.tmdb.org/t/p/w300${item.POSTER_PATH}`} alt={item.TITLE}/>
                  <h4>{item.TITLE}</h4>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {total > 20 && (
            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>이전</button>
              <span>페이지 {page}</span>
              <button onClick={() => setPage(page + 1)} disabled={page * 20 >= total}>다음</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Watch;