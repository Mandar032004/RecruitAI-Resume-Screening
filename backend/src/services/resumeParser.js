// Fix: pdf-parse v1.1.1 has a bug that tries to load a test file on require()
// Using the internal lib path bypasses this issue
let pdfParse;
try {
    pdfParse = require('pdf-parse/lib/pdf-parse');
} catch (e) {
    pdfParse = require('pdf-parse');
}
const mammoth = require('mammoth');
const { allSkills } = require('../data/skillsDb');

// Extract text from PDF
async function extractFromPDF(buffer) {
    try {
        const data = await pdfParse(buffer);
        return data.text || '';
    } catch (e) {
        console.error('PDF parse error:', e.message);
        return '';
    }
}

// Extract text from DOCX
async function extractFromDOCX(buffer) {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '';
    } catch (e) {
        console.error('DOCX parse error:', e.message);
        return '';
    }
}

// Extract email
function extractEmail(text) {
    const match = text.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : null;
}

// Extract phone
function extractPhone(text) {
    const match = text.match(/(\+?\d[\d\s\-().]{8,14}\d)/);
    return match ? match[0].trim() : null;
}

// Extract LinkedIn
function extractLinkedIn(text) {
    const match = text.match(/linkedin\.com\/in\/[\w-]+/i);
    return match ? 'https://' + match[0] : null;
}

// Extract GitHub
function extractGitHub(text) {
    const match = text.match(/github\.com\/[\w-]+/i);
    return match ? 'https://' + match[0] : null;
}

// Extract name (first non-empty line that looks like a name)
function extractName(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 5)) {
        // Name-like: 2-4 words, mostly alpha, no special chars
        if (/^[A-Z][a-zA-Z]+([\s][A-Z][a-zA-Z]+){1,3}$/.test(line) && line.length < 50) {
            return line;
        }
    }
    return lines[0] || 'Unknown';
}

// Extract years of experience
function extractYearsExperience(text) {
    const patterns = [
        /(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/gi,
        /experience[:\s]+(\d+)\+?\s*years?/gi,
    ];
    for (const pat of patterns) {
        const m = pat.exec(text);
        if (m) return parseInt(m[1]);
    }
    // Count year ranges in job entries (e.g. 2019 – 2022)
    const yearMatches = [...text.matchAll(/20\d\d\s*[-–]\s*(20\d\d|present|current)/gi)];
    if (yearMatches.length > 0) {
        return Math.min(yearMatches.length * 2, 20); // rough estimate
    }
    return 0;
}

// Extract education
function extractEducation(text) {
    const lowerText = text.toLowerCase();
    const degrees = ['phd', 'ph.d', 'doctorate', 'masters', 'master of', 'm.s', 'm.sc', 'm.tech', 'mba',
        'bachelor', 'b.s', 'b.sc', 'b.tech', 'b.e', 'btech', 'associate', 'diploma'];

    const found = [];
    for (const deg of degrees) {
        if (lowerText.includes(deg)) {
            // Try to get surrounding context
            const idx = lowerText.indexOf(deg);
            const context = text.substring(Math.max(0, idx - 10), Math.min(text.length, idx + 80)).trim();
            found.push(context.replace(/\n/g, ' ').substring(0, 100));
            break;
        }
    }
    return found.length > 0 ? found : ['Not specified'];
}

// Extract skills from resume text
function extractSkills(text) {
    const lowerText = text.toLowerCase();
    const found = new Set();
    for (const skill of allSkills) {
        // Use word boundary matching
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(lowerText)) {
            found.add(skill);
        }
    }
    return Array.from(found);
}

// Extract certifications
function extractCertifications(text) {
    const certPatterns = [
        /aws\s+(certified|cloud|solutions)/gi,
        /google\s+cloud\s+(certified|professional)/gi,
        /microsoft\s+certified/gi,
        /pmp\b/g,
        /cissp\b/g,
        /cka\b/g,
        /ckad\b/g,
        /tensorflow\s+developer/gi,
        /scrum\s+master/gi,
        /certified\s+[\w\s]{3,30}/gi,
    ];
    const certs = new Set();
    for (const pat of certPatterns) {
        const matches = text.match(pat);
        if (matches) matches.forEach(m => certs.add(m.trim()));
    }
    return Array.from(certs);
}

// Main parser
async function parseResume(buffer, mimetype) {
    let rawText = '';
    if (mimetype === 'application/pdf' || mimetype === 'pdf') {
        rawText = await extractFromPDF(buffer);
    } else {
        rawText = await extractFromDOCX(buffer);
    }

    if (!rawText || rawText.trim().length < 50) {
        // Fallback: treat buffer as plain text
        rawText = buffer.toString('utf8');
    }

    return {
        rawText,
        name: extractName(rawText),
        email: extractEmail(rawText),
        phone: extractPhone(rawText),
        linkedin: extractLinkedIn(rawText),
        github: extractGitHub(rawText),
        skills: extractSkills(rawText),
        education: extractEducation(rawText),
        yearsExperience: extractYearsExperience(rawText),
        certifications: extractCertifications(rawText),
    };
}

module.exports = { parseResume, extractSkills };
