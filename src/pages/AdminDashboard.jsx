import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";
import API from "../services/api";
import { getUser, logout } from "../utils/auth";
import logo from "../assets/skillstek_logo.png";
import "react-calendar/dist/Calendar.css";
import "./style/AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = getUser();

  const fetchDashboardData = async () => {
    try {
      const [userRes, courseRes, classRes, notificationRes] = await Promise.all([
        API.get("/api/users"),
        API.get("/api/courses"),
        API.get("/api/classes"),
        API.get("/api/notifications"),
      ]);

      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
      setClasses(Array.isArray(classRes.data) ? classRes.data : []);
      setNotifications(Array.isArray(notificationRes.data) ? notificationRes.data : []);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate admin-specific statistics
  const adminStats = useMemo(() => {
    const totalUsers = users.length;
    const totalCourses = courses.length;
    const totalClasses = classes.length;
    const instructors = users.filter(u => u.role === "INSTRUCTOR").length;
    const students = users.filter(u => u.role === "STUDENT").length;
    const completedClasses = classes.filter(c => c.status === "COMPLETED").length;
    const upcomingClasses = classes.filter(c => new Date(c.startTime) >= new Date()).length;

    return {
      totalUsers,
      totalCourses,
      totalClasses,
      instructors,
      students,
      completedClasses,
      upcomingClasses,
    };
  }, [users, courses, classes]);

  const selectedClasses = useMemo(
    () =>
      classes.filter(
        (item) =>
          new Date(item.startTime).toDateString() === selectedDate.toDateString()
      ),
    [classes, selectedDate]
  );

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const hasClass = classes.some(
      (item) => new Date(item.startTime).toDateString() === date.toDateString()
    );

    return hasClass ? <span className="admin-calendar-dot"></span> : null;
  };

  if (loading) {
    return (
      <div className="admin-loader">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className={`admin-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
        <Link to="/" className="admin-brand" aria-label="Skillstek home">
          <img src={logo} alt="Skillstek" />
        </Link>

        <button
          className="admin-menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="admin-nav-links" aria-label="Admin navigation">
          <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)}>
            Users
          </Link>
          <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>
            Courses
          </Link>
          <Link to="/create-course" onClick={() => setMobileMenuOpen(false)}>
            Create Course
          </Link>
          <Link to="/calendar" onClick={() => setMobileMenuOpen(false)}>
            Calendar
          </Link>
          <a href="#admin-calendar" onClick={() => setMobileMenuOpen(false)}>
            Schedule
          </a>
        </nav>

        <div className="admin-nav-actions">
          <Link
            to="/notifications"
            className="admin-icon-link"
            aria-label="Notifications"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="admin-bell-icon"></span>
            {notifications.length > 0 && (
              <span className="admin-notification-count">
                {notifications.length > 99 ? "99+" : notifications.length}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            className="admin-profile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <small>Admin</small>
            </div>
          </Link>
          <button className="admin-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-hero">
          <div>
            <span className="admin-eyebrow">Admin workspace</span>
            <h1>Welcome back, {user?.name || "Admin"}</h1>
            <p>
              Manage users, courses, instructors, monitor platform activities, and
              oversee all learning schedules from your comprehensive administration
              dashboard.
            </p>
          </div>

          <div className="admin-hero-actions">
            <Link to="/admin/users" className="admin-primary-btn">
              Manage Users
            </Link>
            <Link to="/profile" className="admin-secondary-btn">
              Admin Profile
            </Link>
          </div>
        </section>

        <section className="admin-stat-grid">
          <Link to="/admin/users" className="admin-stat-card">
            <span>Total Users</span>
            <strong>{adminStats.totalUsers}</strong>
            <p>Platform members</p>
          </Link>
          <div className="admin-stat-card">
            <span>Instructors</span>
            <strong>{adminStats.instructors}</strong>
            <p>Active educators</p>
          </div>
          <div className="admin-stat-card">
            <span>Students</span>
            <strong>{adminStats.students}</strong>
            <p>Enrolled learners</p>
          </div>
          <Link to="/courses" className="admin-stat-card">
            <span>Courses</span>
            <strong>{adminStats.totalCourses}</strong>
            <p>Active courses</p>
          </Link>
          <a href="#admin-calendar" className="admin-stat-card">
            <span>Classes</span>
            <strong>{adminStats.totalClasses}</strong>
            <p>Total sessions</p>
          </a>
          <div className="admin-stat-card">
            <span>Completed</span>
            <strong>{adminStats.completedClasses}</strong>
            <p>Classes finished</p>
          </div>
          <div className="admin-stat-card">
            <span>Upcoming</span>
            <strong>{adminStats.upcomingClasses}</strong>
            <p>Scheduled sessions</p>
          </div>
          <Link to="/notifications" className="admin-stat-card">
            <span>Alerts</span>
            <strong>{notifications.length}</strong>
            <p>Notifications</p>
          </Link>
        </section>

        <section className="admin-content-grid">
          <div className="admin-panel admin-management-panel">
            <div className="admin-section-heading">
              <div>
                <span className="admin-eyebrow">Management</span>
                <h2>Core Controls</h2>
              </div>
            </div>

            <div className="admin-management-list">
              <Link to="/admin/users" className="admin-management-card">
                <div>
                  <h3>Manage Users</h3>
                  <p>Control all platform users, roles, and access</p>
                </div>
                <span className="admin-arrow">→</span>
              </Link>

              <Link to="/courses" className="admin-management-card">
                <div>
                  <h3>Manage Courses</h3>
                  <p>Edit, organize, and monitor course content</p>
                </div>
                <span className="admin-arrow">→</span>
              </Link>

              <Link to="/create-course" className="admin-management-card">
                <div>
                  <h3>Create Course</h3>
                  <p>Add new learning content and programs</p>
                </div>
                <span className="admin-arrow">→</span>
              </Link>

              <Link to="/calendar" className="admin-management-card">
                <div>
                  <h3>Platform Calendar</h3>
                  <p>View and manage all platform schedules</p>
                </div>
                <span className="admin-arrow">→</span>
              </Link>
            </div>
          </div>

          <aside className="admin-panel">
            <div className="admin-section-heading">
              <div>
                <span className="admin-eyebrow">Updates</span>
                <h2>System Notifications</h2>
              </div>
              <Link to="/notifications">View all</Link>
            </div>

            {notifications.length === 0 ? (
              <p className="admin-muted">No notifications yet.</p>
            ) : (
              <div className="admin-notification-list">
                {notifications.slice(0, 5).map((notification) => (
                  <Link
                    to="/notifications"
                    className="admin-notification-item"
                    key={notification._id}
                  >
                    <p>{notification.message}</p>
                    <small>
                      {new Date(notification.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </small>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </section>

        <section className="admin-panel admin-calendar-section" id="admin-calendar">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">Calendar</span>
              <h2>Platform schedule overview</h2>
            </div>
          </div>

          <div className="admin-calendar-layout">
            <div className="admin-calendar-shell">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
              />
            </div>

            <div className="admin-day-classes">
              <h3>{selectedDate.toDateString()}</h3>

              {selectedClasses.length === 0 ? (
                <p className="admin-muted">No classes scheduled for this day.</p>
              ) : (
                selectedClasses.map((item) => (
                  <article className="admin-class-card" key={item._id}>
                    <small>
                      {new Date(item.startTime).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </small>
                    <h4>{item.courseId?.title || "Class"}</h4>
                    <p className="admin-class-instructor">
                      Instructor: {item.instructorId?.name || "Not assigned"}
                    </p>
                    {item.status === "COMPLETED" ? (
                      <span className="admin-status completed">Completed</span>
                    ) : (
                      <a
                        href={item.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-primary-btn"
                      >
                        Monitor Class
                      </a>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}