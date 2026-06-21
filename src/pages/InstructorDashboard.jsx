
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

// import { useEffect, useMemo, useState } from "react";
// import Calendar from "react-calendar";
// import { Link } from "react-router-dom";
// import API from "../services/api";
// import { getUser, logout } from "../utils/auth";
// import logo from "../assets/skillstek_logo.png";
// import "react-calendar/dist/Calendar.css";
// import "./style/InstructorDashboard.css";

// export default function InstructorDashboard() {
//   const [courses, setCourses] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [loading, setLoading] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const user = getUser();

//   const fetchDashboardData = async () => {
//     try {
//       const [courseRes, classRes, notificationRes] = await Promise.all([
//         API.get("/api/courses"),
//         API.get("/api/classes"),
//         API.get("/api/notifications"),
//       ]);

//       setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
//       setClasses(Array.isArray(classRes.data) ? classRes.data : []);
//       setNotifications(Array.isArray(notificationRes.data) ? notificationRes.data : []);
//     } catch (err) {
//       console.error("Error fetching instructor dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const selectedClasses = useMemo(
//     () =>
//       classes.filter(
//         (item) =>
//           new Date(item.startTime).toDateString() === selectedDate.toDateString()
//       ),
//     [classes, selectedDate]
//   );

//   const upcomingClasses = useMemo(
//     () =>
//       classes
//         .filter((item) => new Date(item.startTime) >= new Date())
//         .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
//         .slice(0, 3),
//     [classes]
//   );

//   const tileContent = ({ date, view }) => {
//     if (view !== "month") return null;

//     const hasClass = classes.some(
//       (item) => new Date(item.startTime).toDateString() === date.toDateString()
//     );

//     return hasClass ? <span className="instructor-calendar-dot"></span> : null;
//   };

//   if (loading) {
//     return (
//       <div className="instructor-loader">
//         <div className="instructor-spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="instructor-dashboard">
//       <header className={`instructor-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
//         <Link to="/" className="instructor-brand" aria-label="Skillstek home">
//           <img src={logo} alt="Skillstek" />
//         </Link>

//         <button
//           className="instructor-menu-toggle"
//           type="button"
//           aria-label="Toggle navigation menu"
//           aria-expanded={mobileMenuOpen}
//           onClick={() => setMobileMenuOpen((open) => !open)}
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>

//         <nav className="instructor-nav-links" aria-label="Instructor navigation">
//           <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
//           <Link to="/create-course" onClick={() => setMobileMenuOpen(false)}>Create Course</Link>
//           <Link to="/my-classes" onClick={() => setMobileMenuOpen(false)}>My Classes</Link>
//           <Link to="/schedule" onClick={() => setMobileMenuOpen(false)}>Schedule</Link>
//           <a href="#instructor-calendar" onClick={() => setMobileMenuOpen(false)}>Calendar</a>
//           <a href="/instructor-trials">
//           <a href="/availability">
//   <button>
//     Set Availability
//   </button>
// </a>
//   <button>
//     Trial Classes
//   </button>
// </a>
//         </nav>

//         <div className="instructor-nav-actions">
//           <Link
//             to="/notifications"
//             className="instructor-icon-link"
//             aria-label="Notifications"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             <span className="instructor-bell-icon"></span>
//             {notifications.length > 0 && (
//               <span className="instructor-notification-count">
//                 {notifications.length > 99 ? "99+" : notifications.length}
//               </span>
//             )}
//           </Link>
//           <Link
//             to="/profile"
//             className="instructor-profile-link"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             <span>{user?.name?.charAt(0)?.toUpperCase() || "I"}</span>
//             <div>
//               <strong>{user?.name || "Instructor"}</strong>
//               <small>Profile</small>
//             </div>
//           </Link>
//           <button className="instructor-logout-btn" onClick={logout}>
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="instructor-main">
//         <section className="instructor-hero">
//           <div>
//             <span className="instructor-eyebrow">Instructor workspace</span>
//             <h1>Welcome back, {user?.name || "Instructor"}</h1>
//             <p>
//               Manage your courses, schedule live classes, track student progress, and
//               view all important notifications from one comprehensive dashboard.
//             </p>
//           </div>

//           <div className="instructor-hero-actions">
//             <Link to="/create-course" className="instructor-primary-btn">
//               Create Course
//             </Link>
//             <Link to="/profile" className="instructor-secondary-btn">
//               Manage Profile
//             </Link>
//           </div>
//         </section>

