import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/skillstek_logo.png";
import "./style/Home.css";

const fallbackCourses = [
  {
    _id: "frontend-foundation",
    title: "Full Stack Web Development",
    description:
      "Build responsive websites, modern React interfaces, APIs, and real project workflows from the ground up.",
    pricing: { oneToOne: 14999, batch: 7999 },
    status: "popular",
  },
  {
    _id: "data-analytics",
    title: "Data Analytics",
    description:
      "Learn Excel, SQL, dashboards, and business reporting skills for practical analytics roles.",
    pricing: { oneToOne: 12999, batch: 6999 },
    status: "new",
  },
  {
    _id: "java-backend",
    title: "Java Backend Development",
    description:
      "Master Java, Spring Boot, REST APIs, authentication, and deployment-ready backend patterns.",
    pricing: { oneToOne: 15999, batch: 8499 },
    status: "career track",
  },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    let mounted = true;

    API.get("/api/courses")
      .then((res) => {
        if (mounted && Array.isArray(res.data)) {
          setCourses(res.data.slice(0, 6));
        }
      })
      .catch(() => {
        if (mounted) setCourses([]);
      })
      .finally(() => {
        if (mounted) setLoadingCourses(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const featuredCourses = useMemo(
    () => (courses.length ? courses : fallbackCourses),
    [courses]
  );

  return (
    <div className="home-page">
      <header className="home-nav">
        <Link to="/" className="home-brand" aria-label="Skillstek home">
          <img src={logo} alt="Skillstek" className="home-brand-logo" />
        </Link>

        <nav className="home-nav-links" aria-label="Primary navigation">
          <a href="#home">Home</a>
          <a href="#courses">Courses</a>
          <a href="#why-skillstek">Why Skillstek</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <Link to="/login" className="home-login-btn">
          Login
        </Link>
      </header>

      <main>
        <section className="home-hero" id="home">
          <div className="home-hero-content">
            <span className="home-eyebrow">Live classes. Practical skills.</span>
            <h1>Learn job-ready tech skills with focused mentorship.</h1>
            <p>
              Skillstek helps students move from basics to confident project
              building through guided courses, live learning, and flexible
              one-to-one or batch programs.
            </p>

            <div className="home-hero-actions">
              <a href="#courses" className="home-primary-btn">
                Explore Courses
              </a>
              <Link to="/register" className="home-secondary-btn">
                Start Learning
              </Link>
            </div>

            <div className="home-stats" aria-label="Skillstek highlights">
              <div>
                <strong>1:1</strong>
                <span>Mentorship</span>
              </div>
              <div>
                <strong>Live</strong>
                <span>Instructor-led classes</span>
              </div>
              <div>
                <strong>Real</strong>
                <span>Project practice</span>
              </div>
            </div>
          </div>

          <div className="home-hero-panel" aria-label="Learning program preview">
            <div className="home-panel-header">
              <span>Skillstek Path</span>
              <strong>12 weeks</strong>
            </div>
            <div className="home-progress-list">
              <div className="home-progress-item completed">
                <span>01</span>
                <div>
                  <strong>Foundation</strong>
                  <small>Concept clarity and core tools</small>
                </div>
              </div>
              <div className="home-progress-item active">
                <span>02</span>
                <div>
                  <strong>Live Projects</strong>
                  <small>Build with mentor feedback</small>
                </div>
              </div>
              <div className="home-progress-item">
                <span>03</span>
                <div>
                  <strong>Career Practice</strong>
                  <small>Portfolio, interview, and review</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section home-courses" id="courses">
          <div className="home-section-heading">
            <span className="home-eyebrow">Featured courses</span>
            <h2>Choose the skill path that fits your goal.</h2>
            <p>
              Browse our current programs and pick a batch or personalized
              learning plan.
            </p>
          </div>

          <div className="home-course-grid">
            {featuredCourses.map((course) => (
              <article className="home-course-card" key={course._id || course.title}>
                {course.image ? (
                  <img src={course.image} alt={course.title} />
                ) : (
                  <div className="home-course-art">
                    <span>{course.title?.slice(0, 2) || "SK"}</span>
                  </div>
                )}

                <div className="home-course-body">
                  <div className="home-course-meta">
                    <span>{course.status || "course"}</span>
                    <span>Live</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="home-course-pricing">
                    <span>1:1: Rs {course.pricing?.oneToOne || "Custom"}</span>
                    <span>Batch: Rs {course.pricing?.batch || "Custom"}</span>
                  </div>
                  <Link to="/login" className="home-course-link">
                    View Course
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {loadingCourses && (
            <p className="home-course-note">Loading latest courses...</p>
          )}
        </section>

        <section className="home-section home-why" id="why-skillstek">
          <div className="home-section-heading">
            <span className="home-eyebrow">Why Skillstek</span>
            <h2>A clear learning experience from enrollment to practice.</h2>
          </div>

          <div className="home-feature-grid">
            <div className="home-feature">
              <span>01</span>
              <h3>Mentor-led learning</h3>
              <p>Learn with guidance, doubt support, and practical checkpoints.</p>
            </div>
            <div className="home-feature">
              <span>02</span>
              <h3>Flexible course plans</h3>
              <p>Pick one-to-one focus or batch learning based on your schedule.</p>
            </div>
            <div className="home-feature">
              <span>03</span>
              <h3>Project-first training</h3>
              <p>Practice skills through real assignments and portfolio work.</p>
            </div>
          </div>
        </section>

        <section className="home-section home-faq" id="faq">
          <div className="home-section-heading">
            <span className="home-eyebrow">FAQ</span>
            <h2>Questions students ask before joining.</h2>
            <p>
              Quick answers about learning format, courses, mentorship, and how
              to get started with Skillstek.
            </p>
          </div>

          <div className="home-faq-grid">
            <article className="home-faq-item">
              <h3>Are classes live or recorded?</h3>
              <p>
                Skillstek programs are built around live instructor-led sessions
                with practical assignments and guided project work.
              </p>
            </article>
            <article className="home-faq-item">
              <h3>Can I choose one-to-one training?</h3>
              <p>
                Yes. You can choose personalized one-to-one mentorship or join a
                batch plan based on your schedule and learning goal.
              </p>
            </article>
            <article className="home-faq-item">
              <h3>Do courses include projects?</h3>
              <p>
                Yes. Courses focus on hands-on practice so students can build
                confidence through real assignments and portfolio-ready work.
              </p>
            </article>
            <article className="home-faq-item">
              <h3>How do I enroll in a course?</h3>
              <p>
                Explore the course list, select the program you prefer, and
                register or login to continue with enrollment.
              </p>
            </article>
          </div>
        </section>

        <section className="home-section home-contact" id="contact">
          <div className="home-contact-card">
            <div>
              <span className="home-eyebrow">Contact</span>
              <h2>Ready to start learning with Skillstek?</h2>
              <p>
                Reach out for course guidance, batch details, pricing, or help
                choosing the right learning path.
              </p>
            </div>

            <form className="home-contact-form">
              <div className="home-form-row">
                <label>
                  Name
                  <input type="text" placeholder="Your name" />
                </label>
                <label>
                  Email
                  <input type="email" placeholder="your@email.com" />
                </label>
              </div>
              <label>
                Message
                <textarea placeholder="Tell us what you want to learn" rows="4"></textarea>
              </label>
              <button type="submit" className="home-primary-btn">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <img src={logo} alt="Skillstek" className="home-footer-logo" />
            <p>Learn. Build. Grow with Skillstek.</p>
          </div>

          <nav className="home-footer-links" aria-label="Footer navigation">
            <a href="#">Home</a>
            <a href="#why-skillstek">Values</a>
            <a href="#courses">Features</a>
            <a href="#courses">Courses</a>
            <a href="#contact">Contact Us</a>
            <Link to="/register">Partnership</Link>
          </nav>

          <nav className="home-footer-links" aria-label="Footer resources">
            <a href="#courses">Blogs</a>
            <a href="#courses">News</a>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>

          <div className="home-social-links">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              <span className="social-icon linkedin" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M6.94 8.98H3.72v10.3h3.22V8.98ZM5.33 4.1a1.86 1.86 0 1 0 0 3.72 1.86 1.86 0 0 0 0-3.72Zm13.94 9.26c0-2.78-1.48-4.08-3.46-4.08a2.98 2.98 0 0 0-2.7 1.48h-.04V8.98H9.98v10.3h3.22v-5.1c0-1.34.26-2.64 1.92-2.64 1.63 0 1.65 1.53 1.65 2.73v5.01H20v-5.92h-.73Z" />
                </svg>
              </span>
              Linkedin
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
              <span className="social-icon youtube" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M21.58 7.18a2.65 2.65 0 0 0-1.86-1.88C18.08 4.86 11.5 4.86 11.5 4.86s-6.58 0-8.22.44A2.65 2.65 0 0 0 1.42 7.18 27.6 27.6 0 0 0 1 12a27.6 27.6 0 0 0 .42 4.82 2.65 2.65 0 0 0 1.86 1.88c1.64.44 8.22.44 8.22.44s6.58 0 8.22-.44a2.65 2.65 0 0 0 1.86-1.88A27.6 27.6 0 0 0 22 12a27.6 27.6 0 0 0-.42-4.82ZM9.35 15.05v-6.1L14.82 12l-5.47 3.05Z" />
                </svg>
              </span>
              Youtube
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
              <span className="social-icon instagram" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.95 2.1a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7.15A4.85 4.85 0 1 1 12 16.85 4.85 4.85 0 0 1 12 7.15Zm0 2A2.85 2.85 0 1 0 12 14.85 2.85 2.85 0 0 0 12 9.15Z" />
                </svg>
              </span>
              Instagram
            </a>
          </div>

          <form className="home-newsletter">
            <h3>Newsletter</h3>
            <p>Enter your email to keep in the know with the latest updates from Skillstek.</p>
            <input type="email" placeholder="your@email.com" aria-label="Email address" />
            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="home-footer-bottom">
          <div className="home-legal-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="home-footer-copy">
            <p>Copyright {new Date().getFullYear()} Skillstek. All rights reserved.</p>
            <p>Skillstek provides practical educational programs focused on clarity, accessibility, and career growth.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
