import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, LayoutDashboard, Lightbulb, User, Mail, Phone, Linkedin, Github, Award, TrendingUp, Brain } from 'lucide-react';

function CircularScore({ score }) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 75 ? '#10b981' : score >= 50 ? '#6366f1' : score >= 30 ? '#f59e0b' : '#ef4444';
    const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : score >= 30 ? 'Average' : 'Poor';

    return (
        <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
            <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--border)" strokeWidth="12" />
                <motion.circle
                    cx="90" cy="90" r={radius} fill="none"
                    stroke={color} strokeWidth="12"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                    strokeLinecap="round"
                />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    style={{ color, fontSize: 42, fontWeight: 900, lineHeight: 1 }}
                >
                    {score}
                </motion.div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>ATS Score</div>
                <div style={{ fontSize: 11, color, fontWeight: 700, marginTop: 2 }}>{label}</div>
            </div>
        </div>
    );
}

function ScoreBar({ label, score, color }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}%</span>
            </div>
            <div className="progress-bar-track">
                <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ background: `linear-gradient(90deg, ${color}aa, ${color})` }}
                />
            </div>
        </div>
    );
}

const SAMPLE = {
    id: 'demo',
    name: 'Sample Candidate',
    email: 'candidate@example.com',
    phone: '+1 555-0100',
    linkedin: 'https://linkedin.com/in/sample',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'TypeScript'],
    yearsExperience: 5,
    education: ['Bachelor of Technology in Computer Science'],
    certifications: ['AWS Certified Developer'],
    atsScore: 78,
    scores: {
        skills: { score: 85, matched: ['React', 'Node.js', 'AWS', 'Docker'], missing: ['Kubernetes', 'Redis'] },
        experience: { score: 80, detail: '5 years found, 4 required ✓' },
        education: { score: 75, detail: 'Education requirement met ✓' },
        keyword: { score: 70, detail: '42/60 JD keywords found in resume' },
        semantic: 65,
    },
    insights: {
        strengths: ['Strong skills alignment — React, Node.js, AWS match JD requirements', 'Experience level meets the 4+ year requirement', 'Holds relevant certifications: AWS Certified Developer'],
        weaknesses: ['Missing key JD skills: Kubernetes, Redis', 'No LinkedIn profile detected'],
        suggestions: [
            { type: 'skills', title: 'Add Missing Skills', detail: 'Consider adding or developing: Kubernetes, Redis, GraphQL' },
            { type: 'keywords', title: 'Optimize for ATS Keywords', detail: 'Incorporate job-specific terms naturally into bullet points' },
        ],
    },
    atsCheck: {
        friendly: ['Sufficient resume content detected', 'Technical keywords present', 'Contact email found'],
        issues: ['No professional summary section found'],
    },
};

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const candidate = location.state?.candidate || SAMPLE;
    const { scores, insights, atsCheck } = candidate;

    const scoreColors = {
        skills: '#6366f1',
        experience: '#10b981',
        education: '#f59e0b',
        keyword: '#3b82f6',
        semantic: '#ec4899',
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 64px)', padding: '32px 24px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}
                >
                    <button
                        onClick={() => navigate('/upload')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center' }}>AI Screening Results</h1>
                    </div>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#6366f1', fontSize: 14, fontWeight: 500 }}>
                        <LayoutDashboard size={16} /> Dashboard
                    </Link>
                </motion.div>

                {/* Top Section: Score + Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
                    {/* ATS Score Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                        style={{ padding: 32, textAlign: 'center' }}
                    >
                        <CircularScore score={candidate.atsScore} />
                        <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                                onClick={() => navigate('/upload')}
                                className="btn-secondary"
                                style={{ fontSize: 13, padding: '8px 16px' }}
                            >
                                Screen Another
                            </button>
                            <Link
                                to="/dashboard"
                                className="btn-primary"
                                style={{ fontSize: 13, padding: '8px 16px', textDecoration: 'none' }}
                            >
                                View Dashboard
                            </Link>
                        </div>
                    </motion.div>

                    {/* Candidate Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="card"
                        style={{ padding: 28 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>{candidate.name}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{candidate.yearsExperience > 0 ? `${candidate.yearsExperience} years experience` : 'Experience not detected'}</div>
                            </div>
                        </div>

                        {[
                            { icon: Mail, value: candidate.email, label: 'Email' },
                            { icon: Phone, value: candidate.phone, label: 'Phone' },
                            { icon: Linkedin, value: candidate.linkedin, label: 'LinkedIn' },
                            { icon: Github, value: candidate.github, label: 'GitHub' },
                        ].filter(i => i.value && i.value !== 'N/A').map(({ icon: Icon, value, label }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <Icon size={15} style={{ color: '#6366f1', flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{value}</span>
                            </div>
                        ))}

                        {candidate.education?.[0] && (
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <Award size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{candidate.education[0]}</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Score Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card"
                        style={{ padding: 28 }}
                    >
                        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
                            <TrendingUp size={18} style={{ color: '#6366f1' }} /> Score Breakdown
                        </h3>
                        <ScoreBar label="Skills Match" score={scores.skills.score} color={scoreColors.skills} />
                        <ScoreBar label="Experience Relevance" score={scores.experience.score} color={scoreColors.experience} />
                        <ScoreBar label="Education Alignment" score={scores.education.score} color={scoreColors.education} />
                        <ScoreBar label="Keyword Optimization" score={scores.keyword.score} color={scoreColors.keyword} />
                        <ScoreBar label="Semantic Similarity" score={scores.semantic} color={scoreColors.semantic} />
                    </motion.div>
                </div>

                {/* Skills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
                    {/* Matched Skills */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="card"
                        style={{ padding: 24 }}
                    >
                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={16} /> Matched Skills ({scores.skills.matched?.length || 0})
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(scores.skills.matched || candidate.skills || []).slice(0, 20).map(s => (
                                <span key={s} className="badge-green" style={{ fontSize: 12 }}>{s}</span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Missing Skills */}
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card"
                        style={{ padding: 24 }}
                    >
                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <XCircle size={16} /> Missing Skills ({scores.skills.missing?.length || 0})
                        </h3>
                        {scores.skills.missing?.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {scores.skills.missing.slice(0, 10).map(s => (
                                    <span key={s} className="badge-red" style={{ fontSize: 12 }}>{s}</span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>All required skills are present ✓</p>
                        )}
                    </motion.div>
                </div>

                {/* AI Insights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
                    {/* Strengths */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="card"
                        style={{ padding: 24 }}
                    >
                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={16} /> Why This Candidate Fits
                        </h3>
                        {insights.strengths.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {insights.strengths.map((s, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10 }}>
                                        <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }} />
                                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No major strengths detected</p>}
                    </motion.div>

                    {/* Weaknesses */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card"
                        style={{ padding: 24 }}
                    >
                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <XCircle size={16} /> Potential Rejection Reasons
                        </h3>
                        {insights.weaknesses.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {insights.weaknesses.map((w, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
                                        <XCircle size={14} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{w}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No major weaknesses found</p>}
                    </motion.div>

                    {/* Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="card"
                        style={{ padding: 24 }}
                    >
                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Lightbulb size={16} /> Improvement Suggestions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {insights.suggestions.map((s, i) => (
                                <div key={i} style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
                                    <div style={{ fontWeight: 600, fontSize: 13, color: '#f59e0b', marginBottom: 4 }}>{s.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.detail}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ATS Check */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                    style={{ padding: 24 }}
                >
                    <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Brain size={16} style={{ color: '#6366f1' }} /> ATS Compatibility Check
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>✓ ATS-Friendly</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {atsCheck.friendly.map((f, i) => (
                                    <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <CheckCircle size={13} style={{ color: '#10b981', flexShrink: 0 }} /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚠ Issues</div>
                            {atsCheck.issues.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {atsCheck.issues.map((issue, i) => (
                                        <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                                            <AlertTriangle size={13} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} /> {issue}
                                        </div>
                                    ))}
                                </div>
                            ) : <div style={{ fontSize: 13, color: '#10b981' }}>No ATS-blocking issues found!</div>}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
