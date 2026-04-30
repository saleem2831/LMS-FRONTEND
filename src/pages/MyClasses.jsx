// import { useEffect, useState } from "react";
// import API from "../services/api";
// import { useParams } from "react-router-dom";


// export default function MyClasses() {
//   const [classes, setClasses] = useState([]);
//     const { courseId } = useParams();



//   useEffect(() => {
//     const fetch = async () => {
//       const res = await API.get("/api/classes");

//       // ✅ FILTER BY COURSE
//       const filtered = res.data.filter(
//         (c) => c.courseId === courseId || c.courseId?._id === courseId
//       );

//       setClasses(filtered);
//     };

//     fetch();
//   }, [courseId]);

//   return (
//     <div>
//       <h2>My Classes</h2>

//       {classes.length === 0 && <p>No classes for this course</p>}


//       {classes.map(c => (
//   <div key={c._id} style={{ border: "1px solid", margin: 10 }}>
    
//     <p><b>{c.courseId?.title}</b></p>

//     <p>
//       {new Date(c.startTime).toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata"
//       })}
//     </p>

//     <p>Status: {c.status}</p>


//     {c.status === "UPCOMING" ? (
//   <a href={c.meetLink} target="_blank" rel="noreferrer">
//     Join Class
//   </a>
// ) : (
//   // <button disabled>Completed</button>
//   <p style={{ color: "green" }}>Completed</p>
// )}
//   </div>
// ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import "./style/MyClasses.css";

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/api/classes");

        console.log("API DATA:", res.data);
        console.log("COURSE ID:", courseId);

        // ✅ FIXED FILTER
        // const filtered = res.data.filter((c) => {
        //   const id =
        //     typeof c.courseId === "object"
        //       ? c.courseId?._id
        //       : c.courseId;

        //   return String(id) === String(courseId);
        // });

        console.log("PARAM courseId:", courseId);

// const filtered = res.data.filter((c) => {
//   const id =
//     typeof c.courseId === "object"
//       ? c.courseId._id
//       : c.courseId;

//   console.log("Comparing:", id, courseId);

//   return String(id) === String(courseId);
// });

// console.log("FILTERED:", filtered);

//         // ✅ SORT: Upcoming first
//         const sorted = filtered.sort(
//           (a, b) => new Date(a.startTime) - new Date(b.startTime)
//         );

//         setClasses(sorted);

let filtered = res.data;

if (courseId) {
  filtered = res.data.filter((c) => {
    const id =
      typeof c.courseId === "object"
        ? c.courseId._id
        : c.courseId;

    return String(id) === String(courseId);
  });
}

setClasses(filtered);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [courseId]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="center-page">
      <div className="classes-container">

        <h1>My Classes</h1>

        {classes.length === 0 ? (
          <p className="empty">No classes for this course</p>
        ) : (
          <div className="class-grid">
            {classes.map((c) => {
              
              // ✅ FIX STATUS
              const status =
                c.status ||
                (new Date(c.startTime) > new Date()
                  ? "UPCOMING"
                  : "COMPLETED");

              return (
                <div key={c._id} className="class-card">

                  <h2>{c.courseId?.title || "Course"}</h2>

                  <p className="time">
                    {new Date(c.startTime).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>

                  {/* STATUS */}
                  <span
                    className={`status ${
                      status === "UPCOMING"
                        ? "upcoming"
                        : "completed"
                    }`}
                  >
                    {status}
                  </span>

                  {/* ACTION */}
                  <div className="actions">
                    {status === "UPCOMING" ? (
                      <a
                        href={c.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="join-btn"
                      >
                        Join Class
                      </a>
                    ) : (
                      <button className="completed-btn" disabled>
                        Completed
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}