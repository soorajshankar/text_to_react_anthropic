'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          apiKey: apiKey.trim() || undefined
        }),
      });

      if (!response.ok) throw new Error('Failed to generate component');

      const html = await response.text();
      
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.srcdoc = html;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container">
      <div className="content">
        <h1 style={{ color: 'black' }}>React Component Generator</h1>
        
        <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: '100%', padding: '1rem', border: '1px solid #ccc', borderRadius: '0.5rem', marginBottom: '1rem' }}
          placeholder="Optional: Enter your Anthropic API key if not set in environment variables"
        />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the React component you want to generate..."
          />
          <button
            type="submit"
            disabled={loading}
            className={loading ? 'button disabled' : 'button'}
          >
            {loading ? 'Generating...' : 'Generate Component'}
          </button>
        </form>

        <div className="preview">
          <iframe
            ref={iframeRef}
            title="Generated Component"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
