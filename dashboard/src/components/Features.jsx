import { Zap, Code, Cloud, Rocket, LayoutGrid, Palette } from 'lucide-react';

const features = [
  {
    icon: <Zap size={24} className="text-blue-600" />,
    title: "Blazing Fast Generation",
    description: "Leverage Puppeteer on optimized infrastructure for rapid PDF rendering."
  },
  {
    icon: <Code size={24} className="text-blue-600" />,
    title: "Developer-Friendly API",
    description: "Integrate with RESTful endpoints. Simple requests, powerful results."
  },
  {
    icon: <Cloud size={24} className="text-blue-600" />,
    title: "Scalable Cloud Infrastructure",
    description: "Handle thousands of requests without worrying about server capacity."
  },
  {
    icon: <LayoutGrid size={24} className="text-blue-600" />,
    title: "Flexible Template Engine",
    description: "Use Handlebars with full HTML/CSS support for dynamic content."
  },
  {
    icon: <Rocket size={24} className="text-blue-600" />,
    title: "Asynchronous Processing",
    description: "Queue jobs and get notified via webhooks when PDFs are ready."
  },
  {
    icon: <Palette size={24} className="text-blue-600" />,
    title: "Pixel-Perfect Precision",
    description: "Ensure consistent rendering across all devices and browsers."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
          Unleash the Power of Automated PDFs
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          From invoices to reports, generate any document with ease and precision.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center text-center">
            <div className="mb-4 bg-blue-50 p-3 rounded-full">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;