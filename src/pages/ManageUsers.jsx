// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function ManageUsers() {
//   const [users, setUsers] = useState([]);
//   const [view, setView] = useState("USERS");

//   // ✅ NEW STATES
//   const [courses, setCourses] = useState([]);
//   const [enrollments, setEnrollments] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const [filter, setFilter] = useState("ALL");

//   const filteredUsers = users.filter(u => {
//     if (filter === "ALL") return true;
//     return u.role === filter;
//   });

//   // ✅ CREATE INSTRUCTOR
//   const createInstructor = async () => {
//     await API.post("/api/users/create-instructor", form);

//     alert("Instructor created");

//     setForm({ name: "", email: "", password: "" });

//     fetchAllData(); // refresh everything
//   };

//   // ✅ FETCH ALL DATA (IMPORTANT)
//   const fetchAllData = async () => {
//     const res = await API.get("/api/users/full-data");

//     setUsers(res.data.users);
//     setCourses(res.data.courses);
//     setEnrollments(res.data.enrollments);
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // ✅ UPDATE USER
//   const updateUser = async (user) => {
//     const name = prompt("Enter new name", user.name);
//     const role = prompt(
//       "Enter role (ADMIN/INSTRUCTOR/STUDENT)",
//       user.role
//     );

//     await API.put(`/api/users/${user._id}`, { name, role });
//     fetchAllData();
//   };

//   // ✅ DELETE USER
//   const deleteUser = async (id) => {
//     if (!window.confirm("Are you sure?")) return;

//     await API.delete(`/api/users/${id}`);
//     fetchAllData();
//   };

//   return (
//     <div>

//       {/* 🔥 CREATE INSTRUCTOR */}
//       <h3>Create Instructor</h3>

//       <input
//         placeholder="Name"
//         value={form.name}
//         onChange={e => setForm({ ...form, name: e.target.value })}
//       />

//       <input
//         placeholder="Email"
//         value={form.email}
//         onChange={e => setForm({ ...form, email: e.target.value })}
//       />

//       <input
//         placeholder="Password"
//         type="password"
//         value={form.password}
//         onChange={e => setForm({ ...form, password: e.target.value })}
//       />

//       <button onClick={createInstructor}>
//         Create Instructor
//       </button>

//       {/* 🔥 USERS */}

//       <div style={{ marginBottom: 20 }}>
//   <button onClick={() => setView("USERS")}>Users</button>
//   <button onClick={() => setView("COURSES")}>Courses</button>
//   <button onClick={() => setView("ENROLLMENTS")}>Enrollments</button>
// </div>


//       {view === "USERS" && (
//   <>
//     <h2>Users</h2>

//     <div>
//       <button onClick={() => setFilter("ALL")}>All</button>
//       <button onClick={() => setFilter("STUDENT")}>Students</button>
//       <button onClick={() => setFilter("INSTRUCTOR")}>Instructors</button>
//       <button onClick={() => setFilter("ADMIN")}>Admins</button>
//     </div>

//     {filteredUsers.map((u) => (
//       <div key={u._id} style={{ border: "1px solid", margin: 10, padding: 10 }}>
//         <p>Name: {u.name}</p>
//         <p>Email: {u.email}</p>
//         <p>Role: {u.role}</p>

//         <button onClick={() => updateUser(u)}>Edit</button>
//         <button onClick={() => deleteUser(u._id)}>Delete</button>
//       </div>
//     ))}
//   </>
// )}


//       {view === "COURSES" && (
//   <>
//     <h2>Courses</h2>

//     {courses.map(c => (
//       <div key={c._id} style={{ border: "1px solid", margin: 10, padding: 10 }}>
//         <p><b>{c.title}</b></p>
//         <p>Instructor: {c.assignedInstructor?.name || "Not Assigned"}</p>
//       </div>
//     ))}
//   </>
// )}


// {view === "ENROLLMENTS" && (
//   <>
//     <h2>Enrollments</h2>

//     {enrollments.map(e => (
//       <div key={e._id} style={{ border: "1px solid", margin: 10, padding: 10 }}>
//         <p>
//           👤 {e.studentId?.name} → 📚 {e.courseId?.title}
//         </p>
//       </div>
//     ))}
//   </>
// )}

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";
import "./style/ManageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [view, setView] = useState("USERS");
  const [filter, setFilter] = useState("ALL");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const filteredUsers = users.filter(u =>
    filter === "ALL" ? true : u.role === filter
  );

  const createInstructor = async () => {
    try {
      await API.post("/api/users/create-instructor", form);
      setForm({ name: "", email: "", password: "" });
      fetchAllData();
    } catch (err) {
      alert("Failed to create instructor");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await API.delete(`/api/users/${id}`);
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    // <div className="manage-page">
    <div className="center-page">
  <div className="manage-container">
      <h1>Admin Management</h1>

      {/* CREATE INSTRUCTOR */}
      <div className="card form-card">
        <h2>Create Instructor</h2>

        <div className="form-row">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="primary-btn" onClick={createInstructor}>
          Create Instructor
        </button>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={view === "USERS" ? "active" : ""}
          onClick={() => setView("USERS")}
        >
          Users
        </button>
        <button
          className={view === "COURSES" ? "active" : ""}
          onClick={() => setView("COURSES")}
        >
          Courses
        </button>
        <button
          className={view === "ENROLLMENTS" ? "active" : ""}
          onClick={() => setView("ENROLLMENTS")}
        >
          Enrollments
        </button>
      </div>

      {/* USERS */}
      {view === "USERS" && (
        <>
          <div className="filters">
            {["ALL", "STUDENT", "INSTRUCTOR", "ADMIN"].map(f => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid">
            {filteredUsers.map(u => (
              <div key={u._id} className="card user-card">
                <h3>{u.name}</h3>
                <p>{u.email}</p>
                <span className={`role ${u.role.toLowerCase()}`}>
                  {u.role}
                </span>

                <div className="actions">
                  <button onClick={() => setEditingUser(u)}>
                    Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* COURSES */}
      {view === "COURSES" && (
        <div className="grid">
          {courses.map(c => (
            <div key={c._id} className="card">
              <h3>{c.title}</h3>
              <p>
                Instructor:{" "}
                {c.assignedInstructor?.name || "Not Assigned"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ENROLLMENTS */}
      {view === "ENROLLMENTS" && (
        <div className="grid">
          {enrollments.map(e => (
            <div key={e._id} className="card">
              <p>
                👤 {e.studentId?.name} <br />
                📚 {e.courseId?.title}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 EDIT USER MODAL */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User</h2>

            <div className="form-group">
              <label>Name</label>
              <input
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    name: e.target.value
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input value={editingUser.email} disabled />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
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

            <div className="modal-actions">
              <button
                className="primary-btn"
                onClick={async () => {
                  await API.put(`/api/users/${editingUser._id}`, {
                    name: editingUser.name,
                    role: editingUser.role
                  });
                  setEditingUser(null);
                  fetchAllData();
                }}
              >
                Save
              </button>

              <button onClick={() => setEditingUser(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}