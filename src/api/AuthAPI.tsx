import axios from "axios";

let accessToken: string | null = null; //메모리에 accessToken 저장 (전역 상태)

//accessToken을 갱신하는 함수 (로그인 / 재발급 시 사용)
export const setAccessToken = (token: string | null) => accessToken = token;

//axios 인스턴스 생성
const AuthAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, //모든 요청의 기본 URL
  withCredentials: true  //쿠키(refreshToken) 포함 요청 허용
});

//요청 인터셉터
AuthAPI.interceptors.request.use((config) => {

  //accessToken이 존재하면 요청 헤더에 Authorization 추가
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`; 
  return config;
  }, 
  
  (err) => Promise.reject(err) //요청 에러는 그대로 전달
); 

//응답 인터셉터
AuthAPI.interceptors.response.use((res) => res, //accessToken의 만료 시간이 남아있을 경우

  //accessToken의 만료 시간이 끝났을 경우
  async (err) => {

    //refreshToken이 없을 경우
    if (err.config.url?.includes("/reToken")) {
      return Promise.reject(err.response?.data.message); //에러 메시지 표시
    }

    //accessToken 만료(401), accessToken 재발급
    if (err.response?.status === 401) {
      try {
        const res = await axios.post("/reToken", {}, {withCredentials: true}); //refreshToken으로 accessToken 재발급 요청

        setAccessToken(res.data.accessToken); //발급 받은 새 accessToken 저장

        err.config.headers.Authorization = `Bearer ${res.data.accessToken}`; //실패했던 요청에 새 accessToken 적용

        return AuthAPI(err.config); //요청 다시 실행
        
      } catch (e: any) {
        return Promise.reject(e.response?.data.message); //refreshToken으로 accessToken 발급 실패 에러 표시
      }
    }

    return Promise.reject(err.response?.data.message); //그 외 모든 에러는 서버 메시지 그대로 전달
  }
);

export default AuthAPI;