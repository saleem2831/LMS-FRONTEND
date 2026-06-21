

// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function ScheduleClass() {
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);

//   const [form, setForm] = useState({
//     courseId: "",
//     type: "BATCH",
//     studentId: "",
//     startTime: "",
//     meetLink: ""
//   });

//   // ✅ Fetch instructor courses
//   useEffect(() => {
//     API.get("/api/courses/my").then((res) =>
//       setCourses(res.data)
//     );
//   }, []);

//   // ✅ Fetch students when course changes
//   const handleCourseChange = async (courseId) => {
//     setForm({ ...form, courseId });

//     const res = await API.get(
//       `/api/enrollments/course/${courseId}`
//     );

//     setStudents(res.data);
//   };

//   const handleSubmit = async () => {
//     await API.post("/api/classes", form);
//     alert("Class scheduled");
//   };

//   return (
//     <div>
//       <h2>Schedule Class</h2>

//       {/* ✅ COURSE DROPDOWN */}
//       <select onChange={(e) => handleCourseChange(e.target.value)}>
//         <option>Select Course</option>
//         {courses.map((c) => (
//           <option key={c._id} value={c._id}>
//             {c.title}
//           </option>
//         ))}
//       </select>

//       {/* ✅ TYPE */}
//       <select
//         onChange={(e) =>
//           setForm({ ...form, type: e.target.value })
//         }
//       >
//         <option value="BATCH">Batch</option>
//         <option value="ONE_TO_ONE">1:1</option>
//       </select>

//       {/* ✅ STUDENT SELECT ONLY FOR 1:1 */}
//       {form.type === "ONE_TO_ONE" && (
//         <select
//           onChange={(e) =>
//             setForm({ ...form, studentId: e.target.value })
//           }
//         >
//           <option>Select Student</option>
//           {students.map((s) => (
//             <option key={s._id} value={s.studentId._id}>
//               {s.studentId.name}
//             </option>
//           ))}
//         </select>
//       )}

//       {/* ✅ TIME */}
//       <input
//         type="datetime-local"
//         onChange={(e) =>
//           setForm({ ...form, startTime: e.target.value })
//         }
//       />

//       {/* ✅ MEETING LINK (MANUAL) */}
//       <input
//         placeholder="Enter Google Meet / Zoom link"
//         onChange={(e) =>
//           setForm({ ...form, meetLink: e.target.value })
//         }
//       />

//       <button onClick={handleSubmit}>Schedule</button>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { getUser, logout } from "../utils/auth";
import logo from "../assets/skillstek_logo.png";
import "./style/ScheduleClass.css";

export default function ScheduleClass() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = getUser();

  const [form, setForm] = useState({
    courseId: "",
    type: "BATCH",
    studentId: "",
    startTime: "",
    meetLink: "",
    description:""
  });

  // Fetch courses
  useEffect(() => {
    API.get("/api/courses/my").then((res) =>
      setCourses(res.data || [])
    );
  }, []);

  // Load students when course changes
  const handleCourseChange = async (courseId) => {
    setForm({ ...form, courseId });

    try {
      const res = await API.get(
        `/api/enrollments/course/${courseId}`
      );
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");
      await API.post("/api/classes", form);
      setMessage("✅ Class scheduled successfully");

      setForm({
        courseId: "",
        type: "BATCH",
        studentId: "",
        startTime: "",
        meetLink: ""
      });

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Failed to schedule class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-page">
      {/* Navbar */}
      <header className={`schedule-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
        <Link to="/" className="schedule-brand" aria-label="Skillstek home">
          <img src={logo} alt="Skillstek" />
        </Link>

        <button
          className="schedule-menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="schedule-nav-links">
          <Link to="/instructor">Dashboard</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/my-classes">My Classes</Link>
          <Link to="/create-course">Create Course</Link>
        </nav>

        <div className="schedule-nav-actions">
          <Link to="/profile" className="schedule-profile-link">
            <span>{user?.name?.charAt(0)?.toUpperCase() || "I"}</span>
          </Link>
          <button className="schedule-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="schedule-main">
        <section className="schedule-hero">
          <div>
            <span className="schedule-eyebrow">Class Management</span>
            <h1>Schedule a Live Class</h1>
            <p>Plan and schedule your upcoming live sessions for students</p>
          </div>
        </section>

        <div className="schedule-card">
          <div className="form-section">
            <h2>Class Details</h2>

            {message && <div className="schedule-message">{message}</div>}

            {/* Course Selection */}
            <div className="form-group">
              <label htmlFor="course">📚 Select Course</label>
              <select
                id="course"
                value={form.courseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="form-input"
              >
                <option value="">Choose a course...</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Type */}
            <div className="form-group">
              <label htmlFor="type">👥 Class Type</label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="form-input"
              >
                <option value="BATCH">Batch Class</option>
                <option value="ONE_TO_ONE">1:1 Private Session</option>
              </select>
            </div>

            {/* Student Selection (only for 1:1) */}
            {form.type === "ONE_TO_ONE" && (
              <div className="form-group">
                <label htmlFor="student">👤 Select Student</label>
                <select
                  id="student"
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: e.target.value })
                  }
                  className="form-input"
                >
                  <option value="">Choose a student...</option>
                  {students.map((s) => (
                    <option key={s._id} value={s.studentId?._id}>
                      {s.studentId?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date & Time */}
            <div className="form-group">
              <label htmlFor="datetime">📅 Date & Time</label>
              <input
                id="datetime"
                type="datetime-local"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                className="form-input"
              />
            </div>

            {/* Meeting Link */}
            <div className="form-group">
              <label htmlFor="meetLink">🔗 Meeting Link</label>
              <input
                id="meetLink"
                type="url"
                placeholder="https://meet.google.com/xxx or https://zoom.us/xxx"
                value={form.meetLink}
                onChange={(e) =>
                  setForm({ ...form, meetLink: e.target.value })
                }
                className="form-input"
              />
            </div>
 <div className="form-group">
              <label htmlFor="description">Description</label>
                         <input id="description" type="text Area"
  placeholder="Class Description" value={form.description}
  onChange={e => setForm({ ...form, description: e.target.value })}
  className="form-input"
/>
            </div>



            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !form.courseId || !form.startTime || !form.meetLink || !form.description}
              className="schedule-submit-btn"
            >
              {loading ? "Scheduling..." : "Schedule Class"}
            </button>
          </div>

          {/* Info Card */}
          <div className="form-section info-section">
            <h3>📋 Instructions</h3>
            <ul className="instruction-list">
              <li>Select the course for which you want to schedule a class</li>
              <li>Choose between Batch (all students) or 1:1 (single student)</li>
              <li>Set the date and time for your class</li>
              <li>Add your Google Meet or Zoom link</li>
              <li>Students will receive notifications about the scheduled class</li>
            </ul>

            <h3>💡 Tips</h3>
            <ul className="instruction-list">
              <li>Schedule classes at least 24 hours in advance</li>
              <li>Ensure the meeting link is active and working</li>
              <li>Send reminders to students before class starts</li>
              <li>Record classes for future reference</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}