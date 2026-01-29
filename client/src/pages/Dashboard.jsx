import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
    const [blogUrl, setBlogUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');

    const handleGetSummary = async () => {
        if (!blogUrl) {
            setError('Please enter a blog URL');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const { data } = await api.post('/blog/summary',
                { url: blogUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult({ title: data.title, summary: data.summary });
            setActiveTab('summary');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get summary');
        } finally {
            setLoading(false);
        }
    };

    const handleGetNotes = async () => {
        if (!blogUrl) {
            setError('Please enter a blog URL');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const { data } = await api.post('/blog/notes',
                { url: blogUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult({ title: data.title, notes: data.notes });
            setActiveTab('notes');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get notes');
        } finally {
            setLoading(false);
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <h1 className="nav-title">NoteWise AI</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </nav>

            <main className="dashboard-main">
                <div className="input-section">
                    <h2>Generate Notes from Blog</h2>
                    <p className="input-desc">Enter a blog/article URL to generate summary and study notes</p>

                    <div className="input-group">
                        <label>Blog / Article URL</label>
                        <input
                            type="text"
                            value={blogUrl}
                            onChange={(e) => setBlogUrl(e.target.value)}
                            placeholder="Enter a blog/article URL"
                            className="url-input"
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <div className="btn-group">
                        <button onClick={handleGetSummary} disabled={loading} className="action-btn summary-btn">
                            {loading ? 'Loading...' : 'Get Summary'}
                        </button>
                        <button onClick={handleGetNotes} disabled={loading} className="action-btn notes-btn">
                            {loading ? 'Loading...' : 'Get Notes'}
                        </button>

                    </div>
                </div>

                {loading && (
                    <div className="loading-section">
                        <div className="spinner"></div>
                        <p>Processing blog... This may take a moment.</p>
                    </div>
                )}

                {result && (
                    <div className="result-section">
                        <h3>{result.title}</h3>

                        {(result.summary && result.notes) && (
                            <div className="tabs">
                                <button
                                    className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('summary')}
                                >
                                    Summary
                                </button>
                                <button
                                    className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('notes')}
                                >
                                    Notes
                                </button>
                            </div>
                        )}

                        <div className="content-box markdown-content">
                            {activeTab === 'summary' && result.summary && (
                                <ReactMarkdown>{result.summary}</ReactMarkdown>
                            )}
                            {activeTab === 'notes' && result.notes && (
                                <ReactMarkdown>{result.notes}</ReactMarkdown>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
