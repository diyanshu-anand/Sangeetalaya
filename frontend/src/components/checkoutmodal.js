// import React, { useEffect, useState } from "react";
// import "../styles/CheckoutModal.css";

// function CheckoutModal({ course, onClose }) {
//   const [qr, setQr] = useState(null);
//   const [expiresIn, setExpiresIn] = useState(300); // 5 min
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Request backend to generate secure order + QR
//     fetch("https://sangeetalaya.onrender.com/api/payments/create-order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({
//         courseId: course._id,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setQr(data.qrImage); // base64 or url
//         setExpiresIn(data.expiresIn);
//       })
//       .finally(() => setLoading(false));
//   }, [course]);

//   // Countdown
//   useEffect(() => {
//     if (expiresIn <= 0) return;
//     const timer = setInterval(() => {
//       setExpiresIn((t) => t - 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [expiresIn]);

//   return (
//     <div className="checkout-overlay">
//       <div className="checkout-modal">
//         <button className="close-btn" onClick={onClose}>×</button>

//         <h2>Secure Checkout</h2>

//         <div className="checkout-course">
//           <h3>{course.title}</h3>
//           <p>₹{course.price}</p>
//         </div>

//         {loading ? (
//           <p>Generating secure QR...</p>
//         ) : (
//           <>
//             <img src={qr} alt="Secure QR" className="qr-image" />
//             <p className="expiry">
//               QR expires in {Math.floor(expiresIn / 60)}:
//               {(expiresIn % 60).toString().padStart(2, "0")}
//             </p>
//           </>
//         )}

//         <p className="note">
//           Do not refresh or close until payment is completed.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default CheckoutModal;


import React, { useEffect, useState } from "react";
import "../styles/CheckoutModal.css";

function CheckoutModal({ course, onClose }) {
  const [qrImage, setQrImage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [expiresIn, setExpiresIn] = useState(300);
  const [mode, setMode] = useState("QR");
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "QR") {
      createOrder();
    }
  }, [mode]);

  // countdown timer
  useEffect(() => {
    if (!qrImage) return;
    const timer = setInterval(() => {
      setExpiresIn((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qrImage]);

  const createOrder = async () => {
    setLoading(true);
    const res = await fetch("https://sangeetalaya.onrender.com/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        courseId: course._id,
        paymentMode: "QR"
      })
    });

    const data = await res.json();
    setQrImage(data.qrImage);
    setOrderId(data.orderId);
    setExpiresIn(300);
    setLoading(false);
  };

  const submitManualPayment = async () => {
    if (!txnId) return alert("Enter transaction ID");

    await fetch("https://sangeetalaya.onrender.com/api/payments/manual-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ orderId, txnId })
    });

    alert("Payment submitted for admin review");
    onClose();
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>Checkout</h2>

        <div className="checkout-course">
          <span>{course.title}</span>
          <span>₹{course.price}</span>
        </div>

        <div className="mode-toggle">
          <button onClick={() => setMode("QR")}>QR Payment</button>
          <button onClick={() => setMode("MANUAL")}>Manual</button>
        </div>

        {mode === "QR" && (
          <>
            {loading ? (
              <p>Generating QR...</p>
            ) : (
              <>
                <img src={qrImage} alt="QR Code" className="qr-image" />
                <p className="expiry">
                  Expires in {Math.floor(expiresIn / 60)}:
                  {(expiresIn % 60).toString().padStart(2, "0")}
                </p>
                <p className="note">
                  Scan using any UPI app. QR auto-refreshes after expiry.
                </p>
              </>
            )}
          </>
        )}

        {mode === "MANUAL" && (
          <>
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
            />
            <button onClick={submitManualPayment}>
              Submit for Verification
            </button>
            <p className="note">
              For international payments or alternate methods.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
