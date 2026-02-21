import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sun, Moon, Menu, X, LayoutDashboard, Upload, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/upload', label: 'Screen Resume', icon: Upload },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                    background: 'var(--bg-glass)',
                    borderBottom: '1px solid var(--border)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                }}
            >
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
                        }}>
                            <Brain size={20} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                            Recruit<span style={{ color: '#6366f1' }}>AI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden md:flex">
                        {navLinks.map(({ to, label }) => {
                            const active = location.pathname === to;
                            return (
                                <Link key={to} to={to} style={{
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: active ? '#6366f1' : 'var(--text-secondary)',
                                    background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                                    transition: 'all 0.15s ease',
                                }}>
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)',
                                background: 'var(--bg-card)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-secondary)', transition: 'all 0.2s ease',
                            }}
                            title="Toggle theme"
                        >
                            {isDark ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        <Link to="/upload" className="btn-primary hidden md:inline-flex" style={{ padding: '8px 18px', fontSize: 14 }}>
                            Start Screening
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileOpen(o => !o)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: 4 }}
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
                            background: 'var(--bg-card)',
                            borderBottom: '1px solid var(--border)',
                            padding: 16,
                        }}
                    >
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link key={to} to={to}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                                    borderRadius: 12, textDecoration: 'none',
                                    color: location.pathname === to ? '#6366f1' : 'var(--text-primary)',
                                    background: location.pathname === to ? 'rgba(99,102,241,0.1)' : 'transparent',
                                    marginBottom: 4, fontWeight: 500, fontSize: 15,
                                }}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        ))}
                        <Link to="/upload" onClick={() => setMobileOpen(false)}
                            className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                            Start Screening
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer */}
            <div style={{ height: 64 }} />
        </>
    );
}
