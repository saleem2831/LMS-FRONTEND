import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Pagination from "../components/Pagination";
import "./style/CourseList.css";
import CourseEditDrawer from "../components/CourseEditDrawer";

const COURSES_PER_PAGE = 6;

export default function CourseList() {

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coursePage, setCoursePage] = useState(1);


  const [myEnrollments, setMyEnrollments] = useState([]);
const [myTrials, setMyTrials] = useState([]);

const [hasEnrollments, setHasEnrollments] =
  useState(false);

const [hasTrials, setHasTrials] =
  useState(false);


  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH INSTRUCTORS
  useEffect(() => {

    const fetchInstructors = async () => {

      try {

        const res = await API.get(
          "/api/users/instructors"
        );

        setInstructors(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchInstructors();

  }, []);

  useEffect(() => {

  const fetchStudentData = async () => {

    try {

      if (user?.role !== "STUDENT") return;

      const [enrollmentRes, trialRes] =
        await Promise.all([

          API.get("/api/enrollments/my"),

          API.get("/api/trials/my-trials")

        ]);

      // setMyEnrollments(
      //   enrollmentRes.data || []
      // );

      // setMyTrials(
      //   trialRes.data || []
      // );

      const enrollments =
  enrollmentRes.data || [];

const trials =
  trialRes.data || [];

setMyEnrollments(enrollments);

setMyTrials(trials);

setHasEnrollments(
  enrollments.length > 0
);

setHasTrials(
  trials.length > 0
);

    } catch (error) {

      console.log(error);
    }
  };

  fetchStudentData();

}, []);

  // FETCH COURSES

  const fetchCourses = async () => {

  try {

    setLoading(true);

    // const res = await API.get(
    //   "/api/courses"
    // );

    const res =
  user?.role === "INSTRUCTOR"

    ? await API.get(
        "/api/users/instructor-courses"
      )

    : await API.get(
        "/api/courses"
      );

    // normalize instructors
    const updatedCourses =
      res.data.map((course) => ({

        ...course,

        assignedInstructors:
          course.assignedInstructors || []

      }));

    setCourses(updatedCourses);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);
  }
};

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(courses.length / COURSES_PER_PAGE));

    if (coursePage > totalPages) {
      setCoursePage(totalPages);
    }
  }, [courses.length, coursePage]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (coursePage - 1) * COURSES_PER_PAGE;
    return courses.slice(startIndex, startIndex + COURSES_PER_PAGE);
  }, [courses, coursePage]);

  // APPROVE COURSE
  const handleApprove = async (id) => {

    try {

      await API.put(
        `/api/courses/${id}/approve`
      );

      fetchCourses();

    } catch (error) {

      alert(error.response?.data?.message);
    }
  };

  // ASSIGN INSTRUCTOR


  const assignInstructor = async (
  courseId,
  instructorId
) => {

  if (!instructorId) return;

  try {

    const res = await API.put(
      `/api/courses/${courseId}/assign`,
      {
        instructorId
      }
    );

    setCourses((prev) =>
      prev.map((course) =>
        course._id === courseId
          ? res.data
          : course
      )
    );

    alert("Instructor assigned");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message
    );
  }
};


  

const removeInstructor = async (
  courseId,
  instructorId
) => {

  try {

    const res = await API.put(
      `/api/courses/${courseId}/remove-instructor`,
      {
        instructorId
      }
    );

    setCourses((prev) =>
      prev.map((course) =>
        course._id === courseId
          ? res.data
          : course
      )
    );

    alert("Instructor removed");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message
    );
  }
};



  const handlePayment = async (
    courseId,
    plan
  ) => {

    try {

      if (!user) {

        localStorage.setItem(
          "pendingPurchase",
          JSON.stringify({
            courseId,
            plan
          })
        );

        window.location.href = "/register";

        return;
      }

      const { data } = await API.post(
        "/api/payment/order",
        {
          courseId,
          plan
        }
      );

      const options = {

        key: data.key,

        amount: data.order.amount,

        currency: "INR",

        order_id: data.order.id,

        handler: async function (response) {

          try {

            await API.post(
              "/api/payment/verify",
              {
                ...response,
                courseId,
                plan
              }
            );

            alert(
              "Enrollment successful!"
            );

          } catch (error) {

            alert(
              error.response?.data?.message
            );
          }
        }
      };

      const rzp =
        new window.Razorpay(options);

      rzp.open();

    } catch (error) {

      alert(error.response?.data?.message);
    }
  };

  // TRIAL PURCHASE


