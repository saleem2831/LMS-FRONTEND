import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./style/CourseDetails.css";

export default function CourseDetails() {
  const { id, type } = useParams();
  const [course, setCourse] = useState(null);

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;

  const getPlan = () => {
    if (type === "trial") return "TRIAL";
    if (type === "one-to-one") return "ONE_TO_ONE";
    if (type === "batch") return "BATCH";
    return "TRIAL";
  };

  const plan = getPlan();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/api/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourse();
  }, [id]);

  const handlePayment = async () => {
    const currentToken = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentToken || !currentUser) {
      localStorage.setItem(
        "pendingPurchase",
        JSON.stringify({
          courseId: id,
          plan
        })
      );

      window.location.href = "/login";
      return;
    }

    try {
      if (plan === "TRIAL") {
        const { data } = await API.post("/api/payment/trial-order", {
          courseId: id
        });

        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: "INR",
          order_id: data.order.id,
          name: course.title,
          description: "Trial Purchase",
          handler: async function (response) {
            await API.post("/api/payment/trial-verify", {
              ...response,
              courseId: id
            });

            alert("Trial purchased successfully");
            window.location.href = "/student-trials";
          }
        };

        new window.Razorpay(options).open();
        return;
      }

      const { data } = await API.post("/api/payment/order", {
        courseId: id,
        plan
      });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: course.title,
        description: "Course Enrollment",
        handler: async function (response) {
          await API.post("/api/payment/verify", {
            ...response,
            courseId: id,
            plan
          });

          alert("Enrollment successful");
          window.location.href = "/student";
        }
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  if (!course) {
    return (
      <div className="course-details-loader">
        <div className="course-details-spinner"></div>
      </div>
    );
  }

  const selectedPrice =
    plan === "TRIAL"
      ? course.pricing?.trial
      : plan === "ONE_TO_ONE"
        ? course.pricing?.oneToOne
        : course.pricing?.batch;

  const planLabel =
    plan === "TRIAL"
      ? "Trial Class"
      : plan === "ONE_TO_ONE"
        ? "1:1 Course"
        : "Batch Course";

  return (
    <div className="course-details-page">
      <main className="course-details-main">
        <section className="course-details-hero">
          <div className="course-details-copy">
            <span className="course-details-eyebrow">Course Checkout</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>

            <div className="course-details-highlights">
              <div>
                <span>Selected Plan</span>
                <strong>{planLabel}</strong>
              </div>
              <div>
                <span>Access Type</span>
                <strong>{plan === "TRIAL" ? "Demo session" : "Full enrollment"}</strong>
              </div>
              <div>
                <span>Payment</span>
                <strong>Secure checkout</strong>
              </div>
            </div>
          </div>

          <div className="course-details-media">
            {course.image ? (
              <img src={course.image} alt={course.title} />
            ) : (
              <div className="course-details-placeholder">
                {course.title?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}
          </div>
        </section>

        <section className="course-details-layout">
          <div className="course-details-panel">
            <div className="course-details-section-heading">
              <div>
                <span className="course-details-eyebrow">Plan</span>
                <h2>Available options</h2>
              </div>
            </div>

            <div className="course-details-plan-grid">
              <div className={`course-details-plan ${plan === "TRIAL" ? "active" : ""}`}>
                <span>Trial</span>
                <strong>₹{course.pricing?.trial || 0}</strong>
              </div>
              <div className={`course-details-plan ${plan === "ONE_TO_ONE" ? "active" : ""}`}>
                <span>1:1</span>
                <strong>₹{course.pricing?.oneToOne || 0}</strong>
              </div>
              {course.pricing?.batch && (
                <div className={`course-details-plan ${plan === "BATCH" ? "active" : ""}`}>
                  <span>Batch</span>
                  <strong>₹{course.pricing.batch}</strong>
                </div>
              )}
            </div>
          </div>

          <aside className="course-details-checkout">
            <span className="course-details-eyebrow">Checkout</span>
            <h2>Complete Purchase</h2>
            <p className="course-details-muted">
              You are about to continue with the {planLabel.toLowerCase()} plan.
            </p>

            <div className="course-details-price">
              <span>Total</span>
              <strong>₹{selectedPrice || 0}</strong>
            </div>

            <button
              className="course-details-primary-btn"
              type="button"
              onClick={handlePayment}
            >
              {user ? "Continue Payment" : "Login to Continue"}
            </button>

            <p className="course-details-note">
              {user
                ? "Payment opens in a secure Razorpay checkout."
                : "Login is required before continuing to payment."}
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}
