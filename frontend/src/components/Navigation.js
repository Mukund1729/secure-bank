import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar className="custom-navbar" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <i className="fas fa-university me-2"></i>
          <span className="brand-text">SecureBank</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler-custom" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard" className="nav-link-custom">
                  <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/personal-finance" className="nav-link-custom">
                  <i className="fas fa-wallet me-2"></i>Personal Finance
                </Nav.Link>
                <Nav.Link as={Link} to="/banking" className="nav-link-custom">
                  <i className="fas fa-university me-2"></i>Banking
                </Nav.Link>
                <Nav.Link as={Link} to="/alerts" className="nav-link-custom">
                  <i className="fas fa-bell me-2"></i>Alerts
                </Nav.Link>
                {user.role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/admin" className="nav-link-custom">
                    <i className="fas fa-cog me-2"></i>Admin Panel
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3 user-welcome">
                  <i className="fas fa-user-circle me-2"></i>
                  Welcome, <span className="user-name">{user.name || user.email}</span>
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout} className="logout-btn">
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom">
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom">
                  <i className="fas fa-user-plus me-2"></i>Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