const handleTrialPurchase = async (courseId) => {
  try {
    if (!user) {
      localStorage.setItem(
        "pendingTrial",
        JSON.stringify({ courseId })
      );
      window.location.href = "/register";
      return;
    }

    // 🔥 Create order
    const { data } = await API.post("/api/payment/trial-order", {
      courseId
    });

    if (!data?.order?.id || !data?.key) {
      alert("Payment initialization failed");
      return;
    }

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: "INR",
      order_id: data.order.id,

      handler: async function (response) {
        try {
          await API.post("/api/payment/trial-verify", {
            ...response,
            courseId
          });

          alert("✅ Trial purchased successfully");

        } catch (error) {
          alert(error.response?.data?.message);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Payment failed");
  }
};

  // LOADER
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

      {/* ===================================== */}
{/* STUDENT NAVIGATION */}
{/* ===================================== */}

{user?.role === "STUDENT" && (

  <div className="student-course-nav">

    {/* COURSES */}
    <button
      className="student-course-nav-btn active"
      onClick={() =>
        window.location.href = "/courses"
      }
    >
      Courses
    </button>

    {/* TRIAL STUDENTS */}
    {hasTrials && (

      <button
        className="student-course-nav-btn"
        onClick={() =>
          window.location.href =
            "/student-trials"
        }
      >
        My Trial Classes
      </button>

    )}

    {/* FULL ENROLLMENT */}
    {hasEnrollments && (

      <>
        <button
          className="student-course-nav-btn"
          onClick={() =>
            window.location.href =
              "/student"
          }
        >
          Dashboard
        </button>

        <button
          className="student-course-nav-btn"
          onClick={() =>
            window.location.href =
              "/my-classes"
          }
        >
          My Classes
        </button>
      </>

    )}

  </div>

)}

      <div className="course-grid">

        {paginatedCourses.map((course) => (

          <div
            className="course-card"
            key={course._id}
          >

            <div className="course-image-wrap">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                />
              ) : (
                <div className="course-image-placeholder">
                  {course.title?.charAt(0)?.toUpperCase() || "C"}
                </div>
              )}
            </div>

            <div className="course-content">

              <div className="course-heading">
                <h2>{course.title}</h2>
                {course.status && (
                  <span className={`course-status ${course.status}`}>
                    {course.status}
                  </span>
                )}
              </div>

              <p>{course.description}</p>

              {/* PRICING */}
              <div className="pricing">

                <span>
                  1:1 :
                  ₹{course.pricing?.oneToOne}
                </span>

                {/* TEMPORARILY HIDE BATCH */}

                {/* <span>
                  Batch :
                  ₹{course.pricing?.batch}
                </span> */}

                {course.trialEnabled && (
                  <span>
                    Trial :
                    ₹{course.pricing?.trial}
                  </span>
                )}

              </div>

              {/* CURRICULUM */}
              {course.curriculumPdf && (
                <button
                  className="curriculum-btn"
                  onClick={() =>
                    window.open(
                      course.curriculumPdf,
                      "_blank"
                    )
                  }
                >
                  📄 View Curriculum
                </button>
              )}

    

              {course.curriculumInsPdf &&
 (user?.role === "ADMIN" || user?.role === "INSTRUCTOR") && (
  <button
    className="curriculum-btn"
    onClick={() =>
      window.open(course.curriculumInsPdf, "_blank")
    }
  >
    📄 View Instructor Curriculum
  </button>
)}

              

              {/* ASSIGNED INSTRUCTORS */}
              {/* {course.assignedInstructors
                ?.length > 0 && (

                <div
                  style={{
                    marginTop: 10
                  }}
                >

                  <b>Instructors:</b>

                  {course.assignedInstructors.map(
                    (i) => (
                      <p key={i._id}>
                        {i.name}
                      </p>
                    )
                  )}
                </div>
              )} */}

              {/* ADMIN CONTROLS */}
{/* ADMIN CONTROLS */}
{user?.role === "ADMIN" && (

  <div className="admin-controls">

    <div className="admin-control-row">
    {/* EDIT BUTTON */}
    {/* <button
      className="edit-btn"
      onClick={() => {

        setEditingCourse({

          _id: course._id,

          title: course.title || "",

          description:
            course.description || "",

          pricing: {

            oneToOne:
              course.pricing?.oneToOne || 0,

            batch:
              course.pricing?.batch || 0,

            trial:
              course.pricing?.trial || 0
          }
        });
      }}
    >
      Edit
    </button> */}

    <button
  className="edit-btn"
  onClick={() => setEditingCourse(course)}
>
  ✏️ Edit Course
</button>

    {/* ADD INSTRUCTOR */}
    <select
      onChange={(e) =>
        assignInstructor(
          course._id,
          e.target.value
        )
      }
      defaultValue=""
    >

      <option value="">
        Add Instructor
      </option>

      {instructors.map((ins) => (

        <option
          key={ins._id}
          value={ins._id}
        >
          {ins.name}
        </option>

      ))}

    </select>
    </div>

    {/* APPROVE */}
    {course.status !== "approved" && (

      <button
        className="approve-btn"
        onClick={() =>
          handleApprove(course._id)
        }
      >
        Approve
      </button>

    )}

    {/* ASSIGNED INSTRUCTORS */}
    <div className="assigned-instructors">

      <h3>
        Assigned Instructors
      </h3>

      {course.assignedInstructors &&
      course.assignedInstructors.length > 0 ? (

        course.assignedInstructors.map(
          (ins) => (

            <div
              key={ins._id}
              className="assigned-instructor"
            >

              <div>

                <p>
                  {ins.name}
                </p>

                <small>
                  {ins.email}
                </small>

              </div>

              <button
                className="remove-instructor-btn"
                onClick={() =>
                  removeInstructor(
                    course._id,
                    ins._id
                  )
                }
              >
                Remove
              </button>

            </div>
          )
        )

      ) : (

        <p className="no-instructors">
          No instructors assigned
        </p>

      )}
    </div>

  </div>
)}
              {/* STUDENT ACTIONS */}
         {/* STUDENT ACTIONS */}
{(!user ||
  user.role === "STUDENT") && (() => {

    // CHECK FULL ENROLLMENT
    const alreadyEnrolled =
      myEnrollments.some(
        (e) =>
          e.courseId?._id === course._id
      );

    // CHECK TRIAL PURCHASE
    const alreadyTrialPurchased =
      myTrials.some(
        (t) =>
          t.courseId?._id === course._id
      );

    return (

      <div className="buy-buttons">

        {/* ================================= */}
        {/* ALREADY ENROLLED */}
        {/* ================================= */}

        {alreadyEnrolled ? (

          <button
            disabled
            style={{
              background: "#28a745",
              color: "#fff",
              cursor: "not-allowed"
            }}
          >
            Already Enrolled
          </button>

        ) : (

          <>
            {/* ================================= */}
            {/* TRIAL */}
            {/* ================================= */}

            {course.trialEnabled && (

              alreadyTrialPurchased ? (

                <button
                  disabled
                  style={{
                    background: "#999",
                    color: "#fff",
                    cursor: "not-allowed"
                  }}
                >
                  Trial Purchased
                </button>

              ) : (

                <button
                  className="trial-btn"
                  onClick={() =>
                    handleTrialPurchase(
                      course._id
                    )
                  }
                >
                  Buy Trial
                </button>

              )
            )}

            {/* ================================= */}
            {/* FULL COURSE */}
            {/* ================================= */}

            <button
              onClick={() =>
                handlePayment(
                  course._id,
                  "ONE_TO_ONE"
                )
              }
            >
              Buy 1:1
            </button>

            {/* ================================= */}
            {/* BATCH */}
            {/* ================================= */}

            {/* 
            <button
              onClick={() =>
                handlePayment(
                  course._id,
                  "BATCH"
                )
              }
            >
              Buy Batch
            </button>
            */}

          </>
        )}

      </div>
    );
  })()}

            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={coursePage}
        totalItems={courses.length}
        itemsPerPage={COURSES_PER_PAGE}
        onPageChange={setCoursePage}
      />

<CourseEditDrawer
    open={!!editingCourse}
    course={editingCourse}
    onClose={() => setEditingCourse(null)}
    onUpdated={fetchCourses}
/>

    </div>
  );
}
