import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Save } from 'lucide-react';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [blogUrl, setBlogUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');

    const token = localStorage.getItem('token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const handleGetSummary = async () => {
        if (!blogUrl) {
            setError('Please enter a blog URL');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        setResult(null);

        try {
            const { data } = await api.post('/blog/summary', { url: blogUrl }, authHeaders);
            setResult({ title: data.title, url: data.url, summary: data.summary });
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
        setSuccess('');
        setResult(null);

        try {
            const { data } = await api.post('/blog/notes', { url: blogUrl }, authHeaders);
            setResult({ title: data.title, url: data.url, notes: data.notes });
            setActiveTab('notes');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get notes');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result) return;

        const content = activeTab === 'summary' ? result.summary : result.notes;
        if (!content) {
            setError('No content to save');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/blog/save', {
                articleUrl: result.url || blogUrl,
                articleTitle: result.title,
                content: content,
                type: activeTab
            }, authHeaders);

            setSuccess('Saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <h1 className="nav-title">NoteWise AI</h1>
                <div className="nav-actions">
                    <button onClick={() => navigate('/saved')} className="saved-btn">
                        <BookOpen size={18} /> My Saved Notes
                    </button>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
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
                    {success && <div className="success-msg">{success}</div>}

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
                        <div className="result-header">
                            <h3>{result.title}</h3>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="save-btn"
                            >
                                <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>

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
