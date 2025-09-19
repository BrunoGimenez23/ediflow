import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import DashboardAdmin from '../../assets/images/paneladmin.png';
import GestionPagos from '../../assets/images/pagosgestion.png';
import ReservasResidente from '../../assets/images/reservasresidente.png';
import DashboardResidente from '../../assets/images/panelresidente.png';
import PaymentsChartImg from '../../assets/images/graficosadmin.png';
import PorterPanel from '../../assets/images/panelportero.png';
import AvisosReclamos from '../../assets/images/avisosyreclamos.png';

const screenshots = [
  {
    src: DashboardAdmin,
    alt: "Dashboard principal del administrador de Ediflow",
    caption: "Tu panel central para controlar edificios, residentes, pagos, áreas comunes y portería de manera intuitiva.",
  },
  {
    src: PaymentsChartImg,
    alt: "Gráfico de pagos",
    caption: "Visualizá pagos pagados, pendientes y vencidos de manera clara y rápida.",
  },
  {
    src: AvisosReclamos,
    alt: "Gestión de avisos y reclamos",
    caption: "Recibí y gestioná avisos y reclamos de los residentes rápidamente.",
  },
  {
    src: PorterPanel,
    alt: "Panel de portería",
    caption: "Registrá paquetes y visitas de manera sencilla.",
  },
  {
    src: DashboardResidente,
    alt: "Panel de usuario residente",
    caption: "Permití a tus residentes ver pagos, paquetes, visitas, avisos y reservas desde su propio panel.",
  },
  {
    src: ReservasResidente,
    alt: "Gestión de reservas para residentes",
    caption: "Reservas de espacios comunes al alcance de un clic.",
  },
];

const ScreenshotsSection = ({ id }) => {
  const navigate = useNavigate();

  return (
    <section id={id} className="bg-ediblue py-20 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-10">
          Descubrí cómo Ediflow transforma la administración de edificios
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true, bulletActiveClass: 'bg-white' }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={1} // Solo un slide visible
          className="max-w-4xl mx-auto rounded-2xl shadow-xl shadow-black/30"
        >
          {screenshots.map(({ src, alt, caption }, idx) => (
            <SwiperSlide key={idx} className="transition-transform duration-500 hover:scale-105 cursor-pointer">
              <div className="relative">
                <img
                  src={src}
                  alt={alt}
                  className="w-full rounded-2xl object-contain shadow-md ring-1 ring-white/10"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-4 rounded-b-2xl">
                  <p className="text-white text-base italic">{caption}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA debajo del carrusel */}
        <div className="mt-14">
          <button
            className="bg-white text-ediblue font-semibold py-4 px-10 rounded-xl hover:bg-edigray transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
            onClick={() => navigate('/auth/register-admin')}
          >
            Empezar prueba gratis
          </button>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
