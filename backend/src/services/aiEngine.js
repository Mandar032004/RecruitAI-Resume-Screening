const natural = require('natural');
const { extractSkills } = require('./resumeParser');
const { skillsDb, educationLevels } = require('../data/skillsDb');

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

// Compute cosine similarity between two term-frequency vectors
function cosineSimilarity(vecA, vecB) {
    const keysA = Object.keys(vecA);
    const keysB = new Set(Object.keys(vecB));
    const allKeys = new Set([...keysA, ...Object.keys(vecB)]);

    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    for (const k of allKeys) {
        const a = vecA[k] || 0;
        const b = vecB[k] || 0;
        dotProduct += a * b;
        magA += a * a;
        magB += b * b;
    }

    if (magA === 0 || magB === 0) return 0;
    return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Build term frequency vector from text
function buildTFVector(text) {
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const vec = {};
    for (const t of tokens) {
        if (t.length > 2) vec[t] = (vec[t] || 0) + 1;
    }
    return vec;
}

// Extract JD required skills, experience, education hints
function parseJobDescription(jdText) {
    const skills = extractSkills(jdText);

    // Extract required years
    let requiredYears = 0;
    const yrMatch = jdText.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/i);
    if (yrMatch) requiredYears = parseInt(yrMatch[1]);

    // Extract required education
    let requiredEduLevel = 0;
    const lowerJD = jdText.toLowerCase();
    for (const [key, level] of Object.entries(educationLevels)) {
        if (lowerJD.includes(key) && level > requiredEduLevel) {
            requiredEduLevel = level;
        }
    }

    // Extract key keywords (nouns from JD)
    const keywordsRaw = jdText.match(/\b[A-Z][a-zA-Z+#.]{2,}\b/g) || [];
    const keywords = [...new Set(keywordsRaw.map(k => k.toLowerCase()))].slice(0, 60);

    return { skills, requiredYears, requiredEduLevel, keywords };
}

// Skills match score (0-100)
function calcSkillsScore(resumeSkills, jdSkills) {
    if (jdSkills.length === 0) return 70;
    const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
    let matched = 0;
    const matchedList = [];
    const missingList = [];

    for (const sk of jdSkills) {
        if (resumeSet.has(sk.toLowerCase())) {
            matched++;
            matchedList.push(sk);
        } else {
            missingList.push(sk);
        }
    }

    // Also check partial matches
    for (const rsk of resumeSkills) {
        for (const jsk of jdSkills) {
            if (!matchedList.includes(jsk) && (rsk.includes(jsk) || jsk.includes(rsk))) {
                matched += 0.5;
                matchedList.push(jsk);
            }
        }
    }

    const score = Math.min(100, Math.round((matched / jdSkills.length) * 100));
    return { score, matched: matchedList, missing: missingList.slice(0, 10) };
}

// Experience relevance score (0-100)
function calcExperienceScore(resumeYears, requiredYears) {
    if (requiredYears === 0) return { score: 75, detail: 'No specific experience requirement stated' };
    if (resumeYears === 0) return { score: 30, detail: `${requiredYears}+ years required, could not detect years in resume` };

    if (resumeYears >= requiredYears) {
        const bonus = Math.min(15, (resumeYears - requiredYears) * 3);
        return { score: Math.min(100, 75 + bonus), detail: `${resumeYears} years found, ${requiredYears} required ✓` };
    } else {
        const ratio = resumeYears / requiredYears;
        return { score: Math.round(ratio * 65), detail: `${resumeYears} years found, ${requiredYears} required (gap of ${requiredYears - resumeYears} years)` };
    }
}

// Education alignment score (0-100)
function calcEducationScore(resumeText, requiredEduLevel) {
    const lowerText = resumeText.toLowerCase();
    let resumeEduLevel = 0;
    for (const [key, level] of Object.entries(educationLevels)) {
        if (lowerText.includes(key) && level > resumeEduLevel) {
            resumeEduLevel = level;
        }
    }

    if (requiredEduLevel === 0) return { score: 80, detail: 'No specific education requirement' };
    if (resumeEduLevel === 0) return { score: 40, detail: 'Education level not clearly detected in resume' };

    if (resumeEduLevel >= requiredEduLevel) {
        return { score: Math.min(100, 70 + (resumeEduLevel - requiredEduLevel) * 10), detail: 'Education requirement met ✓' };
    } else {
        return { score: Math.round((resumeEduLevel / requiredEduLevel) * 60), detail: `Education level below requirement` };
    }
}

// Keyword optimization score (keyword density + coverage)
function calcKeywordScore(resumeText, jdKeywords) {
    if (jdKeywords.length === 0) return { score: 70, detail: 'No specific keywords extracted from JD' };
    const lowerResume = resumeText.toLowerCase();
    let found = 0;
    for (const kw of jdKeywords) {
        if (lowerResume.includes(kw)) found++;
    }
    const score = Math.min(100, Math.round((found / jdKeywords.length) * 100));
    return { score, detail: `${found}/${jdKeywords.length} JD keywords found in resume` };
}

// Semantic similarity using TF-IDF cosine
function calcSemanticScore(resumeText, jdText) {
    const vecR = buildTFVector(resumeText);
    const vecJ = buildTFVector(jdText);
    const sim = cosineSimilarity(vecR, vecJ);
    return Math.round(sim * 100);
}

// Generate AI insights
function generateInsights(parsed, jdParsed, scores) {
    const strengths = [];
    const weaknesses = [];
    const suggestions = [];

    // Strengths
    if (scores.skills.score >= 70) strengths.push(`Strong skills alignment — ${scores.skills.matched.slice(0, 4).join(', ')} match JD requirements`);
    if (scores.experience.score >= 75) strengths.push(`Experience level meets or exceeds the ${jdParsed.requiredYears}+ year requirement`);
    if (scores.education.score >= 75) strengths.push('Educational background aligns well with position requirements');
    if (parsed.certifications.length > 0) strengths.push(`Holds relevant certifications: ${parsed.certifications.slice(0, 2).join(', ')}`);
    if (parsed.github) strengths.push('Active GitHub profile signals practical project experience');
    if (scores.keyword.score >= 65) strengths.push('Resume is well-optimized with relevant industry keywords');
    if (parsed.skills.length >= 15) strengths.push(`Broad technical skillset with ${parsed.skills.length} identified skills`);

    // Weaknesses
    if (scores.skills.score < 50) weaknesses.push(`Missing key JD skills: ${scores.skills.missing.slice(0, 4).join(', ')}`);
    if (scores.experience.score < 50) weaknesses.push(scores.experience.detail);
    if (scores.education.score < 50) weaknesses.push(scores.education.detail);
    if (scores.keyword.score < 40) weaknesses.push('Resume lacks important keywords from the job description — consider ATS optimization');
    if (!parsed.linkedin) weaknesses.push('No LinkedIn profile detected — reduces professional visibility');
    if (parsed.skills.length < 5) weaknesses.push('Very few technical skills detected; resume may need richer detail');

    // Suggestions
    if (scores.skills.missing.length > 0) {
        suggestions.push({
            type: 'skills',
            title: 'Add Missing Skills',
            detail: `Consider adding or developing: ${scores.skills.missing.slice(0, 5).join(', ')}`
        });
    }
    if (scores.keyword.score < 60) {
        suggestions.push({
            type: 'keywords',
            title: 'Optimize for ATS Keywords',
            detail: 'Incorporate job-specific terms naturally into your bullet points and summary section'
        });
    }
    if (!parsed.linkedin) {
        suggestions.push({
            type: 'formatting',
            title: 'Add LinkedIn Profile',
            detail: 'Include a LinkedIn URL in the header — recruiters and ATS systems value this signal'
        });
    }
    if (scores.experience.score < 60) {
        suggestions.push({
            type: 'experience',
            title: 'Quantify Your Achievements',
            detail: 'Add metrics and impact numbers to experience bullets (e.g., "Increased performance by 40%")'
        });
    }
    suggestions.push({
        type: 'formatting',
        title: 'Use Action Verbs',
        detail: 'Start bullet points with strong verbs: Architected, Delivered, Optimized, Led, Automated, Scaled'
    });

    return { strengths, weaknesses, suggestions };
}

// Composite ATS score
function calcATSScore(skillsScore, experienceScore, educationScore, keywordScore, semanticScore) {
    return Math.round(
        skillsScore * 0.35 +
        experienceScore * 0.25 +
        educationScore * 0.15 +
        keywordScore * 0.15 +
        semanticScore * 0.10
    );
}

// ATS blocking / friendly checks
function atsIssues(resumeText) {
    const issues = [];
    const friendly = [];

    if (resumeText.length > 500) friendly.push('Sufficient resume content detected');
    if (/\b(javascript|python|java|react|node)\b/i.test(resumeText)) friendly.push('Technical keywords present');
    if (/@/.test(resumeText)) friendly.push('Contact email found');

    // Potential issues
    if (/[^\x00-\x7F]/.test(resumeText)) issues.push('Non-ASCII characters detected — may confuse some ATS parsers');
    if ((resumeText.match(/\n/g) || []).length < 10) issues.push('Resume appears to have minimal structure/sections');
    if (resumeText.length < 300) issues.push('Resume content too short — ATS prefers 400+ words');
    if (!/objective|summary|profile|about/i.test(resumeText)) issues.push('No professional summary section found — highly recommended');
    if (!/experience|work history|employment/i.test(resumeText)) issues.push('Work experience section not clearly labeled');

    return { issues, friendly };
}

// Main AI screening function
async function analyzeResume(parsed, jdText) {
    const jdParsed = parseJobDescription(jdText);

    const skillResult = calcSkillsScore(parsed.skills, jdParsed.skills);
    const expResult = calcExperienceScore(parsed.yearsExperience, jdParsed.requiredYears);
    const eduResult = calcEducationScore(parsed.rawText, jdParsed.requiredEduLevel);
    const kwResult = calcKeywordScore(parsed.rawText, jdParsed.keywords);
    const semanticScore = calcSemanticScore(parsed.rawText, jdText);

    const scores = {
        skills: { score: skillResult.score, matched: skillResult.matched, missing: skillResult.missing },
        experience: { score: expResult.score, detail: expResult.detail },
        education: { score: eduResult.score, detail: eduResult.detail },
        keyword: { score: kwResult.score, detail: kwResult.detail },
        semantic: semanticScore,
    };

    const atsScore = calcATSScore(
        scores.skills.score,
        scores.experience.score,
        scores.education.score,
        scores.keyword.score,
        scores.semantic
    );

    const insights = generateInsights(parsed, jdParsed, scores);
    const atsCheck = atsIssues(parsed.rawText);

    return {
        atsScore,
        scores,
        insights,
        atsCheck,
        jdParsed,
    };
}

module.exports = { analyzeResume };
