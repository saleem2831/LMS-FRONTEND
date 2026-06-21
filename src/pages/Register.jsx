// import { useState } from "react";
// import API from "../services/api";

// export default function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const handleRegister = async () => {
//     try {
//       const res = await API.post("/api/auth/register", form);

//       // ✅ Save user (auto login)
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       localStorage.setItem("token", res.data.token);

//       alert("Registered successfully");

//       // ✅ CHECK pending purchase
//       const pending = JSON.parse(localStorage.getItem("pendingPurchase"));

//       if (pending) {
//         localStorage.removeItem("pendingPurchase");

//         // Redirect to courses page (payment will trigger there)
//         window.location.href = "/courses";
//       } else {
//         window.location.href = "/student";
//       }

//     } catch (err) {
//       alert(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div>
//       <h2>Student Register</h2>

//       <input
//         placeholder="Name"
//         onChange={(e) =>
//           setForm({ ...form, name: e.target.value })
//         }
//       />

//       <input
//         placeholder="Email"
//         onChange={(e) =>
//           setForm({ ...form, email: e.target.value })
//         }
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) =>
//           setForm({ ...form, password: e.target.value })
//         }
//       />

//       <button onClick={handleRegister}>
//         Register
//       </button>
//     </div>
//   );
// }


import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import logo from "../assets/skillstek_logo.png";
import "./style/Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("/api/auth/register", form);

      // ✅ Auto login
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setMessage("✅ Registered successfully!");

      // ✅ Resume pending purchase
      // const pending = JSON.parse(localStorage.getItem("pendingPurchase"));

      // if (pending) {
      //   localStorage.removeItem("pendingPurchase");
      //   window.location.href = "/courses";
      // } else {
      //   window.location.href = "/student";
      // }

      // =====================================
// RESUME PURCHASE FLOW
// =====================================

const pending =
  JSON.parse(
    localStorage.getItem(
      "pendingPurchase"
    )
  );

if (pending) {

  const {
    courseId,
    plan
  } = pending;

  localStorage.removeItem(
    "pendingPurchase"
  );

  // ROUTE TYPE
  let routeType =
    "trial";

  if (
    plan === "ONE_TO_ONE"
  ) {

    routeType =
      "one-to-one";
  }

  if (plan === "BATCH") {

    routeType =
      "batch";
  }

  // REDIRECT TO COURSE
  window.location.href =
    `/courses/${courseId}/${routeType}`;

} else {

  // NORMAL STUDENT REDIRECT
  window.location.href =
    "/login";
}

    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo-link" aria-label="Skillstek home">
          <img src={logo} alt="Skillstek" className="auth-logo" />
        </Link>

        {/* <span className="auth-eyebrow">Start learning</span> */}
        <h1>Create Account</h1>
        <p className="subtitle">Create your Skillstek account and choose your course path.</p>

        {message && <p className="message">{message}</p>}

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button
          className="auth-btn"
          onClick={handleRegister}
          disabled={
            loading ||
            !form.name ||
            !form.email ||
            !form.password
          }
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <div className="auth-links">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
