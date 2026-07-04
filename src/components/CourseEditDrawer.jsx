// import { useState, useEffect } from "react";
// import API from "../services/api";
// import "./CourseEditDrawer.css";

// export default function CourseEditDrawer({
//   course,
//   open,
//   onClose,
//   onUpdated,
// }) {
//   const [form, setForm] = useState(null);
//   const [saving, setSaving] = useState(false);
  

//   useEffect(() => {
//     if (course) {
//       setForm({
//         _id: course._id,
//         title: course.title || "",
//         description: course.description || "",
//         pricing: {
//           oneToOne: course.pricing?.oneToOne || 0,
//           batch: course.pricing?.batch || 0,
//           trial: course.pricing?.trial || 0,
//         },
//       });
//     }
//   }, [course]);

//   if (!open || !form) return null;

//   const updateField = (key, value) => {
//     setForm({
//       ...form,
//       [key]: value,
//     });
//   };

//   const updatePrice = (key, value) => {
//     setForm({
//       ...form,
//       pricing: {
//         ...form.pricing,
//         [key]: value,
//       },
//     });
//   };

//   const saveCourse = async () => {
//     try {
//       setSaving(true);

//       await API.put(`/api/courses/${form._id}`, {
//         title: form.title,
//         description: form.description,
//         pricing: {
//           oneToOne: Number(form.pricing.oneToOne),
//           batch: Number(form.pricing.batch),
//           trial: Number(form.pricing.trial),
//         },
//       });

//       alert("Course Updated");

//       onUpdated();
//       onClose();
//     } catch (err) {
//       alert(err.response?.data?.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteCourse = async () => {
//     const confirmDelete = window.confirm(
//       "Delete this course?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await API.delete(`/api/courses/${form._id}`);

//       alert("Course Deleted");

//       onUpdated();
//       onClose();
//     } catch (err) {
//       alert(err.response?.data?.message);
//     }
//   };

//   return (
//     <>
//       <div
//         className="drawer-backdrop"
//         onClick={onClose}
//       />

//       <aside className="course-drawer">

//         <div className="drawer-header">

//           <h2>Edit Course</h2>

//           <button
//             className="drawer-close"
//             onClick={onClose}
//           >
//             ✕
//           </button>

//         </div>

//         <div className="drawer-body">

//           <label>Course Title</label>

//           <input
//             value={form.title}
//             onChange={(e) =>
//               updateField("title", e.target.value)
//             }
//           />

//           <label>Description</label>

//           <textarea
//             rows={6}
//             value={form.description}
//             onChange={(e) =>
//               updateField(
//                 "description",
//                 e.target.value
//               )
//             }
//           />

//           <label>1:1 Price</label>

//           <input
//             type="number"
//             value={form.pricing.oneToOne}
//             onChange={(e) =>
//               updatePrice(
//                 "oneToOne",
//                 e.target.value
//               )
//             }
//           />

//           <label>Batch Price</label>

//           <input
//             type="number"
//             value={form.pricing.batch}
//             onChange={(e) =>
//               updatePrice(
//                 "batch",
//                 e.target.value
//               )
//             }
//           />

//           <label>Trial Price</label>

//           <input
//             type="number"
//             value={form.pricing.trial}
//             onChange={(e) =>
//               updatePrice(
//                 "trial",
//                 e.target.value
//               )
//             }
//           />

//         </div>

//         <div className="drawer-footer">

//           <button
//             className="save-btn"
//             onClick={saveCourse}
//             disabled={saving}
//           >
//             Save Changes
//           </button>

//           <button
//             className="delete-btn"
//             onClick={deleteCourse}
//           >
//             Delete Course
//           </button>

//           <button
//             className="cancel-btn"
//             onClick={onClose}
//           >
//             Cancel
//           </button>

//         </div>

//       </aside>
//     </>
//   );
// }

import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import {
  FiX,
  FiSave,
  FiTrash2,
  FiUpload,
  FiFileText,
  FiImage,
} from "react-icons/fi";
import "./CourseEditDrawer.css";