//         <section className="instructor-stat-grid">
//           <Link to="/courses" className="instructor-stat-card">
//             <span>Courses</span>
//             <strong>{courses.length}</strong>
//             <p>Total courses created</p>
//           </Link>
//           <Link to="/my-classes" className="instructor-stat-card">
//             <span>Classes</span>
//             <strong>{classes.length}</strong>
//             <p>Scheduled live sessions</p>
//           </Link>
//           <Link to="/notifications" className="instructor-stat-card">
//             <span>Notifications</span>
//             <strong>{notifications.length}</strong>
//             <p>Latest platform updates</p>
//           </Link>
//           <a href="#instructor-calendar" className="instructor-stat-card">
//             <span>Upcoming</span>
//             <strong>{upcomingClasses.length}</strong>
//             <p>Next classes to conduct</p>
//           </a>
//         </section>

//         <section className="instructor-content-grid">
//           <div className="instructor-panel instructor-courses-panel">
//             <div className="instructor-section-heading">
//               <div>
//                 <span className="instructor-eyebrow">My Courses</span>
//                 <h2>Your course library</h2>
//               </div>
//               <Link to="/courses">View all</Link>
//             </div>

//             {courses.length === 0 ? (
//               <div className="instructor-empty-state">
//                 <h3>No courses yet</h3>
//                 <p>Start by creating your first course to share knowledge with students.</p>
//                 <Link to="/create-course" className="instructor-primary-btn">
//                   Create Course
//                 </Link>
//               </div>
//             ) : (
//               <div className="instructor-course-list">
//                 {courses.slice(0, 3).map((course) => (
//                   <article className="instructor-course-card" key={course._id}>
//                     <div>
//                       <span>{course.category || "Course"}</span>
//                       <h3>{course.title || "Course"}</h3>
//                       <p>{course.description?.substring(0, 80)}...</p>
//                     </div>

//                     <Link
//                       to={`/courses`}
//                       className="instructor-primary-btn"
//                     >
//                       Manage
//                     </Link>
//                   </article>
//                 ))}
//               </div>
//             )}
//           </div>

//           <aside className="instructor-panel">
//             <div className="instructor-section-heading">
//               <div>
//                 <span className="instructor-eyebrow">Updates</span>
//                 <h2>Notifications</h2>
//               </div>
//               <Link to="/notifications">View all</Link>
//             </div>

//             {notifications.length === 0 ? (
//               <p className="instructor-muted">No notifications yet.</p>
//             ) : (
//               <div className="instructor-notification-list">
//                 {notifications.slice(0, 4).map((notification) => (
//                   <Link
//                     to="/notifications"
//                     className="instructor-notification-item"
//                     key={notification._id}
//                   >
//                     <p>{notification.message}</p>
//                     <small>
//                       {new Date(notification.createdAt).toLocaleString("en-IN", {
//                         timeZone: "Asia/Kolkata",
//                       })}
//                     </small>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </aside>
//         </section>

//         <section className="instructor-panel instructor-calendar-section" id="instructor-calendar">
//           <div className="instructor-section-heading">
//             <div>
//               <span className="instructor-eyebrow">Calendar</span>
//               <h2>Your teaching schedule</h2>
//             </div>
//           </div>

//           <div className="instructor-calendar-layout">
//             <div className="instructor-calendar-shell">
//               <Calendar
//                 onChange={setSelectedDate}
//                 value={selectedDate}
//                 tileContent={tileContent}
//               />
//             </div>

//             <div className="instructor-day-classes">
//               <h3>{selectedDate.toDateString()}</h3>

