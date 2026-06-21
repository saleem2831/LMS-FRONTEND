

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Pagination from "../components/Pagination";
import { getUser, logout } from "../utils/auth";
import logo from "../assets/skillstek_logo.png";
import "./style/ManageUsers.css";

const USERS_PER_PAGE = 9;

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [view, setView] = useState("USERS");
  const [filter, setFilter] = useState("ALL");
  const [userPage, setUserPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [salesForm, setSalesForm] = useState({
  name: "",
  email: "",
  password: ""
});

  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/users/full-data");
      setUsers(res.data.users || []);
      setCourses(res.data.courses || []);
      setEnrollments(res.data.enrollments || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    setUserPage(1);
  }, [filter, view]);

  const filteredUsers = useMemo(
    () => users.filter(u => (filter === "ALL" ? true : u.role === filter)),
    [users, filter]
  );

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));

    if (userPage > totalPages) {
      setUserPage(totalPages);
    }
  }, [filteredUsers.length, userPage]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (userPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, userPage]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const instructors = users.filter(u => u.role === "INSTRUCTOR").length;
    const students = users.filter(u => u.role === "STUDENT").length;
    const admins = users.filter(u => u.role === "ADMIN").length;
    const totalCourses = courses.length;
    const totalEnrollments = enrollments.length;

    return {
      totalUsers,
      instructors,
      students,
      admins,
      totalCourses,
      totalEnrollments
    };
  }, [users, courses, enrollments]);

  const createInstructor = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }
    try {
      await API.post("/api/users/create-instructor", form);
      setForm({ name: "", email: "", password: "" });
      fetchAllData();
    } catch (err) {
      alert("Failed to create instructor");
    }
  };

  const createSales = async () => {
  try {
    await API.post("/api/users/create-sales", salesForm);

    alert("Sales user created");

    setSalesForm({
      name: "",
      email: "",
      password: ""
    });

    fetchAllData();

  } catch (error) {
    alert(error.response?.data?.message || "Error creating sales user");
  }
};

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/api/users/${id}`);
      fetchAllData();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="manage-loader">
        <div className="manage-spinner"></div>
      </div>
    );
  }

  return (
    <div className="manage-users">
      {/* NAVBAR */}
      <header className={`manage-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
        <Link to="/" className="manage-brand" aria-label="Skillstek home">
          <img src={logo} alt="Skillstek" />
        </Link>

        <button
          className="manage-menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="manage-nav-links" aria-label="Admin navigation">
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
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
        </nav>

        <div className="manage-nav-actions">
          <Link
            to="/profile"
            className="manage-profile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <small>Admin</small>
            </div>
          </Link>
          <button className="manage-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="manage-main">
        {/* HERO SECTION */}
        <section className="manage-hero">
          <div>
            <span className="manage-eyebrow">User Management</span>
            <h1>Manage All Users</h1>
            <p>
              Create new instructors, manage user roles, view courses, and track
              student enrollments across your platform.
            </p>
          </div>

          <div className="manage-hero-actions">
            <button className="manage-primary-btn" onClick={() => {
              document.querySelector('.manage-form-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Create Instructor
            </button>
            <Link to="/admin" className="manage-secondary-btn">
              Back to Dashboard
            </Link>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="manage-stat-grid">
          <div className="manage-stat-card">
            <span>Total Users</span>
            <strong>{stats.totalUsers}</strong>
            <p>All platform members</p>
          </div>
          <div className="manage-stat-card">
            <span>Students</span>
            <strong>{stats.students}</strong>
            <p>Enrolled learners</p>
          </div>
          <div className="manage-stat-card">
            <span>Instructors</span>
            <strong>{stats.instructors}</strong>
            <p>Active educators</p>
          </div>
          <div className="manage-stat-card">
            <span>Admins</span>
            <strong>{stats.admins}</strong>
            <p>System administrators</p>
          </div>
          <div className="manage-stat-card">
            <span>Courses</span>
            <strong>{stats.totalCourses}</strong>
            <p>Active courses</p>
          </div>
          <div className="manage-stat-card">
            <span>Enrollments</span>
            <strong>{stats.totalEnrollments}</strong>
            <p>Total enrollments</p>
          </div>
        </section>

        {/* CREATE INSTRUCTOR FORM */}
        <section className="manage-form-section manage-panel">
          <div className="manage-section-heading">
            <div>
              <span className="manage-eyebrow">Create</span>
              <h2>New Instructor</h2>
            </div>
          </div>

          <div className="manage-form-grid">
            <input
              className="manage-input"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="manage-input"
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="manage-input"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="manage-primary-btn" onClick={createInstructor}>
            Create Instructor
          </button>
        </section>


        <hr />

 <section className="manage-form-section manage-panel">
          <div className="manage-section-heading">
            <div>
              <span className="manage-eyebrow">Create</span>
              <h2>Sales User</h2>
            </div>
          </div>

          <div className="manage-form-grid">

<input
  className="manage-input"
  placeholder="Name"
  value={salesForm.name}
  onChange={(e) =>
    setSalesForm({
      ...salesForm,
      name: e.target.value
    })
  }
/>

<input
className="manage-input"
  placeholder="Email"
  value={salesForm.email}
  onChange={(e) =>
    setSalesForm({
      ...salesForm,
      email: e.target.value
    })
  }
/>

<input
className="manage-input"
  type="password"
  placeholder="Password"
  value={salesForm.password}
  onChange={(e) =>
    setSalesForm({
      ...salesForm,
      password: e.target.value
    })
  }
/>
 </div>
<button className="manage-primary-btn" onClick={createSales}>
  Create Sales User
</button>
         
        </section>

<hr />

        {/* TABS */}
        <div className="manage-tabs">
          <button
            className={`manage-tab ${view === "USERS" ? "active" : ""}`}
            onClick={() => setView("USERS")}
          >
            Users
          </button>
          <button
            className={`manage-tab ${view === "COURSES" ? "active" : ""}`}
            onClick={() => setView("COURSES")}
          >
            Courses
          </button>
          <button
            className={`manage-tab ${view === "ENROLLMENTS" ? "active" : ""}`}
            onClick={() => setView("ENROLLMENTS")}
          >
            Enrollments
          </button>
        </div>

        {/* USERS VIEW */}
        {view === "USERS" && (
          <>
            <div className="manage-filters">
              {["ALL", "STUDENT", "INSTRUCTOR", "ADMIN"].map(f => (
                <button
                  key={f}
                  className={`manage-filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="manage-grid">
              {filteredUsers.length > 0 ? (
                paginatedUsers.map(u => (
                  <div key={u._id} className="manage-card manage-user-card">
                    <div className="manage-card-header">
                      <h3>{u.name}</h3>
                      <span className={`manage-role-badge ${u.role.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </div>

                    <p className="manage-email">{u.email}</p>

                    <div className="manage-card-actions">
                      <button
                        className="manage-edit-btn"
                        onClick={() => setEditingUser(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="manage-delete-btn"
                        onClick={() => deleteUser(u._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="manage-empty">No users found.</p>
              )}
            </div>

            <Pagination
              currentPage={userPage}
              totalItems={filteredUsers.length}
              itemsPerPage={USERS_PER_PAGE}
              onPageChange={setUserPage}
            />
          </>
        )}

        {/* COURSES VIEW */}
        {view === "COURSES" && (
          <div className="manage-grid">
            {courses.length > 0 ? (
              courses.map(c => (
                <div key={c._id} className="manage-card">
                  <h3>{c.title}</h3>
                  <p className="manage-course-instructor">
                    Instructor:{" "}
                    <strong>{c.assignedInstructor?.name || "Not Assigned"}</strong>
                  </p>
                </div>
              ))
            ) : (
              <p className="manage-empty">No courses found.</p>
            )}
          </div>
        )}

        {/* ENROLLMENTS VIEW */}
        {view === "ENROLLMENTS" && (
          <div className="manage-grid">
            {enrollments.length > 0 ? (
              enrollments.map(e => (
                <div key={e._id} className="manage-card">
                  <div className="manage-enrollment-item">
                    <p className="manage-student">
                      <strong>Student:</strong> {e.studentId?.name || "Unknown"}
                    </p>
                    <p className="manage-course">
                      <strong>Course:</strong> {e.courseId?.title || "Unknown"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="manage-empty">No enrollments found.</p>
            )}
          </div>
        )}
      </main>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="manage-modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal-header">
              <h2>Edit User</h2>
              <button
                className="manage-modal-close"
                onClick={() => setEditingUser(null)}
              >
                ✕
              </button>
            </div>

            <div className="manage-modal-body">
              <div className="manage-form-group">
                <label>Name</label>
                <input
                  className="manage-input"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value
                    })
                  }
                />
              </div>

              <div className="manage-form-group">
                <label>Email</label>
                <input
                  className="manage-input"
                  value={editingUser.email}
                  disabled
                />
              </div>

              <div className="manage-form-group">
                <label>Role</label>
                <select
                  className="manage-input"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value
                    })
                  }
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
              </div>
            </div>

            <div className="manage-modal-actions">
              <button
                className="manage-primary-btn"
                onClick={async () => {
                  await API.put(`/api/users/${editingUser._id}`, {
                    name: editingUser.name,
                    role: editingUser.role
                  });
                  setEditingUser(null);
                  fetchAllData();
                }}
              >
                Save Changes
              </button>

              <button
                className="manage-secondary-btn"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
