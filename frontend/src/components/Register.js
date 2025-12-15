import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    branchCode: 'BR001'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Default to Bright Theme
  const [isBrightTheme, setIsBrightTheme] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      setSuccess('Registration successful! Please login to continue.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className={isBrightTheme ? 'auth-page theme-bright' : 'auth-page theme-dark'}>
      {/* Theme Toggle Button */}
      <div className="homepage-theme-toggle">
        <span>Theme</span>
        <div className="theme-toggle-pill" onClick={() => setIsBrightTheme(prev => !prev)}>
          <div className={`theme-toggle-thumb ${isBrightTheme ? 'theme-toggle-thumb--bright' : 'theme-toggle-thumb--dark'}`}>
            {isBrightTheme ? 'Bright' : 'Dark'}
          </div>
        </div>
      </div>

      <Container fluid className="register-container">
        <div className="register-background">
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col md={10} lg={8} xl={6}>
              <div className="register-card-wrapper">
                <Card className="register-card shadow-lg border-0">
                  <Card.Header className="register-header text-center border-0">
                    <div className="bank-logo mb-3">
                      <i className="fas fa-university fa-3x text-primary"></i>
                    </div>
                    <h3 className="fw-bold text-primary mb-0">Join SecureBank</h3>
                    <p className="text-muted small">Create your account today</p>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {error && (
                      <Alert variant="danger" className="alert-custom">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </Alert>
                    )}
                    {success && (
                      <Alert variant="success" className="alert-success-custom">
                        <i className="fas fa-check-circle me-2"></i>
                        {success}
                      </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-user me-2"></i>Full Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Enter your full name"
                              className="form-control-custom"
                              size="lg"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-id-badge me-2"></i>Username
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              required
                              placeholder="Choose a username"
                              className="form-control-custom"
                              size="lg"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-envelope me-2"></i>Email Address
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="Enter your email"
                              className="form-control-custom"
                              size="lg"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-lock me-2"></i>Password
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              minLength={6}
                              placeholder="Enter password (min 6 characters)"
                              className="form-control-custom"
                              size="lg"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-phone me-2"></i>Phone Number
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Enter your phone number"
                              className="form-control-custom"
                              size="lg"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-building me-2"></i>Select Branch
                        </Form.Label>
                        <Form.Select
                          name="branchCode"
                          value={formData.branchCode}
                          onChange={handleChange}
                          required
                          className="form-control-custom"
                          size="lg"
                        >
                          <option value="BR001">🏢 Main Branch - North Region</option>
                          <option value="BR002">🏙️ Downtown Branch - South Region</option>
                          <option value="BR003">🌆 Westside Branch - West Region</option>
                          <option value="BR004">🌇 Eastside Branch - East Region</option>
                        </Form.Select>
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
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-user-plus me-2"></i>
                            Create Account
                          </>
                        )}
                      </Button>
                    </Form>
                    
                    <div className="text-center mt-4">
                      <div className="divider-custom">
                        <span>or</span>
                      </div>
                      <p className="text-muted mb-0">
                        Already have an account? 
                        <Link to="/login" className="text-primary fw-semibold ms-1 text-decoration-none">
                          Login here
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

export default Register;
