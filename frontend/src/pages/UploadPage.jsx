import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Upload, FileText, Briefcase, CheckCircle, AlertCircle, Brain, Sparkles, X, Loader } from 'lucide-react';

const ANALYSIS_STEPS = [
    { label: 'Parsing resume content', icon: FileText },
    { label: 'Extracting skills & experience', icon: Brain },
    { label: 'Matching against job description', icon: Briefcase },
    { label: 'Calculating ATS score', icon: Sparkles },
    { label: 'Generating AI insights', icon: CheckCircle },
];

function AnalysisProgress({ step }) {
    return (
        <div style={{ padding: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 60, height: 60, margin: '0 auto 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Brain size={28} color="white" />
                </motion.div>
                <h3 style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 6 }}>
                    AI Analyzing Resume
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Please wait while our AI processes your resume...</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ANALYSIS_STEPS.map(({ label, icon: Icon }, i) => {
                    const done = i < step;
                    const active = i === step;
                    return (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 16px', borderRadius: 12,
                                background: done ? 'rgba(16,185,129,0.08)' : active ? 'rgba(99,102,241,0.08)' : 'var(--bg-secondary)',
                                border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : active ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {done ? (
                                <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                            ) : active ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                    <Loader size={18} style={{ color: '#6366f1', flexShrink: 0 }} />
                                </motion.div>
                            ) : (
                                <Icon size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            )}
                            <span style={{ fontSize: 14, fontWeight: 500, color: done ? '#10b981' : active ? '#6366f1' : 'var(--text-muted)' }}>
                                {label}
                            </span>
                            {active && (
                                <motion.div
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [jd, setJD] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onDrop = useCallback((accepted) => {
        if (accepted.length > 0) {
            setFile(accepted[0]);
            setError('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024,
        onDropRejected: () => setError('Only PDF or DOCX files up to 10MB are supported.'),
    });

    const handleAnalyze = async () => {
        if (!file) { setError('Please upload a resume file'); return; }
        if (!jd.trim() || jd.trim().length < 20) { setError('Please enter a job description (minimum 20 characters)'); return; }
        setError('');
        setAnalyzing(true);
        setAnalysisStep(0);

        // Simulate step progression
        const stepInterval = setInterval(() => {
            setAnalysisStep(prev => {
                if (prev >= ANALYSIS_STEPS.length - 1) { clearInterval(stepInterval); return prev; }
                return prev + 1;
            });
        }, 800);

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('jobDescription', jd);

            const res = await api.post('/api/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000,
            });

            clearInterval(stepInterval);
            setAnalysisStep(ANALYSIS_STEPS.length - 1);

            // Brief pause to show completion, then navigate
            setTimeout(() => {
                navigate('/results', { state: { candidate: res.data.candidate } });
            }, 700);
        } catch (err) {
            clearInterval(stepInterval);
            setAnalyzing(false);
            setAnalysisStep(0);
            const msg = err.response?.data?.error || err.message || 'Analysis failed. Please check the backend is running.';
            setError(msg);
        }
    };

    const sampleJD = `Senior Full Stack Developer

We are looking for a Senior Full Stack Developer with 4+ years of experience to join our engineering team.

Requirements:
- Proficiency in React, Node.js, and TypeScript
- Experience with PostgreSQL or MongoDB
- Knowledge of AWS services (EC2, S3, Lambda)
- Familiarity with Docker and Kubernetes
- Strong understanding of REST APIs and GraphQL
- Experience with CI/CD pipelines (GitHub Actions, Jenkins)
- Excellent problem-solving and communication skills

Nice to have:
- Bachelor's degree in Computer Science or related field
- Redis experience
- Microservices architecture
- Agile/Scrum methodology`;

    if (analyzing) {
        return (
            <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card"
                    style={{ width: '100%', maxWidth: 520 }}
                >
                    <AnalysisProgress step={analysisStep} />
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 24px', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: 40 }}
                >
                    <h1 className="section-title" style={{ marginBottom: 12 }}>Screen a Resume</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
                        Upload a resume (PDF/DOCX) and paste the job description to get an instant AI analysis
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 28 }}>
                    {/* Resume Upload */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={18} style={{ color: '#6366f1' }} />
                            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Resume File</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF or DOCX, max 10MB</span>
                        </div>

                        <div
                            {...getRootProps()}
                            style={{
                                border: `2px dashed ${isDragActive ? '#6366f1' : file ? 'rgba(16,185,129,0.5)' : 'var(--border)'}`,
                                borderRadius: 16,
                                padding: '40px 24px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: isDragActive ? 'rgba(99,102,241,0.05)' : file ? 'rgba(16,185,129,0.04)' : 'var(--bg-secondary)',
                                transition: 'all 0.2s ease',
                                minHeight: 200,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <input {...getInputProps()} />
                            <AnimatePresence mode="wait">
                                {file ? (
                                    <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                        <CheckCircle size={40} style={{ color: '#10b981', marginBottom: 12 }} />
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{file.name}</div>
                                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, margin: '12px auto 0' }}
                                        >
                                            <X size={14} /> Remove
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <motion.div animate={{ y: isDragActive ? -8 : 0 }} transition={{ duration: 0.2 }}>
                                            <Upload size={40} style={{ color: isDragActive ? '#6366f1' : 'var(--text-muted)', marginBottom: 12 }} />
                                        </motion.div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                                            {isDragActive ? 'Drop to upload' : 'Drag & drop your resume'}
                                        </div>
                                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>or click to browse files</div>
                                        <div style={{ marginTop: 12, padding: '6px 14px', background: 'rgba(99,102,241,0.1)', borderRadius: 8, display: 'inline-block', fontSize: 12, color: '#6366f1', fontWeight: 500 }}>
                                            PDF · DOCX
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Job Description */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Briefcase size={18} style={{ color: '#6366f1' }} />
                                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Job Description</span>
                            </div>
                            <button
                                onClick={() => setJD(sampleJD)}
                                style={{ fontSize: 12, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                            >
                                Use sample
                            </button>
                        </div>
                        <textarea
                            value={jd}
                            onChange={e => setJD(e.target.value)}
                            placeholder="Paste the job description here — include role requirements, skills needed, experience expected, and education requirements for best results..."
                            style={{
                                width: '100%', height: 260, resize: 'vertical',
                                padding: '16px', borderRadius: 16, fontSize: 13,
                                lineHeight: 1.7, fontFamily: 'Inter, sans-serif',
                                background: 'var(--bg-secondary)',
                                border: `1.5px solid ${jd.length > 0 ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                                color: 'var(--text-primary)',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                            {jd.length} characters
                        </div>
                    </motion.div>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                            <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                            <span style={{ color: '#ef4444', fontSize: 14 }}>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Analyze button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ textAlign: 'center', marginTop: 32 }}
                >
                    <button
                        onClick={handleAnalyze}
                        disabled={!file || jd.trim().length < 20}
                        className="btn-primary"
                        style={{
                            fontSize: 16, padding: '16px 48px',
                            opacity: (!file || jd.trim().length < 20) ? 0.5 : 1,
                            cursor: (!file || jd.trim().length < 20) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <Brain size={20} />
                        Analyze Resume with AI
                    </button>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
                        Analysis typically takes 2–5 seconds
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
