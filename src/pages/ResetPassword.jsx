// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../services/api";

// export default function ResetPassword() {
//   const { token } = useParams();
//   const [password, setPassword] = useState("");

//   const handleReset = async () => {
//     await API.post(`/api/users/reset-password/${token}`, {
//       password
//     });

//     alert("Password updated");
//   };

//   return (
//     <div>
//       <h2>Reset Password</h2>

//       <input
//         type="password"
//         placeholder="New password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={handleReset}>Reset</button>
//     </div>
//   );
// }


import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./style/Auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    try {
      setLoading(true);

      await API.post(`/api/users/reset-password/${token}`, {
        password,
      });

      alert("Password updated successfully");
    } catch (err) {
      alert("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Reset Password</h1>

        <p className="subtitle">
          Enter your new password below
        </p>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading || !password}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </div>

    </div>
  );
}