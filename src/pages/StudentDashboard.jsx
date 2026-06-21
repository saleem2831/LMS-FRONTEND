// import { useEffect, useMemo, useState } from "react";
// import Calendar from "react-calendar";
// import { Link } from "react-router-dom";
// import API from "../services/api";
// import { getUser, logout } from "../utils/auth";
// import logo from "../assets/skillstek_logo.png";
// import "react-calendar/dist/Calendar.css";
// import "./style/StudentDashboard.css";

// export default function StudentDashboard() {
//   const [enrollments, setEnrollments] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [loading, setLoading] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const user = getUser();

//   const fetchDashboardData = async () => {
//     try {
//       const [enrollmentRes, notificationRes, classRes] = await Promise.all([
//         API.get("/api/enrollments/my"),
//         API.get("/api/notifications"),
//         API.get("/api/classes"),
//       ]);

//       setEnrollments(Array.isArray(enrollmentRes.data) ? enrollmentRes.data : []);
//       setNotifications(Array.isArray(notificationRes.data) ? notificationRes.data : []);
//       setClasses(Array.isArray(classRes.data) ? classRes.data : []);
//     } catch (err) {
//       console.error("Error fetching student dashboard data:", err);
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

//     return hasClass ? <span className="student-calendar-dot"></span> : null;
//   };

//   if (loading) {
//     return (
//       <div className="student-loader">
//         <div className="student-spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="student-dashboard">
//       <header className={`student-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
//         <Link to="/" className="student-brand" aria-label="Skillstek home">
//           <img src={logo} alt="Skillstek" />
//         </Link>

//         <button
//           className="student-menu-toggle"
//           type="button"
//           aria-label="Toggle navigation menu"
//           aria-expanded={mobileMenuOpen}
//           onClick={() => setMobileMenuOpen((open) => !open)}
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>

//         <nav className="student-nav-links" aria-label="Student navigation">
//           <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
//           <Link to="/my-classes" onClick={() => setMobileMenuOpen(false)}>My Classes</Link>
//           <a href="#student-calendar" onClick={() => setMobileMenuOpen(false)}>Calendar</a>
//         </nav>

//         <div className="student-nav-actions">
//           <Link
//             to="/notifications"
//             className="student-icon-link"
//             aria-label="Notifications"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             <span className="student-bell-icon"></span>
//             {notifications.length > 0 && (
//               <span className="student-notification-count">
//                 {notifications.length > 99 ? "99+" : notifications.length}
//               </span>
//             )}
//           </Link>

//            <a href="/student-trials">
//   <button>
//     My Trial Classes
//   </button>
// </a>
//           <Link
//             to="/profile"
//             className="student-profile-link"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             <span>{user?.name?.charAt(0)?.toUpperCase() || "S"}</span>
//             <div>
//               <strong>{user?.name || "Student"}</strong>
//               <small>Profile</small>
//             </div>
//           </Link>
//           <button className="student-logout-btn" onClick={logout}>
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="student-main">
//         <section className="student-hero">
//           <div>
//             <span className="student-eyebrow">Student workspace</span>
//             <h1>Welcome back, {user?.name || "Student"}</h1>
//             <p>
//               Track your courses, upcoming live classes, notifications, and
//               learning schedule from one polished dashboard.
//             </p>
//           </div>

//           <div className="student-hero-actions">
//             <Link to="/courses" className="student-primary-btn">
//               Browse Courses
//             </Link>
//             <Link to="/profile" className="student-secondary-btn">
//               Manage Profile
//             </Link>
//           </div>
//         </section>

