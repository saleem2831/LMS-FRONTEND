
// import { useState } from "react";
// import API from "../services/api";
// import { Link } from "react-router-dom";
// import logo from "../assets/skillstek_logo.png";
// import "./style/Auth.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleLogin = async () => {
//     try {
//       setLoading(true);
//       setMessage("");

//       const res = await API.post("/api/auth/login", {
//         email,
//         password
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));



//       const pending =
//   JSON.parse(
//     localStorage.getItem(
//       "pendingPurchase"
//     )
//   );

// if (pending) {

//   const {
//     courseId,
//     plan
//   } = pending;

//   localStorage.removeItem(
//     "pendingPurchase"
//   );

//   // URL TYPE
//   let routeType =
//     "trial";

//   if (
//     plan === "ONE_TO_ONE"
//   ) {

//     routeType =
//       "one-to-one";
//   }

//   if (plan === "BATCH") {

//     routeType =
//       "batch";
//   }

//   // REDIRECT BACK
//   window.location.href =
//     `/courses/${courseId}/${routeType}`;

//   return;
// }

//       const role = res.data.user.role;

//       if (role === "ADMIN") window.location.href = "/admin";
//       if (role === "INSTRUCTOR") window.location.href = "/instructor";
//       if (role === "STUDENT") window.location.href = "/student";
//       if (role === "SALES") window.location.href = "/sales";


//     } catch (err) {
//       setMessage(err.response?.data?.message || "❌ Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <Link to="/" className="auth-logo-link" aria-label="Skillstek home">
//           <img src={logo} alt="Skillstek" className="auth-logo" />
//         </Link>

//         {/* <span className="auth-eyebrow">Welcome back</span> */}
//         <h1>Welcome Back</h1>
//         <p className="subtitle">Login to continue your learning journey.</p>

//         {message && <p className="message">{message}</p>}

//         <div className="form-group">
//           <label>Email Address</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         <button
//           className="auth-btn"
//           onClick={handleLogin}
//           disabled={loading || !email || !password}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <div className="auth-links">
//           <Link to="/forgot-password">Forgot Password?</Link>
//           <Link to="/register">Create Account</Link>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import logo from "../assets/skillstek_logo.png";
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

  // URL TYPE
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

  // REDIRECT BACK
  window.location.href =
    `/courses/${courseId}/${routeType}`;

  return;
}

      // const role = res.data.user.role;

      // if (role === "ADMIN") window.location.href = "/admin";
      // if (role === "INSTRUCTOR") window.location.href = "/instructor";
      // if (role === "STUDENT") window.location.href = "/student";
      // if (role === "SALES") window.location.href = "/sales";

      const role =
  res.data.user.role;

// ADMIN
if (role === "ADMIN") {

  window.location.href =
    "/admin";
}

// INSTRUCTOR
if (role === "INSTRUCTOR") {

  window.location.href =
    "/instructor";
}

// SALES
if (role === "SALES") {

  window.location.href =
    "/sales";
}

// STUDENT
if (role === "STUDENT") {

  try {

    const enrollmentRes =
      await API.get(
        "/api/enrollments/my"
      );

    const enrollments =
      enrollmentRes.data || [];

    // NO ENROLLMENTS
    if (
      enrollments.length === 0
    ) {

      window.location.href =
        "/courses";

      return;
    }

    // HAS ENROLLMENTS
    window.location.href =
      "/student";

  } catch (error) {

    console.log(error);

    window.location.href =
      "/courses";
  }
}


    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
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

        {/* <span className="auth-eyebrow">Welcome back</span> */}
        <h1>Welcome Back</h1>
        <p className="subtitle">Login to continue your learning journey.</p>

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

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
