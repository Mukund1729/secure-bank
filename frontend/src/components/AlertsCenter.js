import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';

const AlertsCenter = () => {
  const location = useLocation();
  return (
    <div className="dashboard-container">
      <Row className="dashboard-shell">
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

        <Col lg={7} className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h2>Notifications & Alerts</h2>
              <p className="header-subtitle">Monitor important banking alerts, reminders, and insights.</p>
            </div>
          </div>

          <Row className="mb-4">
            <Col>
              <Card className="dashboard-card">
                <Card.Header className="card-header-custom">Recent Alerts</Card.Header>
                <Card.Body>
                  <p>List of recent security alerts, low balance (₹) warnings, and transaction notifications.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="dashboard-card">
                <Card.Header className="card-header-custom">Upcoming Reminders</Card.Header>
                <Card.Body>
                  <p>Space for bill due dates, EMI reminders, and goal notifications.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col lg={3} className="dashboard-profile-col d-none d-lg-block">
          <Card className="dashboard-card live-visual-card">
            <Card.Header className="card-header-custom">Alert Summary</Card.Header>
            <Card.Body className="three-d-card-body charts-body">
              <p className="charts-caption">Tiny charts or counters for unread alerts can go here.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AlertsCenter;