export default function CourseEditDrawer({
  course,
  open,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const [courseImage, setCourseImage] = useState(null);
  const [studentPdf, setStudentPdf] = useState(null);
  const [instructorPdf, setInstructorPdf] = useState(null);

  const imageInputRef = useRef(null);
  const studentPdfRef = useRef(null);
  const instructorPdfRef = useRef(null);

  useEffect(() => {
    if (!course) return;

    setForm({
      _id: course._id,
      title: course.title || "",
      description: course.description || "",
      image: course.image || "",
      curriculumPdf: course.curriculumPdf || "",
      curriculumInsPdf: course.curriculumInsPdf || "",
      pricing: {
        oneToOne: course.pricing?.oneToOne || 0,
        batch: course.pricing?.batch || 0,
        trial: course.pricing?.trial || 0,
      },
    });

    setCourseImage(null);
    setStudentPdf(null);
    setInstructorPdf(null);
  }, [course]);

  if (!open || !form) return null;

  const updateField = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const updatePrice = (key, value) => {
    setForm({
      ...form,
      pricing: {
        ...form.pricing,
        [key]: value,
      },
    });
  };

  const saveCourse = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);

      formData.append(
        "pricing",
        JSON.stringify({
          oneToOne: Number(form.pricing.oneToOne),
          batch: Number(form.pricing.batch),
          trial: Number(form.pricing.trial),
        })
      );

      if (courseImage) {
        formData.append("image", courseImage);
      }

      if (studentPdf) {
        formData.append("curriculumPdf", studentPdf);
      }

      if (instructorPdf) {
        formData.append(
          "curriculumInsPdf",
          instructorPdf
        );
      }

      await API.put(
        `/api/courses/${form._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Course Updated Successfully");

      onUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async () => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await API.delete(`/api/courses/${form._id}`);

      alert("Course Deleted");

      onUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <>
      <div
        className="drawer-backdrop"
        onClick={onClose}
      />

      <aside className="course-drawer">

        <div className="drawer-header">

          <h2>Edit Course</h2>

          <button
            className="drawer-close"
            onClick={onClose}
          >
            <FiX />
          </button>

        </div>

        <div className="drawer-body">

          <label>Course Title</label>

          <input
            value={form.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
          />

          <label>Description</label>

          <textarea
            rows={5}
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
          />

          <label>1 : 1 Price</label>

          <input
            type="number"
            value={form.pricing.oneToOne}
            onChange={(e) =>
              updatePrice(
                "oneToOne",
                e.target.value
              )
            }
          />

          <label>Batch Price</label>

          <input
            type="number"
            value={form.pricing.batch}
            onChange={(e) =>
              updatePrice(
                "batch",
                e.target.value
              )
            }
          />

          <label>Trial Price</label>

          <input
            type="number"
            value={form.pricing.trial}
            onChange={(e) =>
              updatePrice(
                "trial",
                e.target.value
              )
            }
          />

          {/* IMAGE */}

          <div className="file-card">

            <div className="file-title">
              <FiImage />
              <span>Course Image</span>
            </div>

            {courseImage ? (
              <img
                src={URL.createObjectURL(courseImage)}
                className="preview-image"
                alt=""
              />
            ) : form.image ? (
              <img
                src={form.image}
                className="preview-image"
                alt=""
              />
            ) : (
              <div className="empty-file">
                No image uploaded
              </div>
            )}

            <input
              hidden
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCourseImage(e.target.files[0])
              }
            />

            <button
              className="replace-btn"
              onClick={() =>
                imageInputRef.current.click()
              }
            >
              <FiUpload />
              Replace Image
            </button>

          </div>

          {/* STUDENT PDF */}

          <div className="file-card">

            <div className="file-title">
              <FiFileText />
              <span>Student Curriculum</span>
            </div>

            {form.curriculumPdf ? (
              <a
                href={form.curriculumPdf}
                target="_blank"
                rel="noreferrer"
                className="pdf-link"
              >
                View Current PDF
              </a>
            ) : (
              <div className="empty-file">
                No PDF uploaded
              </div>
            )}

            {studentPdf && (
              <p className="selected-file">
                {studentPdf.name}
              </p>
            )}

            <input
              hidden
              ref={studentPdfRef}
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setStudentPdf(e.target.files[0])
              }
            />

            <button
              className="replace-btn"
              onClick={() =>
                studentPdfRef.current.click()
              }
            >
              <FiUpload />
              Replace PDF
            </button>

          </div>

          {/* INSTRUCTOR PDF */}

          <div className="file-card">

            <div className="file-title">
              <FiFileText />
              <span>Instructor Curriculum</span>
            </div>

            {form.curriculumInsPdf ? (
              <a
                href={form.curriculumInsPdf}
                target="_blank"
                rel="noreferrer"
                className="pdf-link"
              >
                View Current PDF
              </a>
            ) : (
              <div className="empty-file">
                No PDF uploaded
              </div>
            )}

            {instructorPdf && (
              <p className="selected-file">
                {instructorPdf.name}
              </p>
            )}

            <input
              hidden
              ref={instructorPdfRef}
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setInstructorPdf(e.target.files[0])
              }
            />

            <button
              className="replace-btn"
              onClick={() =>
                instructorPdfRef.current.click()
              }
            >
              <FiUpload />
              Replace PDF
            </button>

          </div>

        </div>

        <div className="drawer-footer">

          <button
            className="save-btn"
            disabled={saving}
            onClick={saveCourse}
          >
            <FiSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            className="delete-btn"
            onClick={deleteCourse}
          >
            <FiTrash2 />
            Delete Course
          </button>

        </div>

      </aside>
    </>
  );
}
