import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import DashboardAdmin from '../../assets/images/paneladmin.png';
import ListaResidentes from '../../assets/images/gestionapartamentos.png';
import GestionPagos from '../../assets/images/pagosgestion.png';
import ReservasResidente from '../../assets/images/reservasresidente.png';
import DashboardResidente from '../../assets/images/panelresidente.png';

const screenshots = [
  {
    src: DashboardAdmin,
    alt: "Dashboard principal del administrador de Ediflow",
    caption: "Gestioná todos tus edificios y residentes desde un solo panel intuitivo.",
  },
  {
    src: ListaResidentes,
    alt: "Gestión de apartamentos con los residentes",
    caption: "Organizá departamentos y residentes sin complicaciones.",
  },
  {
    src: GestionPagos,
    alt: "Pantalla de gestión de pagos",
    caption: "Mantené al día los pagos y controlá los estados de cada unidad fácilmente.",
  },
  {
    src: DashboardResidente,
    alt: "Panel de usuario residente",
    caption: "Permití a tus residentes ver pagos y reservas desde su propio panel.",
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
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={1}
          className="max-w-4xl mx-auto rounded-2xl shadow-xl shadow-black/40"
        >
          {screenshots.map(({ src, alt, caption }, idx) => (
            <SwiperSlide key={idx} className="transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={src}
                alt={alt}
                className="w-full rounded-2xl object-contain shadow-md ring-1 ring-white/10"
              />
              <p className="mt-6 text-edigray text-base italic">{caption}</p>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA debajo del carrusel */}
        <div className="mt-14">
          <button
            className="bg-white text-ediblue font-semibold py-4 px-10 rounded-xl hover:bg-edigray transition-all duration-300 shadow-md"
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
