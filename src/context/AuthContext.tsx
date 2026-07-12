import { createContext, useContext, useState, useEffect } from "react";
import api, { setAccessToken as setAxiosToken } from "../api/AuthAPI";

const AuthContext = createContext<any>(null); //로그인 상태를 공유하기 위한 Context 생성

//로그인 상태 관리 컴포넌트
export function AuthProvider({ children }: any) {

  const [accessToken, setAccessToken] = useState<string | null>(null); //accessToken 상태 
  const [loading, setLoading] = useState(true); //마이페이지가 먼저 렌더링되는 거 방지하기 위한 로딩 상태

  //애플리케이션이 다시 실행될 때 로그인 상태를 복구하는 함수
  const initAuth = async () => {
    try {
      //아직 refreshToken이 있을 경우
      const res = await api.post("/reToken");  //refreshToken으로 accessToken 재발급 요청
      setAccessToken(res.data.accessToken); //새 accessToken 저장
    } catch (e: any) {
      setAccessToken(null); //refreshToken이 없으면 로그인 안 된 상태로 처리
    } finally {
      setLoading(false); //인증 체크 완료(로딩 종료)
    }
  };

  useEffect(() => {
    initAuth(); //로그인 상태를 복구하는 함수 실행
  }, []);

  useEffect(() => {
    setAxiosToken(accessToken); //새 accessToken을 메모리 변수에 저장
  }, [accessToken]);

  //전역 Context로 값 전달
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

//다른 컴포넌트에서 사용하기 위해 Hook으로 추출
export function useAuth() {
  return useContext(AuthContext);
}