import "../../css/Component/Header.css";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { accessToken } = useAuth(); // 로그인 상태

  return (
    <header className="header">
      <h1 className="logo">Movie App</h1>

      <nav>
        <a href="/">Home</a>

        {/* 로그인 안 했을 때 */}
        {!accessToken && (
          <>
            <a href="/register">Register</a>
            <a href="/login">Login</a>
          </>
        )}

        {/* 로그인 했을 때 */}
        {accessToken && (
          <>
            <a href="/mypage/profile">MyPage</a>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;