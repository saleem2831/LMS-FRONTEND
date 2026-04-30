

// import { useEffect, useState } from "react";
// import API from "../services/api";
// import { logout } from "../utils/auth";
// import { Link } from "react-router-dom";


// export default function StudentDashboard() {
//   const [enrollments, setEnrollments] = useState([]);

//   const fetchEnrollments = async () => {
//     const res = await API.get("/api/enrollments/my");
//     setEnrollments(res.data);
//   };

//   useEffect(() => {
//     fetchEnrollments();
//   }, []);

//   return (
//     <div>
//       <h2>Welcome Student</h2>

//       <a href="/courses">
//         <button>Browse Courses</button>
//       </a>

//       <Link to="/profile">
//   <button>My Profile</button>
// </Link>

//       <button onClick={logout}>Logout</button>

//       <h3>My Courses</h3>

//         <a href="/notifications">
//     <button>Notifications</button>
//   </a>


//       <a href="/calendar">
//   <button>View Calendar</button>
// </a>

//       {enrollments.length === 0 && <p>No courses purchased yet</p>}

//       {enrollments.map(e => (
//         <div key={e._id} style={{ border: "1px solid", margin: 10 }}>
//           <h4>{e.courseId?.title}</h4>
//           <p>Plan: {e.plan}</p>

//           {/* <a href="/my-classes">
//             <button>View Classes</button>
//           </a> */}
//           <Link to={`/my-classes/${e.courseId._id}`}>
//   <button>View Classes</button>
// </Link>

//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";
import { logout } from "../utils/auth";
import { Link } from "react-router-dom";
import "./style/StudentDashboard.css";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async () => {
    try {
      const res = await API.get("/api/enrollments/my");
      setEnrollments(res.data);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Manage your learning and activities</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Top Cards (like your screenshot) */}
      <div className="card-grid">
        <Link to="/courses" className="card">
          <h3>📚 Browse Courses</h3>
          <p>Explore and enroll in new courses</p>
        </Link>

        <Link to="/notifications" className="card">
          <h3>🔔 Notifications</h3>
          <p>View important updates</p>
        </Link>

        <Link to="/calendar" className="card">
          <h3>🗓️ Calendar</h3>
          <p>Track your schedule</p>
        </Link>

        <Link to="/profile" className="card">
          <h3>👤 My Profile</h3>
          <p>Update your profile details</p>
        </Link>
      </div>

      {/* My Courses Section */}
      <div className="courses-section">
        <h2>My Courses</h2>

        {enrollments.length === 0 ? (
          <p className="empty">No courses purchased yet</p>
        ) : (
          <div className="course-grid">
            {enrollments.map((e) => (
              <div className="course-card" key={e._id}>
                <h4>{e.courseId?.title}</h4>
                <p>Plan: {e.plan}</p>

                <Link to={`/my-classes/${e.courseId._id}`}>
                  <button className="primary-btn">View Classes</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}