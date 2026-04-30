// import { useState } from "react";
// import API from "../services/api";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");

//   const handleSubmit = async () => {
//     const res = await API.post("/api/users/forgot-password", { email });

//     alert("Token: " + res.data.token); // temp (later email)
//   };

//   return (
//     <div>
//       <h2>Forgot Password</h2>

//       <input
//         placeholder="Enter email"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <button onClick={handleSubmit}>Send Reset Link</button>
//     </div>
//   );
// }


import { useState } from "react";
import API from "../services/api";
import "./style/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("/api/users/forgot-password", { email });

      // TEMP: showing token (later remove when email is implemented)
      setMessage("✅ Reset token: " + res.data.token);

    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p className="subtitle">
          Enter your email to receive a reset link
        </p>

        {message && <p className="message">{message}</p>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="auth-btn"
          onClick={handleSubmit}
          disabled={loading || !email}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}