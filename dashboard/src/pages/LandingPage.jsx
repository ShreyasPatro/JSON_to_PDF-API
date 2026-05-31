import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import SocialProof from '../components/SocialProof'; // New import
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />
      <div className="bg-slate-50">
        <HowItWorks />
      </div>
      <Features />
      <SocialProof /> {/* Added SocialProof here */}
      <Footer />
    </div>
  );
};

export default LandingPage;