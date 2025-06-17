import ImageScreenHero from '../../assets/ImageScreenSection.png';

const ScreenshotsSection = () => {
  return (
    <section className="bg-ediblue py-16">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-[1280px] mx-auto px-4">
        <div className="md:w-1/2 text-white px-4">
          <h2 className="text-4xl font-bold mb-8 text-center md:text-left">
            Una mirada rápida a cómo Ediflow simplifica la gestión de edificios
          </h2>
          <p className="text-edigray text-lg text-center md:text-left">
            Descubrí cómo funciona Ediflow con capturas reales de la plataforma. Desde paneles intuitivos hasta gráficos de pagos mensuales y control total sobre residentes, edificios y departamentos. Todo en un entorno claro, moderno y fácil de usar.
            Lo que ves es lo que obtenés: eficiencia, control y una experiencia impecable.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center px-4 mt-8 md:mt-0">
          <img
            src={ImageScreenHero}
            alt="Captura de pantalla de la plataforma Ediflow mostrando el panel de administración"
            className="rounded max-w-full h-auto shadow-lg shadow-black/50"
          />
        </div>
      </div>
    </section>
  )
}

export default ScreenshotsSection