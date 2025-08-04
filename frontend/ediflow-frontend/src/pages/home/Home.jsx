import Navbar from '../../components/landing/Navbar'
import HeroSection from '../../components/landing/HeroSection'
import FeaturesSection from '../../components/landing/FeaturesSection'
import ScreenshotsSection from '../../components/landing/ScreenshotsSection'
import CTASection from '../../components/landing/CTASection'
import Footer from '../../components/landing/Footer'
import PricingPlans from '../../components/landing/PricingPlans'
import WhatsappButton from '../../components/common/WhatsappButton'

const Home = () => {
  return (
    <>
    <Navbar />
      <HeroSection />
      <FeaturesSection id="features" />
      <ScreenshotsSection id="screenshots" />
      <PricingPlans id="pricing"/>
      <CTASection id="contact"/>
      <Footer />
      <WhatsappButton/>
    </>
  )
}

export default Home