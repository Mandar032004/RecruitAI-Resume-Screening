const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { parseResume } = require('../services/resumeParser');
const { analyzeResume } = require('../services/aiEngine');
const { addCandidate, getAllCandidates, getCandidateById, updateCandidateStatus, clearAll } = require('../data/candidateStore');

// Configure multer (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (allowed.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.docx')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed'));
        }
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// POST /api/analyze — upload resume + JD, return analysis
router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }
        const jdText = req.body.jobDescription || '';
        if (!jdText || jdText.trim().length < 20) {
            return res.status(400).json({ error: 'Job description is required (at least 20 characters)' });
        }

        const mimetype = req.file.mimetype || (req.file.originalname.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        // Parse resume
        const parsed = await parseResume(req.file.buffer, mimetype);

        // AI analysis
        const analysis = await analyzeResume(parsed, jdText);

        // Build candidate record
        const candidate = {
            id: uuidv4(),
            name: parsed.name || 'Unknown',
            email: parsed.email || 'N/A',
            phone: parsed.phone || 'N/A',
            linkedin: parsed.linkedin || null,
            github: parsed.github || null,
            skills: parsed.skills,
            education: parsed.education,
            yearsExperience: parsed.yearsExperience,
            certifications: parsed.certifications,
            atsScore: analysis.atsScore,
            scores: analysis.scores,
            insights: analysis.insights,
            atsCheck: analysis.atsCheck,
            status: 'pending',
            uploadedAt: new Date().toISOString(),
            fileName: req.file.originalname,
            jobDescription: jdText.substring(0, 500),
        };

        addCandidate(candidate);

        res.json({ success: true, candidate });
    } catch (err) {
        console.error('Analyze error:', err);
        res.status(500).json({ error: 'Analysis failed: ' + err.message });
    }
});

// GET /api/candidates — list all candidates
router.get('/candidates', (req, res) => {
    const candidates = getAllCandidates();
    res.json({ candidates });
});

// GET /api/candidates/:id — get specific candidate
router.get('/candidates/:id', (req, res) => {
    const candidate = getCandidateById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ candidate });
});

// PUT /api/candidates/:id/status — update status
router.put('/candidates/:id/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'shortlisted', 'rejected', 'on_hold'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    }
    const candidate = updateCandidateStatus(req.params.id, status);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ success: true, candidate });
});

// DELETE /api/candidates — clear all (demo)
router.delete('/candidates', (req, res) => {
    clearAll();
    res.json({ success: true, message: 'All candidates cleared' });
});

module.exports = router;
