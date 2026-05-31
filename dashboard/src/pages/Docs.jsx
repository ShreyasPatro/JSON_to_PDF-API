import { Copy, Terminal } from 'lucide-react';

const Endpoint = ({ method, path, desc, body }) => (
  <div className="mb-8 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
    <div className="flex items-center gap-4 p-4 bg-slate-50 border-b">
      <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${
        method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {method}
      </span>
      <code className="text-slate-800 font-mono font-bold">{path}</code>
    </div>
    <div className="p-4">
      <p className="text-slate-600 mb-4">{desc}</p>
      {body && (
        <div className="relative group">
          <div className="absolute right-4 top-4 text-slate-400 group-hover:text-blue-500 cursor-pointer">
            <Copy size={16} />
          </div>
          <pre className="bg-slate-900 text-blue-300 p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  </div>
);

const Docs = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">API Documentation</h1>
      <p className="text-slate-500 mb-10">Integration guide for the PDF Generation Service.</p>

      <Endpoint 
        method="POST"
        path="/api/auth/login"
        desc="Authenticate to receive a Bearer token."
        body={{ email: "user@example.com", password: "yourpassword" }}
      />

      <Endpoint 
        method="POST"
        path="/api/generate-async"
        desc="Queue a PDF generation task. Returns a jobId."
        body={{
          templateId: "pro-invoice-v1",
          data: { customerName: "Shrey", total: "500.00" },
          webhookUrl: "https://yourserver.com/callback"
        }}
      />

      <Endpoint 
        method="GET"
        path="/api/job/:jobId"
        desc="Poll the status of a generation task."
      />
    </div>
  );
};

export default Docs;