import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Form, Alert, Modal, Table, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import FinancialSphere3D from './FinancialSphere3D';
import Chart from 'chart.js/auto';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isBrightTheme, setIsBrightTheme] = useState(true);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const sparklineChartRef = useRef(null);
  const donutChartRef = useRef(null);
  
  // Transaction modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [transactionData, setTransactionData] = useState({
    amount: '',
    description: '',
    toAccountId: ''
  });
  
  // Loan modal states
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanData, setLoanData] = useState({
    amount: '',
    interestRate: '8.5',
    termMonths: '12',
    purpose: ''
  });

  useEffect(() => {
    fetchAccountData();
    fetchTransactions();
    fetchLoans();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await axios.get('/api/account/balance');
      setAccount(response.data);
    } catch (error) {
      setError('Failed to fetch account data');
    } finally {
      setLoading(false);
    }
  };

  // Initialize / update Chart.js charts when transactions or account change
  useEffect(() => {
    const sparkCanvas = document.getElementById('spendingSparkline');
    const donutCanvas = document.getElementById('incomeDonut');

    if (!sparkCanvas || !donutCanvas) return;

    // Clean up existing charts if any
    if (sparklineChartRef.current) {
      sparklineChartRef.current.destroy();
      sparklineChartRef.current = null;
    }
    if (donutChartRef.current) {
      donutChartRef.current.destroy();
      donutChartRef.current = null;
    }

    if (!transactions || transactions.length === 0) {
      return;
    }

    const sortedTx = [...transactions].sort((a, b) => new Date(a[5]) - new Date(b[5]));
    const recent = sortedTx.slice(-10);

    const sparkLabels = recent.map(txn => new Date(txn[5]).toLocaleDateString());
    const sparkData = recent.map(txn => txn[2]);

    sparklineChartRef.current = new Chart(sparkCanvas, {
      type: 'line',
      data: {
        labels: sparkLabels,
        datasets: [
          {
            data: sparkData,
            borderColor: '#2DD4BF',
            backgroundColor: 'rgba(45, 212, 191, 0.15)',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 0,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'nearest',
            intersect: false,
            displayColors: false,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.6)',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: { display: false },
            grid: { display: false, drawBorder: false },
          },
          y: {
            ticks: { display: false },
            grid: { display: false, drawBorder: false },
          },
        },
      },
    });

    let income = 0;
    let expenses = 0;
    transactions.forEach((txn) => {
      const amt = Number(txn[2]) || 0;
      if (amt > 0) {
        income += amt;
      } else if (amt < 0) {
        expenses += Math.abs(amt);
      }
    });

    const balanceVal = Number(account?.balance) || 0;
    const savings = Math.max(balanceVal, 0);

    donutChartRef.current = new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses', 'Savings'],
        datasets: [
          {
            data: [income, expenses, savings],
            backgroundColor: [
              'rgba(45, 212, 191, 0.8)',
              'rgba(248, 113, 113, 0.9)',
              'rgba(124, 58, 237, 0.85)',
            ],
            borderColor: 'rgba(15, 23, 42, 1)',
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#E5F2FF',
              boxWidth: 10,
              padding: 12,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.6)',
            borderWidth: 1,
          },
        },
      },
    });

    return () => {
      if (sparklineChartRef.current) {
        sparklineChartRef.current.destroy();
        sparklineChartRef.current = null;
      }
      if (donutChartRef.current) {
        donutChartRef.current.destroy();
        donutChartRef.current = null;
      }
    };
  }, [transactions, account]);

  const fetchTransactions = async () => {
    try {
      if (account?.accountId) {
        const response = await axios.get(`/api/transaction/statement/${account.accountId}`);
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get('/api/loan/status');
      setLoans(response.data.loans || []);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    }
  };

  const handleTransaction = async (type) => {
    setTransactionType(type);
    setShowTransactionModal(true);
    setTransactionData({ amount: '', description: '', toAccountId: '' });
  };

  const submitTransaction = async () => {
    try {
      const payload = {
        accountId: account.accountId,
        amount: parseFloat(transactionData.amount),
        description: transactionData.description || `${transactionType} transaction`
      };

      if (transactionType === 'transfer') {
        payload.toAccountId = transactionData.toAccountId;
      }

      const response = await axios.post(`/api/transaction/${transactionType}`, payload);
      setSuccess(response.data.message);
      setShowTransactionModal(false);
      fetchAccountData();
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.error || 'Transaction failed');
    }
  };

  const submitLoanApplication = async () => {
    try {
      const payload = {
        amount: parseFloat(loanData.amount),
        interestRate: parseFloat(loanData.interestRate),
        termMonths: parseInt(loanData.termMonths),
        purpose: loanData.purpose
      };

      const response = await axios.post('/api/loan/apply', payload);
      setSuccess(response.data.message);
      setShowLoanModal(false);
      fetchLoans();
    } catch (error) {
      setError(error.response?.data?.error || 'Loan application failed');
    }
  };

  if (loading) {
    return (
      <div className={`dashboard-container ${isBrightTheme ? 'theme-bright' : 'theme-dark'}`}>
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${isBrightTheme ? 'theme-bright' : 'theme-dark'}`}>
      <div className="homepage-theme-toggle">
        <span>Theme</span>
        <div className="theme-toggle-pill" onClick={() => setIsBrightTheme(prev => !prev)}>
          <div className={`theme-toggle-thumb ${isBrightTheme ? 'theme-toggle-thumb--bright' : 'theme-toggle-thumb--dark'}`}>
            {isBrightTheme ? 'Bright' : 'Dark'}
          </div>
        </div>
      </div>
      <Row className="dashboard-shell">
        {/* Left sidebar */}
        <Col lg={2} className="dashboard-sidebar d-none d-lg-flex flex-column align-items-center">
          <div className="sidebar-logo">SB</div>
          <div className="sidebar-nav-icons">
            <Link to="/dashboard" className={`sidebar-icon ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <i className="fas fa-tachometer-alt"></i>
            </Link>
            <Link to="/personal-finance" className={`sidebar-icon ${location.pathname === '/personal-finance' ? 'active' : ''}`}>
              <i className="fas fa-wallet"></i>
            </Link>
            <Link to="/banking" className={`sidebar-icon ${location.pathname === '/banking' ? 'active' : ''}`}>
              <i className="fas fa-university"></i>
            </Link>
            <Link to="/alerts" className={`sidebar-icon ${location.pathname === '/alerts' ? 'active' : ''}`}>
              <i className="fas fa-bell"></i>
            </Link>
          </div>
        </Col>

        {/* Center main area */}
        <Col lg={7} className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h2>Hi, {user?.name || 'SecureBank User'}</h2>
              <p className="header-subtitle">Todays snapshot of your SecureBank accounts.</p>
            </div>
            <div className="header-total-balance">
              <span className="label">Total Balance</span>
              <span className="value balance-value-highlight">₹{account?.balance || '0.00'}</span>
            </div>
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          </div>

          {/* Hero: Account Summary, Quick Actions, 3D Visualization */}
          <Row className="mb-4 dashboard-hero">
            <Col lg={7} className="hero-left">
              <Card className="dashboard-card balance-card mb-3">
                <Card.Body>
                  <h5 className="balance-label">Primary Account</h5>
                  <h2 className="balance-amount">₹{account?.balance || '0.00'}</h2>
                  <p className="text-muted small">Account: {account?.accountNumber}</p>
                  <p className="text-muted small">Branch: {account?.branchName}</p>
                </Card.Body>
              </Card>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">💳</div>
                  <p className="stat-value">{transactions.length}</p>
                  <p className="stat-label">Total Transactions</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <p className="stat-value">₹{account?.balance || '0.00'}</p>
                  <p className="stat-label">Current Balance</p>
                </div>
              </div>

              <Card className="dashboard-card quick-actions-card">
                <Card.Header className="card-header-custom">Quick Actions</Card.Header>
                <Card.Body>
                  <div className="action-buttons">
                    <Button className="btn-action btn-deposit" onClick={() => handleTransaction('deposit')}>
                      Deposit
                    </Button>
                    <Button className="btn-action btn-withdraw" onClick={() => handleTransaction('withdraw')}>
                      Withdraw
                    </Button>
                    <Button className="btn-action btn-transfer" onClick={() => handleTransaction('transfer')}>
                      Transfer
                    </Button>
                    <Button className="btn-action btn-loan" onClick={() => setShowLoanModal(true)}>
                      Apply Loan
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5} className="hero-right">
              <Card className="dashboard-card three-d-card">
                <Card.Header className="card-header-custom">Spending Overview</Card.Header>
                <Card.Body className="three-d-card-body charts-body">
                  <canvas id="spendingSparkline" className="chart-sparkline"></canvas>
                  <canvas id="incomeDonut" className="chart-donut"></canvas>
                  <p className="charts-caption">Recent flow of your income, expenses, and savings.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Transactions */}
          <Row className="mb-4">
            <Col>
              <Card className="dashboard-card">
                <Card.Header className="card-header-custom">Recent Transactions</Card.Header>
                <Card.Body>
                  {transactions.length > 0 ? (
                    <Table hover className="transaction-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Balance After</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn, index) => (
                          <tr key={index}>
                            <td>{new Date(txn[5]).toLocaleDateString()}</td>
                            <td>
                              <span className={`transaction-type ${
                                txn[1] === 'DEPOSIT' ? 'type-deposit' :
                                txn[1] === 'WITHDRAW' ? 'type-withdraw' : 'type-transfer'
                              }`}>
                                {txn[1]}
                              </span>
                            </td>
                            <td className={txn[2] > 0 ? 'amount-positive' : 'amount-negative'}>
                              ${Math.abs(txn[2])}
                            </td>
                            <td>₹{txn[3]}</td>
                            <td>{txn[4]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>No transactions found.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Loan Status */}
          <Row>
            <Col>
              <Card className="dashboard-card">
                <Card.Header className="card-header-custom">My Loans</Card.Header>
                <Card.Body>
                  {loans.length > 0 ? (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Interest Rate</th>
                          <th>Term (Months)</th>
                          <th>Status</th>
                          <th>Applied Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loans.map((loan) => (
                          <tr key={loan.loanId}>
                            <td>₹{loan.amount}</td>
                            <td>{loan.interestRate}%</td>
                            <td>{loan.termMonths}</td>
                            <td>
                              <span className={`badge bg-${
                                loan.status === 'APPROVED' ? 'success' : 
                                loan.status === 'REJECTED' ? 'danger' : 'warning'
                              }`}>
                                {loan.status}
                              </span>
                            </td>
                            <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>No loans found.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right profile / summary column */}
        <Col lg={3} className="dashboard-profile-col d-none d-lg-block">
          <Card className="dashboard-card profile-card">
            <Card.Body>
              <div className="profile-avatar">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</div>
              <h5 className="profile-name">{user?.name || 'SecureBank User'}</h5>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-stats">
                <div className="profile-stat-item">
                  <span className="label">Accounts</span>
                  <span className="value">1</span>
                </div>
                <div className="profile-stat-item">
                  <span className="label">Loans</span>
                  <span className="value">{loans.length}</span>
                </div>
                <div className="profile-stat-item">
                  <span className="label">Transactions</span>
                  <span className="value">{transactions.length}</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="dashboard-card live-visual-card">
            <Card.Header className="card-header-custom">Live Financial Visualization</Card.Header>
            <Card.Body className="three-d-card-body three-d-card-body--compact">
              <FinancialSphere3D />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction Modal */}
      <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)} className="modal-custom">
        <Modal.Header closeButton>
          <Modal.Title>
            {transactionType === 'deposit' ? 'Deposit Money' :
             transactionType === 'withdraw' ? 'Withdraw Money' : 'Transfer Money'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                value={transactionData.amount}
                onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                placeholder="Enter amount"
                required
                className="form-control-modal"
              />
            </Form.Group>
            
            {transactionType === 'transfer' && (
              <Form.Group className="mb-3">
                <Form.Label>To Account ID</Form.Label>
                <Form.Control
                  type="text"
                  value={transactionData.toAccountId}
                  onChange={(e) => setTransactionData({...transactionData, toAccountId: e.target.value})}
                  placeholder="Enter destination account ID"
                  required
                  className="form-control-modal"
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={transactionData.description}
                onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
                placeholder="Enter description"
                className="form-control-modal"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransactionModal(false)} className="btn-modal">
            Cancel
          </Button>
          <Button variant="primary" onClick={submitTransaction} className="btn-modal">
            Submit {transactionType}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Loan Application Modal */}
      <Modal show={showLoanModal} onHide={() => setShowLoanModal(false)} className="modal-custom">
        <Modal.Header closeButton>
          <Modal.Title>Apply for Loan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Loan Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="1000"
                value={loanData.amount}
                onChange={(e) => setLoanData({...loanData, amount: e.target.value})}
                placeholder="Enter loan amount (minimum $1000)"
                required
                className="form-control-modal"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Interest Rate (%)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                min="0"
                value={loanData.interestRate}
                onChange={(e) => setLoanData({...loanData, interestRate: e.target.value})}
                required
                className="form-control-modal"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Term (Months)</Form.Label>
              <Form.Select
                value={loanData.termMonths}
                onChange={(e) => setLoanData({...loanData, termMonths: e.target.value})}
                required
                className="form-control-modal"
              >
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="48">48 Months</option>
                <option value="60">60 Months</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Purpose</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={loanData.purpose}
                onChange={(e) => setLoanData({...loanData, purpose: e.target.value})}
                placeholder="Enter loan purpose"
                className="form-control-modal"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoanModal(false)} className="btn-modal">
            Cancel
          </Button>
          <Button variant="primary" onClick={submitLoanApplication} className="btn-modal">
            Submit Application
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
