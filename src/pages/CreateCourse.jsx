// import { useState } from "react";
// import API from "../services/api";

// export default function CreateCourse() {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     oneToOne: "",
//     batch: ""
//   });

//   const [pdf, setPdf] = useState(null);
//   const [image, setImage] = useState(null);

//   const handleSubmit = async () => {
//     try {
//       const data = new FormData();

//       data.append("title", form.title);
//       data.append("description", form.description);
//       data.append("oneToOne", form.oneToOne);
//       data.append("batch", form.batch);
//       data.append("curriculumPdf", pdf);
//       data.append("image", image);

//       await API.post("/api/courses", data);

//       alert("Course created successfully");

//     } catch (err) {
//       alert(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div>
//       <h2>Create Course</h2>

//       <input placeholder="Title"
//         onChange={(e) => setForm({ ...form, title: e.target.value })} />

//       <textarea placeholder="Description"
//         onChange={(e) => setForm({ ...form, description: e.target.value })} />

//       <input placeholder="1:1 Price"
//         onChange={(e) => setForm({ ...form, oneToOne: e.target.value })} />

//       <input placeholder="Batch Price"
//         onChange={(e) => setForm({ ...form, batch: e.target.value })} />

//       <p>Upload Curriculum PDF</p>
//       <input type="file" onChange={(e) => setPdf(e.target.files[0])} />

//       <p>Upload Course Image</p>
//       <input type="file" onChange={(e) => setImage(e.target.files[0])} />

//       <button onClick={handleSubmit}>Create</button>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../services/api";
import "./style/CreateCourse.css";

export default function CreateCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    oneToOne: "",
    batch: ""
  });

  const [pdf, setPdf] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("oneToOne", form.oneToOne);
      data.append("batch", form.batch);
      data.append("curriculumPdf", pdf);
      data.append("image", image);

      await API.post("/api/courses", data);

      setMessage("✅ Course created successfully!");

      setForm({
        title: "",
        description: "",
        oneToOne: "",
        batch: ""
      });
      setPdf(null);
      setImage(null);

    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <div className="form-card">
        <h1>Create Course</h1>

        {message && <p className="message">{message}</p>}

        {/* Title */}
        <div className="form-group">
          <label>Course Title</label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="Enter course title"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Enter course description"
          />
        </div>

        {/* Pricing */}
        <div className="pricing-row">
          <div className="form-group">
            <label>1:1 Price (₹)</label>
            <input
              type="number"
              value={form.oneToOne}
              onChange={(e) =>
                setForm({ ...form, oneToOne: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Batch Price (₹)</label>
            <input
              type="number"
              value={form.batch}
              onChange={(e) =>
                setForm({ ...form, batch: e.target.value })
              }
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="form-group">
          <label>Upload Curriculum PDF</label>
          <input
            type="file"
            onChange={(e) => setPdf(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>Upload Course Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Submit */}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </div>
    </div>
  );
}
