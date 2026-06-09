import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/Movie/List.css";

//영화 목록 데이터 타입 정의
type MovieListData = {
  id: number;
  title: string;
  poster_path: string;
};

function List() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<MovieListData[]>([]); //영화 목록 데이터 타입 적용
  const [page, setPage] = useState<number>(1); //페이지 번호 타입 적용
  const [inputQuery, setInputQuery] = useState<string>(""); //검색 입력값 
  const [executeQuery, setExecuteQuery] = useState<string>(""); //검색 실행값
  const [loading, setLoading] = useState<boolean>(true); //로딩 상태 타입 적용

  //영화 목록 or 검색 결과 가져오기 함수
  const fetchMovies = async (page: number) => {
    try {
      setLoading(true); //로딩 시작

      let res;

      if (executeQuery.trim() !== "") { //검색어가 있을 때
        res = await axios.get(`${import.meta.env.VITE_API_URL}/movie/search?query=${executeQuery}`); //검색한 목록
      } else { //검색어가 없음 and 처음 페이지 로드 시
        res = await axios.get(`${import.meta.env.VITE_API_URL}/movieList?page=${page}`); //전체 목록
      }

      setMovies(res.data.results); //영화 목록 업데이트
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); //로딩 종료
    }
  };

  //   //영화 목록 or 검색 결과 가져오기 함수
  // const fetchMovies = async (page: number) => {
  //   try {
  //     setLoading(true); //로딩 시작

  //     let res;

  //     if (executeQuery.trim() !== "") { //검색어가 있을 때
  //       res = await axios.get(`/api/movie/search?query=${executeQuery}`); //검색한 목록
  //     } else { //검색어가 없음 and 처음 페이지 로드 시
  //       res = await axios.get(`/api/movieList?page=${page}`); //전체 목록
  //     }

  //     setMovies(res.data.results); //영화 목록 업데이트
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false); //로딩 종료
  //   }
  // };

  //검색 함수
  const handleSearch = () => {
    setPage(1); //검색 시 페이지 초기화
    setExecuteQuery(inputQuery); //검색 실행값 업데이트
  };

  //목록 불러오기
  useEffect(() => {
    fetchMovies(page);
  }, [page, executeQuery]);

  if (loading) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="list-container">
      {/* 검색 UI */}
      <div className="search-box">
        <input type="text" placeholder="영화 검색" value={inputQuery} onChange={(e) => setInputQuery(e.target.value)}/>
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 페이지 이동 */}
      {executeQuery.trim() === "" && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>이전</button>
          <span>페이지: {page}</span>
          <button onClick={() => setPage(page + 1)}>다음</button>
        </div>
      )}

      {/* 영화 목록 */}
      {movies.length === 0 ? (
        <div className="empty">검색 결과가 없습니다.</div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
              {movie.poster_path && (
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
              )}
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default List;