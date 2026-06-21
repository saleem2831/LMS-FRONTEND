
// import { useEffect, useState } from "react";
// import API from "../services/api";
// import { useParams, useLocation } from "react-router-dom";
// import "./style/MyClasses.css";

// export default function MyClasses() {
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { courseId } = useParams();

//   const location =
//   useLocation();

// const filter =
//   location.state?.filter || "ALL";

//   const filteredClasses =
//   filter === "UPCOMING"

//     ? classes.filter(
//         (c) =>
//           new Date(c.startTime) >
//           new Date()
//       )

//     : classes;

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const res = await API.get("/api/classes");



// let filtered = res.data;

// if (courseId) {
//   filtered = res.data.filter((c) => {
//     const id =
//       typeof c.courseId === "object"
//         ? c.courseId._id
//         : c.courseId;

//     return String(id) === String(courseId);
//   });
// }

// setClasses(filtered);

//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClasses();
//   }, [courseId]);

//   if (loading) {
//     return (
//       <div className="loader-container">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="center-page">
//       <div className="classes-container">

//         <h1>My Classes</h1>

//         {classes.length === 0 ? (
//           <p className="empty">No classes for this course</p>
//         ) : (
//           <div className="class-grid">
//             {/* {classes.map((c) => { */}
//                   {filteredClasses.map((c) => {

//               // ✅ FIX STATUS
//               const status =
//                 c.status ||
//                 (new Date(c.startTime) > new Date()
//                   ? "UPCOMING"
//                   : "COMPLETED");

//               return (
//                 <div key={c._id} className="class-card">

//                   <h2>{c.courseId?.title || "Course"}</h2>
//                   <h2>{c.description || "Description"}</h2>
//                   <p className="time">
//                     {new Date(c.startTime).toLocaleString("en-IN", {
//                       timeZone: "Asia/Kolkata",
//                     })}
//                   </p>

//                   {/* STATUS */}
//                   <span
//                     className={`status ${
//                       status === "UPCOMING"
//                         ? "upcoming"
//                         : "completed"
//                     }`}
//                   >
//                     {status}
//                   </span>

//                   {/* ACTION */}
//                   <div className="actions">
//                     {status === "UPCOMING" ? (
//                       <a
//                         href={c.meetLink}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="join-btn"
//                       >
//                         Join Class
//                       </a>
//                     ) : (
//                       <button className="completed-btn" disabled>
//                         Completed
//                       </button>
//                     )}
//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useParams, useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";
import "./style/MyClasses.css";

const CLASSES_PER_PAGE = 9;

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classPage, setClassPage] = useState(1);
  const { courseId } = useParams();

  const location = useLocation();
  const initialFilter = location.state?.filter || "ALL";
  const [filter, setFilter] = useState(initialFilter);

  const filteredClasses = useMemo(
    () => {
      if (filter === "UPCOMING") {
        return classes.filter((c) => {
          const status =
            c.status ||
            (new Date(c.startTime) > new Date()
              ? "UPCOMING"
              : "COMPLETED");

          return status === "UPCOMING";
        });
      }

      if (filter === "COMPLETED") {
        return classes.filter((c) => {
          const status =
            c.status ||
            (new Date(c.startTime) > new Date()
              ? "UPCOMING"
              : "COMPLETED");

          return status === "COMPLETED";
        });
      }

      return classes;
    },
    [classes, filter]
  );

  useEffect(() => {
    setClassPage(1);
  }, [filter, courseId]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredClasses.length / CLASSES_PER_PAGE));

    if (classPage > totalPages) {
      setClassPage(totalPages);
    }
  }, [filteredClasses.length, classPage]);

  const paginatedClasses = useMemo(() => {
    const startIndex = (classPage - 1) * CLASSES_PER_PAGE;
    return filteredClasses.slice(startIndex, startIndex + CLASSES_PER_PAGE);
  }, [filteredClasses, classPage]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/api/classes");

        let filtered = res.data;

        // ✅ FILTER BY COURSE (if exists)
        if (courseId) {
          filtered = res.data.filter((c) => {
            const id =
              typeof c.courseId === "object"
                ? c.courseId._id
                : c.courseId;

            return String(id) === String(courseId);
          });
        }

        // ✅ ✅ SMART SORT (OPTION 2)
        filtered.sort((a, b) => {
          const now = new Date();

          const aTime = new Date(a.startTime);
          const bTime = new Date(b.startTime);

          const aUpcoming = aTime > now;
          const bUpcoming = bTime > now;

          // ✅ Upcoming first
          if (aUpcoming && !bUpcoming) return -1;
          if (!aUpcoming && bUpcoming) return 1;

          // ✅ Within same group → nearest first
          return aTime - bTime;
        });

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

        <div className="class-tabs">
          {["ALL", "UPCOMING", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              className={`class-tab ${filter === tab ? "active" : ""}`}
              type="button"
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredClasses.length === 0 ? (
          <p className="empty">No classes for this course</p>
        ) : (
          <>
            <div className="class-grid">
              {paginatedClasses.map((c) => {
                const status =
                  c.status ||
                  (new Date(c.startTime) > new Date()
                    ? "UPCOMING"
                    : "COMPLETED");

                return (
                  <div key={c._id} className="class-card">
                    <h2>{c.courseId?.title || "Course"}</h2>
                    <h2>{c.description || "Description"}</h2>

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

            <Pagination
              currentPage={classPage}
              totalItems={filteredClasses.length}
              itemsPerPage={CLASSES_PER_PAGE}
              onPageChange={setClassPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