//         <section className="student-stat-grid">
//           <Link to="/courses" className="student-stat-card">
//             <span>Courses</span>
//             <strong>{enrollments.length}</strong>
//             <p>Enrolled learning paths</p>
//           </Link>
//           <Link to="/notifications" className="student-stat-card">
//             <span>Notifications</span>
//             <strong>{notifications.length}</strong>
//             <p>Latest platform updates</p>
//           </Link>
//           <a href="#student-calendar" className="student-stat-card">
//             <span>Schedule</span>
//             <strong>{classes.length}</strong>
//             <p>Total scheduled classes</p>
//           </a>
//           <Link to="/my-classes" className="student-stat-card">
//             <span>Upcoming</span>
//             <strong>{upcomingClasses.length}</strong>
//             <p>Next classes to attend</p>
//           </Link>
//         </section>

//         <section className="student-content-grid">
//           <div className="student-panel student-courses-panel">
//             <div className="student-section-heading">
//               <div>
//                 <span className="student-eyebrow">My Courses</span>
//                 <h2>Continue learning</h2>
//               </div>
//               <Link to="/courses">Explore more</Link>
//             </div>

//             {enrollments.length === 0 ? (
//               <div className="student-empty-state">
//                 <h3>No courses purchased yet</h3>
//                 <p>Explore available courses and start your first learning path.</p>
//                 <Link to="/courses" className="student-primary-btn">
//                   Browse Courses
//                 </Link>
//               </div>
//             ) : (
//               <div className="student-course-list">
//                 {enrollments.map((enrollment) => (
//                   <article className="student-course-card" key={enrollment._id}>
//                     <div>
//                       <span>{enrollment.plan}</span>
//                       <h3>{enrollment.courseId?.title || "Course"}</h3>
//                       <p>Access your live classes, materials, and schedule.</p>
//                     </div>

//                     <Link
//                       to={`/my-classes/${enrollment.courseId?._id}`}
//                       className="student-primary-btn"
//                     >
//                       View Classes
//                     </Link>
//                   </article>
//                 ))}
//               </div>
//             )}
//           </div>

//           <aside className="student-panel">
//             <div className="student-section-heading">
//               <div>
//                 <span className="student-eyebrow">Updates</span>
//                 <h2>Notifications</h2>
//               </div>
//               <Link to="/notifications">View all</Link>
//             </div>

//             {notifications.length === 0 ? (
//               <p className="student-muted">No notifications yet.</p>
//             ) : (
//               <div className="student-notification-list">
//                 {notifications.slice(0, 4).map((notification) => (
//                   <Link
//                     to="/notifications"
//                     className="student-notification-item"
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

//         <section className="student-panel student-calendar-section" id="student-calendar">
//           <div className="student-section-heading">
//             <div>
//               <span className="student-eyebrow">Calendar</span>
//               <h2>Your learning schedule</h2>
//             </div>
//             {/* <Link to="/calendar">Open full calendar</Link> */}
//           </div>

//           <div className="student-calendar-layout">
//             <div className="student-calendar-shell">
//               <Calendar
//                 onChange={setSelectedDate}
//                 value={selectedDate}
//                 tileContent={tileContent}
//               />
//             </div>

//             <div className="student-day-classes">
//               <h3>{selectedDate.toDateString()}</h3>

//               {selectedClasses.length === 0 ? (
//                 <p className="student-muted">No classes scheduled for this day.</p>
//               ) : (
//                 selectedClasses.map((item) => (
//                   <article className="student-class-card" key={item._id}>
//                     <small>
//                       {new Date(item.startTime).toLocaleString("en-IN", {
//                         timeZone: "Asia/Kolkata",
//                       })}
//                     </small>
//                     <h4>{item.courseId?.title || "Class"}</h4>
//                     {item.status === "COMPLETED" ? (
//                       <span className="student-status completed">Completed</span>
//                     ) : (
//                       <a
//                         href={item.meetLink}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="student-primary-btn"
//                       >
//                         Join Class
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
import "./style/StudentDashboard.css";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = getUser();

//   const fetchDashboardData = async () => {
//     try {
//       const [enrollmentRes, notificationRes, classRes] = await Promise.all([
//         API.get("/api/enrollments/my"),
//         API.get("/api/notifications"),
//         API.get("/api/classes"),
//       ]);

