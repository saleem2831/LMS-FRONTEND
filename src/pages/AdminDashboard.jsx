// import { getUser, logout } from "../utils/auth";
// import { Link } from "react-router-dom";

// export default function AdminDashboard() {
//   const user = getUser();

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
      
//       <p>Welcome {user?.name}</p>
//       <Link to="/admin/users">
//   <button>Manage Users</button>
// </Link>
//       <Link to="/courses">
//   <button>Manage Courses</button>
// </Link>
//       <Link to="/create-course">
//   <button>Create Course</button>
//   </Link>
//   <Link to="/admin/calendar">
//   <button>Platform Calendar</button>
// </Link>

//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getUser, logout } from "../utils/auth";
import { Link } from "react-router-dom";
import "./style/AdminDashboard.css";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    setUser(u);

    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome back, <span>{user?.name}</span>
          </p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Cards */}
      <div className="dashboard-grid">
        <Link to="/admin/users" className="card">
          <h2>Manage Users</h2>
          <p>View and control platform users</p>
        </Link>

        <Link to="/courses" className="card">
          <h2>Manage Courses</h2>
          <p>Edit and organize courses</p>
        </Link>

        <Link to="/create-course" className="card">
          <h2>Create Course</h2>
          <p>Add new learning content</p>
        </Link>

        <Link to="/admin/calendar" className="card">
          <h2>Platform Calendar</h2>
          <p>Manage schedules & events</p>
        </Link>
      </div>
    </div>
  );
}