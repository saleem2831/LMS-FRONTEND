
// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function CourseList() {
//   const [courses, setCourses] = useState([]);
//   const [message, setMessage] = useState("");
//   const [instructors, setInstructors] = useState([]);
//   const [editingCourse, setEditingCourse] = useState(null);

// useEffect(() => {
//   API.get("/api/users/instructors").then(res =>
//     setInstructors(res.data)
//   );
// }, []);

//   const user = JSON.parse(localStorage.getItem("user"));

//   const fetchCourses = async () => {
//     const res = await API.get("/api/courses");
//     setCourses(res.data);
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // ✅ APPROVE COURSE
//   const handleApprove = async (id) => {
//     await API.put(`/api/courses/${id}/approve`);
//     alert("Approved");
//     fetchCourses();
//   };

//   // ✅ ASSIGN INSTRUCTOR (TEMP SIMPLE)


// const assignInstructor = async (courseId, instructorId) => {
//   try {
//     await API.put(`/api/courses/${courseId}/assign`, {
//       instructorId
//     });

//     // ✅ Refresh courses so UI updates
//     fetchCourses();

//   } catch (err) {
//     console.error(err);
//     alert("Failed to assign instructor");
//   }
// };

//   // ✅ PAYMENT FLOW
//   const handlePayment = async (courseId, plan) => {
  
//     if (!user) {
//   localStorage.setItem(
//     "pendingPurchase",
//     JSON.stringify({ courseId, plan })
//   );

//   window.location.href = "/register";
//   return;
// }
//     startPayment(courseId, plan);
//   };

//   const startPayment = async (courseId, plan) => {
//     const { data } = await API.post("/api/payment/order", {
//       courseId,
//       plan
//     });

//     const options = {
//       key: data.key,
//       amount: data.order.amount,
//       order_id: data.order.id,

//       handler: async function (response) {
//         await API.post("/api/payment/verify", {
//           ...response,
//           courseId,
//           plan
//         });

//         alert("Enrollment successful!");
//       }
//     };

//     new window.Razorpay(options).open();
//   };



//   return (
//     <div>
//       {/* ✅ MESSAGE */}
//       {message && (
//         <p style={{ color: "red", fontWeight: "bold" }}>
//           {message}
//         </p>
//       )}

//       <h2>Courses</h2>

//       {courses.map((course) => (
//         <div
//           key={course._id}
//           style={{
//             border: "1px solid #ccc",
//             margin: 10,
//             padding: 10
//           }}
//         >
//           <h3>{course.title}</h3>

//           {/* ✅ SAFE IMAGE */}
//           {course.image && (
//             <img src={course.image} width="200" alt="course" />
//           )}

//           <p>{course.description}</p>

//           <p>1:1 Price: {course.pricing?.oneToOne}</p>
//           <p>Batch Price: {course.pricing?.batch}</p>

//           {/* ✅ SAFE LINK */}
//           {course.curriculumPdf && (
//             <a href={course.curriculumPdf} target="_blank" rel="noreferrer">
//               View Curriculum
//             </a>
//           )}

//           <p>Status: {course.status}</p>

//           {user?.role === "ADMIN" && (

//   <button onClick={() => setEditingCourse(course)}>
//   Edit Course
// </button>

// )}


// {editingCourse && (
//   <div style={{ border: "2px solid black", padding: 10 }}>
//     <h3>Edit Course</h3>

//     {/* TITLE */}
//     <input
//       placeholder="Title"
//       value={editingCourse.title || ""}
//       onChange={(e) =>
//         setEditingCourse({
//           ...editingCourse,
//           title: e.target.value
//         })
//       }
//     />

//     {/* DESCRIPTION */}
//     <textarea
//       placeholder="Description"
//       value={editingCourse.description || ""}
//       onChange={(e) =>
//         setEditingCourse({
//           ...editingCourse,
//           description: e.target.value
//         })
//       }
//     />

//     {/* 1:1 PRICE */}
//     <input
//       placeholder="1:1 Price"
//       value={editingCourse.pricing?.oneToOne || ""}
//       onChange={(e) =>
//         setEditingCourse({
//           ...editingCourse,
//           pricing: {
//             ...editingCourse.pricing,
//             oneToOne: e.target.value
//           }
//         })
//       }
//     />

//     {/* BATCH PRICE */}
//     <input
//       placeholder="Batch Price"
//       value={editingCourse.pricing?.batch || ""}
//       onChange={(e) =>
//         setEditingCourse({
//           ...editingCourse,
//           pricing: {
//             ...editingCourse.pricing,
//             batch: e.target.value
//           }
//         })
//       }
//     />

//     {/* SAVE */}
//     <button
//       onClick={async () => {
//         await API.put(
//           `/api/courses/${editingCourse._id}`,
//           editingCourse
//         );
//         setEditingCourse(null);
//         fetchCourses();
//       }}
//     >
//       Save
//     </button>

//     {/* DELETE */}
//     <button
//       onClick={async () => {
//         await API.delete(
//           `/api/courses/${editingCourse._id}`
//         );
//         setEditingCourse(null);
//         fetchCourses();
//       }}
//     >
//       Delete Course
//     </button>
//   </div>
// )}

//           {/* ✅ SAFE ADMIN CHECK */}
//           {user?.role === "ADMIN" && (
//             <>


// <select
//   value={course.assignedInstructor?._id || ""}
//   onChange={(e) =>
//     assignInstructor(course._id, e.target.value)
//   }
// >
//   <option value="">Select Instructor</option>

