import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const [isBrightTheme, setIsBrightTheme] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      if (result.data.role === 'ADMIN' && from === '/dashboard') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className={isBrightTheme ? 'auth-page theme-bright' : 'auth-page theme-dark'}>
      <div className="homepage-theme-toggle">
        <span>Theme</span>
        <div className="theme-toggle-pill" onClick={() => setIsBrightTheme(prev => !prev)}>
          <div className={`theme-toggle-thumb ${isBrightTheme ? 'theme-toggle-thumb--bright' : 'theme-toggle-thumb--dark'}`}>
            {isBrightTheme ? 'Bright' : 'Dark'}
          </div>
        </div>
      </div>
      <Container fluid className="login-container">
        <div className="login-background">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6} xl={4}>
            <div className="login-card-wrapper">
              <Card className="login-card shadow-lg border-0">
                <Card.Header className="login-header text-center border-0">
                  <div className="bank-logo mb-3">
                    <i className="fas fa-university fa-3x text-primary"></i>
                  </div>
                  <h3 className="fw-bold text-primary mb-0">SecureBank</h3>
                  <p className="text-muted small">Your trusted banking partner</p>
                </Card.Header>
                <Card.Body className="p-4">
                  {error && (
                    <Alert variant="danger" className="alert-custom">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <i className="fas fa-id-badge me-2"></i>Username
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                        className="form-control-custom"
                        size="lg"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <i className="fas fa-lock me-2"></i>Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="form-control-custom"
                        size="lg"
                      />
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 btn-custom"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Login
                        </>
                      )}
                    </Button>
                  </Form>
                  
                  <div className="text-center mt-4">
                    <div className="divider-custom">
                      <span>or</span>
                    </div>
                    <p className="text-muted mb-0">
                      Don't have an account? 
                      <Link to="/register" className="text-primary fw-semibold ms-1 text-decoration-none">
                        Register here
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
        </div>
      </Container>
    </div>
  );
};

export default Login;
