import { createContext, useContext, useState, useEffect } from "react";
import api, { setAccessToken as setAxiosToken } from "../api/AuthAPI";

const AuthContext = createContext<any>(null); //로그인 상태를 공유하기 위한 Context 생성

//로그인 상태 관리 컴포넌트
export function AuthProvider({ children }: any) {

  const [accessToken, setAccessToken] = useState<string | null>(null); //accessToken 상태 
  const [loading, setLoading] = useState(true); //마이페이지가 먼저 렌더링되는 거 방지하기 위해 로딩

  //접속 시 refreshToken으로 accessToken 발급 함수
  const initAuth = async () => {
    try {
      const res = await api.post("/reToken");  //refreshToken으로 accessToken 재발급 요청
      setAccessToken(res.data.accessToken); //새 accessToken 저장
    } catch (e: any) {
      setAccessToken(null); //refreshToken이 없으면 로그인 안 된 상태로 처리
    } finally {
      setLoading(false); //인증 체크 완료(로딩 종료)
    }
  };

  useEffect(() => {
    initAuth(); //refreshToken으로 accessToken 발급
  }, []);

  useEffect(() => {
    //accessToken이 변경될 때마다 axios에도 반영
    setAxiosToken(accessToken); //accessToken이 변경될 때마다 axios에도 반영
  }, [accessToken]);

  //전역 Context로 값 전달
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading, /*logout*/ }}>
      {children}
    </AuthContext.Provider>
  );
}

//다른 컴포넌트에서 AuthContext 쉽게 사용하기 위한 Hook
export function useAuth() {
  return useContext(AuthContext);
}
