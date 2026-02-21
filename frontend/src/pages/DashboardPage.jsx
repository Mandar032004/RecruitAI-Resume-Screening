import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, User, CheckCircle, XCircle, Clock, TrendingUp, ChevronUp, ChevronDown, Upload, Trash2, RefreshCw, Mail, Phone, Award } from 'lucide-react';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: Clock },
    shortlisted: { label: 'Shortlisted', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
    rejected: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
    on_hold: { label: 'On Hold', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Clock },
};

const SCORE_COLOR = (s) => s >= 75 ? '#10b981' : s >= 50 ? '#6366f1' : s >= 30 ? '#f59e0b' : '#ef4444';

function ScoreBadge({ score }) {
    const color = SCORE_COLOR(score);
    return (
        <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: `3px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, fontWeight: 800, fontSize: 14,
            background: `${color}12`,
            flexShrink: 0,
        }}>
            {score}
        </div>
    );
}

function CandidateRow({ candidate, onStatusChange, onClick, selected }) {
    const cfg = STATUS_CONFIG[candidate.status] || STATUS_CONFIG.pending;
    const StatusIcon = cfg.icon;

    return (
        <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                background: selected ? 'rgba(99,102,241,0.06)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.15s',
            }}
            whileHover={{ backgroundColor: 'rgba(99,102,241,0.04)' }}
        >
            <td style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={18} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{candidate.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{candidate.email}</div>
                    </div>
                </div>
            </td>
            <td style={{ padding: '16px 12px' }}>
                <ScoreBadge score={candidate.atsScore} />
            </td>
            <td style={{ padding: '16px 12px' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {candidate.yearsExperience > 0 ? `${candidate.yearsExperience} yr${candidate.yearsExperience !== 1 ? 's' : ''}` : '—'}
                </span>
            </td>
            <td style={{ padding: '16px 12px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(candidate.scores?.skills?.matched || candidate.skills || []).slice(0, 3).map(s => (
                        <span key={s} className="badge-skill" style={{ fontSize: 10 }}>{s}</span>
                    ))}
                    {(candidate.scores?.skills?.matched || candidate.skills || []).length > 3 && (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{(candidate.scores?.skills?.matched || candidate.skills).length - 3}</span>
                    )}
                </div>
            </td>
            <td style={{ padding: '16px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, background: cfg.bg, width: 'fit-content' }}>
                    <StatusIcon size={13} style={{ color: cfg.color }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                </div>
            </td>
            <td style={{ padding: '16px 12px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => onStatusChange(candidate.id, 'shortlisted')} className="btn-success" style={{ padding: '5px 10px', fontSize: 11 }}>
                        ✓ Shortlist
                    </button>
                    <button onClick={() => onStatusChange(candidate.id, 'rejected')} className="btn-danger" style={{ padding: '5px 10px', fontSize: 11 }}>
                        ✗ Reject
                    </button>
                    <button onClick={() => onStatusChange(candidate.id, 'on_hold')} style={{ padding: '5px 10px', fontSize: 11, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
                        Hold
                    </button>
                </div>
            </td>
        </motion.tr>
    );
}

function CandidateDetail({ candidate }) {
    if (!candidate) return (
        <div style={{ padding: 32, textAlign: 'center' }}>
            <User size={40} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Select a candidate to view details</p>
        </div>
    );

    return (
        <div style={{ padding: 24, height: '100%', overflow: 'auto' }} className="no-scrollbar">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <User size={28} color="white" />
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>{candidate.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{candidate.yearsExperience > 0 ? `${candidate.yearsExperience} years experience` : 'Experience undetected'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{
                    textAlign: 'center',
                    padding: '20px 40px',
                    background: `${SCORE_COLOR(candidate.atsScore)}12`,
                    border: `2px solid ${SCORE_COLOR(candidate.atsScore)}40`,
                    borderRadius: 16,
                }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: SCORE_COLOR(candidate.atsScore) }}>{candidate.atsScore}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>ATS SCORE</div>
                </div>
            </div>

            {/* Score bars */}
            {candidate.scores && (
                <div style={{ marginBottom: 20 }}>
                    {[
                        { label: 'Skills', score: candidate.scores.skills?.score, color: '#6366f1' },
                        { label: 'Experience', score: candidate.scores.experience?.score, color: '#10b981' },
                        { label: 'Education', score: candidate.scores.education?.score, color: '#f59e0b' },
                        { label: 'Keywords', score: candidate.scores.keyword?.score, color: '#3b82f6' },
                    ].map(({ label, score, color }) => score !== undefined && (
                        <div key={label} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                                <span style={{ fontSize: 12, color, fontWeight: 700 }}>{score}%</span>
                            </div>
                            <div className="progress-bar-track">
                                <div className="progress-bar-fill" style={{ width: `${score}%`, background: color }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {candidate.email && candidate.email !== 'N/A' && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Mail size={13} style={{ color: '#6366f1' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{candidate.email}</span>
                    </div>
                )}
                {candidate.phone && candidate.phone !== 'N/A' && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Phone size={13} style={{ color: '#6366f1' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{candidate.phone}</span>
                    </div>
                )}
                {candidate.certifications?.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Award size={13} style={{ color: '#f59e0b' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{candidate.certifications[0]}</span>
                    </div>
                )}
            </div>

            {/* Skills */}
            {candidate.skills?.length > 0 && (
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {candidate.skills.slice(0, 20).map(s => (
                            <span key={s} className="badge-skill" style={{ fontSize: 10 }}>{s}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortKey, setSortKey] = useState('atsScore');
    const [sortDir, setSortDir] = useState('desc');
    const [selected, setSelected] = useState(null);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/candidates');
            setCandidates(res.data.candidates || []);
        } catch {
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCandidates(); }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/api/candidates/${id}/status`, { status });
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        } catch { }
    };

    const handleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const filtered = candidates
        .filter(c => {
            const q = search.toLowerCase();
            const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.skills?.some(s => s.toLowerCase().includes(q));
            const matchStatus = statusFilter === 'all' || c.status === statusFilter;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            let va = sortKey === 'atsScore' ? a.atsScore : sortKey === 'yearsExperience' ? a.yearsExperience : a.name;
            let vb = sortKey === 'atsScore' ? b.atsScore : sortKey === 'yearsExperience' ? b.yearsExperience : b.name;
            if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
            return sortDir === 'asc' ? va - vb : vb - va;
        });

    const stats = [
        { label: 'Total', value: candidates.length, color: '#6366f1' },
        { label: 'Shortlisted', value: candidates.filter(c => c.status === 'shortlisted').length, color: '#10b981' },
        { label: 'Rejected', value: candidates.filter(c => c.status === 'rejected').length, color: '#ef4444' },
        { label: 'Avg Score', value: candidates.length ? Math.round(candidates.reduce((a, c) => a + c.atsScore, 0) / candidates.length) : 0, color: '#f59e0b' },
    ];

    const SortIcon = ({ k }) => {
        if (sortKey !== k) return <ChevronDown size={14} style={{ opacity: 0.3 }} />;
        return sortDir === 'asc' ? <ChevronUp size={14} style={{ color: '#6366f1' }} /> : <ChevronDown size={14} style={{ color: '#6366f1' }} />;
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 64px)', padding: '32px 24px' }}>
            <div style={{ maxWidth: 1300, margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}
                >
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Recruiter Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Review, filter, and action all screened candidates</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={fetchCandidates} className="btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }}>
                            <RefreshCw size={14} /> Refresh
                        </button>
                        <Link to="/upload" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px', textDecoration: 'none' }}>
                            <Upload size={14} /> Screen Resume
                        </Link>
                    </div>
                </motion.div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                    {stats.map(({ label, value, color }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="card"
                            style={{ padding: '20px 24px' }}
                        >
                            <div style={{ fontSize: 32, fontWeight: 900, color, letterSpacing: '-1px' }}>{value}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Main content: table + detail */}
                <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: 20, alignItems: 'start' }}>
                    {/* Table card */}
                    <motion.div layout className="card" style={{ overflow: 'hidden' }}>
                        {/* Filters */}
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, skill..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: 36, height: 38, fontSize: 13 }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 6 }}>
                                {['all', 'shortlisted', 'pending', 'on_hold', 'rejected'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        style={{
                                            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                                            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                                            background: statusFilter === s ? '#6366f1' : 'var(--bg-secondary)',
                                            color: statusFilter === s ? 'white' : 'var(--text-secondary)',
                                        }}
                                    >
                                        {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
                                    <RefreshCw size={28} />
                                </motion.div>
                                <p>Loading candidates...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: 56, textAlign: 'center' }}>
                                <TrendingUp size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
                                <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>
                                    {candidates.length === 0 ? 'No candidates yet' : 'No results found'}
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                                    {candidates.length === 0 ? 'Upload and screen a resume to see candidates here' : 'Try adjusting your search or filter'}
                                </p>
                                {candidates.length === 0 && (
                                    <Link to="/upload" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>
                                        <Upload size={16} /> Screen First Resume
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                                            {[
                                                { key: 'name', label: 'Candidate' },
                                                { key: 'atsScore', label: 'ATS' },
                                                { key: 'yearsExperience', label: 'Exp.' },
                                                { key: null, label: 'Top Skills' },
                                                { key: 'status', label: 'Status' },
                                                { key: null, label: 'Actions' },
                                            ].map(({ key, label }) => (
                                                <th key={label}
                                                    onClick={key ? () => handleSort(key) : undefined}
                                                    style={{
                                                        padding: '12px 16px', textAlign: 'left', fontWeight: 600,
                                                        fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase',
                                                        letterSpacing: '0.5px', cursor: key ? 'pointer' : 'default',
                                                        userSelect: 'none', whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                        {label} {key && <SortIcon k={key} />}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {filtered.map(c => (
                                                <CandidateRow
                                                    key={c.id}
                                                    candidate={c}
                                                    onStatusChange={handleStatusChange}
                                                    onClick={() => setSelected(s => s?.id === c.id ? null : c)}
                                                    selected={selected?.id === c.id}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {filtered.length > 0 && (
                            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
                                Showing {filtered.length} of {candidates.length} candidates
                            </div>
                        )}
                    </motion.div>

                    {/* Candidate detail panel */}
                    <AnimatePresence>
                        {selected && (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="card"
                                style={{ position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflow: 'hidden' }}
                            >
                                <CandidateDetail candidate={selected} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
