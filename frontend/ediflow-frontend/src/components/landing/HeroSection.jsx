import ImagenHero from '../../assets/ImagenHero.png';
import Button from '../common/Button';

const HeroSection = () => {
  return (
    <section className="bg-edigray w-full">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12">
        
        {/* Texto */}
        <div className="text-center md:text-left md:flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-editext mb-6 leading-tight">
            Gestioná tu edificio con facilidad
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Ediflow te ayuda a administrar residentes, pagos y reservas de forma simple y rápida.
          </p>
          <Button variant="primary" size="lg" onClick={() => console.log('Registro')}>
            Registrate gratis
          </Button>
        </div>

        {/* Imagen */}
        <div className="md:flex-1">
          <img
            src={ImagenHero}
            alt="Ediflow Hero"
            className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
