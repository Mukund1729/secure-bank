import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './AnimatedStats.css';

const AnimatedStats = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [counters, setCounters] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Fetch real stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userCount, transactionTotal, loanStats] = await Promise.all([
          axios.get('/api/admin/users/count').catch(() => ({ data: { count: 0 } })),
          axios.get('/api/transaction/total-amount').catch(() => ({ data: { totalAmount: 0 } })),
          axios.get('/api/admin/loans/stats').catch(() => ({ data: { totalLoans: 0, totalAmount: 0 } })),
        ]);

        const users = userCount.data.count || 0;
        const transactions = transactionTotal.data.totalAmount || 0;
        const loans = loanStats.data.totalAmount || 0;

        const realStats = [
          { 
            number: users, 
            label: 'Active Users', 
            icon: 'fas fa-users', 
            delay: 0, 
            target: users,
            format: 'number'
          },
          { 
            number: transactions, 
            label: 'Total Transactions Processed',
            prefix: '₹',
            icon: 'fas fa-exchange-alt', 
            delay: 0.1, 
            target: transactions,
            format: 'currency'
          },
          { 
            number: loans, 
            label: 'Loans Disbursed',
            prefix: '₹',
            label: 'Loans Disbursed', 
            icon: 'fas fa-handshake', 
            delay: 0.2, 
            target: loans,
            format: 'currency'
          },
          { 
            number: 99.9, 
            label: 'System Uptime', 
            icon: 'fas fa-shield-alt', 
            delay: 0.3, 
            target: 99.9,
            format: 'percent'
          },
        ];

        setStatsData(realStats);
        setCounters(realStats.map(() => 0));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Memoized counter increment logic
  const incrementCounter = useCallback((idx, target, step) => {
    setCounters((prev) => {
      const newCounters = [...prev];
      newCounters[idx] = Math.min(prev[idx] + step, target);
      return newCounters;
    });
  }, []);

  // Animation effect with cleanup
  useEffect(() => {
    if (!isVisible || hasAnimated || !statsData) return;

    const intervals = statsData.map((stat, idx) => {
      const target = stat.target;
      const step = target / 40;
      
      const interval = setInterval(() => {
        incrementCounter(idx, target, step);
      }, 30);
      return interval;
    });

    setHasAnimated(true);
    return () => intervals.forEach(clearInterval);
  }, [isVisible, hasAnimated, statsData, incrementCounter]);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.animated-stats-section');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  // Format display number with useCallback - handles real data
  const formatNumber = useCallback((num, idx) => {
    if (!statsData || !statsData[idx]) return '0';
    const stat = statsData[idx];
    
    switch (stat.format) {
      case 'currency':
        if (num >= 1000000000) return '$' + (num / 1000000000).toFixed(2) + 'B';
        if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return '$' + (num / 1000).toFixed(2) + 'K';
        return '$' + num.toFixed(2);
      case 'number':
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
        return Math.floor(num).toString();
      case 'percent':
        return num.toFixed(1) + '%';
      default:
        return num.toString();
    }
  }, [statsData]);

  return (
    <section className="animated-stats-section">
      <div className="stats-background">
        <div className="stats-glow-1"></div>
        <div className="stats-glow-2"></div>
        <div className="stats-glow-3"></div>
      </div>
      {loading ? (
        <div className="stats-loader">
          <div className="loader-spinner"></div>
          <p>Loading statistics...</p>
        </div>
      ) : (
        <Row className="stats-container">
          {statsData && statsData.map((stat, index) => (
            <Col md={6} lg={3} key={`stat-${index}`} className="stat-wrapper">
              <div
                className={`stat-card ${hoveredIndex === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  animation: `slideUp 0.6s ease-out ${stat.delay}s both`,
                }}
                role="article"
                aria-label={`${stat.label}: ${formatNumber(counters[index], index)}`}
              >
                <div className="stat-inner">
                  <div className="stat-icon">
                    <i className={stat.icon}></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">
                      {isVisible ? formatNumber(counters[index], index) : '0'}
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
                <div className="stat-shine"></div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default AnimatedStats;
