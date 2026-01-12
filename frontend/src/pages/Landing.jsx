import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const [activeWorkers, setActiveWorkers] = useState(12482);
  const [attendanceRate, setAttendanceRate] = useState(98.4);
  const [tasksCompleted, setTasksCompleted] = useState(3912);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [isInsideZone, setIsInsideZone] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Simulate live counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkers(prev => prev + Math.floor(Math.random() * 3 - 1));
      setAttendanceRate(prev => Math.min(99.9, prev + (Math.random() * 0.2 - 0.1)));
      setTasksCompleted(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animate performance score
  useEffect(() => {
    const timer = setTimeout(() => {
      if (performanceScore < 9.2) {
        setPerformanceScore(prev => Math.min(9.2, prev + 0.1));
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [performanceScore]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      const response = await fetch('/api/leaves'); // Adjust the endpoint as necessary
      const data = await response.json();
      setLeaveRequests(data.leaves); // Assuming the response has a 'leaves' field
    };

    fetchLeaveRequests();
  }, []);

  const handleZoneEntry = () => {
    setIsInsideZone(true);
  };

  const handleMarkAttendance = () => {
    if (isInsideZone) {
      setAttendanceMarked(true);
    }
  };

  const handleApproval = async (leaveId) => {
    const response = await fetch(`/api/leaves/${leaveId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Approved' }),
    });

    if (response.ok) {
      // Update the state to reflect the change
      setLeaveRequests(prev => prev.map(leave => leave.id === leaveId ? { ...leave, status: 'Approved' } : leave));
    } else {
      console.error('Failed to approve leave request');
    }
  };

  const handleRejection = async (leaveId) => {
    const response = await fetch(`/api/leaves/${leaveId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Rejected' }),
    });

    if (response.ok) {
      // Update the state to reflect the change
      setLeaveRequests(prev => prev.map(leave => leave.id === leaveId ? { ...leave, status: 'Rejected' } : leave));
    } else {
      console.error('Failed to reject leave request');
    }
  };

  const roleMetrics = {
    admin: {
      title: 'Admin Command Center',
      metrics: [
        { label: 'Active Workforce', value: activeWorkers, suffix: '' },
        { label: 'Department Efficiency', value: '94.2', suffix: '%' },
        { label: 'AI Alerts Today', value: '23', suffix: '' }
      ]
    },
    employee: {
      title: 'Your Performance Dashboard',
      metrics: [
        { label: 'Your Score', value: '9.2', suffix: '/10' },
        { label: 'Attendance Rate', value: '98', suffix: '%' },
        { label: 'Tasks Completed', value: '847', suffix: '' }
      ]
    },
    candidate: {
      title: 'Application Status',
      metrics: [
        { label: 'Skill Match', value: '92', suffix: '%' },
        { label: 'Position Rank', value: '7', suffix: '/150' },
        { label: 'Interview Stage', value: '2', suffix: '/3' }
      ]
    },
    citizen: {
      title: 'Public Transparency View',
      metrics: [
        { label: 'Service Active', value: '98', suffix: '%' },
        { label: 'Efficiency Index', value: '92', suffix: '%' },
        { label: 'Response Time', value: '12', suffix: 'min' }
      ]
    }
  };

  const topPerformers = [
    { name: 'Rajesh Kumar', dept: 'Sanitation', score: 9.8 },
    { name: 'Priya Singh', dept: 'Public Works', score: 9.6 },
    { name: 'Amit Verma', dept: 'Health Services', score: 9.4 },
    { name: 'Sneha Patel', dept: 'Administration', score: 9.3 },
    { name: 'Arjun Mehta', dept: 'Engineering', score: 9.1 }
  ];

  const aiInsights = [
    { icon: '⚠', text: 'Staff shortage predicted in Zone B (7 days)', type: 'warning' },
    { icon: '⬆', text: 'Sanitation efficiency improved by 14%', type: 'success' },
    { icon: '⭐', text: 'Ward 12 – Top performing zone today', type: 'highlight' }
  ];

  return (
    <div className="landing-page">
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      {/* Header Navigation */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 50 50" fill="none">
              <rect x="10" y="15" width="8" height="20" fill="#00f0ff"/>
              <rect x="21" y="10" width="8" height="25" fill="#00f0ff"/>
              <rect x="32" y="12" width="8" height="23" fill="#00f0ff"/>
              <circle cx="25" cy="25" r="20" stroke="#00f0ff" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M25 5 L35 15 M25 5 L15 15" stroke="#0ff" strokeWidth="2"/>
            </svg>
            <span className="logo-text">Nagar-Yukt-HRMS</span>
          </div>
          <nav className="nav">
            <Link to="/platform">Platform</Link>
            <Link to="/solutions">Solutions</Link>
            <Link to="/transparency">Transparency</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Living City Dashboard */}
      <section className="hero-command">
        <div className="city-grid-background"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="command-title">
              A Real-Time Operating System for<br/>
              <span className="gradient-text">Municipal Workforce Transparency</span>
            </h1>
            <p className="command-subtitle">
              Know where your workforce is. Know how they perform. Decide without bias.
            </p>

            {/* Live Stats Counters */}
            <div className="live-stats">
              <div className="stat-card pulsing">
                <div className="stat-value">{activeWorkers.toLocaleString()}</div>
                <div className="stat-label">Workers Active Now</div>
                <div className="live-indicator">● LIVE</div>
              </div>
              <div className="stat-card pulsing">
                <div className="stat-value">{attendanceRate.toFixed(1)}%</div>
                <div className="stat-label">Attendance Accuracy Today</div>
                <div className="live-indicator">● LIVE</div>
              </div>
              <div className="stat-card pulsing">
                <div className="stat-value">{tasksCompleted.toLocaleString()}</div>
                <div className="stat-label">Tasks Completed Today</div>
                <div className="live-indicator">● LIVE</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="hero-cta">
              <button className="btn-primary">Explore the Command Center</button>
              <button className="btn-secondary">See Jio-Hazari in Action</button>
            </div>
          </div>

          {/* Animated City Map */}
          <div className="city-map-container">
            <svg className="city-visualization" viewBox="0 0 600 400">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <radialGradient id="activeGlow" cx="50%" cy="50%">
                  <stop offset="0%" style={{stopColor: '#00ff88', stopOpacity: 0.8}} />
                  <stop offset="100%" style={{stopColor: '#00ff88', stopOpacity: 0}} />
                </radialGradient>
              </defs>

              {/* Grid */}
              <g className="grid-lines">
                {[...Array(15)].map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 30} x2="600" y2={i * 30} 
                        stroke="rgba(0,240,255,0.1)" strokeWidth="0.5"/>
                ))}
                {[...Array(20)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="400" 
                        stroke="rgba(0,240,255,0.1)" strokeWidth="0.5"/>
                ))}
              </g>

              {/* Zones */}
              <rect x="50" y="50" width="200" height="150" fill="none" 
                    stroke="#00ff88" strokeWidth="2" strokeDasharray="10,5" opacity="0.4"/>
              <text x="150" y="40" fill="#00ff88" fontSize="12" textAnchor="middle">Zone A - 98% Active</text>

              <rect x="350" y="100" width="200" height="180" fill="none" 
                    stroke="#ffc800" strokeWidth="2" strokeDasharray="10,5" opacity="0.4"/>
              <text x="450" y="90" fill="#ffc800" fontSize="12" textAnchor="middle">Zone B - 87% Active</text>

              {/* Worker Dots - Green (Active) */}
              {[...Array(80)].map((_, i) => {
                const x = 50 + (i % 10) * 20 + Math.random() * 15;
                const y = 50 + Math.floor(i / 10) * 20 + Math.random() * 15;
                return (
                  <circle key={`green${i}`} cx={x} cy={y} r="2" fill="#00ff88" 
                          filter="url(#glow)" className="worker-dot active">
                    <animate attributeName="opacity" values="0.5;1;0.5" 
                             dur={`${2 + Math.random()}s`} repeatCount="indefinite"/>
                  </circle>
                );
              })}

              {/* Worker Dots - Amber (Break) */}
              {[...Array(20)].map((_, i) => {
                const x = 350 + (i % 5) * 25 + Math.random() * 15;
                const y = 100 + Math.floor(i / 5) * 30 + Math.random() * 15;
                return (
                  <circle key={`amber${i}`} cx={x} cy={y} r="2" fill="#ffc800" 
                          filter="url(#glow)" className="worker-dot break">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" 
                             dur={`${2.5 + Math.random()}s`} repeatCount="indefinite"/>
                  </circle>
                );
              })}

              {/* Worker Dots - Red (Inactive) */}
              {[...Array(8)].map((_, i) => {
                const x = 350 + Math.random() * 200;
                const y = 100 + Math.random() * 180;
                return (
                  <circle key={`red${i}`} cx={x} cy={y} r="2" fill="#ff4444" 
                          opacity="0.6" className="worker-dot inactive"/>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-dot active"></span> Active
              </div>
              <div className="legend-item">
                <span className="legend-dot break"></span> On Break
              </div>
              <div className="legend-item">
                <span className="legend-dot inactive"></span> Inactive
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Interactive Toggle */}
      <section className="role-selector">
        <div className="container">
          <div className="role-toggle">
            <button 
              className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              Admin / HR
            </button>
            <button 
              className={`role-btn ${selectedRole === 'employee' ? 'active' : ''}`}
              onClick={() => setSelectedRole('employee')}
            >
              Employee
            </button>
            <button 
              className={`role-btn ${selectedRole === 'candidate' ? 'active' : ''}`}
              onClick={() => setSelectedRole('candidate')}
            >
              Candidate
            </button>
            <button 
              className={`role-btn ${selectedRole === 'citizen' ? 'active' : ''}`}
              onClick={() => setSelectedRole('citizen')}
            >
              Citizen
            </button>
          </div>

          {/* Dynamic Dashboard Preview */}
          <div className="role-dashboard">
            <h2 className="dashboard-title">{roleMetrics[selectedRole].title}</h2>
            <div className="role-metrics">
              {roleMetrics[selectedRole].metrics.map((metric, index) => (
                <div key={index} className="metric-card morphing">
                  <div className="metric-value">
                    {metric.value}
                    <span className="metric-suffix">{metric.suffix}</span>
                  </div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jio-Hazari Geo-Fenced Attendance Demo */}
      <section className="jio-hazari-demo">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Jio-Hazari — Location-Verified Attendance</h2>
            <p className="section-subtitle">Eliminates ghost workers. Creates audit-proof records.</p>
          </div>

          <div className="demo-container">
            <div className="demo-left">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="phone-header">
                    <div className="time">9:41</div>
                    <div className="status-icons">📶 📡 🔋</div>
                  </div>
                  
                  <div className="geo-map">
                    <div className="geo-zone" style={{ 
                      border: isInsideZone ? '3px solid #00ff88' : '3px solid #666',
                      animation: isInsideZone ? 'zoneActive 2s ease infinite' : 'none'
                    }}>
                      <div className="zone-label">Municipal Office</div>
                    </div>
                    <div className={`user-location ${isInsideZone ? 'inside' : 'outside'}`}>
                      📍
                    </div>
                  </div>

                  {attendanceMarked ? (
                    <div className="attendance-success">
                      <div className="success-icon">✔</div>
                      <div className="success-text">Attendance Verified</div>
                      <div className="timestamp">09:41 AM | Location Verified</div>
                    </div>
                  ) : (
                    <button 
                      className={`mark-attendance-btn ${isInsideZone ? 'enabled' : 'disabled'}`}
                      onClick={handleMarkAttendance}
                      disabled={!isInsideZone}
                    >
                      {isInsideZone ? '✓ Mark Attendance' : '🔒 Outside Zone'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="demo-right">
              <div className="demo-controls">
                <h3>Try it yourself:</h3>
                <button 
                  className="demo-btn"
                  onClick={handleZoneEntry}
                  disabled={isInsideZone}
                >
                  {isInsideZone ? '✓ Inside Zone' : 'Simulate Zone Entry'}
                </button>
                <button 
                  className="demo-btn secondary"
                  onClick={() => {
                    setIsInsideZone(false);
                    setAttendanceMarked(false);
                  }}
                >
                  Reset Demo
                </button>
              </div>

              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Location-locked attendance</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📍</span>
                  <span>GPS + Geo-fence verification</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⏰</span>
                  <span>Timestamp + location logged</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Audit-proof records</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Performance Engine */}
      <section className="performance-engine">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">AI Performance Engine — Merit Visualized</h2>
            <p className="section-subtitle">Scores that cannot be argued with.</p>
          </div>

          <div className="performance-container">
            <div className="score-dial">
              <svg viewBox="0 0 200 200" className="dial-svg">
                <circle cx="100" cy="100" r="80" fill="none" 
                        stroke="rgba(255,255,255,0.1)" strokeWidth="15"/>
                <circle cx="100" cy="100" r="80" fill="none" 
                        stroke="#00ff88" strokeWidth="15"
                        strokeDasharray={`${(performanceScore / 10) * 502.4} 502.4`}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        className="score-arc"/>
                <text x="100" y="95" textAnchor="middle" 
                      fill="#fff" fontSize="36" fontWeight="bold">
                  {performanceScore.toFixed(1)}
                </text>
                <text x="100" y="115" textAnchor="middle" 
                      fill="rgba(255,255,255,0.6)" fontSize="14">
                  / 10
                </text>
              </svg>
              <div className="score-label">Overall Performance Score</div>
            </div>

            <div className="performance-factors">
              <div className="factor-item">
                <div className="factor-label">Attendance Punctuality</div>
                <div className="factor-bar">
                  <div className="factor-fill" style={{width: '95%'}}></div>
                </div>
                <div className="factor-value">95%</div>
              </div>
              <div className="factor-item">
                <div className="factor-label">Task Completion Rate</div>
                <div className="factor-bar">
                  <div className="factor-fill" style={{width: '92%'}}></div>
                </div>
                <div className="factor-value">92%</div>
              </div>
              <div className="factor-item">
                <div className="factor-label">Citizen Feedback Score</div>
                <div className="factor-bar">
                  <div className="factor-fill" style={{width: '89%'}}></div>
                </div>
                <div className="factor-value">4.5/5.0</div>
              </div>
              <div className="factor-item">
                <div className="factor-label">Supervisor Validation</div>
                <div className="factor-bar">
                  <div className="factor-fill" style={{width: '97%'}}></div>
                </div>
                <div className="factor-value">97%</div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="leaderboard">
            <h3>Top Performers — City Wide</h3>
            <div className="leaderboard-scroll">
              {topPerformers.map((performer, index) => (
                <div key={index} className="performer-card">
                  <div className="performer-rank">#{index + 1}</div>
                  <div className="performer-info">
                    <div className="performer-name">{performer.name}</div>
                    <div className="performer-dept">{performer.dept}</div>
                  </div>
                  <div className="performer-score">{performer.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admin Command Center */}
      <section className="admin-command">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Admin Command Center — God Mode</h2>
            <p className="section-subtitle">Decision intelligence, not record keeping.</p>
          </div>

          <div className="command-grid">
            {/* Heatmap */}
            <div className="command-card">
              <h4>Workforce Distribution Heatmap</h4>
              <div className="heatmap-grid">
                {[...Array(36)].map((_, i) => {
                  const intensity = Math.random();
                  return (
                    <div 
                      key={i} 
                      className="heatmap-cell"
                      style={{
                        backgroundColor: intensity > 0.7 ? '#00ff88' : 
                                       intensity > 0.4 ? '#00f0ff' : 
                                       intensity > 0.2 ? '#ffc800' : '#ff4444',
                        opacity: 0.3 + (intensity * 0.7)
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>

            {/* Department Strength */}
            <div className="command-card">
              <h4>Department Strength</h4>
              <svg viewBox="0 0 200 200" className="dept-chart">
                <circle cx="100" cy="100" r="70" fill="none" 
                        stroke="#2563a0" strokeWidth="40"/>
                <circle cx="100" cy="100" r="70" fill="none" 
                        stroke="#00ff88" strokeWidth="40"
                        strokeDasharray="180 440"
                        transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="70" fill="none" 
                        stroke="#00f0ff" strokeWidth="40"
                        strokeDasharray="110 440"
                        strokeDashoffset="-180"
                        transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="70" fill="none" 
                        stroke="#ffc800" strokeWidth="40"
                        strokeDasharray="90 440"
                        strokeDashoffset="-290"
                        transform="rotate(-90 100 100)"/>
              </svg>
              <div className="dept-legend">
                <div><span style={{background: '#00ff88'}}></span> Sanitation (40%)</div>
                <div><span style={{background: '#00f0ff'}}></span> Public Works (25%)</div>
                <div><span style={{background: '#ffc800'}}></span> Health (20%)</div>
                <div><span style={{background: '#2563a0'}}></span> Admin (15%)</div>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="command-card">
              <h4>Performance Trends (30 Days)</h4>
              <svg viewBox="0 0 300 150" className="trend-chart">
                <polyline 
                  points="10,120 40,100 70,110 100,80 130,90 160,60 190,70 220,50 250,45 280,30"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="3"
                  filter="url(#glow)"
                />
                <line x1="10" y1="130" x2="290" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              </svg>
            </div>
          </div>

          {/* AI Insight Cards */}
          <div className="ai-insights">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <span className="insight-icon">{insight.icon}</span>
                <span className="insight-text">{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Recruitment */}
      <section className="recruitment-engine">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">AI-Powered Recruitment Engine</h2>
            <p className="section-subtitle">Faster hiring. Reduced bias. Best-fit talent automatically surfaced.</p>
          </div>

          <div className="recruitment-flow">
            <div className="flow-step">
              <div className="flow-icon">📝</div>
              <div className="flow-label">Job Description</div>
              <div className="flow-arrow">→</div>
            </div>
            <div className="flow-step">
              <div className="flow-icon">🤖</div>
              <div className="flow-label">AI Analysis</div>
              <div className="flow-arrow">→</div>
            </div>
            <div className="flow-step">
              <div className="flow-icon">🎯</div>
              <div className="flow-label">Skill Matching</div>
              <div className="flow-arrow">→</div>
            </div>
            <div className="flow-step">
              <div className="flow-icon">⭐</div>
              <div className="flow-label">Ranked Shortlist</div>
            </div>
          </div>

          <div className="candidate-matches">
            <div className="candidate-card">
              <div className="candidate-name">Candidate A</div>
              <div className="skill-match">
                <div className="skill-label">Skill Match</div>
                <div className="skill-bar">
                  <div className="skill-fill" style={{width: '94%'}}></div>
                </div>
                <div className="skill-percent">94%</div>
              </div>
            </div>
            <div className="candidate-card">
              <div className="candidate-name">Candidate B</div>
              <div className="skill-match">
                <div className="skill-label">Skill Match</div>
                <div className="skill-bar">
                  <div className="skill-fill" style={{width: '89%'}}></div>
                </div>
                <div className="skill-percent">89%</div>
              </div>
            </div>
            <div className="candidate-card">
              <div className="candidate-name">Candidate C</div>
              <div className="skill-match">
                <div className="skill-label">Skill Match</div>
                <div className="skill-bar">
                  <div className="skill-fill" style={{width: '86%'}}></div>
                </div>
                <div className="skill-percent">86%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Transparency View */}
      <section className="citizen-transparency">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Public Transparency Dashboard</h2>
            <p className="section-subtitle">Building trust through data.</p>
          </div>

          <div className="transparency-stats">
            <div className="transparency-card">
              <div className="transparency-value">98%</div>
              <div className="transparency-label">Sanitation Staff Active Today</div>
            </div>
            <div className="transparency-card">
              <div className="transparency-value">92%</div>
              <div className="transparency-label">Public Service Efficiency Index</div>
            </div>
          </div>

          {/* Trust Meter */}
          <div className="trust-meter">
            <h3>Public Trust Improvement</h3>
            <div className="trust-comparison">
              <div className="trust-before">
                <div className="trust-label">Before NexusPrep</div>
                <div className="trust-gauge">
                  <div className="trust-fill before" style={{width: '45%'}}></div>
                </div>
                <div className="trust-value">45%</div>
              </div>
              <div className="trust-after">
                <div className="trust-label">After NexusPrep</div>
                <div className="trust-gauge">
                  <div className="trust-fill after" style={{width: '87%'}}></div>
                </div>
                <div className="trust-value">87%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="cityscape-background"></div>
        <div className="container">
          <h2 className="final-statement">
            Run Your Municipality on Truth,<br/>
            Not Assumptions.
          </h2>
          <div className="final-buttons">
            <button className="btn-primary large">Request Demo</button>
            <button className="btn-secondary large">Partner With Us</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/compliance">Government Compliance</Link>
            <Link to="/contact">Contact Support</Link>
          </div>
          
          <div className="footer-copyright">
            <p>&copy; 2026 NexusPrep Municipal Systems. Built for Public Trust.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;