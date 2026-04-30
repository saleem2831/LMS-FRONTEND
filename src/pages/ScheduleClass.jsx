

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
import API from "../services/api";
import "./style/ScheduleClass.css";

export default function ScheduleClass() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    courseId: "",
    type: "BATCH",
    studentId: "",
    startTime: "",
    meetLink: ""
  });

  // Fetch courses
  useEffect(() => {
    API.get("/api/courses/my").then((res) =>
      setCourses(res.data)
    );
  }, []);

  // Load students when course changes
  const handleCourseChange = async (courseId) => {
    setForm({ ...form, courseId });

    const res = await API.get(
      `/api/enrollments/course/${courseId}`
    );

    setStudents(res.data || []);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await API.post("/api/classes", form);
      alert("Class scheduled successfully");

      setForm({
        courseId: "",
        type: "BATCH",
        studentId: "",
        startTime: "",
        meetLink: ""
      });

    } catch (err) {
      alert("Failed to schedule class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-page">

      <div className="schedule-card">

        <h1>Schedule Class</h1>

        {/* COURSE */}
        <label>Course</label>
        <select
          value={form.courseId}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <label>Class Type</label>
        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="BATCH">Batch Class</option>
          <option value="ONE_TO_ONE">1:1 Class</option>
        </select>

        {/* STUDENT (only for 1:1) */}
        {form.type === "ONE_TO_ONE" && (
          <>
            <label>Select Student</label>
            <select
              value={form.studentId}
              onChange={(e) =>
                setForm({ ...form, studentId: e.target.value })
              }
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option
                  key={s._id}
                  value={s.studentId?._id}
                >
                  {s.studentId?.name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* TIME */}
        <label>Date & Time</label>
        <input
          type="datetime-local"
          value={form.startTime}
          onChange={(e) =>
            setForm({ ...form, startTime: e.target.value })
          }
        />

        {/* MEET LINK */}
        <label>Meeting Link</label>
        <input
          placeholder="Google Meet / Zoom link"
          value={form.meetLink}
          onChange={(e) =>
            setForm({ ...form, meetLink: e.target.value })
          }
        />

        {/* BUTTON */}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Class"}
        </button>

      </div>

    </div>
  );
}