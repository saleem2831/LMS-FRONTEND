
// import { Link } from "react-router-dom";
// import { logout } from "../utils/auth";

// export default function InstructorDashboard() {
//   return (
//     <div>
//       <h2>Instructor Dashboard</h2>

//       <Link to="/courses">
//         <button>View Courses</button>
//       </Link>

//       <Link to="/create-course">
//         <button>Create Course</button>
//       </Link>

//       {/* ✅ ADD THIS */}
//       <Link to="/schedule">
//         <button>Schedule Class</button>
        
//       </Link>
      

//       {/* ✅ ADD THIS */}
//       <Link to="/my-classes">
//         <button>My Classes</button>
//       </Link>

//         <a href="/notifications">
//     <button>Notifications</button>
//   </a>


//       <a href="/calendar">
//   <button>View Calendar</button>
// </a>
// <Link to="/profile">
//   <button>My Profile</button>
// </Link>

//       <br /><br />
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import "./style/InstructorDashboard.css";

export default function InstructorDashboard() {
  return (
    <div className="instructor-page">
      
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Instructor Dashboard</h1>
          <p>Manage your courses and classes</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Grid */}
      <div className="dashboard-grid">

        {/* Courses */}
        <Link to="/courses" className="card">
          <h2>📚 View Courses</h2>
          <p>Browse and manage your courses</p>
        </Link>

        <Link to="/create-course" className="card">
          <h2>➕ Create Course</h2>
          <p>Add new courses to the platform</p>
        </Link>

        {/* Classes */}
        <Link to="/schedule" className="card">
          <h2>📅 Schedule Class</h2>
          <p>Plan upcoming sessions</p>
        </Link>

        <Link to="/my-classes" className="card">
          <h2>🎓 My Classes</h2>
          <p>View and manage your classes</p>
        </Link>



        {/* Tools */}
        <Link to="/calendar" className="card">
          <h2>🗓️ Calendar</h2>
          <p>Track all scheduled classes</p>
        </Link>

        <Link to="/notifications" className="card">
          <h2>🔔 Notifications</h2>
          <p>View important updates</p>
        </Link>

        {/* Account */}
        <Link to="/profile" className="card">
          <h2>👤 My Profile</h2>
          <p>Update your profile details</p>
        </Link>

      </div>
    </div>
  );
}