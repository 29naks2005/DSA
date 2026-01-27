import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './Login.css';

const Login = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            alert('Login successful!');
            navigate('/');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
        }
    };

    return (
        <div className="login-container">
            {/* Left Panel - Branding & Features */}
            <div className="login-left-panel">
                <div className="login-brand">
                    <div className="login-brand-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </div>
                    <h1>VidNotes AI</h1>
                    <p>Transform lengthy YouTube videos into concise summaries and structured study notes powered by artificial intelligence.</p>
                </div>

                <div className="login-features">
                    <div className="login-feature-item">
                        <div className="login-feature-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span>Instant Video Summaries</span>
                    </div>
                    <div className="login-feature-item">
                        <div className="login-feature-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span>AI-Generated Study Notes</span>
                    </div>
                    <div className="login-feature-item">
                        <div className="login-feature-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span>Key Takeaways Extraction</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="login-right-panel">
                <div className="login-form-wrapper">
                    <div className="login-header">
                        <h2 className="login-title">Welcome back</h2>
                        <p className="login-subtitle">Enter your credentials to access your account</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-btn">
                            Sign In
                        </button>
                    </form>
                    <div className="login-footer">
                        Don't have an account?
                        <Link to="/signup" className="login-link">Create account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
