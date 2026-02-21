import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Zap, Shield, BarChart3, Users, ChevronRight, Star, CheckCircle, ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';

const features = [
    { icon: Brain, title: 'AI-Powered Parsing', desc: 'Advanced NLP extracts skills, experience, education and context — not just keywords.', color: '#6366f1' },
    { icon: Target, title: 'ATS Score Engine', desc: 'Composite 0–100 scoring across skills, experience, education, and keyword optimization.', color: '#8b5cf6' },
    { icon: BarChart3, title: 'Skill Gap Analysis', desc: 'Compare candidate skill sets against JD requirements with semantic matching.', color: '#ec4899' },
    { icon: Sparkles, title: 'AI Insights', desc: 'Explainable decisions: why hired, why rejected, and personalized improvement tips.', color: '#f59e0b' },
    { icon: TrendingUp, title: 'Recruiter Dashboard', desc: 'Sortable candidate table with filters, search, and quick status actions.', color: '#10b981' },
    { icon: Shield, title: 'Bias-Reduced Screening', desc: 'Objective, skills-first evaluation reduces unconscious bias in hiring.', color: '#3b82f6' },
];

const stats = [
    { value: '< 3s', label: 'Per resume analysis' },
    { value: '500+', label: 'Skills in taxonomy' },
    { value: '95%', label: 'Parsing accuracy' },
    { value: '6x', label: 'Faster screening' },
];

function HeroAnimation() {
    return (
        <div style={{ position: 'relative', width: 320, height: 340 }}>
            {/* Main card */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', inset: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: '0 25px 80px rgba(99,102,241,0.2)',
                    overflow: 'hidden',
                }}
            >
                {/* Scan line */}
                <div className="scan-line" style={{
                    position: 'absolute', left: 0, right: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)',
                    boxShadow: '0 0 12px rgba(99,102,241,0.8)',
                }} />

                {/* Resume lines */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
                    <div>
                        <div style={{ width: 120, height: 10, borderRadius: 6, background: 'var(--border)', marginBottom: 5 }} />
                        <div style={{ width: 80, height: 8, borderRadius: 6, background: 'var(--border)' }} />
                    </div>
                    <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '4px 10px', color: '#10b981', fontSize: 12, fontWeight: 700 }}>
                        87
                    </div>
                </div>

                {['Skills Match', 'Experience', 'Education', 'Keywords'].map((label, i) => (
                    <div key={label} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600 }}>{[92, 85, 75, 88][i]}%</span>
                        </div>
                        <div className="progress-bar-track">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${[92, 85, 75, 88][i]}%` }}
                                transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
                                style={{ background: ['linear-gradient(90deg,#6366f1,#8b5cf6)', 'linear-gradient(90deg,#10b981,#34d399)', 'linear-gradient(90deg,#f59e0b,#fcd34d)', 'linear-gradient(90deg,#3b82f6,#60a5fa)'][i] }}
                            />
                        </div>
                    </div>
                ))}

                <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                    {['React', 'Node.js', 'Python', 'AWS', 'Docker'].map(s => (
                        <span key={s} className="badge-skill" style={{ fontSize: 10 }}>{s}</span>
                    ))}
                </div>
            </motion.div>

            {/* Floating chips */}
            <motion.div
                animate={{ x: [0, 8, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: -20, right: -30, background: 'linear-gradient(135deg,#10b981,#34d399)', borderRadius: 12, padding: '8px 14px', color: 'white', fontSize: 13, fontWeight: 700, boxShadow: '0 8px 25px rgba(16,185,129,0.4)' }}
            >
                ✓ Shortlisted
            </motion.div>

            <motion.div
                animate={{ x: [0, -6, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{ position: 'absolute', bottom: -15, left: -25, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 12, padding: '8px 14px', color: 'white', fontSize: 12, fontWeight: 600, boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
            >
                🤖 AI Analyzed
            </motion.div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div style={{ background: 'var(--bg-primary)' }}>
            {/* Hero */}
            <section className="grid-bg" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', padding: '60px 24px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
                        {/* Left */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}
                            >
                                <Zap size={14} style={{ color: '#6366f1' }} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>AI-Powered Resume Screening</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1.5px' }}
                            >
                                Hire Faster with{' '}
                                <span className="text-gradient">AI Resume<br />Screening</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36, maxWidth: 500 }}
                            >
                                Automatically score resumes against job descriptions with precision ATS analysis,
                                semantic skill matching, and transparent AI insights — in seconds.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
                            >
                                <Link to="/upload" className="btn-primary" style={{ fontSize: 16, padding: '14px 28px' }}>
                                    Screen a Resume <ArrowRight size={18} />
                                </Link>
                                <Link to="/dashboard" className="btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }}>
                                    View Dashboard
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}
                            >
                                {['No setup required', 'PDF & DOCX support', 'Real-time analysis'].map(item => (
                                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <CheckCircle size={15} style={{ color: '#10b981' }} />
                                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right: Animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            style={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <HeroAnimation />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: '60px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
                    {stats.map(({ value, label }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{ fontSize: 40, fontWeight: 900, color: '#6366f1', letterSpacing: '-1px' }}>{value}</div>
                            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="section-title" style={{ marginBottom: 12 }}
                        >
                            Everything you need to hire better
                        </motion.h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 17 }}>Enterprise-grade AI screening for teams of all sizes</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                        {features.map(({ icon: Icon, title, desc, color }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                viewport={{ once: true }}
                                className="card"
                                style={{ padding: 28 }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: `${color}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 16,
                                }}>
                                    <Icon size={24} style={{ color }} />
                                </div>
                                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        maxWidth: 800, margin: '0 auto', textAlign: 'center',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: 28, padding: '60px 40px',
                        boxShadow: '0 25px 80px rgba(99,102,241,0.35)',
                    }}
                >
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
                        Start screening smarter today
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 36 }}>
                        Upload your first resume and get an AI-generated ATS report in under 3 seconds
                    </p>
                    <Link to="/upload" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'white', color: '#6366f1',
                        padding: '14px 32px', borderRadius: 14, fontWeight: 700, fontSize: 16,
                        textDecoration: 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease',
                    }}>
                        Try it free <ChevronRight size={18} />
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    © 2026 RecruitAI — AI-Powered Resume Screening Platform
                </span>
            </footer>
        </div>
    );
}
