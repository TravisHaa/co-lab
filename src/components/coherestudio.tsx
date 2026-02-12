import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  FileText, 
  PenTool, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle, 
  Loader2, 
  Settings,
  ChevronRight,
  Eraser,
  Zap
} from 'lucide-react';

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, variant = 'primary', className = "", icon: Icon }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600",
    ghost: "bg-transparent hover:bg-slate-700/50 text-slate-400 hover:text-slate-200",
    outline: "border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, minHeight = "h-32" }) => (
  <div className="space-y-1.5 flex-1 flex flex-col">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none ${minHeight}`}
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>}
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <ChevronRight size={16} className="rotate-90" />
      </div>
    </div>
  </div>
);

const ResultBox = ({ title, content, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative group">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-800">
        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
          {isLoading ? <Loader2 size={14} className="animate-spin text-indigo-400" /> : <Sparkles size={14} className="text-indigo-400" />}
          {title}
        </h3>
        {content && !isLoading && !error && (
          <button 
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-slate-700/50 px-2 py-1 rounded-md"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto min-h-[200px] text-sm leading-relaxed text-slate-300">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-2 bg-slate-800 rounded w-3/4"></div>
            <div className="h-2 bg-slate-800 rounded w-full"></div>
            <div className="h-2 bg-slate-800 rounded w-5/6"></div>
            <div className="h-2 bg-slate-800 rounded w-4/6"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-400 gap-2 p-4 text-center">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        ) : content ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
            <Zap size={24} className="opacity-20" />
            <p>Result will appear here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- App Logic ---

export default function CohereStudio() {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(true);
  const [activeTab, setActiveTab] = useState('summarize');
  
  // State for tools
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Settings for tools
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryFormat, setSummaryFormat] = useState('paragraph');
  const [draftTone, setDraftTone] = useState('professional');
  const [refineStyle, setRefineStyle] = useState('concise');

  // Load key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('cohere_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setShowKeyInput(false);
    }
  }, []);

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('cohere_api_key', apiKey);
      setShowKeyInput(false);
    }
  };

  const clearKey = () => {
    localStorage.removeItem('cohere_api_key');
    setApiKey('');
    setShowKeyInput(true);
  };

  const clearAll = () => {
    setInputText('');
    setGeneratedText('');
    setError(null);
  };

  // Generic API Caller
  const callCohere = async (endpoint, payload) => {
    setLoading(true);
    setError(null);
    setGeneratedText('');

    if (!apiKey) {
      setError("Please enter your API Key in settings.");
      setLoading(false);
      setShowKeyInput(true);
      return;
    }

    try {
      const response = await fetch(`https://api.cohere.ai/v1${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Client-Name': 'cohere-studio-demo'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    const data = await callCohere('/summarize', {
      text: inputText,
      length: summaryLength,
      format: summaryFormat,
      model: 'summarize-xlarge',
      extractiveness: 'low',
      temperature: 0.3,
    });

    if (data && data.summary) {
      setGeneratedText(data.summary);
    }
  };

  const handleDraft = async () => {
    if (!inputText.trim()) {
      setError("Please enter a topic or instruction.");
      return;
    }

    // Using chat endpoint for better instruction following
    const data = await callCohere('/chat', {
      message: `Write a ${draftTone} piece about: ${inputText}.`,
      model: "command",
      temperature: 0.7,
    });

    if (data && data.text) {
      setGeneratedText(data.text);
    }
  };

  const handleRefine = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to refine.");
      return;
    }

    const promptMap = {
      concise: "Rewrite the following text to be more concise and clear:",
      formal: "Rewrite the following text to be more formal and professional:",
      casual: "Rewrite the following text to be more casual and friendly:",
      exciting: "Rewrite the following text to sound exciting and energetic:"
    };

    const data = await callCohere('/chat', {
      message: `${promptMap[refineStyle]} "${inputText}"`,
      model: "command",
      temperature: 0.4,
    });

    if (data && data.text) {
      setGeneratedText(data.text);
    }
  };

  const handleAction = () => {
    if (activeTab === 'summarize') handleSummarize();
    else if (activeTab === 'draft') handleDraft();
    else if (activeTab === 'refine') handleRefine();
  };

  // Tab Content Configuration
  const tabs = [
    { id: 'summarize', label: 'Summarizer', icon: FileText, color: 'text-blue-400' },
    { id: 'draft', label: 'Writer', icon: PenTool, color: 'text-purple-400' },
    { id: 'refine', label: 'Refiner', icon: Sparkles, color: 'text-emerald-400' },
  ];

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'summarize': return "Paste an article, email, or report here to get a quick summary...";
      case 'draft': return "Enter a topic (e.g., 'The benefits of remote work') or a specific instruction...";
      case 'refine': return "Paste the text you want to rewrite or improve...";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Co-Lab <span className="text-slate-500 font-normal">| AI Text Studio</span></h1>
          </div>
          
          <button 
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${apiKey ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'}`}
          >
            <Key size={14} />
            {apiKey ? 'API Key Active' : 'Set API Key'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* API Key Modal/Card */}
        {showKeyInput && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <Card className="border-indigo-500/30 bg-indigo-900/10">
              <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-indigo-100 flex items-center gap-2">
                    <Settings size={18} /> Configure Access
                  </h3>
                  <p className="text-sm text-indigo-300/70">
                    Your API Key is stored locally in your browser. Get one at <a href="https://dashboard.cohere.com/api-keys" target="_blank" rel="noreferrer" className="underline hover:text-indigo-200">cohere.com</a>.
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="paste your cohere-api-key" 
                    className="flex-1 min-w-[240px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <Button variant="primary" onClick={saveKey} className="py-2 text-sm">Save</Button>
                  {apiKey && <Button variant="ghost" onClick={clearKey} className="py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30">Clear</Button>}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 w-fit mx-auto md:mx-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); clearAll(); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={16} className={isActive ? tab.color : ''} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          
          {/* Input Section */}
          <div className="flex flex-col gap-4 h-full">
            <Card className="flex-1 flex flex-col gap-4 h-full border-t-4 border-t-indigo-500">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-200">Input</h2>
                <button onClick={() => setInputText('')} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
                  <Eraser size={12} /> Clear
                </button>
              </div>
              
              <TextArea 
                value={inputText}
                onChange={setInputText}
                placeholder={getPlaceholder()}
                minHeight="h-full"
              />

              {/* Contextual Options */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700/50">
                {activeTab === 'summarize' && (
                  <>
                    <Select 
                      label="Length" 
                      value={summaryLength} 
                      onChange={setSummaryLength}
                      options={[
                        { value: 'short', label: 'Short' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'long', label: 'Long' }
                      ]} 
                    />
                    <Select 
                      label="Format" 
                      value={summaryFormat} 
                      onChange={setSummaryFormat}
                      options={[
                        { value: 'paragraph', label: 'Paragraph' },
                        { value: 'bullets', label: 'Bullet Points' }
                      ]} 
                    />
                  </>
                )}
                {activeTab === 'draft' && (
                  <div className="col-span-2">
                     <Select 
                      label="Tone" 
                      value={draftTone} 
                      onChange={setDraftTone}
                      options={[
                        { value: 'professional', label: 'Professional' },
                        { value: 'casual', label: 'Casual' },
                        { value: 'enthusiastic', label: 'Enthusiastic' },
                        { value: 'informative', label: 'Informative' },
                        { value: 'witty', label: 'Witty' }
                      ]} 
                    />
                  </div>
                )}
                {activeTab === 'refine' && (
                   <div className="col-span-2">
                   <Select 
                    label="Goal" 
                    value={refineStyle} 
                    onChange={setRefineStyle}
                    options={[
                      { value: 'concise', label: 'Make it Concise' },
                      { value: 'formal', label: 'Make it Formal' },
                      { value: 'casual', label: 'Make it Casual' },
                      { value: 'exciting', label: 'Make it Exciting' }
                    ]} 
                  />
                </div>
                )}
              </div>
              
              <Button 
                onClick={handleAction} 
                disabled={loading || !inputText.trim()} 
                className="w-full mt-2"
                icon={loading ? Loader2 : Zap}
              >
                {loading ? 'Processing...' : activeTab === 'summarize' ? 'Summarize Text' : activeTab === 'draft' ? 'Generate Draft' : 'Refine Text'}
              </Button>
            </Card>
          </div>

          {/* Output Section */}
          <div className="h-full">
             <ResultBox 
                title="AI Output" 
                content={generatedText} 
                isLoading={loading}
                error={error}
             />
          </div>

        </div>
      </main>
    </div>
  );
}