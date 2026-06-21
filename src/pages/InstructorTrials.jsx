import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./style/InstructorTrials.css";

export default function InstructorTrials() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("UPCOMING");

  const fetchClasses = async () => {
    try {
      const res = await API.get("/api/instructor/trial-classes");

      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();

    const interval = setInterval(() => {
      fetchClasses();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const upcoming = useMemo(
    () =>
      classes
        .filter((c) => c.status === "SCHEDULED")
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [classes]
  );

  const completed = useMemo(
    () =>
      classes
        .filter((c) => c.status === "COMPLETED")
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)),
    [classes]
  );

  const activeClasses = view === "UPCOMING" ? upcoming : completed;

  if (loading) {
    return (
      <div className="trial-loader">
        <div className="trial-spinner"></div>
      </div>
    );
  }

  return (
    <div className="trial-page">
      <main className="trial-main">
        <section className="trial-hero">
          <div>
            <span className="trial-eyebrow">Trial classes</span>
            <h1>Manage Your Trial Sessions</h1>
            <p>
              Track scheduled trials, join upcoming demos, and review completed
              student sessions.
            </p>
          </div>

          <Link to="/instructor" className="trial-secondary-btn">
            Back to Dashboard
          </Link>
        </section>

        <section className="trial-stat-grid">
          <div className="trial-stat-card">
            <span>Upcoming</span>
            <strong>{upcoming.length}</strong>
            <p>Scheduled trial classes</p>
          </div>
          <div className="trial-stat-card">
            <span>Completed</span>
            <strong>{completed.length}</strong>
            <p>Finished trial sessions</p>
          </div>
          <div className="trial-stat-card">
            <span>Total</span>
            <strong>{classes.length}</strong>
            <p>All assigned trials</p>
          </div>
        </section>

        <section className="trial-panel">
          <div className="trial-section-heading">
            <div>
              <span className="trial-eyebrow">Classes</span>
              <h2>{view === "UPCOMING" ? "Upcoming Classes" : "Completed Classes"}</h2>
            </div>

            <div className="trial-tabs">
              <button
                className={`trial-tab ${view === "UPCOMING" ? "active" : ""}`}
                type="button"
                onClick={() => setView("UPCOMING")}
              >
                Upcoming
                <span>{upcoming.length}</span>
              </button>
              <button
                className={`trial-tab ${view === "COMPLETED" ? "active" : ""}`}
                type="button"
                onClick={() => setView("COMPLETED")}
              >
                Completed
                <span>{completed.length}</span>
              </button>
            </div>
          </div>

          {activeClasses.length === 0 ? (
            <p className="trial-empty">
              No {view.toLowerCase()} trial classes.
            </p>
          ) : (
            <div className="trial-grid">
              {activeClasses.map((item) => (
                <article className="trial-card" key={item._id}>
                  <span className={`trial-status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>

                  <h3>{item.courseId?.title || "Course"}</h3>

                  <div className="trial-detail-list">
                    <p>
                      <strong>Student:</strong> {item.studentId?.name || "Student"}
                    </p>
                    <p>
                      <strong>Email:</strong> {item.studentId?.email || "No email"}
                    </p>
                    {item.startTime && (
                      <p>
                        <strong>Start:</strong>{" "}
                        {/* {new Date(item.startTime).toLocaleString("en-IN")} */}
                        {new Date(item.startTime).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
})}
                      </p>
                    )}
                  </div>

                  {item.status === "SCHEDULED" ? (
                    <a
                      href={item.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="trial-primary-btn"
                    >
                      Join Class
                    </a>
                  ) : (
                    <span className="trial-complete-note">Completed</span>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
