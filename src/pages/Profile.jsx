// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function Profile() {
//   const [form, setForm] = useState({});

//   useEffect(() => {
//     API.get("/api/users/me").then(res => setForm(res.data));
//   }, []);

// //   const handleUpdate = async () => {
// //     await API.put("/api/users/me", form);
// //     alert("Profile updated");
// //   };

// const handleUpdate = async () => {
//   try {
//     await API.put("/api/users/me", form);
//     alert("Profile updated");
//   } catch (err) {
//     alert("Update failed");
//   }
// };

//   return (
//     <div>
//       <h2>Profile</h2>

//       <input value={form.name || ""}
//         onChange={e => setForm({ ...form, name: e.target.value })} />

//       <input placeholder="Mobile"
//         value={form.mobile || ""}
//         onChange={e => setForm({ ...form, mobile: e.target.value })} />

//       <input placeholder="Address"
//         value={form.address || ""}
//         onChange={e => setForm({ ...form, address: e.target.value })} />

//       <input placeholder="New Password"
//         onChange={e => setForm({ ...form, password: e.target.value })} />

//       <button onClick={handleUpdate}>Update</button>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";
import "./style/Profile.css";

export default function Profile() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/api/users/me");
        setForm(res.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await API.put("/api/users/me", form);
      alert("Profile updated");
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <h1>My Profile</h1>

        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            value={form.name || ""}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        {/* Mobile */}
        <div className="form-group">
          <label>Mobile</label>
          <input
            value={form.mobile || ""}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <input
            value={form.address || ""}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          className="save-btn"
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Profile"}
        </button>

      </div>

    </div>
  );
}