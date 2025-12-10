import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [highValueTransactions, setHighValueTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    fetchPendingLoans();
    fetchAlerts();
    fetchHighValueTransactions();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      const response = await axios.get('/api/admin/loans/pending');
      setPendingLoans(response.data);
    } catch (error) {
      setError('Failed to fetch pending loans');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/admin/transactions/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const fetchHighValueTransactions = async () => {
    try {
      const response = await axios.get('/api/admin/transactions/high-value');
      setHighValueTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch high value transactions:', error);
    }
  };

  const handleLoanAction = async (loanId, action) => {
    try {
      const response = await axios.post(`/api/admin/loans/${loanId}/${action}`);
      setSuccess(response.data.message);
      fetchPendingLoans();
      setShowLoanModal(false);
    } catch (error) {
      setError(error.response?.data?.error || `Failed to ${action} loan`);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      const response = await axios.post(`/api/admin/alerts/${alertId}/resolve`);
      setSuccess(response.data.message);
      fetchAlerts();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to resolve alert');
    }
  };

  const openLoanModal = (loan) => {
    setSelectedLoan(loan);
    setShowLoanModal(true);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading admin dashboard...</div>;
  }

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{pendingLoans.length}</h3>
              <p>Pending Loans</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{alerts.length}</h3>
              <p>Unresolved Alerts</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-danger">{highValueTransactions.length}</h3>
              <p>High Value Transactions</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pending Loans */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>Pending Loan Applications</Card.Header>
            <Card.Body>
              {pendingLoans.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Amount</th>
                      <th>Interest Rate</th>
                      <th>Term</th>
                      <th>Applied Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingLoans.map((loan) => (
                      <tr key={loan.loanId}>
                        <td>{loan.user?.name || 'N/A'}</td>
                        <td>₹{loan.amount}</td>
                        <td>{loan.interestRate}%</td>
                        <td>{loan.termMonths} months</td>
                        <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="me-2"
                            onClick={() => openLoanModal(loan)}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No pending loan applications.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Suspicious Transaction Alerts */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>Suspicious Transaction Alerts</Card.Header>
            <Card.Body>
              {alerts.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Message</th>
                      <th>Alert Type</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert) => (
                      <tr key={alert.alertId}>
                        <td>{alert.account?.accountNumber || 'N/A'}</td>
                        <td>{alert.message}</td>
                        <td>
                          <span className="badge bg-warning">{alert.alertType}</span>
                        </td>
                        <td>{new Date(alert.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => resolveAlert(alert.alertId)}
                          >
                            Resolve
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No unresolved alerts.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Loan Review Modal */}
      <Modal show={showLoanModal} onHide={() => setShowLoanModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Review Loan Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <div>
              <Row>
                <Col md={6}>
                  <p><strong>Applicant:</strong> {selectedLoan.user?.name}</p>
                  <p><strong>Email:</strong> {selectedLoan.user?.email}</p>
                  <p><strong>Amount:</strong> ${selectedLoan.amount}</p>
                  <p><strong>Interest Rate:</strong> {selectedLoan.interestRate}%</p>
                </Col>
                <Col md={6}>
                  <p><strong>Term:</strong> {selectedLoan.termMonths} months</p>
                  <p><strong>Applied Date:</strong> {new Date(selectedLoan.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {selectedLoan.status}</p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoanModal(false)}>
            Close
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleLoanAction(selectedLoan?.loanId, 'reject')}
          >
            Reject
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleLoanAction(selectedLoan?.loanId, 'approve')}
          >
            Approve
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
