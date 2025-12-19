import React, { useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

export default function ResumeApp() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/analyze', { resumeText, jobText });
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert('Analyze failed. Check backend and OPENAI_API_KEY.');
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">AI Resume Analyzer</h1>

      <div className="w-full max-w-3xl bg-white p-6 rounded shadow">
        <label className="block mb-2 font-medium">Upload resume (txt) or paste text</label>
        <input type="file" accept=".txt" onChange={handleFile} className="mb-4" />
        <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)} rows={6} className="w-full border p-2 mb-4" placeholder="Paste resume text here" />
        <label className="block mb-2 font-medium">Job description (optional)</label>
        <textarea value={jobText} onChange={e=>setJobText(e.target.value)} rows={4} className="w-full border p-2 mb-4" placeholder="Paste job description here" />

        <div className="flex gap-3">
          <button onClick={handleAnalyze} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {analysis && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Results</h2>
            <p>Match: {analysis.match_percentage}%</p>

            <Chart
              chartType="PieChart"
              data={[
                ['Type', 'Count'],
                ['Matched', (analysis.matched_keywords || []).length],
                ['Missing', (analysis.missing_keywords || []).length],
              ]}
              options={{ title: 'Skill Match' }}
              width="100%"
              height="300px"
            />

            <div className="mt-4">
              <h3 className="font-semibold text-green-700">Matched</h3>
              <ul className="list-disc ml-6">
                {(analysis.matched_keywords || []).map((k,i)=>(<li key={i}>{k}</li>))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-red-600">Missing</h3>
              <ul className="list-disc ml-6">
                {(analysis.missing_keywords || []).map((k,i)=>(<li key={i}>{k}</li>))}
              </ul>
            </div>

            <div className="mt-4 italic">{analysis.feedback_summary}</div>
          </div>
        )}
      </div>
    </div>
  );
}
