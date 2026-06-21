import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./style/StudentTrials.css";

export default function StudentTrials() {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("ALL");

  const fetchTrials = async () => {
    try {
      const res = await API.get("/api/trials/my-trials");

      const updatedTrials = await Promise.all(
        res.data.map(async (trial) => {
          if (trial.demoClass?.startTime && trial.status !== "COMPLETED") {
            const startTime = new Date(trial.demoClass.startTime);
            const now = new Date();
            const endTime = new Date(startTime.getTime() + 45 * 60 * 1000);

            if (now > endTime) {
              try {
                await API.put(`/api/trials/${trial._id}/complete`);

                return {
                  ...trial,
                  status: "COMPLETED"
                };
              } catch (error) {
                console.log(error);
              }
            }
          }

          return trial;
        })
      );

      setTrials(updatedTrials);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  const scheduledTrials = useMemo(
    () => trials.filter((trial) => trial.demoClass && trial.status !== "COMPLETED"),
    [trials]
  );

  const waitingTrials = useMemo(
    () => trials.filter((trial) => !trial.demoClass && trial.status !== "COMPLETED"),
    [trials]
  );

  const completedTrials = useMemo(
    () => trials.filter((trial) => trial.status === "COMPLETED"),
    [trials]
  );

  const visibleTrials = useMemo(() => {
    if (view === "SCHEDULED") return scheduledTrials;
    if (view === "WAITING") return waitingTrials;
    if (view === "COMPLETED") return completedTrials;
    return trials;
  }, [view, trials, scheduledTrials, waitingTrials, completedTrials]);

  if (loading) {
    return (
      <div className="student-trials-loader">
        <div className="student-trials-spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-trials-page">
      <main className="student-trials-main">
        <section className="student-trials-hero">
          <div>
            <span className="student-trials-eyebrow">Trial learning</span>
            <h1>My Trial Classes</h1>
            <p>
              Track your trial requests, join scheduled demo classes, and review
              completed sessions from one place.
            </p>
          </div>

          <Link to="/student" className="student-trials-secondary-btn">
            Back to Dashboard
          </Link>
        </section>

        <section className="student-trials-stat-grid">
          <div className="student-trials-stat-card">
            <span>Total Trials</span>
            <strong>{trials.length}</strong>
            <p>All trial requests</p>
          </div>
          <div className="student-trials-stat-card">
            <span>Scheduled</span>
            <strong>{scheduledTrials.length}</strong>
            <p>Ready to join</p>
          </div>
          <div className="student-trials-stat-card">
            <span>Waiting</span>
            <strong>{waitingTrials.length}</strong>
            <p>Awaiting scheduling</p>
          </div>
          <div className="student-trials-stat-card">
            <span>Completed</span>
            <strong>{completedTrials.length}</strong>
            <p>Finished trials</p>
          </div>
        </section>

        <section className="student-trials-panel">
          <div className="student-trials-section-heading">
            <div>
              <span className="student-trials-eyebrow">Sessions</span>
              <h2>Trial Classes</h2>
            </div>

            <div className="student-trials-tabs">
              {[
                ["ALL", trials.length],
                ["SCHEDULED", scheduledTrials.length],
                ["WAITING", waitingTrials.length],
                ["COMPLETED", completedTrials.length]
              ].map(([tab, count]) => (
                <button
                  key={tab}
                  type="button"
                  className={`student-trials-tab ${view === tab ? "active" : ""}`}
                  onClick={() => setView(tab)}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </div>

          {visibleTrials.length === 0 ? (
            <p className="student-trials-empty">No trial classes found.</p>
          ) : (
            <div className="student-trials-grid">
              {visibleTrials.map((trial) => {
                const isCompleted = trial.status === "COMPLETED";
                const isWaiting = !trial.demoClass && !isCompleted;

                return (
                  <article className="student-trials-card" key={trial._id}>
                    <span
                      className={`student-trials-status ${
                        isCompleted ? "completed" : isWaiting ? "waiting" : "scheduled"
                      }`}
                    >
                      {isCompleted ? "Completed" : isWaiting ? "Waiting" : trial.status}
                    </span>

                    <h3>{trial.courseId?.title || "Trial Course"}</h3>

                    {trial.demoClass ? (
                      <div className="student-trials-details">
                        <p>
                          <strong>Instructor:</strong>{" "}
                          {trial.demoClass?.instructorId?.name || "Instructor"}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {new Date(trial.demoClass?.startTime).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ) : (
                      <p className="student-trials-muted">
                        Waiting for the sales team to schedule your trial class.
                      </p>
                    )}

                    {trial.demoClass && (
                      isCompleted ? (
                        <button className="student-trials-complete-btn" disabled>
                          Completed
                        </button>
                      ) : (
                        <a
                          href={trial.demoClass?.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="student-trials-primary-btn"
                        >
                          Join Demo Class
                        </a>
                      )
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
