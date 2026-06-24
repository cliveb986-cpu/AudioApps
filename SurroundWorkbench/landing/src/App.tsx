import Nav from './components/Nav'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import Features from './components/Features'
import Install from './components/Install'
import Gallery from './components/Gallery'
import ConfigPreview from './components/ConfigPreview'
import Faq from './components/Faq'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="grain relative min-h-screen overflow-x-hidden">
      <Nav />
      <main className="relative z-10">
        <Hero />
        <TrustStrip />
        <Features />
        <Install />
        <Gallery />
        <ConfigPreview />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
