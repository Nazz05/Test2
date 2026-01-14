import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import "./Login/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/login", {
        username,
        password,
      });

      // Lưu token - backend trả về { id, token, username, email, fullName, phone, role, status }
      const token = res.data.token || res.data.accessToken;
      const userRole = res.data.role;
      
      login({ token, user: {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        fullName: res.data.fullName,
        phone: res.data.phone,
        role: res.data.role,
        status: res.data.status
      }});

      // Hiển thị thông báo thành công
      alert(`Đăng nhập thành công! Xin chào ${res.data.username || res.data.fullName}`);
      
      // Chuyển trang dựa trên role
      if (userRole && userRole.toUpperCase().includes('ADMIN')) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <Link to="/">Sixedi</Link>
          <p>Thời trang đẳng cấp cho mọi người</p>
        </div>

        {/* Body */}
        <div className="login-body">
          <h2>Đăng Nhập Tài Khoản</h2>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tài khoản</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập hoặc email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>

            <button className="login-btn" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          Chưa có tài khoản?
          <Link to="/register"> Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
