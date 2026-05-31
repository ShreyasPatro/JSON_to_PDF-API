import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        V1.0 Now Live for Developers
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
        Generate Professional PDFs <br />
        <span className="text-blue-600">Via Simple API Calls</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
        Stop fighting with print CSS. Use our scalable API to turn HTML templates 
        into pixel-perfect PDFs in seconds. Built for developers, by developers.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/login" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2">
          Get Started for Free <ArrowRight size={20} />
        </Link>
        <Link to="/docs" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition">
          View API Docs
        </Link>
      </div>
      <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-2xl max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-xl p-6 text-left overflow-hidden">
          <code className="text-blue-400">POST</code> <code className="text-white">/api/generate-async</code>
          <pre className="text-slate-400 mt-4 text-sm font-mono">
{`{
  "templateId": "invoice-v1",
  "data": { "total": "500.00", "client": "Shrey" }
}`}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default Hero;