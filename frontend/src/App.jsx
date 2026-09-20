import { useEffect, useState } from "react";

function App() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState("");

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setError("");
      const response = await fetch( "http://localhost:5000/api/payments");

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Unable to connect to backend");
    }
  };
  useEffect(() => {fetchPayments();}, []);
  // Dashboard calculations
  const totalFailedAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),0);

  const recoveredPayments = payments.filter(
    (payment) => payment.status &&
      payment.status.toLowerCase() === "recovered"
  );

  const recoveredRevenue = recoveredPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),0);

  const recoveryRate =
    payments.length > 0 ? Math.round(
          (recoveredPayments.length / payments.length) * 100
        ): 0;

  // AI Analysis
  const handleAIAnalysis = async (paymentId) => {
    try {
      setLoadingAI(true);
      setAiAnalysis(null);
      setError("");

      const response = await fetch(`http://localhost:5000/api/ai/${paymentId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch AI analysis");
      }
      const data = await response.json();
      setAiAnalysis(data);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      setError("Unable to load AI analysis");
    } finally {
      setLoadingAI(false);
    }
  };

  // Recovery action
  const handleRecovery = async (paymentId, action) => {
    try {
      setRecoveryLoading(action);
      setError("");

      const response = await fetch(`http://localhost:5000/api/recovery/${paymentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ action })
        });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Recovery action failed"
        )}

      console.log("Recovery action:", data);

      // Refresh payments
      const paymentsResponse = await fetch( "http://localhost:5000/api/payments" );

      if (!paymentsResponse.ok) {
        throw new Error("Failed to refresh payments");
      }

      const paymentsData = await paymentsResponse.json();
      setPayments(paymentsData);

      // Update selected payment
      const updatedPayment = paymentsData.find(
        (payment) => payment._id === paymentId
      );

      if (updatedPayment) {
        setSelectedPayment(updatedPayment);
      }
    } catch (error) {
      console.error("Recovery error:", error);
      setError(
        error.message || "Unable to record recovery action"
      );
    } finally {
      setRecoveryLoading("");
    }
  };

  // Select payment
  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
    setAiAnalysis(null);
    setError("");
  };

  // Format recovery action
  const formatAction = (action) => {
    if (!action) return "Not started";

    const actions = {
      retry: "Retry Payment",
      reminder: "Send Reminder",
      human_review: "Human Review"
    };

    return actions[action] || action;
  };

  // Risk class
  const getRiskClass = (risk) => {
    if (!risk) return "";

    const value = risk.toLowerCase();

    if (value === "high") return "risk-high";
    if (value === "medium") return "risk-medium";
    if (value === "low") return "risk-low";
    return "";
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">AI</div>
          <div>
            <h2>Payment AI</h2>
            <span>Recovery System</span>
          </div>
        </div>

        <nav className="navigation">
          <a className="nav-item active" href="#dashboard">
            <span>▣</span>
            Dashboard
          </a>

          <a className="nav-item" href="#payments">
            <span>₹</span>
            Payments
          </a>

          <a className="nav-item" href="#analysis">
            <span>✦</span>
            AI Analysis
          </a>

          <a className="nav-item" href="#recovery">
            <span>↻</span>
            Recovery
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="online-dot"></span>
          Backend Connected
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div>
            <p className="eyebrow">PAYMENT INTELLIGENCE</p>

            <h1>AI Payment Recovery</h1>
            <p className="header-description">
              Monitor failed payments, analyze risk and manage
              intelligent recovery actions.
            </p>
          </div>

          <button className="refresh-button" onClick={fetchPayments} >
            ↻ Refresh
          </button>
        </header>

        {error && (
          <div className="error-message">
            <span>⚠</span>
            {error}
          </div> )}

        <section className="stats-grid" id="dashboard">
          <div className="stat-card">
            <div className="stat-top">
              <span>Revenue at Risk</span>
              <div className="stat-icon danger">₹</div>
            </div>

            <h2>₹{totalFailedAmount.toLocaleString()}</h2>

            <p className="stat-description">
              Total value of failed payments
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Recovered Revenue</span>
              <div className="stat-icon success">✓</div>
            </div>

            <h2>₹{recoveredRevenue.toLocaleString()}</h2>
            <p className="stat-description">
              Successfully recovered payments
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Failed Payments</span>
              <div className="stat-icon warning">!</div>
            </div>

            <h2>{payments.length}</h2>
            <p className="stat-description">
              Payments requiring attention
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Recovery Rate</span>
              <div className="stat-icon ai">✦</div>
            </div>

            <h2>{recoveryRate}%</h2>
            <p className="stat-description">
              Current successful recovery rate
            </p>
          </div>
        </section>
        <section className="content-card" id="payments">
          <div className="section-header">
            <div>
              <p className="section-label">TRANSACTIONS</p>
              <h2>Failed Payment Records</h2>
            </div>

            <span className="record-count">
              {payments.length} records
            </span>
          </div>

          {payments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No payment records found</h3>
              <p>
                Failed payment records will appear here.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Failure Reason</th>
                    <th>Recovery</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}
                      className={ selectedPayment?._id === payment._id ? "selected-row" : ""}
                      onClick={() => handleSelectPayment(payment)}>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">
                            {payment.customer ? payment.customer.charAt(0).toUpperCase(): "C"}
                          </div>
                          <div>
                            <strong>{payment.customer}</strong>
                            <small> Payment ID:{" "} {payment._id?.slice(-6)}</small>
                          </div>
                        </div>
                      </td>
                      <td className="amount"> ₹{Number(payment.amount || 0).toLocaleString()} </td>
                      <td> <span className="status-badge failed">{payment.status} </span></td>
                      <td>{payment.reason || "Unknown"}</td>
                      <td>
                        {payment.recovery?.action ? (
                          <span className="status-badge recovery">{formatAction(payment.recovery.action )} </span>
                        ) : (
                          <span className="not-started"> Not started </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Selected Payment */}
        {selectedPayment && (
          <section className="details-grid" id="analysis" >
            {/* Payment Details */}
            <div className="content-card details-card">

              <div className="section-header">
                <div>
                  <p className="section-label"> SELECTED PAYMENT</p>
                  <h2>Payment Details</h2>
                </div>
                <span className="status-badge failed">
                  {selectedPayment.status}
                </span>
              </div>

              <div className="payment-info">

                <div className="info-item">
                  <span>Customer</span>
                  <strong>
                    {selectedPayment.customer}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Amount</span>
                  <strong>
                    ₹{Number(selectedPayment.amount || 0).toLocaleString()}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Failure Reason</span>
                  <strong>{selectedPayment.reason} </strong>
                </div>

                <div className="info-item">
                  <span>Payment ID</span>
                  <strong className="small-id">{selectedPayment._id}</strong>
                </div>
              </div>

              <button className="ai-button" onClick={() =>handleAIAnalysis( selectedPayment._id )} disabled={loadingAI}>
                {loadingAI ? "Analyzing..." : "✦ Analyze Payment with AI"}
              </button>
            </div>
            <div className="content-card ai-card">
              <div className="section-header">
                <div>
                  <p className="section-label">ARTIFICIAL INTELLIGENCE</p>
                  <h2>AI Payment Analysis</h2>
                </div>
              </div>

              {!aiAnalysis ? (
                <div className="analysis-placeholder">
                  <div className="ai-large-icon">✦</div>
                  <h3> Analyze this payment </h3>
                  <p> Click the AI analysis button to identify payment risk and receive a recommended recovery strategy.</p>
                </div>
              ) : (
                <div className="analysis-result">
                  <div className="risk-container">
                    <span>Risk Level</span>
                    <strong className={getRiskClass( aiAnalysis.analysis?.riskLevel )} >
                      {aiAnalysis.analysis?.riskLevel ||"Unknown"} </strong>
                  </div>

                  <div className="analysis-block">
                    <span>Recommended Action</span>
                    <p>{aiAnalysis.analysis ?.recommendation || "No recommendation available"} </p>
                  </div>

                  <div className="analysis-block">
                    <span>AI Explanation</span>
                    <p> {aiAnalysis.analysis ?.explanation || "No explanation available"} </p>
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* Recovery Section */}
        {selectedPayment && (
          <section className="content-card recovery-card" id="recovery">

            <div className="section-header">
              <div>
                <p className="section-label"> RECOVERY MANAGEMENT</p>

                <h2>Recovery Actions</h2>
                <p className="section-description"> Choose an action based on the AI recommendation and track its progress.</p>
              </div>

              {selectedPayment.recovery?.status && (
                <span className="status-badge recovery-status-badge">
                  {selectedPayment.recovery.status}
                </span>
              )}
            </div>

            <div className="recovery-options">

              <button className="recovery-button retry" onClick={() => handleRecovery(selectedPayment._id,"retry") }
                disabled={recoveryLoading !== ""}>
                <span className="action-icon">↻</span>
                <span>
                  <strong>
                    Retry Payment
                  </strong>
                  <small>
                    Attempt the payment again
                  </small>
                </span>
              </button>

              <button className="recovery-button reminder"onClick={() =>handleRecovery(selectedPayment._id,"reminder" )}
                disabled={recoveryLoading !== ""}>
                <span className="action-icon">✉</span>

                <span>
                  <strong>
                    Send Reminder
                  </strong>
                  <small>
                    Notify the customer
                  </small>
                </span>
              </button>

              <button
                className="recovery-button review"
                onClick={() => handleRecovery(selectedPayment._id, "human_review" )}
                disabled={recoveryLoading !== ""}>
                <span className="action-icon">◉</span>
                <span>
                  <strong>
                    Human Review
                  </strong>

                  <small>
                    Escalate to a team member
                  </small>
                </span>
              </button>
            </div>

            {/* Recovery Tracking */}
            <div className="tracking-section">

              <div className="tracking-title">
                <h3>Recovery Tracking</h3>
                <span>
                  {selectedPayment.recovery?.action ? "Action recorded" : "No action recorded"}
                </span>
              </div>

              <div className="tracking-grid">

                <div className="tracking-item">
                  <span>Action</span>
                  <strong>
                    {formatAction( selectedPayment.recovery?.action)}
                  </strong>
                </div>

                <div className="tracking-item">
                  <span>Status</span>
                  <strong>
                    {selectedPayment.recovery?.status || "Not started"}
                  </strong>
                </div>

                <div className="tracking-item">
                  <span>Timestamp</span>
                  <strong>
                    {selectedPayment.recovery?.timestamp ? new Date(selectedPayment.recovery.timestamp).toLocaleString(): "Not available"}
                  </strong>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="footer">
          <span>
            AI Payment Recovery System
          </span>

          <span>
            Intelligent payment monitoring & recovery
          </span>
        </footer>

      </main>
    </div>
  );
}

export default App;

