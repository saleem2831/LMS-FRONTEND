import { useEffect, useState } from "react";
import API from "../services/api";

export default function DemoList() {
  const [demos, setDemos] = useState([]);

  const fetchDemos = async () => {
    const res = await API.get("/api/demos");
    setDemos(res.data);
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/api/demos/${id}/status`, {
      status
    });

    fetchDemos();
  };

  return (
    <div>
      <h2>Demo / Trial Classes</h2>

      {demos.map((d) => (
        <div
          key={d._id}
          style={{
            border: "1px solid #ccc",
            margin: 10,
            padding: 10
          }}
        >
          <p><b>{d.studentName}</b></p>

          <p>{d.studentPhone}</p>

          <p>Course: {d.courseId?.title}</p>

          <p>Instructor: {d.instructorId?.name}</p>

          <p>
            {new Date(d.scheduledTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata"
            })}
          </p>

          <p>Status: {d.status}</p>

          <a href={d.meetLink} target="_blank" rel="noreferrer">
            Join Demo
          </a>

          <br />
          <br />

          <button
            onClick={() => updateStatus(d._id, "COMPLETED")}
          >
            Complete
          </button>

          <button
            onClick={() => updateStatus(d._id, "CANCELLED")}
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}