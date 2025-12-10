import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SecureLock3D from './SecureLock3D';
import AnimatedStats from './AnimatedStats';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBrightTheme, setIsBrightTheme] = useState(true);

  return (
    <div className={`homepage ${isBrightTheme ? 'homepage--bright' : 'homepage--dark'}`}>
      <div className="homepage-theme-toggle">
        <span>Theme</span>
        <div className="theme-toggle-pill" onClick={() => setIsBrightTheme(prev => !prev)}>
          <div className={`theme-toggle-thumb ${isBrightTheme ? 'theme-toggle-thumb--bright' : 'theme-toggle-thumb--dark'}`}>
            {isBrightTheme ? 'Bright' : 'Dark'}
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center hero-row">
            <Col lg={6} className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  <i className="fas fa-university me-3"></i>
                  SecureBank
                </h1>
                <p className="hero-subtitle">Your Trusted Banking Partner</p>
                <p className="hero-description">
                  Experience secure, RBI-grade digital banking with instant transfers, intelligent insights, and everyday convenience. Manage all your accounts, cards, and goals in one protected place.
                </p>
                <div className="hero-buttons">
                  {!user ? (
                    <>
                      <Button 
                        size="lg" 
                        className="btn-primary-custom me-3"
                        onClick={() => navigate('/login')}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>Login
                      </Button>
                      <Button 
                        size="lg" 
                        className="btn-secondary-custom"
                        onClick={() => navigate('/register')}
                      >
                        <i className="fas fa-user-plus me-2"></i>Open Account
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="lg" 
                      className="btn-primary-custom"
                      onClick={() => navigate('/dashboard')}
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>Go to Dashboard
                    </Button>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={6} className="hero-image">
              <div className="hero-orb-wrapper">
                <SecureLock3D />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Why Choose SecureBank?</h2>
              <p className="section-subtitle">Everything you need for modern banking</p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={6} lg={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-lock"></i>
                </div>
                <Card.Body>
                  <Card.Title>Bank-Grade Security</Card.Title>
                  <Card.Text>
                    Your money is protected with industry-leading encryption and multi-factor authentication for peace of mind.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <Card.Body>
                  <Card.Title>Instant Transactions</Card.Title>
                  <Card.Text>
                    Send money instantly to anyone, anytime. No waiting periods, no hidden fees, just seamless transfers.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <Card.Body>
                  <Card.Title>Smart Analytics</Card.Title>
                  <Card.Text>
                    Track your spending patterns and get insights into your financial habits with our advanced PFM tools.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <Card.Body>
                  <Card.Title>Easy Loans</Card.Title>
                  <Card.Text>
                    Get quick access to loans with competitive interest rates. Apply in minutes with instant approval decisions.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <Card.Body>
                  <Card.Title>Mobile First</Card.Title>
                  <Card.Text>
                    Bank on the go with our responsive platform. Access your accounts from any device, anywhere, anytime.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <Card.Body>
                  <Card.Title>24/7 Support</Card.Title>
                  <Card.Text>
                    Our dedicated support team is always ready to help. Get assistance whenever you need it, round the clock.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Our Services</h2>
              <p className="section-subtitle">Comprehensive banking solutions tailored for you</p>
            </Col>
          </Row>

          <Row className="g-4 align-items-center">
            <Col lg={6}>
              <div className="services-image">
                <div className="service-circle">
                  <i className="fas fa-wallet"></i>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="services-content">
                <h3>Account Management</h3>
                <p>
                  Manage multiple accounts with ease. Check balance, view statements, and monitor transactions in real-time.
                </p>
                <ul className="services-list">
                  <li><i className="fas fa-check-circle me-2"></i>Savings & Checking Accounts</li>
                  <li><i className="fas fa-check-circle me-2"></i>Real-time Balance Updates</li>
                  <li><i className="fas fa-check-circle me-2"></i>Transaction History</li>
                  <li><i className="fas fa-check-circle me-2"></i>Branch Locator</li>
                </ul>
              </div>
            </Col>
          </Row>

          <Row className="g-4 align-items-center mt-5">
            <Col lg={6} className="order-lg-last">
              <div className="services-image">
                <div className="service-circle">
                  <i className="fas fa-exchange-alt"></i>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="services-content">
                <h3>Money Transfer</h3>
                <p>
                  Send money instantly to friends, family, or business associates worldwide with competitive exchange rates.
                </p>
                <ul className="services-list">
                  <li><i className="fas fa-check-circle me-2"></i>Domestic & International Transfers</li>
                  <li><i className="fas fa-check-circle me-2"></i>Low Fees & Rates</li>
                  <li><i className="fas fa-check-circle me-2"></i>Instant Notifications</li>
                  <li><i className="fas fa-check-circle me-2"></i>Recurring Transfers</li>
                </ul>
              </div>
            </Col>
          </Row>

          <Row className="g-4 align-items-center mt-5">
            <Col lg={6}>
              <div className="services-image">
                <div className="service-circle">
                  <i className="fas fa-coins"></i>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="services-content">
                <h3>Loans & Advances</h3>
                <p>
                  Get instant access to personal loans with minimal documentation and competitive interest rates.
                </p>
                <ul className="services-list">
                  <li><i className="fas fa-check-circle me-2"></i>Instant Approval</li>
                  <li><i className="fas fa-check-circle me-2"></i>Flexible Tenure Options</li>
                  <li><i className="fas fa-check-circle me-2"></i>EMI Calculator</li>
                  <li><i className="fas fa-check-circle me-2"></i>Minimal Documentation</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <AnimatedStats />

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="text-center">
            <Col>
              <h2>Ready to Join SecureBank?</h2>
              <p>Start your banking journey today. It takes just 2 minutes to open an account.</p>
              <Button 
                size="lg" 
                className="btn-cta"
                onClick={() => navigate('/register')}
              >
                <i className="fas fa-arrow-right me-2"></i>Get Started Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <Container>
          <Row className="mb-4">
            <Col md={3} className="footer-column">
              <h5>SecureBank</h5>
              <p>Your trusted partner in digital banking.</p>
            </Col>
            <Col md={3} className="footer-column">
              <h5>Services</h5>
              <ul className="footer-links">
                <li><a href="#accounts">Accounts</a></li>
                <li><a href="#transfers">Transfers</a></li>
                <li><a href="#loans">Loans</a></li>
                <li><a href="#analytics">Analytics</a></li>
              </ul>
            </Col>
            <Col md={3} className="footer-column">
              <h5>Company</h5>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </Col>
            <Col md={3} className="footer-column">
              <h5>Legal</h5>
              <ul className="footer-links">
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#security">Security</a></li>
              </ul>
            </Col>
          </Row>
          <Row className="border-top pt-4">
            <Col className="text-center">
              <p className="mb-0">&copy; 2024 SecureBank. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
