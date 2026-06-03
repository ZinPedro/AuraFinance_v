import Hero from '../landing/Hero'
import HowItWorks from '../landing/HowItWorks';
import Footer from '../landing/Footer';
import Objectives from '../landing/objectives'

function LandingPage() {
  return (
    <div>
      <Hero />
      <Objectives />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default LandingPage;