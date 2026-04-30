
// import { useEffect, useState } from "react";
// import Calendar from "react-calendar";
// import API from "../services/api";
// import "react-calendar/dist/Calendar.css";

// export default function CalendarView() {
//   const [classes, setClasses] = useState([]); // ✅ MUST EXIST
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   useEffect(() => {
//     API.get("/api/classes")
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           setClasses(res.data);
//         } else {
//           console.error("Invalid response:", res.data);
//           setClasses([]);
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         setClasses([]);
//       });
//   }, []);

//   // ✅ SAFE FILTER
//   const filtered = classes.filter((c) => {
//     return (
//       new Date(c.startTime).toDateString() ===
//       selectedDate.toDateString()
//     );
//   });

//   // ✅ MARK DATES WITH CLASSES
//   const tileContent = ({ date, view }) => {
//     if (view === "month") {
//       const hasClass = classes.some(
//         (c) =>
//           new Date(c.startTime).toDateString() ===
//           date.toDateString()
//       );

//       return hasClass ? (
//         <div style={{ color: "green", fontWeight: "bold" }}>•</div>
//       ) : null;
//     }
//   };

//   return (
//     <div>
//       <h2>Calendar</h2>

//       <Calendar
//         onChange={setSelectedDate}
//         value={selectedDate}
//         tileContent={tileContent}
//       />

//       <h3>Classes on {selectedDate.toDateString()}</h3>

//       {filtered.length === 0 && <p>No classes</p>}

//       {filtered.map((c) => (
//         <div key={c._id} style={{ border: "1px solid", margin: 10 }}>
//           <p>
//             {new Date(c.startTime).toLocaleString("en-IN", {
//               timeZone: "Asia/Kolkata"
//             })}
//           </p>

//           <p><b>{c.courseId?.title}</b></p>

//           {/* <a href={c.meetLink} target="_blank" rel="noreferrer">
//             Join Class
//           </a> */}
//           {c.status === "COMPLETED" ? (
//       <p style={{ color: "green" }}>✔ Completed</p>
//     ) : (
//       <a href={c.meetLink} target="_blank">
//         Join
//       </a>
//     )}
//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import API from "../services/api";
import "react-calendar/dist/Calendar.css";
import "./style/CalendarView.css";

export default function CalendarView() {
  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/classes")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setClasses(res.data);
        } else {
          setClasses([]);
        }
      })
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = classes.filter(
    (c) =>
      new Date(c.startTime).toDateString() ===
      selectedDate.toDateString()
  );

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hasClass = classes.some(
        (c) =>
          new Date(c.startTime).toDateString() ===
          date.toDateString()
      );

      return hasClass ? <div className="dot"></div> : null;
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <h1 className="page-title">Platform Calendar</h1>

      <div className="calendar-layout">
        
        {/* Calendar Section */}
        <div className="calendar-box">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
          />
        </div>

        {/* Classes Section */}
        <div className="classes-box">
          <h2>
            Classes on{" "}
            <span>{selectedDate.toDateString()}</span>
          </h2>

          {filtered.length === 0 ? (
            <p className="no-data">No classes scheduled</p>
          ) : (
            filtered.map((c) => (
              <div key={c._id} className="class-card">
                <p className="time">
                  {new Date(c.startTime).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>

                <h3>{c.courseId?.title}</h3>

                {c.status === "COMPLETED" ? (
                  <span className="badge completed">
                    ✔ Completed
                  </span>
                ) : (
                  <a
                    href={c.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="join-btn"
                  >
                    Join Class
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}