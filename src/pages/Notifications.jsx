// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     API.get("/api/notifications").then(res =>
//       setNotifications(res.data)
//     );
//   }, []);

//   return (
//     <div>
//       <h2>Notifications</h2>

//       {notifications.length === 0 && <p>No notifications</p>}

//       {notifications.map(n => (
//         <div key={n._id} style={{ border: "1px solid", margin: 10 }}>
//           <p>{n.message}</p>
//           <small>{new Date(n.createdAt).toLocaleString()}</small>
//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";
import "./style/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/api/notifications");
        setNotifications(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="notif-page">

      <h1>Notifications</h1>

      {notifications.length === 0 ? (
        <div className="empty">
          📭 No notifications yet
        </div>
      ) : (
        <div className="notif-list">

          {notifications.map((n) => (
            <div key={n._id} className="notif-card">

              <div className="notif-message">
                {n.message}
              </div>

              <div className="notif-time">
                {new Date(n.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata"
                })}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}