// //        if (enrollmentData.length === 0) {
// //   window.location.href ="/courses";

// //   return;
// // }


//       setEnrollments(Array.isArray(enrollmentRes.data) ? enrollmentRes.data : []);
//       setNotifications(Array.isArray(notificationRes.data) ? notificationRes.data : []);
//       setClasses(Array.isArray(classRes.data) ? classRes.data : []);



//     } catch (err) {
//       console.error("Error fetching student dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

// const fetchDashboardData = async () => {
//   try {

//     const [
//       enrollmentRes,
//       notificationRes,
//       classRes,
//       trialRes
//     ] = await Promise.all([
//       API.get("/api/enrollments/my"),
//       API.get("/api/notifications"),
//       API.get("/api/classes"),
//       API.get("/api/trials/my-trials")
//     ]);

//     const enrollmentsData = Array.isArray(enrollmentRes.data)
//       ? enrollmentRes.data
//       : [];

//     const trialsData = Array.isArray(trialRes.data)
//       ? trialRes.data
//       : [];

//     // ===============================
//     // USER HAS NOTHING
//     // ===============================
//     if (
//       enrollmentsData.length === 0 &&
//       trialsData.length === 0
//     ) {
//       window.location.href = "/courses";
//       return;
//     }

//     // ===============================
//     // USER ONLY HAS TRIAL
//     // ===============================
//     if (
//       enrollmentsData.length === 0 &&
//       trialsData.length > 0
//     ) {
//       window.location.href = "/student-trials";
//       return;
//     }

//     // ===============================
//     // USER HAS FULL COURSE
//     // ===============================
//     setEnrollments(enrollmentsData);

//     setNotifications(
//       Array.isArray(notificationRes.data)
//         ? notificationRes.data
//         : []
//     );

//     setClasses(
//       Array.isArray(classRes.data)
//         ? classRes.data
//         : []
//     );

//   } catch (err) {

//     console.error(
//       "Error fetching student dashboard data:",
//       err
//     );

//   } finally {

//     setLoading(false);
//   }
// };

const [trials, setTrials] = useState([]);

