import { useEffect, useState } from "react";

import API from "../services/api";

export default function TrialRequests() {

  const [trials, setTrials] = useState([]);

  const [instructors, setInstructors] = useState([]);

  const [selectedTrial, setSelectedTrial] =
    useState(null);

  const [form, setForm] = useState({
    instructorId: "",
    scheduledTime: "",
    meetLink: "",
    notes: ""
  });

  const fetchData = async () => {

    const trialRes = await API.get(
      "/api/trials"
    );

    const instructorRes = await API.get(
      "/api/users/instructors"
    );

    setTrials(trialRes.data);

    setInstructors(instructorRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scheduleDemo = async () => {

    try {

      await API.post(
        "/api/demos/schedule",
        {
          trialEnrollmentId:
            selectedTrial._id,

          ...form
        }
      );

      alert("Demo scheduled");

      fetchData();

      setSelectedTrial(null);

    } catch (error) {

      alert(
        error.response?.data?.message
      );
    }
  };

  return (
    <div>

      <h2>Trial Requests</h2>

      {trials.map((t) => (

        <div
          key={t._id}
          style={{
            border: "1px solid #ccc",
            margin: 10,
            padding: 10
          }}
        >

          <p>
            Student:
            {t.studentId?.name}
          </p>

          <p>
            Email:
            {t.studentId?.email}
          </p>

          <p>
            Course:
            {t.courseId?.title}
          </p>

          <p>
            Trial Price:
            ₹{t.courseId?.pricing?.trial}
          </p>

          <p>Status: {t.status}</p>

          {t.status === "PENDING" && (

            <button
              onClick={() =>
                setSelectedTrial(t)
              }
            >
              Schedule Demo
            </button>
          )}

        </div>
      ))}

      {selectedTrial && (

        <div
          style={{
            border: "2px solid black",
            padding: 20
          }}
        >

          <h3>Schedule Demo</h3>

          <select
            onChange={(e) =>
              setForm({
                ...form,
                instructorId:
                  e.target.value
              })
            }
          >

            <option>
              Select Instructor
            </option>

            {instructors.map((i) => (

              <option
                key={i._id}
                value={i._id}
              >
                {i.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            onChange={(e) =>
              setForm({
                ...form,
                scheduledTime:
                  e.target.value
              })
            }
          />

          <input
            placeholder="Meet Link"
            onChange={(e) =>
              setForm({
                ...form,
                meetLink:
                  e.target.value
              })
            }
          />

          <textarea
            placeholder="Notes"
            onChange={(e) =>
              setForm({
                ...form,
                notes:
                  e.target.value
              })
            }
          />

          <button onClick={scheduleDemo}>
            Confirm Demo
          </button>

        </div>
      )}

    </div>
  );
}