import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">S</div>
          <div>
            <div style={{ fontWeight: "bold" }}>Skillstek</div>
            <div className="navbar-tagline">
              <span>Learn</span>
              <span>•</span>
              <span>Grow</span>
              <span>•</span>
              <span>Succeed</span>
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-nav">
          {user && (
            <>
              <Link to="/courses" className="navbar-link">
                📚 Courses
              </Link>
              <Link to="/calendar" className="navbar-link">
                📅 Calendar
              </Link>
              <Link to="/notifications" className="navbar-link">
                🔔 Notifications
              </Link>

              {/* Profile for All */}
              <Link to="/profile" className="navbar-link">
                👤 Profile
              </Link>

              {/* Role-specific Links */}
              {user?.role === "ADMIN" && (
                <Link to="/admin" className="navbar-link">
                  ⚙️ Admin
                </Link>
              )}

              {user?.role === "INSTRUCTOR" && (
                <Link to="/instructor" className="navbar-link">
                  👨‍🏫 Instructor
                </Link>
              )}

              {user?.role === "STUDENT" && (
                <Link to="/student" className="navbar-link">
                  👨‍🎓 Student
                </Link>
              )}

              {/* Logout Button */}
              <button onClick={handleLogout} className="btn btn-error" style={{ height: "40px" }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}