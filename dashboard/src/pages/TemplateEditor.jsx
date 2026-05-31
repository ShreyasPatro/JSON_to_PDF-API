import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import api from '../api/client';
import { Save, Eye, FileText, Loader2, CheckCircle, Clock, Plus, Download } from 'lucide-react';

const TemplateEditor = () => {
  const [id, setId] = useState(null); 
  const [html, setHtml] = useState('<h1>Hello {{name}}</h1>');
  const [css, setCss] = useState('h1 { color: #2563eb; font-family: sans-serif; }');
  const [templateName, setTemplateName] = useState('Untitled Template');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // New State
  const [lastSaved, setLastSaved] = useState(null);
  const [recentTemplates, setRecentTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  useEffect(() => {
    fetchRecentTemplates();
  }, []);

  const fetchRecentTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const res = await api.get('/templates');
      setRecentTemplates(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { name: templateName, html, css };
      if (id) {
        await api.put(`/templates/${id}`, payload);
      } else {
        const res = await api.post('/templates', payload);
        const newId = res.data.data?.id || res.data.id;
        if (newId) setId(newId);
      }
      setLastSaved(new Date().toLocaleTimeString());
      fetchRecentTemplates();
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = '/login';
      } else {
        alert("Failed to save: " + (err.response?.data?.message || "Error"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // NEW: Download PDF Logic
  const handleDownload = async () => {
    if (!id) return alert("Please save the template first!");
    setIsDownloading(true);
    try {
      const response = await api.post('/templates/generate', {
        templateId: id,
        data: { name: "Test User" }, // Dummy data for preview
        options: { format: 'A4' }
      }, { responseType: 'blob' }); // This is required for binary data

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${templateName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("PDF Generation failed. Ensure your backend engine (Puppeteer) is ready.");
    } finally {
      setIsDownloading(false);
    }
  };

  const loadTemplate = (tpl) => {
    setId(tpl.id);
    setTemplateName(tpl.name);
    setHtml(tpl.html);
    setCss(tpl.css);
    setLastSaved(null);
  };

  const startNew = () => {
    setId(null);
    setTemplateName('Untitled Template');
    setHtml('<h1>Hello {{name}}</h1>');
    setCss('h1 { color: #2563eb; font-family: sans-serif; }');
    setLastSaved(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden -m-8">
      {/* Header Toolbar */}
      <div className="h-16 bg-white border-b px-6 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition" onClick={startNew} title="New Template">
            <Plus className="text-blue-600" size={20} />
          </div>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="font-bold text-slate-800 text-base border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none transition px-1"
            />
            {lastSaved && (
              <span className="text-[10px] text-green-500 flex items-center gap-1 px-1">
                <CheckCircle size={10} /> Saved {lastSaved}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Download Button */}
          <button 
            onClick={handleDownload}
            disabled={!id || isDownloading}
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-200 transition font-bold disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            Download PDF
          </button>

          {/* Save/Update Button */}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition shadow-lg shadow-blue-200 disabled:bg-slate-300 font-bold"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {id ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editors and Preview (Split 50/50) */}
        <div className="flex-[3] flex overflow-hidden border-b">
          {/* LEFT HALF: Code Editors */}
          <div className="w-1/2 flex flex-col border-r bg-slate-900">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="bg-slate-800 px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                <span>HTML Content</span>
              </div>
              <Editor
                height="100%"
                defaultLanguage="html"
                theme="vs-dark"
                value={html}
                onChange={(val) => setHtml(val || '')}
                options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 10 } }}
              />
            </div>
            <div className="flex-1 flex flex-col border-t border-slate-700 min-h-0">
              <div className="bg-slate-800 px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                CSS Styles
              </div>
              <Editor
                height="100%"
                defaultLanguage="css"
                theme="vs-dark"
                value={css}
                onChange={(val) => setCss(val || '')}
                options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 10 } }}
              />
            </div>
          </div>

          {/* RIGHT HALF: Live Preview */}
          <div className="w-1/2 bg-slate-100 flex flex-col overflow-auto p-6 items-center">
            <div className="w-full max-w-[500px] mb-3 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <Eye size={12} /> Real-time Render
              </div>
              <span className="text-[10px]">Standard A4 Ratio</span>
            </div>
            
            <div className="bg-white shadow-xl w-full max-w-[595px] aspect-[1/1.41] origin-top overflow-hidden ring-1 ring-slate-200">
              <iframe 
                title="render-preview"
                className="w-full h-full border-none"
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 30px; font-family: sans-serif; word-wrap: break-word; }
                        ${css}
                      </style>
                    </head>
                    <body>${html}</body>
                  </html>
                `}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Recent Work Tab */}
        <div className="flex-1 bg-white flex flex-col min-h-0">
          <div className="px-6 py-2 border-b bg-slate-50 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Recent Templates
            </h3>
            <span className="text-[10px] text-slate-400">{recentTemplates.length} saved versions</span>
          </div>
          
          <div className="flex-1 overflow-x-auto p-4 flex gap-4 items-start scrollbar-hide">
            {isLoadingTemplates ? (
              <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs italic">
                Loading history...
              </div>
            ) : recentTemplates.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs italic">
                No templates found.
              </div>
            ) : (
              recentTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => loadTemplate(tpl)}
                  className={`flex-shrink-0 w-48 p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                    id === tpl.id 
                      ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/20' 
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${id === tpl.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <FileText size={14} />
                    </div>
                    <div className="font-bold text-slate-800 text-xs truncate">{tpl.name}</div>
                  </div>
                  <div className="text-[9px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {new Date(tpl.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;