const fetchDashboardData = async () => {

  try {

    const [
      enrollmentRes,
      notificationRes,
      classRes,
      trialRes
    ] = await Promise.all([

      API.get("/api/enrollments/my"),

      API.get("/api/notifications"),

      API.get("/api/classes"),

      API.get("/api/trials/my-trials")
    ]);

    const enrollmentsData =
      Array.isArray(enrollmentRes.data)
        ? enrollmentRes.data
        : [];

    const trialsData =
      Array.isArray(trialRes.data)
        ? trialRes.data
        : [];

    // ====================================
    // JUST REGISTERED USER
    // ====================================

    if (
      enrollmentsData.length === 0 &&
      trialsData.length === 0
    ) {

      window.location.href = "/courses";

      return;
    }

    setEnrollments(enrollmentsData);

    setTrials(trialsData);

    setNotifications(
      Array.isArray(notificationRes.data)
        ? notificationRes.data
        : []
    );

    setClasses(
      Array.isArray(classRes.data)
        ? classRes.data
        : []
    );

    setTrials(
  Array.isArray(trialRes.data)
    ? trialRes.data
    : []
);

  } catch (err) {

    console.error(
      "Error fetching dashboard:",
      err
    );

  } finally {

    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboardData();
    
  }, []);

  const allCalendarClasses = [

  // NORMAL CLASSES
  ...classes,

  // TRIAL CLASSES
  ...trials
    .filter((t) => t.demoClass)
    .map((t) => ({

      _id: t._id,

      startTime:
        t.demoClass.startTime,

      meetLink:
        t.demoClass.meetLink,

      status: t.status,

      isTrial: true,

      courseId: {
        title:
          t.courseId?.title
      }
    }))
];
  

  // const selectedClasses = useMemo(
  //   () =>
  //     classes.filter(
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
    [allCalendarClasses]
  );

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const hasClass = allCalendarClasses.some(
      (item) => new Date(item.startTime).toDateString() === date.toDateString()
    );

    return hasClass ? <span className="student-calendar-dot"></span> : null;
  };

  if (loading) {
    return (
      <div className="student-loader">
        <div className="student-spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <header className={`student-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
        <Link to="/" className="student-brand" aria-label="Skillstek home">
          <img src={logo} alt="Skillstek" />
        </Link>

        <button
          className="student-menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

<nav
  className="student-nav-links"
  aria-label="Student navigation"
>

  <Link
    to="/courses"
    onClick={() =>
      setMobileMenuOpen(false)
    }
  >
    Courses
  </Link>

  {/* FULL ENROLLMENT ONLY */}

  {enrollments.length > 0 && (

    <>
      <Link
        to="/my-classes"
        onClick={() =>
          setMobileMenuOpen(false)
        }
      >
        My Classes
      </Link>

      <a
        href="#student-calendar"
        onClick={() =>
          setMobileMenuOpen(false)
        }
      >
        Calendar
      </a>
    </>
  )}

  {/* TRIAL USERS */}

  {trials.length > 0 && (

    <Link
      to="/student-trials"
      onClick={() =>
        setMobileMenuOpen(false)
      }
    >
      My Trial Classes
    </Link>

  )}

</nav>

        <div className="student-nav-actions">
          <Link
            to="/notifications"
            className="student-icon-link"
            aria-label="Notifications"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="student-bell-icon"></span>
            {notifications.length > 0 && (
              <span className="student-notification-count">
                {notifications.length > 99 ? "99+" : notifications.length}
              </span>
            )}
          </Link>

           {/* <a href="/student-trials">
  <button>
    My Trial Classes
  </button>
</a> */}

{enrollments.length === 0 && (
  <a href="/student-trials">
    <button>
      My Trial Classes
    </button>
  </a>
)}

          <Link
            to="/profile"
            className="student-profile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>{user?.name?.charAt(0)?.toUpperCase() || "S"}</span>
            <div>
              <strong>{user?.name || "Student"}</strong>
              <small>Profile</small>
            </div>
          </Link>
          <button className="student-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="student-main">
        <section className="student-hero">
          <div>
            <span className="student-eyebrow">Student workspace</span>
            <h1>Welcome back, {user?.name || "Student"}</h1>
            <p>
              Track your courses, upcoming live classes, notifications, and
              learning schedule from one polished dashboard.
            </p>
          </div>

          <div className="student-hero-actions">
            <Link to="/courses" className="student-primary-btn">
              Browse Courses
            </Link>
            <Link to="/profile" className="student-secondary-btn">
              Manage Profile
            </Link>
          </div>
        </section>

{enrollments.length > 0 && (
        <section className="student-stat-grid">
          <Link to="/courses" className="student-stat-card">
            <span>Courses</span>
            <strong>{enrollments.length}</strong>
            <p>Enrolled learning paths</p>
          </Link>
          <Link to="/notifications" className="student-stat-card">
            <span>Notifications</span>
            <strong>{notifications.length}</strong>
            <p>Latest platform updates</p>
          </Link>
          {/* <a href="#student-calendar" className="student-stat-card">
            <span>Schedule</span>
            <strong>{classes.length}</strong>
            <p>Total scheduled classes</p>
          </a>
          <Link to="/my-classes" className="student-stat-card">
            <span>Upcoming</span>
            <strong>{upcomingClasses.length}</strong>
            <p>Next classes to attend</p>
          </Link> */}
          {/* ALL CLASSES */}
<Link
  to="/my-classes"
  state={{
    filter: "ALL"
  }}
  className="student-stat-card"
>

  <span>Schedule</span>

  <strong>
    {classes.length}
  </strong>

  <p>
    Total scheduled classes
  </p>

</Link>

{/* UPCOMING ONLY */}
<Link
  to="/my-classes"
  state={{
    filter: "UPCOMING"
  }}
  className="student-stat-card"
>

  <span>Upcoming</span>

  <strong>
    {upcomingClasses.length}
  </strong>

  <p>
    Next classes to attend
  </p>

</Link>
        </section>
)}
        {/* ===================================== */}
{/* TRIAL CLASSES SECTION */}
{/* ===================================== */}

{/* {trials.length > 0 && (

  <section className="student-panel">

    <div className="student-section-heading">

      <div>
        <span className="student-eyebrow">
          Trial Classes
        </span>

        <h2>
          Your Trial Sessions
        </h2>
      </div>

      <Link to="/student-trials">
        View All
      </Link>

    </div>

    <div className="student-course-list">

      {trials.map((trial) => (

        <article
          className="student-course-card"
          key={trial._id}
        >

          <div>

            <span>
              Trial Class
            </span>

            <h3>
              {trial.courseId?.title}
            </h3>

            <p>
              Status:
              {" "}
              {trial.status}
            </p>

            {trial.demoClass && (

              <p>
                Scheduled:
                {" "}
                {new Date(
                  trial.demoClass.startTime
                ).toLocaleString()}
              </p>

            )}

          </div>

          <Link
            to="/student-trials"
            className="student-primary-btn"
          >
            Open Trial
          </Link>

        </article>

      ))}

    </div>

  </section>

)} */}

        <section className="student-content-grid">
          <div className="student-panel student-courses-panel">
            <div className="student-section-heading">
              <div>
                <span className="student-eyebrow">My Courses</span>
                <h2>Continue learning</h2>
              </div>
              <Link to="/courses">Explore more</Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="student-empty-state">
                <h3>No courses purchased yet</h3>
                <p>Explore available courses and start your first learning path.</p>
                <Link to="/courses" className="student-primary-btn">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="student-course-list">
                {enrollments.map((enrollment) => (
                  <article className="student-course-card" key={enrollment._id}>
                    <div>
                      <span>{enrollment.plan}</span>
                      <h3>{enrollment.courseId?.title || "Course"}</h3>
                      <p>Access your live classes, materials, and schedule.</p>
                    </div>

                    <Link
                      to={`/my-classes/${enrollment.courseId?._id}`}
                      className="student-primary-btn"
                    >
                      View Classes
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="student-panel">
            <div className="student-section-heading">
              <div>
                <span className="student-eyebrow">Upcoming</span>
                <h2>Class Updates</h2>
              </div>
              <Link to="/my-classes">View all</Link>
            </div>

            {upcomingClasses.length === 0 ? (
              <p className="student-muted">No upcoming classes yet.</p>
            ) : (
              <div className="student-notification-list">
                {upcomingClasses.map((item) => (
                  <article className="student-notification-item" key={item._id}>
                    <span className="student-status">
                      {item.isTrial ? "Trial Class" : "Live Class"}
                    </span>
                    <p>{item.courseId?.title || "Class"}</p>
                    <small>
                      {new Date(item.startTime).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </small>
                    {item.meetLink && (
                      <a
                        href={item.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="student-upcoming-link"
                      >
                        Join Class
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </aside>
        </section>

        <section className="student-panel student-calendar-section" id="student-calendar">
          <div className="student-section-heading">
            <div>
              <span className="student-eyebrow">Calendar</span>
              <h2>Your learning schedule</h2>
            </div>
            {/* <Link to="/calendar">Open full calendar</Link> */}
          </div>

          <div className="student-calendar-layout">
            <div className="student-calendar-shell">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
              />
            </div>

            <div className="student-day-classes">
              <h3>{selectedDate.toDateString()}</h3>

              {selectedClasses.length === 0 ? (
                <p className="student-muted">No classes scheduled for this day.</p>
              ) : (
                selectedClasses.map((item) => (
                  <article className="student-class-card" key={item._id}>
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
        background: "orange",
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
                      <span className="student-status completed">Completed</span>
                    ) : (
                      <a
                        href={item.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="student-primary-btn"
                      >
                        Join Class
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
