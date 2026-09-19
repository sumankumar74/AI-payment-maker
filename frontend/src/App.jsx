import { useEffect, useState } from "react";

function App() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/payments")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        return response.json();
      })
      .then((data) => {
        setPayments(data);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
        setError("Unable to connect to backend");
      });
  }, []);

  const totalFailedAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const recoveryRate = 0;

  return (
    <div className="app">
      <header className="header">
        <h1>AI Payment Recovery System</h1>
        <p>Payment analysis and revenue recovery dashboard</p>
      </header>

      <main className="dashboard">
        <div className="stat-card">
          <h2>Revenue at Risk</h2>
          <p>₹{totalFailedAmount}</p>
        </div>

        <div className="stat-card">
          <h2>Recovered Revenue</h2>
          <p>₹0</p>
        </div>

        <div className="stat-card">
          <h2>Failed Payments</h2>
          <p>{payments.length}</p>
        </div>

        <div className="stat-card">
          <h2>Recovery Rate</h2>
          <p>{recoveryRate}%</p>
        </div>
      </main>

      {error && <p className="error">{error}</p>}

      <section className="payments-section">
        <h2>Failed Payment Records</h2>

        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Failure Reason</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                onClick={() => setSelectedPayment(payment)}
              >
                <td>{payment.customer}</td>
                <td>₹{payment.amount}</td>
                <td className="status-failed">{payment.status}</td>
                <td>{payment.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedPayment && (
        <section className="payment-details">
          <h2>Payment Details</h2>

          <p>Customer: {selectedPayment.customer}</p>
          <p>Amount: ₹{selectedPayment.amount}</p>
          <p>Status: {selectedPayment.status}</p>
          <p>Failure Reason: {selectedPayment.reason}</p>

          <button onClick={() => setSelectedPayment(null)}>
            Close Details
          </button>
        </section>
      )}
    </div>
  );
}

export default App;