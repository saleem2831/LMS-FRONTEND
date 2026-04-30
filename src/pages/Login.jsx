// import { useState } from "react";
// import API from "../services/api";
// import { Link } from "react-router-dom";


// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       const res = await API.post("/api/auth/login", {
//         email,
//         password
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//         // 🔥 Resume purchase if exists
//   const pending = JSON.parse(localStorage.getItem("pendingPurchase"));

//   if (pending) {
//     localStorage.removeItem("pendingPurchase");

//     window.location.href = "/courses";

//     setTimeout(() => {
//       window.startPayment(pending.courseId, pending.plan);
//     }, 500);

//     return;
//   }

//       const role = res.data.user.role;

//       if (role === "ADMIN") window.location.href = "/admin";
//       if (role === "INSTRUCTOR") window.location.href = "/instructor";
//       if (role === "STUDENT") window.location.href = "/student";

//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div style={{ padding: 50 }}>
//       <h2>Login</h2>

//       <input
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       /><br/><br/>

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       /><br/><br/>

//       <button onClick={handleLogin}>Login</button>
// <br/><br/>
//       <Link to="/forgot-password">Forgot Password?</Link>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "./style/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 Resume purchase if exists
      const pending = JSON.parse(localStorage.getItem("pendingPurchase"));

      if (pending) {
        localStorage.removeItem("pendingPurchase");

        window.location.href = "/courses";

        setTimeout(() => {
          window.startPayment(pending.courseId, pending.plan);
        }, 500);

        return;
      }

      const role = res.data.user.role;

      if (role === "ADMIN") window.location.href = "/admin";
      if (role === "INSTRUCTOR") window.location.href = "/instructor";
      if (role === "STUDENT") window.location.href = "/student";

    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Login to your account</p>

        {message && <p className="message">{message}</p>}

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Links */}
        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}