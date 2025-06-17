import Navbar from '../../components/landing/Navbar'
import HeroSection from '../../components/landing/HeroSection'
import FeaturesSection from '../../components/landing/FeaturesSection'
import ScreenshotsSection from '../../components/landing/ScreenshotsSection'
import CTASection from '../../components/landing/CTASection'
import Footer from '../../components/landing/Footer'
import PricingPlans from '../../components/landing/PricingPlans'

const Home = () => {
  return (
    <>
    <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <PricingPlans/>
      <CTASection />
      <Footer />
    </>
  )
}

export default Home