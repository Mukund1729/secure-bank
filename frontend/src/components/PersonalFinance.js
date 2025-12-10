import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, ProgressBar, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chart from 'chart.js/auto';
import './PersonalFinance.css';

const PersonalFinance = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isBrightTheme, setIsBrightTheme] = useState(true);
  const [accountSummary, setAccountSummary] = useState(null);
  const [savingsGoal, setSavingsGoal] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [categories, setCategories] = useState({
    food: 0,
    education: 0,
    misc: 0,
    cash: 0,
  });

  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: 'FOOD',
    amount: '',
    note: '',
  });

  const [monthlySummary, setMonthlySummary] = useState({});
  const [dailySummary, setDailySummary] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const balanceRes = await axios.get('/api/account/balance');
        setAccountSummary(balanceRes.data);
        const monthlyRes = await axios.get('/api/expense/summary/monthly', {
          params: { months: 6 },
        });
        const monthlyData = monthlyRes.data || {};
        setMonthlySummary(monthlyData);

        const monthKeys = Object.keys(monthlyData).sort();
        if (monthKeys.length > 0) {
          const latest = monthKeys[monthKeys.length - 1];
          setSelectedMonth(latest);
          const dailyRes = await axios.get('/api/expense/summary/daily', {
            params: { month: latest },
          });
          setDailySummary(dailyRes.data || {});
          const listRes = await axios.get('/api/expense/list', {
            params: { month: latest },
          });
          const listData = listRes.data;
          setMonthlyExpenses(Array.isArray(listData) ? listData : []);
        }
      } catch (e) {
        // keep personal dashboard usable even if API fails
      }
    };
    load();
  }, []);

  const totalPlanned = Object.values(categories).reduce((a, b) => a + Number(b || 0), 0);
  const savingsProgress = savingsGoal ? Math.min(100, Math.round((currentSavings / savingsGoal) * 100)) : 0;
  const selectedMonthTotal = Array.isArray(monthlyExpenses)
    ? monthlyExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    : 0;
  const remainingAgainstSavings = Number(currentSavings || 0) - selectedMonthTotal;

  const handleCategoryChange = (name, value) => {
    setCategories(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleExpenseInputChange = (field, value) => {
    setExpenseForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddExpense = async e => {
    e.preventDefault();
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      return;
    }
    try {
      await axios.post('/api/expense/add', {
        date: expenseForm.date,
        category: expenseForm.category,
        amount: expenseForm.amount,
        note: expenseForm.note,
      });

      const monthlyRes = await axios.get('/api/expense/summary/monthly', {
        params: { months: 6 },
      });
      const monthlyData = monthlyRes.data || {};
      setMonthlySummary(monthlyData);

      const monthKey = selectedMonth || Object.keys(monthlyData).sort().slice(-1)[0];
      if (monthKey) {
        const dailyRes = await axios.get('/api/expense/summary/daily', {
          params: { month: monthKey },
        });
        setDailySummary(dailyRes.data || {});
        const listRes = await axios.get('/api/expense/list', {
          params: { month: monthKey },
        });
        const listData = listRes.data;
        setMonthlyExpenses(Array.isArray(listData) ? listData : []);
        setSelectedMonth(monthKey);
      }

      setExpenseForm(prev => ({ ...prev, amount: '', note: '' }));
    } catch (error) {
      // silent fail to keep page usable
    }
  };

  useEffect(() => {
    const canvas = document.getElementById('pfSpendingChart');
    if (!canvas) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = ['Food & Dining', 'Education', 'Cash Withdrawals', 'Miscellaneous'];

    const plannedData = [
      Number(categories.food || 0),
      Number(categories.education || 0),
      Number(categories.cash || 0),
      Number(categories.misc || 0),
    ];

    const actualByCategory = { FOOD: 0, EDUCATION: 0, CASH: 0, MISC: 0 };
    if (Array.isArray(monthlyExpenses)) {
      monthlyExpenses.forEach(exp => {
        const key = (exp.category || '').toUpperCase();
        if (actualByCategory[key] !== undefined) {
          actualByCategory[key] += Number(exp.amount || 0);
        }
      });
    }

    const actualData = [
      actualByCategory.FOOD,
      actualByCategory.EDUCATION,
      actualByCategory.CASH,
      actualByCategory.MISC,
    ];

    if (plannedData.every(v => v === 0) && actualData.every(v => v === 0)) {
      return;
    }

    chartRef.current = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Planned (₹)',
            data: plannedData,
            backgroundColor: 'rgba(59, 130, 246, 0.45)',
            borderColor: '#3B82F6',
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: selectedMonth ? `Actual in ${selectedMonth} (₹)` : 'Actual (₹)',
            data: actualData,
            backgroundColor: 'rgba(45, 212, 191, 0.6)',
            borderColor: '#2DD4BF',
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#E5F2FF',
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.6)',
            borderWidth: 1,
            callbacks: {
              label: context => {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return `${label}: ₹${value}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#9CA3AF' },
            grid: { display: false, drawBorder: false },
          },
          y: {
            ticks: { color: '#9CA3AF' },
            grid: { color: 'rgba(31, 41, 55, 0.7)' },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [categories, monthlyExpenses, selectedMonth]);

  return (
    <div className={`dashboard-container pf-container ${isBrightTheme ? 'theme-bright' : 'theme-dark'}`}>
      <div className="homepage-theme-toggle">
        <span>Theme</span>
        <div className="theme-toggle-pill" onClick={() => setIsBrightTheme(prev => !prev)}>
          <div className={`theme-toggle-thumb ${isBrightTheme ? 'theme-toggle-thumb--bright' : 'theme-toggle-thumb--dark'}`}>
            {isBrightTheme ? 'Bright' : 'Dark'}
          </div>
        </div>
      </div>
      <Row className="dashboard-shell">
        {/* Left sidebar (same as dashboard) */}
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

        {/* Center: personal finance content */}
        <Col lg={7} className="dashboard-main">
          <div className="pf-header dashboard-header">
            <div>
              <h2>Hi, {user?.name || 'SecureBank User'}</h2>
              <p className="header-subtitle">Your personal savings and spending plan with SecureBank.</p>
            </div>
          </div>

          <Row className="pf-hero mt-2">
            <Col lg={12} className="pf-hero-left">
              <Card className="pf-card pf-balance-card">
                <Card.Body>
                  <h5 className="pf-label">SecureBank e-wallet</h5>
                  <h2 className="pf-amount">₹{accountSummary?.balance || '0.00'}</h2>
                  <p className="pf-subtext">Linked account: {accountSummary?.accountNumber || '—'}</p>
                  <p className="pf-subtext">Branch: {accountSummary?.branchName || '—'}</p>
                </Card.Body>
              </Card>

              <Card className="pf-card pf-savings-card">
                <Card.Body>
                  <h5 className="pf-label">Savings Goal</h5>
                  <Row className="align-items-end">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Target Amount</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={savingsGoal}
                          onChange={e => setSavingsGoal(Number(e.target.value) || 0)}
                          className="pf-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Savings</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={currentSavings}
                          onChange={e => setCurrentSavings(Number(e.target.value) || 0)}
                          className="pf-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <ProgressBar now={savingsProgress} label={`${savingsProgress}%`} className="pf-progress" />
                </Card.Body>
              </Card>

              <Card className="pf-card pf-categories-card">
                <Card.Body>
                  <h5 className="pf-label">Monthly Plan by Category</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Food & Dining</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={categories.food}
                          onChange={e => handleCategoryChange('food', e.target.value)}
                          className="pf-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Education</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={categories.education}
                          onChange={e => handleCategoryChange('education', e.target.value)}
                          className="pf-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cash Withdrawals</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={categories.cash}
                          onChange={e => handleCategoryChange('cash', e.target.value)}
                          className="pf-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Miscellaneous</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={categories.misc}
                          onChange={e => handleCategoryChange('misc', e.target.value)}
                          className="pf-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="pf-summary-row">
                    <span>Total planned this month</span>
                    <span className="pf-summary-amount">₹{totalPlanned}</span>
                  </div>
                </Card.Body>
              </Card>

              <Card className="pf-card pf-expense-form-card">
                <Card.Body>
                  <h5 className="pf-label">Add Expense (Day-wise)</h5>
                  <Form onSubmit={handleAddExpense}>
                    <Row>
                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label>Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={expenseForm.date}
                            onChange={e => handleExpenseInputChange('date', e.target.value)}
                            className="pf-input"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label>Category</Form.Label>
                          <Form.Select
                            value={expenseForm.category}
                            onChange={e => handleExpenseInputChange('category', e.target.value)}
                            className="pf-input"
                          >
                            <option value="FOOD">Food & Dining</option>
                            <option value="EDUCATION">Education</option>
                            <option value="CASH">Cash</option>
                            <option value="MISC">Miscellaneous</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label>Amount (₹)</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            value={expenseForm.amount}
                            onChange={e => handleExpenseInputChange('amount', e.target.value)}
                            className="pf-input"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Note</Form.Label>
                      <Form.Control
                        type="text"
                        value={expenseForm.note}
                        onChange={e => handleExpenseInputChange('note', e.target.value)}
                        className="pf-input"
                        placeholder="Optional description"
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button type="submit" className="pf-save-btn">
                        Save Expense
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right profile / analytics column */}
        <Col lg={3} className="dashboard-profile-col d-none d-lg-block">
          <Card className="dashboard-card profile-card">
            <Card.Body>
              <div className="profile-avatar">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</div>
              <h5 className="profile-name">{user?.name || 'SecureBank User'}</h5>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-stats">
                <div className="profile-stat-item">
                  <span className="label">Wallet Balance</span>
                  <span className="value">₹{accountSummary?.balance || '0.00'}</span>
                </div>
                <div className="profile-stat-item">
                  <span className="label">Savings Target</span>
                  <span className="value">₹{savingsGoal}</span>
                </div>
                <div className="profile-stat-item">
                  <span className="label">Progress</span>
                  <span className="value">{savingsProgress}%</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="dashboard-card live-visual-card pf-spending-chart-card">
            <Card.Header className="card-header-custom d-flex justify-content-between align-items-center">
              <span>Spending Analytics</span>
              {Object.keys(monthlySummary).length > 0 && (
                <Form.Select
                  size="sm"
                  value={selectedMonth}
                  onChange={async e => {
                    const value = e.target.value;
                    setSelectedMonth(value);
                    try {
                      const dailyRes = await axios.get('/api/expense/summary/daily', {
                        params: { month: value },
                      });
                      setDailySummary(dailyRes.data || {});
                      const listRes = await axios.get('/api/expense/list', {
                        params: { month: value },
                      });
                      const listData = listRes.data;
                      setMonthlyExpenses(Array.isArray(listData) ? listData : []);
                    } catch (error) {
                      // ignore
                    }
                  }}
                  className="pf-month-select"
                >
                  {Object.keys(monthlySummary)
                    .sort()
                    .map(key => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                </Form.Select>
              )}
            </Card.Header>
            <Card.Body className="pf-chart-body">
              <div className="pf-chart-wrapper">
                <canvas id="pfSpendingChart" />
              </div>
              <div className="pf-spend-summary">
                <div className="pf-spend-pill">
                  <span className="label">This month spent</span>
                  <span className="value">₹{selectedMonthTotal.toFixed(2)}</span>
                </div>
                <div className="pf-spend-pill">
                  <span className="label">Your savings</span>
                  <span className="value">₹{Number(currentSavings || 0).toFixed(2)}</span>
                </div>
                <div className={`pf-spend-pill ${remainingAgainstSavings >= 0 ? 'pf-positive' : 'pf-negative'}`}>
                  <span className="label">Remaining vs savings</span>
                  <span className="value">{remainingAgainstSavings >= 0 ? '+' : '-'}₹{Math.abs(remainingAgainstSavings).toFixed(2)}</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="dashboard-card pf-expense-list-card">
            <Card.Header className="card-header-custom">Expenses in {selectedMonth || '—'}</Card.Header>
            <Card.Body className="pf-expense-list-body">
              {Array.isArray(monthlyExpenses) && monthlyExpenses.length > 0 ? (
                <div className="pf-expense-table-wrapper">
                  <table className="pf-expense-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Amount (₹)</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyExpenses.map(exp => (
                        <tr key={exp.expenseId}>
                          <td>{exp.date}</td>
                          <td>{exp.category}</td>
                          <td>₹{exp.amount}</td>
                          <td>{exp.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="pf-empty-text">No expenses recorded for this month yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalFinance;
