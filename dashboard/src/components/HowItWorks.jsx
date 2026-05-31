const steps = [
  { title: "Design", desc: "Create your HTML/CSS templates in our interactive editor." },
  { title: "Connect", desc: "Integrate our REST API into your application with a single endpoint." },
  { title: "Deliver", desc: "We handle the rendering and storage. You get the download link." }
];

const HowItWorks = () => {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-16">How it Works</h2>
      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <div key={i} className="relative text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
              {i + 1}
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-slate-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default HowItWorks;