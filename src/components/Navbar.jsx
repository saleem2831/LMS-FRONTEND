import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav style={{ display: "flex", gap: 10 }}>
      <Link to="/courses">Courses</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/notifications">🔔</Link>

      {/* ✅ PROFILE FOR ALL */}
      <Link to="/profile">Profile</Link>

      {user?.role === "ADMIN" && (
        <Link to="/admin">Admin</Link>
      )}

      {user?.role === "INSTRUCTOR" && (
        <Link to="/instructor">Instructor</Link>
      )}

      {user?.role === "STUDENT" && (
        <Link to="/student">Student</Link>
      )}
    </nav>
  );
}