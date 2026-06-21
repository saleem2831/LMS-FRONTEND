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
import { Link } from "react-router-dom";
import API from "../services/api";
import { getUser, logout } from "../utils/auth";
import logo from "../assets/skillstek_logo.png";
import "./style/CreateCourse.css";

export default function CreateCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    // category: "",
    oneToOne: "",
    batch: "",
    trial:"",
  });

  const [pdf, setPdf] = useState(null);
  const [pdfIns, setPdfIns] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = getUser();
  const dashboardPath = user?.role === "ADMIN" ? "/admin" : "/instructor";

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!form.title || !form.description || !form.oneToOne || !form.batch || !form.trial) {
        setMessage("❌ Please fill in all required fields");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      // data.append("category", form.category || "General");
      data.append("oneToOne", form.oneToOne);
      data.append("batch", form.batch);
      // data.append("trail",form.trial);
      data.append("trial", form.trial);
      if (pdf) data.append("curriculumPdf", pdf);
      if (pdfIns) data.append("curriculumInsPdf",pdfIns); 
      if (image) data.append("image", image);




      await API.post("/api/courses", data);




      setMessage("✅ Course created successfully!");

      setForm({
        title: "",
        description: "",
        // category: "",
        oneToOne: "",
        batch: "",
        trial,
      });
      setPdf(null);
      setPdfIns(null);
      setImage(null);

      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      {/* Navbar */}
      <header className={`create-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
        <Link to="/" className="create-brand" aria-label="Skillstek home">
          <img src={logo} alt="Skillstek" />
        </Link>

        <button
          className="create-menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="create-nav-links">
          <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>
            All Courses
          </Link>
          <Link to="/my-classes" onClick={() => setMobileMenuOpen(false)}>
            My Classes
          </Link>
          <Link to="/schedule" onClick={() => setMobileMenuOpen(false)}>
            Schedule Class
          </Link>
        </nav>

        <div className="create-nav-actions">
          <Link
            to="/profile"
            className="create-profile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>{user?.name?.charAt(0)?.toUpperCase() || "I"}</span>
          </Link>
          <button className="create-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="create-main">
        <section className="create-hero">
          <div>
            <span className="create-eyebrow">Course Creation</span>
            <h1>Create a New Course</h1>
            <p>Build and share your expertise with students worldwide</p>
          </div>
        </section>

        <div className="create-container">
          <form className="create-form">
            {message && <div className="create-message">{message}</div>}

            <div className="form-columns">
              {/* Left Column */}
              <div className="form-column">
                <h2>Course Information</h2>

                {/* Title */}
                <div className="form-group">
                  <label htmlFor="title">
                    📖 Course Title <span className="required">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Advanced React Fundamentals"
                    className="form-input"
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description">
                    📝 Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your course, what students will learn, and course objectives..."
                    className="form-input form-textarea"
                  />
                </div>

              </div>

              {/* Right Column */}
              <div className="form-column">
                <h2>Pricing & Files</h2>

                {/* Pricing Section */}
                <div className="pricing-section">
                  <div className="form-group">
                    <label htmlFor="oneToOne">
                      💎 1:1 Session Price (₹) <span className="required">*</span>
                    </label>
                    <input
                      id="oneToOne"
                      type="number"
                      value={form.oneToOne}
                      onChange={(e) => setForm({ ...form, oneToOne: e.target.value })}
                      placeholder="e.g., 500"
                      className="form-input"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="batch">
                      👥 Batch Price (₹) <span className="required">*</span>
                    </label>
                    <input
                      id="batch"
                      type="number"
                      value={form.batch}
                      onChange={(e) => setForm({ ...form, batch: e.target.value })}
                      placeholder="e.g., 299"
                      className="form-input"
                      min="0"
                    />
                  </div>

                   <div className="form-group">
                    <label htmlFor="trial">
                      💎 Trail Price (₹) <span className="required">*</span>
                    </label>
                    <input
                      id="trial"
                      type="number"
                      value={form.trial}
                      onChange={(e) => setForm({ ...form, trial: e.target.value })}
                      placeholder="e.g., 200"
                      className="form-input"
                      min="0"
                    />
                  </div>
                </div>

                {/* File Uploads */}
                <div className="form-group">
                  <label htmlFor="pdf">
                    📄 Student Milestones PDF
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      id="pdf"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdf(e.target.files[0])}
                      className="file-input"
                    />
                    <div className="file-input-label">
                      {pdf ? `✓ ${pdf.name}` : "Click to upload PDF"}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pdfIns">
                    📄Instructor Curriculum PDF
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      id="pdfIns"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfIns(e.target.files[0])}
                      className="file-input"
                    />
                    <div className="file-input-label">
                      {pdfIns ? `✓ ${pdfIns.name}` : "Click to upload PDF"}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="image">
                    🖼️ Course Image
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="file-input"
                    />
                    <div className="file-input-label">
                      {image ? `✓ ${image.name}` : "Click to upload image"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="create-submit-btn"
            >
              {loading ? "Creating Course..." : "Create Course"}
            </button>
          </form>

          {/* Info Card */}
          <aside className="create-info">
            <h3>💡 Tips for Creating Great Courses</h3>
            <ul className="tips-list">
              <li>Use clear, descriptive titles</li>
              <li>Write comprehensive course descriptions</li>
              <li>Price competitively for 1:1 and batch classes</li>
              <li>Include a professional course image</li>
              <li>Upload detailed curriculum as PDF</li>
              <li>Target your audience clearly</li>
              <li>Update course content regularly</li>
              <li>Collect student feedback for improvements</li>
            </ul>

            <h3>📊 Pricing Guide</h3>
            <ul className="tips-list">
              <li><strong>1:1 Sessions:</strong> Higher price point (₹300-1000+)</li>
              <li><strong>Batch Classes:</strong> Lower per-student price (₹99-500)</li>
              <li>Consider market rates and your expertise</li>
              <li>Offer discounts for bulk purchases</li>
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
}
