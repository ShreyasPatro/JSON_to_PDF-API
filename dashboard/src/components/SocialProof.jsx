const stats = [
  { value: "100K+", label: "PDFs Generated" },
  { value: "99.9%", label: "API Uptime" },
  { value: "50+", label: "Happy Developers" }
];

const SocialProof = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-12 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <p className="text-5xl font-extrabold text-blue-400 mb-2">{stat.value}</p>
            <p className="text-xl font-medium text-slate-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialProof;