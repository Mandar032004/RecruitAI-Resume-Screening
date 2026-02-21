const fs = require('fs');
const path = require('path');

const STORE_FILE = path.join(__dirname, '../../uploads/candidates.json');

let candidates = [];

// Load persisted data on startup
try {
    if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf8');
        candidates = JSON.parse(raw);
    }
} catch (e) {
    candidates = [];
}

function persist() {
    try {
        fs.writeFileSync(STORE_FILE, JSON.stringify(candidates, null, 2));
    } catch (e) {
        // ignore write errors in demo
    }
}

function addCandidate(candidate) {
    candidates.unshift(candidate);
    persist();
    return candidate;
}

function getAllCandidates() {
    return candidates;
}

function getCandidateById(id) {
    return candidates.find(c => c.id === id);
}

function updateCandidateStatus(id, status) {
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
        candidate.status = status;
        persist();
        return candidate;
    }
    return null;
}

function clearAll() {
    candidates = [];
    persist();
}

module.exports = { addCandidate, getAllCandidates, getCandidateById, updateCandidateStatus, clearAll };
