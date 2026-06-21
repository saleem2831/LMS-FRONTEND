import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./style/InstructorAvailability.css";

export default function InstructorAvailability() {
  const [form, setForm] = useState({
    workingDays: [],
    startHour: "10:00",
    endHour: "18:00",
    slotDuration: 60
  });

  const [loading, setLoading] = useState(false);

  const fetchAvailability = async () => {
    try {
      const res = await API.get("/api/availability/my");

      if (res.data) {
        setForm({
          workingDays: res.data.workingDays || [],
          startHour: res.data.startHour || "10:00",
          endHour: res.data.endHour || "18:00",
          slotDuration: res.data.slotDuration || 60
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const toggleDay = (day) => {
    if (form.workingDays.includes(day)) {
      setForm({
        ...form,
        workingDays: form.workingDays.filter((d) => d !== day)
      });
    } else {
      setForm({
        ...form,
        workingDays: [...form.workingDays, day]
      });
    }
  };

  const saveAvailability = async () => {
    try {
      setLoading(true);
      await API.post("/api/availability", form);
      alert("Availability updated");
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  return (
    <div className="availability-page">
      <main className="availability-main">
        <section className="availability-hero">
          <div>
            <span className="availability-eyebrow">Instructor schedule</span>
            <h1>Set Availability</h1>
            <p>
              Choose your working days and teaching window so sales can book trial
              classes only when you are available.
            </p>
          </div>

          <Link to="/instructor" className="availability-secondary-btn">
            Back to Dashboard
          </Link>
        </section>

        <section className="availability-layout">
          <div className="availability-panel">
            <div className="availability-section-heading">
              <div>
                <span className="availability-eyebrow">Working days</span>
                <h2>Select active days</h2>
              </div>
            </div>

            <div className="availability-day-grid">
              {days.map((day) => {
                const checked = form.workingDays.includes(day);

                return (
                  <label
                    className={`availability-day ${checked ? "active" : ""}`}
                    key={day}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDay(day)}
                    />
                    <span>{day}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <aside className="availability-panel">
            <div className="availability-section-heading">
              <div>
                <span className="availability-eyebrow">Time window</span>
                <h2>Daily slots</h2>
              </div>
            </div>

            <div className="availability-form-grid">
              <label className="availability-field">
                <span>Start Time</span>
                <input
                  type="time"
                  value={form.startHour}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startHour: e.target.value
                    })
                  }
                />
              </label>

              <label className="availability-field">
                <span>End Time</span>
                <input
                  type="time"
                  value={form.endHour}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endHour: e.target.value
                    })
                  }
                />
              </label>

              <label className="availability-field">
                <span>Slot Duration</span>
                <select
                  value={form.slotDuration}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slotDuration: Number(e.target.value)
                    })
                  }
                >
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Minutes</option>
                </select>
              </label>
            </div>

            <div className="availability-summary">
              <p>
                <strong>{form.workingDays.length}</strong>
                working days selected
              </p>
              <p>
                <strong>{form.startHour} - {form.endHour}</strong>
                teaching window
              </p>
            </div>

            <button
              className="availability-primary-btn"
              type="button"
              onClick={saveAvailability}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Availability"}
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}