//   {instructors.map((i) => (
//     <option key={i._id} value={i._id}>
//       {i.name}
//     </option>
//   ))}
// </select>

//               {course.status !== "approved" && (
//                 <button onClick={() => handleApprove(course._id)}>
//                   Approve
//                 </button>
//               )}
//             </>
//           )}

//           {/* ✅ BUY BUTTONS */}
//           <div style={{ marginTop: 10 }}>

// {(!user || user.role === "STUDENT") && (
//   <>
//     <button onClick={() => handlePayment(course._id, "ONE_TO_ONE")}>
//       Buy 1:1
//     </button>

//     <button onClick={() => handlePayment(course._id, "BATCH")}>
//       Buy Batch
//     </button>
//   </>
// )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";
import "./style/CourseList.css";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/api/users/instructors").then((res) =>
      setInstructors(res.data)
    );
  }, []);

  const fetchCourses = async () => {
    const res = await API.get("/api/courses");
    setCourses(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleApprove = async (id) => {
    await API.put(`/api/courses/${id}/approve`);
    fetchCourses();
  };

  const assignInstructor = async (courseId, instructorId) => {
    await API.put(`/api/courses/${courseId}/assign`, {
      instructorId,
    });
    fetchCourses();
  };

  const handlePayment = async (courseId, plan) => {
    if (!user) {
      localStorage.setItem(
        "pendingPurchase",
        JSON.stringify({ courseId, plan })
      );
      window.location.href = "/register";
      return;
    }

    const { data } = await API.post("/api/payment/order", {
      courseId,
      plan,
    });

    const options = {
      key: data.key,
      amount: data.order.amount,
      order_id: data.order.id,
      handler: async function (response) {
        await API.post("/api/payment/verify", {
          ...response,
          courseId,
          plan,
        });
        alert("Enrollment successful!");
      },
    };

    new window.Razorpay(options).open();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="course-page">
      <h1>Courses</h1>

      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course._id}>
            
            {course.image && (
              <img src={course.image} alt="course" />
            )}

            <div className="course-content">
              <h2>{course.title}</h2>
              <p>{course.description}</p>

              <div className="pricing">
                <span>1:1: ₹{course.pricing?.oneToOne}</span>
                <span>Batch: ₹{course.pricing?.batch}</span>
              </div>

              {course.curriculumPdf && (
                <a
                  href={course.curriculumPdf}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  View Curriculum
                </a>
              )}

              <p className={`status ${course.status}`}>
                {course.status}
              </p>

              {/* ADMIN CONTROLS */}
              {user?.role === "ADMIN" && (
                <div className="admin-controls">

                  <button
                    // onClick={() => setEditingCourse(course)}
                    onClick={() =>
  setEditingCourse({
    ...course,
    pricing: {
      oneToOne: course.pricing?.oneToOne || "",
      batch: course.pricing?.batch || ""
    }
  })
}
                    className="edit-btn"
                  >
                    Edit
                  </button>

                  <select
                    value={course.assignedInstructor?._id || ""}
                    onChange={(e) =>
                      assignInstructor(course._id, e.target.value)
                    }
                  >
                    <option value="">Assign Instructor</option>
                    {instructors.map((i) => (
                      <option key={i._id} value={i._id}>
                        {i.name}
                      </option>
                    ))}
                  </select>

                  {course.status !== "approved" && (
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(course._id)}
                    >
                      Approve
                    </button>
                  )}
                </div>
              )}

              {/* STUDENT ACTIONS */}
              {(!user || user.role === "STUDENT") && (
                <div className="buy-buttons">
                  <button
                    onClick={() =>
                      handlePayment(course._id, "ONE_TO_ONE")
                    }
                  >
                    Buy 1:1
                  </button>

                  <button
                    onClick={() =>
                      handlePayment(course._id, "BATCH")
                    }
                  >
                    Buy Batch
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingCourse && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Course</h2>

            <input
              value={editingCourse.title}
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  title: e.target.value,
                })
              }
            />

            <textarea
              value={editingCourse.description}
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  description: e.target.value,
                })
              }
            />

            <input
              value={editingCourse.pricing?.oneToOne}
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  pricing: {
                    ...editingCourse.pricing,
                    oneToOne: e.target.value,
                  },
                })
              }
            />

            <input
              value={editingCourse.pricing?.batch}
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  pricing: {
                    ...editingCourse.pricing,
                    batch: e.target.value,
                  },
                })
              }
            />

            <div className="modal-actions">
              <button
                // onClick={async () => {
                //   await API.put(
                //     `/api/courses/${editingCourse._id}`,
                //     editingCourse
                //   );
                //   setEditingCourse(null);
                //   fetchCourses();
                // }}
                onClick={async () => {
  const payload = {
    title: editingCourse.title,
    description: editingCourse.description,
    pricing: {
      oneToOne: Number(editingCourse.pricing?.oneToOne),
      batch: Number(editingCourse.pricing?.batch)
    }
  };

  console.log("Sending payload:", payload);

  await API.put(`/api/courses/${editingCourse._id}`, payload);

  setEditingCourse(null);
  fetchCourses();
}}
              >
                Save
              </button>

              <button
                className="delete"
                onClick={async () => {
                  await API.delete(
                    `/api/courses/${editingCourse._id}`
                  );
                  setEditingCourse(null);
                  fetchCourses();
                }}
              >
                Delete
              </button>

              <button onClick={() => setEditingCourse(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}