import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';
import './Signup.css';

const Signup = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await api.post('/auth/signup', { name, email, password });
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-right-panel">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="signup-form-wrapper">
                    <h2 className="signup-title">Create account</h2>
                    <p className="signup-subtitle">
                        Join <strong>NoteWise AI</strong> to get started
                    </p>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Create a strong password"
                                required
                            />
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
