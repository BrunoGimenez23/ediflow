import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
SwiperCore.use([Navigation, Pagination, Autoplay]);

import DashboardAdmin from '../../assets/images/paneladmin.png';
import ListaResidentes from '../../assets/images/gestionapartamentos.png';
import GestionPagos from '../../assets/images/pagosgestion.png';
import GraficoPagos from '../../assets/images/reservasresidente.png';
import DashboardResidente from '../../assets/images/panelresidente.png';

const screenshots = [
  {
    src: DashboardAdmin,
    alt: "Dashboard principal del administrador de Ediflow",
    caption: "Panel principal para gestionar edificios y pagos.",
  },
  {
    src: ListaResidentes,
    alt: "Lista de residentes y departamentos",
    caption: "Administrá residentes y departamentos fácilmente.",
  },
  {
    src: GestionPagos,
    alt: "Pantalla de gestión de pagos",
    caption: "Control total de pagos y vencimientos.",
  },
  {
    src: GraficoPagos,
    alt: "Gráfico de pagos mensuales",
    caption: "Visualizá estadísticas y pagos con gráficos claros.",
  },
  {
    src: DashboardResidente,
    alt: "Panel de usuario residente",
    caption: "Acceso rápido para residentes a pagos y reservas.",
  },
];

const ScreenshotsSection = () => {
  return (
    <section className="bg-ediblue py-20">
      <div className="max-w-7xl mx-auto px-6 text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-10">
          Una mirada rápida a cómo Ediflow simplifica la gestión
        </h2>

        <Swiper
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={1}
          className="max-w-4xl mx-auto rounded-2xl shadow-xl shadow-black/40"
        >
          {screenshots.map(({ src, alt, caption }, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={src}
                alt={alt}
                className="w-full rounded-2xl object-contain"
              />
              <p className="mt-4 text-edigray text-base italic">{caption}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
