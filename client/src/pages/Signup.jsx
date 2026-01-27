import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './Signup.css';

const Signup = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            await api.post('/auth/signup', { name, email, password });
            const loginRes = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', loginRes.data.token);
            alert('Signup successful! Redirecting to dashboard...');
            navigate('/');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(msg);
        }
    };

    return (
        <div className="signup-container">
            {/* Left Panel - Branding & Stats */}
            <div className="signup-left-panel">
                <div className="signup-brand">
                    <div className="signup-brand-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <h1>Join VidNotes AI</h1>
                    <p>Start transforming YouTube videos into smart study materials with AI-powered summarization.</p>
                </div>

                <div className="signup-stats">
                    <div className="signup-stat-item">
                        <span className="signup-stat-number">50K+</span>
                        <span className="signup-stat-label">Videos Processed</span>
                    </div>
                    <div className="signup-stat-item">
                        <span className="signup-stat-number">10K+</span>
                        <span className="signup-stat-label">Active Users</span>
                    </div>
                    <div className="signup-stat-item">
                        <span className="signup-stat-number">4.9</span>
                        <span className="signup-stat-label">User Rating</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="signup-right-panel">
                <div className="signup-form-wrapper">
                    <div className="signup-header">
                        <h2 className="signup-title">Create your account</h2>
                        <p className="signup-subtitle">Fill in your details to get started</p>
                    </div>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="signup-btn">
                            Create Account
                        </button>
                    </form>
                    <div className="signup-footer">
                        Already have an account?
                        <Link to="/login" className="signup-link">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