//               {selectedClasses.length === 0 ? (
//                 <p className="instructor-muted">No classes scheduled for this day.</p>
//               ) : (
//                 selectedClasses.map((item) => (
//                   <article className="instructor-class-card" key={item._id}>
//                     <small>
//                       {new Date(item.startTime).toLocaleString("en-IN", {
//                         timeZone: "Asia/Kolkata",
//                       })}
//                     </small>
//                     <h4>{item.courseId?.title || "Class"}</h4>
//                     {item.status === "COMPLETED" ? (
//                       <span className="instructor-status completed">Completed</span>
//                     ) : (
//                       <a
//                         href={item.meetLink}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="instructor-primary-btn"
//                       >
//                         Start Class
//                       </a>
//                     )}
//                   </article>
//                 ))
//               )}
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";
import API from "../services/api";
import { getUser, logout } from "../utils/auth";
import logo from "../assets/skillstek_logo.png";
import "react-calendar/dist/Calendar.css";
import "./style/InstructorDashboard.css";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [trials, setTrials] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  

  const user = getUser();

  const fetchDashboardData = async () => {
    try {
      // const [courseRes, classRes, notificationRes] = await Promise.all([
      const [
  courseRes,
  classRes,
  notificationRes,
  trialRes
] = await Promise.all([
        API.get("/api/users/instructor-courses"), // ✅ UPDATED
        API.get("/api/classes"),
        API.get("/api/notifications"),
        API.get("/api/instructor/trial-classes"),
        
      ]);
      console.log(trialRes.data);

      // ✅ Courses directly from instructor API
      setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);

      // ✅ Filter only instructor classes
      const userId = user?._id;
      const filteredClasses = Array.isArray(classRes.data)
        ? classRes.data.filter(
            (cls) => cls.instructorId === userId
          )
        : [];

      setClasses(filteredClasses);

      setNotifications(Array.isArray(notificationRes.data) ? notificationRes.data : []);
      setTrials(
  Array.isArray(trialRes.data)
    ? trialRes.data
    : []
);
    } catch (err) {
      console.error("Error fetching instructor dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
//   const allCalendarClasses = [

//   // NORMAL CLASSES
//   ...classes,

//   // TRIAL CLASSES
//   ...trials
//     .filter((t) => t.demoClass)
//     .map((t) => ({

//       _id: t._id,

//       startTime:
//         t.demoClass.startTime,

//       meetLink:
//         t.demoClass.meetLink,

//       status: t.status,

//       isTrial: true,

//       courseId: {
//         title:
//           t.courseId?.title
//       }
//     }))
// ];


const allCalendarClasses = [

  // NORMAL CLASSES
  ...classes.map((c) => ({
    ...c,
    isTrial: false
  })),

  // TRIAL CLASSES
  ...trials.map((t) => ({

    _id: t._id,

    startTime: t.startTime,

    endTime: t.endTime,

    meetLink: t.meetLink,

    status: t.status,

    isTrial: true,

    courseId: {
      title:
        t.courseId?.title
    }
  }))
];


  const selectedClasses = useMemo(
    () =>
      allCalendarClasses.filter(
        (item) =>
          new Date(item.startTime).toDateString() === selectedDate.toDateString()
      ),
    [classes, selectedDate]
  );

  const upcomingClasses = useMemo(
    () =>
      allCalendarClasses
        .filter((item) => new Date(item.startTime) >= new Date())
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 3),
    [classes]
  );

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const hasClass = allCalendarClasses.some(
      (item) => new Date(item.startTime).toDateString() === date.toDateString()
    );

    return hasClass ? <span className="instructor-calendar-dot"></span> : null;
  };

  if (loading) {
    return (
      <div className="instructor-loader">
        <div className="instructor-spinner"></div>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <header className={`instructor-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
        <Link to="/" className="instructor-brand">
          <img src={logo} alt="Skillstek" />
        </Link>

        <button
          className="instructor-menu-toggle"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="instructor-nav-links">
          <Link to="/courses">Courses</Link>
          <Link to="/create-course">Create Course</Link>
          <Link to="/my-classes">My Classes</Link>
          <Link to="/schedule">Schedule</Link>
          <a href="#instructor-calendar">Calendar</a>

          {/* ✅ FIXED BUTTON LINKS */}
        </nav>

        <div className="instructor-nav-actions">
          <Link to="/notifications" className="instructor-icon-link">
            <span className="instructor-bell-icon"></span>
            {notifications.length > 0 && (
              <span className="instructor-notification-count">
                {notifications.length > 99 ? "99+" : notifications.length}
              </span>
            )}
          </Link>

          <Link to="/profile" className="instructor-profile-link">
            <span>{user?.name?.charAt(0)?.toUpperCase() || "I"}</span>
            <div>
              <strong>{user?.name || "Instructor"}</strong>
              <small>Profile</small>
            </div>
          </Link>

          <button className="instructor-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="instructor-main">
        <section className="instructor-hero">
          <div>
            <span className="instructor-eyebrow">Instructor workspace</span>
            <h1>Welcome back, {user?.name || "Instructor"}</h1>
            <p>
              Manage your assigned courses, schedule classes, and track your teaching activities.
            </p>
          </div>

          <div className="instructor-hero-actions">
            <Link to="/create-course" className="instructor-primary-btn">
              Create Course
            </Link>
            <Link to="/profile" className="instructor-secondary-btn">
              Manage Profile
            </Link>
          </div>
        </section>

        <section className="instructor-stat-grid">
          <Link to="/courses" className="instructor-stat-card">
            <span>Courses</span>
            <strong>{courses.length}</strong>
            <p>Courses assigned to you</p>
          </Link>

          {/* <Link to="/my-classes" className="instructor-stat-card"> */}
          <Link
  to="/my-classes"
  state={{
    filter: "ALL"
  }}
  className="instructor-stat-card"
>
            <span>Classes</span>
            <strong>{classes.length}</strong>
            <p>Your scheduled sessions</p>
          </Link>

          <Link to="/notifications" className="instructor-stat-card">
            <span>Notifications</span>
            <strong>{notifications.length}</strong>
          </Link>

          {/* <a href="#instructor-calendar" className="instructor-stat-card"> */}
          <Link
  to="/my-classes"
  state={{
    filter: "UPCOMING"
  }}
  className="instructor-stat-card"
>
            <span>Upcoming</span>
            <strong>{upcomingClasses.length}</strong>
       </Link>
        </section>

        <section className="instructor-tools-grid">
          <Link to="/availability" className="instructor-tool-card">
            <div>
              <span className="instructor-eyebrow">Availability</span>
              <h3>Set Availability</h3>
              <p>Update working days, class hours, and slot duration for trial bookings.</p>
            </div>
            <span className="instructor-arrow">→</span>
          </Link>

          <Link to="/instructor-trials" className="instructor-tool-card">
            <div>
              <span className="instructor-eyebrow">Trials</span>
              <h3>Trial Classes</h3>
              <p>View scheduled trial sessions and review completed trial classes.</p>
            </div>
            <span className="instructor-arrow">→</span>
          </Link>
        </section>

        <section className="instructor-content-grid">
          <div className="instructor-panel">
            <div className="instructor-section-heading">
              <h2>My Courses</h2>
              <Link to="/courses">View all</Link>
            </div>

            {courses.length === 0 ? (
              <p>No assigned courses yet.</p>
            ) : (
              <div className="instructor-course-list">
                {courses.slice(0, 3).map((course) => (
                  <article key={course._id} className="instructor-course-card">
                    <div>
                      <span>Assigned Course</span>
                      <h3>{course.title}</h3>
                      <p>{course.description?.substring(0, 100)}...</p>
                    </div>
                    <Link to="/courses" className="instructor-secondary-btn">
                      Manage
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

  <section className="instructor-panel instructor-calendar-section" id="instructor-calendar">
           <div className="instructor-section-heading">
             <div>
               <span className="instructor-eyebrow">Calendar</span>
               <h2>Your teaching schedule</h2>
             </div>
           </div>

           <div className="instructor-calendar-layout">
             <div className="instructor-calendar-shell">
               <Calendar
                 onChange={setSelectedDate}
                 value={selectedDate}
                 tileContent={tileContent}
               />
             </div>

             <div className="instructor-day-classes">
               <h3>{selectedDate.toDateString()}</h3>

             {selectedClasses.length === 0 ? (
                 <p className="instructor-muted">No classes scheduled for this day.</p>
             ) : (
                selectedClasses.map((item) => (
                  <article className="instructor-class-card" key={item._id}>
                    <small>
                      {new Date(item.startTime).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </small>
                    {/* <h4>{item.courseId?.title || "Class"}</h4> */}
<h4>

  {item.courseId?.title || "Class"}

  {item.isTrial && (
    <span
      style={{
        marginLeft: 10,
        background: "#ff9800",
        color: "white",
        padding: "4px 8px",
        borderRadius: 6,
        fontSize: 12
      }}
    >
      Trial
    </span>
  )}

</h4>
                     {item.status === "COMPLETED" ? (
                       <span className="instructor-status completed">Completed</span>
                     ) : (
                      <a
                         href={item.meetLink}
                         target="_blank"
                         rel="noreferrer"
                         className="instructor-primary-btn"
                       >
                         Start Class
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
