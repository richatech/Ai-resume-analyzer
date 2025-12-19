const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set. /analyze will fail without a key.');
}

app.post('/analyze', async (req, res) => {
  try {
    const { resumeText, jobText } = req.body;
    if (!resumeText) return res.status(400).json({ error: 'resumeText required' });

    const prompt = `
You are an AI Resume Analyzer. Compare the resume text with the job description and return a JSON with:
- match_percentage (0-100)
- matched_keywords (array)
- missing_keywords (array)
- feedback_summary (short text)

Resume:
${resumeText}

Job Description:
${jobText || ''}

Respond ONLY with valid JSON.
    `;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.2
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const text = response.data?.choices?.[0]?.message?.content;
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      // Try to extract JSON substring if extra text is present
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const substring = text.substring(jsonStart, jsonEnd + 1);
        parsed = JSON.parse(substring);
      } else {
        throw new Error('Could not parse model output as JSON');
      }
    }

    return res.json(parsed);
  } catch (err) {
    console.error('Analyze error', err.message || err);
    return res.status(500).json({ error: String(err.message || err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`AI Resume Analyzer backend listening on ${PORT}`));
