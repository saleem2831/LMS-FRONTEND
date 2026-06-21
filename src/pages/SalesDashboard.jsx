import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import API from "../services/api";
import Pagination from "../components/Pagination";
import { getUser, logout } from "../utils/auth";
import logo from "../assets/skillstek_logo.png";
import "react-datepicker/dist/react-datepicker.css";
import "./style/SalesDashboard.css";

const COURSES_PER_PAGE = 3;

export default function SalesDashboard() {
  const [trials, setTrials] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [instructorAvailability, setInstructorAvailability] = useState({});
  const [availableInstructors, setAvailableInstructors] = useState({});
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [trialStatusTab, setTrialStatusTab] = useState("PENDING");
  const [trialStatusPage, setTrialStatusPage] = useState(1);
  const [pendingSchedulePage, setPendingSchedulePage] = useState(1);
  const [forms, setForms] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = getUser();

  const fetchCourses = async () => {
    try {
      const res = await API.get("/api/courses");
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrials = async () => {
    try {
      const res = await API.get("/api/sales/trial-requests");
      setTrials(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await API.get("/api/sales/instructors");
      setInstructors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInstructorAvailability = async (instructorId) => {
    try {
      const res = await API.get(`/api/availability/instructor/${instructorId}`);

      setInstructorAvailability((prev) => ({
        ...prev,
        [instructorId]: res.data
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAvailableInstructors = async (trialId, date) => {
    try {
      const res = await API.get(`/api/availability/date-slots?date=${date}`);

      setAvailableInstructors((prev) => ({
        ...prev,
        [trialId]: res.data
      }));
    } catch (error) {
      console.log(error);

      setAvailableInstructors((prev) => ({
        ...prev,
        [trialId]: []
      }));
    }
  };

  useEffect(() => {
    fetchTrials();
    fetchInstructors();
    fetchCourses();
  }, []);

  const updateForm = (trialId, field, value) => {
    setForms((prev) => ({
      ...prev,
      [trialId]: {
        ...prev[trialId],
        [field]: value
      }
    }));
  };

  const fetchSlots = async (trialId, instructorId, date) => {
    try {
      if (!instructorId || !date) {
        setAvailableSlots((prev) => ({
          ...prev,
          [trialId]: []
        }));

        return;
      }

      const res = await API.get(`/api/availability/slots/${instructorId}?date=${date}`);

      setAvailableSlots((prev) => ({
        ...prev,
        [trialId]: res.data
      }));
    } catch (error) {
      console.log(error);

      setAvailableSlots((prev) => ({
        ...prev,
        [trialId]: []
      }));
    }
  };

  const handleSlotSelect = (trialId, slot, selectedDate, instructorId) => {
    if (!selectedDate) return;

    const [hour, minute] = slot.split(":");
    const startHour = parseInt(hour);
    const endHour = startHour + 1;
    const startTime = `${selectedDate}T${slot}`;
    const endTime = `${selectedDate}T${String(endHour).padStart(2, "0")}:${minute}`;

    setForms((prev) => ({
      ...prev,
      [trialId]: {
        ...prev[trialId],
        instructorId,
        startTime,
        endTime
      }
    }));
  };

  const scheduleDemo = async (trialId) => {
    try {
      const payload = {
        ...forms[trialId],
        trialEnrollmentId: trialId
      };

      await API.post("/api/sales/schedule-demo", payload);

      alert("Demo scheduled successfully");

      setForms((prev) => ({
        ...prev,
        [trialId]: {}
      }));

      setAvailableSlots((prev) => ({
        ...prev,
        [trialId]: []
      }));

      fetchTrials();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const updateTrialStatus = async (trialId, status) => {
    try {
      await API.put(`/api/sales/trial-status/${trialId}`, { status });

      setTrials((prev) =>
        prev.map((trial) =>
          trial._id === trialId
            ? {
                ...trial,
                status
              }
            : trial
        )
      );

      alert("Status updated");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const copyLink = (link, message = "Link copied") => {
    navigator.clipboard.writeText(link);
    alert(message);
  };

  const pendingTrials = trials.filter((t) => t.status === "PENDING");
  const scheduledTrials = trials.filter((t) => t.status === "SCHEDULED");
  const completedTrials = trials.filter((t) => t.status === "COMPLETED");
  const cancelledTrials = trials.filter((t) => t.status === "CANCELLED");
  const pendingScheduleStartIndex = (pendingSchedulePage - 1) * 9;
  const paginatedPendingTrials = pendingTrials.slice(
    pendingScheduleStartIndex,
    pendingScheduleStartIndex + 9
  );
  const statusTrialMap = {
    PENDING: pendingTrials,
    SCHEDULED: scheduledTrials,
    COMPLETED: completedTrials,
    CANCELLED: cancelledTrials
  };
  const activeStatusTrials = statusTrialMap[trialStatusTab] || [];
  const statusStartIndex = (trialStatusPage - 1) * 9;
  const paginatedStatusTrials = activeStatusTrials.slice(
    statusStartIndex,
    statusStartIndex + 9
  );

  const generatePurchaseLink = (courseId, type) => {
    const baseUrl = window.location.origin;
    let routeType = "";

    if (type === "TRIAL") {
      routeType = "trial";
    } else if (type === "ONE_TO_ONE") {
      routeType = "one-to-one";
    }

    return `${baseUrl}/courses/${courseId}/${routeType}`;
  };

  const lastIndex = currentPage * COURSES_PER_PAGE;
  const firstIndex = lastIndex - COURSES_PER_PAGE;
  const currentCourses = courses.slice(firstIndex, lastIndex);

  const stats = [
    { label: "Trial Requests", value: trials.length, detail: "All trial leads" },
    { label: "Pending", value: pendingTrials.length, detail: "Need scheduling" },
    { label: "Scheduled", value: scheduledTrials.length, detail: "Demos booked" },
    { label: "Completed", value: completedTrials.length, detail: "Trials finished" },
    { label: "Cancelled", value: cancelledTrials.length, detail: "Closed as cancelled" },
    { label: "Courses", value: courses.length, detail: "Sales links ready" }
  ];

  const renderStatusCard = (trial, allowedStatuses) => (
    <article className={`sales-trial-card ${trial.status.toLowerCase()}`} key={trial._id}>
      <div>
        <span className={`sales-status ${trial.status.toLowerCase()}`}>
          {trial.status}
        </span>
        <h3>{trial.studentId?.name || "Student"}</h3>
        <p>{trial.studentId?.email || "No email"}</p>
        <p>
          <strong>Course:</strong> {trial.courseId?.title || "Course"}
        </p>
      </div>

      <select
        className="sales-select"
        value={trial.status}
        onChange={(e) => updateTrialStatus(trial._id, e.target.value)}
      >
        {allowedStatuses.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </article>
  );

  const getStatusOptions = (status) => {
    const options = [status, "PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"];
    return [...new Set(options)];
  };

  useEffect(() => {
    setTrialStatusPage(1);
  }, [trialStatusTab]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(activeStatusTrials.length / 9));

    if (trialStatusPage > totalPages) {
      setTrialStatusPage(totalPages);
    }
  }, [activeStatusTrials.length, trialStatusPage]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(pendingTrials.length / 9));

    if (pendingSchedulePage > totalPages) {
      setPendingSchedulePage(totalPages);
    }
  }, [pendingTrials.length, pendingSchedulePage]);

  return (
    <div className="sales-dashboard">
      <header className={`sales-navbar ${mobileMenuOpen ? "menu-open" : ""}`}>
        <Link to="/" className="sales-brand" aria-label="Skillstek home">
          <img src={logo} alt="Skillstek" />
        </Link>

        <button
          className="sales-menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="sales-nav-links" aria-label="Sales navigation">
          <a href="#sales-links" onClick={() => setMobileMenuOpen(false)}>
            Course Links
          </a>
          <a href="#pending-trials" onClick={() => setMobileMenuOpen(false)}>
            Pending Trials
          </a>
          <a href="#trial-status" onClick={() => setMobileMenuOpen(false)}>
            Trial Status
          </a>
        </nav>

        <div className="sales-nav-actions">
          <Link
            to="/profile"
            className="sales-profile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>{user?.name?.charAt(0)?.toUpperCase() || "S"}</span>
            <div>
              <strong>{user?.name || "Sales"}</strong>
              <small>Sales</small>
            </div>
          </Link>
          <button className="sales-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="sales-main">
        <section className="sales-hero">
          <div>
            <span className="sales-eyebrow">Sales workspace</span>
            <h1>Manage trial leads and course purchase links</h1>
            <p>
              Share direct enrollment links, schedule demo classes, and move each
              trial request through the sales pipeline.
            </p>
          </div>

          <div className="sales-hero-actions">
            <a href="#pending-trials" className="sales-primary-btn">
              Schedule Demos
            </a>
            <a href="#sales-links" className="sales-secondary-btn">
              Copy Course Links
            </a>
          </div>
        </section>

        <section className="sales-stat-grid">
          {stats.map((stat) => (
            <div className="sales-stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </div>
          ))}
        </section>

        <section className="sales-panel" id="sales-links">
          <div className="sales-section-heading">
            <div>
              <span className="sales-eyebrow">Links</span>
              <h2>Course Sales Links</h2>
            </div>
          </div>

          <div className="sales-course-grid">
            {currentCourses.length > 0 ? (
              currentCourses.map((course) => {
                const trialLink = generatePurchaseLink(course._id, "TRIAL");
                const oneToOneLink = generatePurchaseLink(course._id, "ONE_TO_ONE");

                return (
                  <article className="sales-course-card" key={course._id}>
                    <h3>{course.title}</h3>

                    <div className="sales-link-box">
                      <label>Trial Class Link</label>
                      <input readOnly value={trialLink} />
                      <button
                        type="button"
                        onClick={() => copyLink(trialLink, "Trial link copied")}
                      >
                        Copy Trial Link
                      </button>
                    </div>

                    <div className="sales-link-box">
                      <label>1:1 Course Link</label>
                      <input readOnly value={oneToOneLink} />
                      <button
                        type="button"
                        onClick={() => copyLink(oneToOneLink, "1:1 link copied")}
                      >
                        Copy 1:1 Link
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="sales-empty">No courses found.</p>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={courses.length}
            itemsPerPage={COURSES_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </section>

        <section className="sales-panel" id="pending-trials">
          <div className="sales-section-heading">
            <div>
              <span className="sales-eyebrow">Scheduling</span>
              <h2>Pending Trials</h2>
            </div>
          </div>

          <div className="sales-pending-list">
            {paginatedPendingTrials.length > 0 ? (
              paginatedPendingTrials.map((trial) => {
                const form = forms[trial._id] || {};
                const instructorOptions = availableInstructors[trial._id] || [];

                return (
                  <article className="sales-schedule-card" key={trial._id}>
                    <div className="sales-lead-summary">
                      <span className="sales-status pending">{trial.status}</span>
                      <h3>{trial.studentId?.name || "Student"}</h3>
                      <p>{trial.studentId?.email || "No email"}</p>
                      <p>
                        <strong>Course:</strong> {trial.courseId?.title || "Course"}
                      </p>
                    </div>

                    <div className="sales-schedule-grid">
                      <div className="sales-datepicker-shell">
                        <h4>Select Date</h4>
                        <DatePicker
                          selected={form.selectedDate ? new Date(form.selectedDate) : null}
                          onChange={(date) => {
                            if (!date) return;

                            const formattedDate = date.toISOString().split("T")[0];

                            updateForm(trial._id, "selectedDate", formattedDate);
                            fetchAvailableInstructors(trial._id, formattedDate);
                          }}
                          minDate={new Date()}
                          inline
                        />
                      </div>

                      <div className="sales-schedule-details">
                        <div>
                          <h4>Available Instructors</h4>

                          <div className="sales-instructor-list">
                            {instructorOptions.length > 0 ? (
                              instructorOptions.map((inst) => (
                                <div
                                  className="sales-instructor-card"
                                  key={inst.instructorId}
                                >
                                  <h3>{inst.instructorName}</h3>

                                  <div className="sales-slot-list">
                                    {inst.slots.map((slot) => {
                                      const isSelected =
                                        form.instructorId === inst.instructorId &&
                                        form.startTime?.includes(slot);

                                      return (
                                        <button
                                          key={slot}
                                          type="button"
                                          className={`sales-slot-btn ${isSelected ? "active" : ""}`}
                                          onClick={() =>
                                            handleSlotSelect(
                                              trial._id,
                                              slot,
                                              form.selectedDate,
                                              inst.instructorId
                                            )
                                          }
                                        >
                                          {slot}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="sales-muted">No instructors available</p>
                            )}
                          </div>
                        </div>

                        <div className="sales-form-grid">
                          <input
                            className="sales-input"
                            placeholder="Meet Link"
                            value={form.meetLink || ""}
                            onChange={(e) =>
                              updateForm(trial._id, "meetLink", e.target.value)
                            }
                          />

                          <textarea
                            className="sales-input"
                            placeholder="Notes"
                            value={form.notes || ""}
                            onChange={(e) =>
                              updateForm(trial._id, "notes", e.target.value)
                            }
                          />
                        </div>

                        <div className="sales-time-summary">
                          <p>
                            <strong>Start:</strong> {form.startTime || "-"}
                          </p>
                          <p>
                            <strong>End:</strong> {form.endTime || "-"}
                          </p>
                        </div>

                        <button
                          className="sales-primary-btn"
                          type="button"
                          onClick={() => scheduleDemo(trial._id)}
                          disabled={!form.startTime || !form.endTime || !form.instructorId}
                        >
                          Schedule Demo
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="sales-empty">No pending trials.</p>
            )}
          </div>

          <Pagination
            currentPage={pendingSchedulePage}
            totalItems={pendingTrials.length}
            itemsPerPage={9}
            onPageChange={setPendingSchedulePage}
          />
        </section>

        <section className="sales-panel" id="trial-status">
          <div className="sales-section-heading">
            <div>
              <span className="sales-eyebrow">Pipeline</span>
              <h2>Trial Status</h2>
            </div>
          </div>

          <div className="sales-status-tabs">
            {["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].map((status) => (
              <button
                key={status}
                type="button"
                className={`sales-status-tab ${trialStatusTab === status ? "active" : ""}`}
                onClick={() => setTrialStatusTab(status)}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
                <span>{statusTrialMap[status].length}</span>
              </button>
            ))}
          </div>

          <div className="sales-trial-grid">
            {paginatedStatusTrials.length > 0 ? (
              paginatedStatusTrials.map((trial) =>
                renderStatusCard(trial, getStatusOptions(trialStatusTab))
              )
            ) : (
              <p className="sales-empty">
                No {trialStatusTab.toLowerCase()} trials.
              </p>
            )}
          </div>

          <Pagination
            currentPage={trialStatusPage}
            totalItems={activeStatusTrials.length}
            itemsPerPage={9}
            onPageChange={setTrialStatusPage}
          />
        </section>
      </main>
    </div>
  );
}
