import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/AuthAPI";
import "../../css/Movie/Detail.css";

//영화 장르 정보
type GenreData = {
  id: number; //장르 아이디
  name: string; //장르 이름
}

//영화 배우 정보
type CastData = {
  id: number; //배우 아이디
  name: string; //배우 이름
  profile_path: string; //배우 프로필 이미지 경로
}

//영화 감독 정보
type CrewData = {
  id: number; //감독 아이디
  name: string; //감독 이름
}

//영화 상세 정보
type MovieDetailData = {
  id: number; //영화 아이디
  title: string; //영화 제목
  overview: string; //영화 개요
  poster_path: string; //영화 포스터 이미지 경로
  release_date: string; //영화 개봉일
  vote_average: number; //영화 평점
  genres: GenreData[]; //영화 장르 목록
  cast: CastData[]; //영화 출연진 목록
  crew: CrewData[]; //영화 제작진 목록
}

function Detail() {
  const { id } = useParams(); //URL에서 영화 아이디 가져오기
  const { accessToken } = useAuth(); //인증 관리 Hook
  const [movie, setMovie] = useState<MovieDetailData | null>(null); //영화 상세 정보 상태
  const [trailerKey, setTrailerKey] = useState<string | null>(null); //예고편 키 상태

  //예고편 가져오기 함수
  const handleTrailer = async () => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/movie/${id}/trailer`);
      setTrailerKey(res.data);

      //로그인 상태면 시청기록 저장
      if (accessToken && movie) {
        await api.post("/watch/save", {
          MOVIE_ID: movie.id, //영화 아이디
          TITLE: movie.title, //영화 제목
          POSTER_PATH: movie.poster_path, //영화 포스터 이미지 경로
          GENRES: movie.genres.map(g => g.id).join(","), //영화 장르
        });
      }
    }catch(err){
      console.error(err);
    }
  };

  // const handleTrailer = async () => {
  //   try{
  //     const res = await axios.get(`/api/movie/${id}/trailer`);
  //     setTrailerKey(res.data);

  //     //로그인 상태면 시청기록 저장
  //     if (accessToken && movie) {
  //       await api.post("/watch/save", {
  //         MOVIE_ID: movie.id, //영화 아이디
  //         TITLE: movie.title, //영화 제목
  //         POSTER_PATH: movie.poster_path, //영화 포스터 이미지 경로
  //         GENRES: movie.genres.map(g => g.id).join(","), //영화 장르
  //       });
  //     }
  //   }catch(err){
  //     console.error(err);
  //   }
  // };

  //영화 상세 정보 가져오기
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/movie/${id}`).then(res => setMovie(res.data));
  }, [id]);

    // useEffect(() => {
    //   axios.get(`/api/movie/${id}`).then(res => setMovie(res.data));
    // }, [id]);

  if (!movie) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="detail-container">
      <div className="detail-top">
        {/* 포스터 */}
        <img className="poster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>

        {/* 정보 */}
        <div className="info">
          <h1>{movie.title}</h1>

          <p className="meta">📅 {movie.release_date} | ⭐ {Math.round(movie.vote_average * 10) / 10}</p>

          {/* 장르 */}
          <div className="genres">
            {movie.genres.map(genre => (
              <span key={genre.id}>#{genre.name}</span>
            ))}
          </div>

          {/* 감독 */}
          <div className="director">
            {movie.crew.map(director => (
              <p key={director.id}>🎬 {director.name}</p>
            ))}
          </div>

          <p className="overview">{movie.overview}</p>

          <button className="trailer-btn" onClick={handleTrailer}>▶ 예고편 보기 </button>
        </div>
      </div>

      {/* 예고편 */}
      {trailerKey && (
        <div className="trailer">
          <iframe src={`https://www.youtube.com/embed/${trailerKey}`} allowFullScreen/>
        </div>
      )}

      {/* 배우 */}
      <h2 className="cast-title">출연진</h2>
      <div className="cast-list">
        {movie.cast.map(actor => (
          <div key={actor.id} className="actor-card">
            {actor.profile_path && (
              <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}/>
            )}
            <p>{actor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Detail;