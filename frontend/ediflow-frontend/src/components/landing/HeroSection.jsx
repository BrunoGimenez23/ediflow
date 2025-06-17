import ImagenHero from '../../assets/ImagenHero.png'
import Button from '../common/Button'

const HeroSection = () => {
    return (
        <div className="bg-edigray w-full">
            <div className="bg-edigray py-20 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-0">
                
      <div className="text-center md:text-left md:max-w-md">
        <h1 className="text-4xl font-bold text-editext mb-4">
          Gestioná tu edificio con facilidad
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Ediflow te ayuda a administrar residentes, pagos y más.
        </p>
        <Button variant="primary" size="lg" onClick={() => console.log('Registro')}>
          Registrate gratis
        </Button>
      </div>

      <div className="mt-8 md:mt-0 md:ml-20">
        <img
          src={ImagenHero}
          alt="Ediflow Hero"
          className="mx-auto rounded-lg shadow-lg max-w-xs md:max-w-md"
        />
      </div>

    </div>
        </div>
        
    )
}

export default HeroSection  