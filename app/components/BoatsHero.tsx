"use client";

import { useState } from "react";
import { useYachts, type Yacht } from "@/lib/hooks/useYachts";

/**
 * BoatsHero Component
 *
 * Hero section with interactive carousel of yachts:
 * - Central yacht: larger size, full color
 * - Side yachts: smaller, black and white filter
 * - Click any yacht to rotate it to center
 * - Data loaded dynamically from JSON
 */

type PriceFilter = "<1000" | "<2000" | "<3000" | ">4000";
type InteriorFilter = "Cabin" | "Deck" | "Yacht";
type CarouselMode = "Interior" | "Price" | "Service";

export function BoatsHero() {
  // Load yachts data from JSON
  const { yachts, loading, error } = useYachts();
  
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle boat active
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("<1000"); // Default filter
  const [showDetails, setShowDetails] = useState(false); // Control detail view
  const [selectedBoat, setSelectedBoat] = useState<Yacht | null>(null); // Selected boat for details
  const [interiorImageIndex, setInteriorImageIndex] = useState(0); // Interior carousel index
  const [interiorFilter, setInteriorFilter] = useState<InteriorFilter>("Cabin"); // Filter for interior photos
  const [carouselMode, setCarouselMode] = useState<CarouselMode>("Interior"); // Control carousel type
  const [carouselActiveIndex, setCarouselActiveIndex] = useState(1); // For Price/Service carousel
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Image preview overlay

  // Filtrar yates según el precio seleccionado
  const getFilteredBoats = () => {
    if (yachts.length === 0) return [];
    
    // Filtrar por precio
    const filtered = yachts.filter(yacht => yacht.priceRange === priceFilter);
    
    // Si no hay resultados, devolver los primeros 3 yates
    if (filtered.length === 0) {
      return yachts.slice(0, 3);
    }
    
    return filtered;
  };

  const handleInteriorImageClick = (index: number, imageSrc: string) => {
    setInteriorImageIndex(index);
    if (index === interiorImageIndex) {
      setPreviewImage(imageSrc);
    }
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const filteredBoats = getFilteredBoats();

  // Loading state
  if (loading) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white text-2xl">Loading yachts...</div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center bg-black">
        <div className="text-red-500 text-2xl">Error: {error}</div>
      </section>
    );
  }

  // No yachts state
  if (yachts.length === 0) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white text-2xl">No yachts available</div>
      </section>
    );
  }

  // Get the current arrangement based on active index
  const getBoatPosition = (index: number) => {
    const totalBoats = filteredBoats.length;
    let diff = (index - activeIndex + totalBoats) % totalBoats;
    
    // Para 3 barcos, solo hay left, center, right
    if (totalBoats === 3) {
      if (diff === 0) return "center";  // Centro
      if (diff === 1) return "right";   // Derecha
      return "left";                    // Izquierda
    }
    
    // Para 5 barcos (lógica original)
    if (diff > 2) diff -= totalBoats;
    
    if (diff === 0) return "center";                    // Centro (visible)
    if (diff === 1 || diff === -4) return "right";      // Derecha (visible)
    if (diff === -1 || diff === 4) return "left";       // Izquierda (visible)
    if (diff === 2 || diff === -3) return "far-right";  // Muy derecha (oculto)
    return "far-left";                                  // Muy izquierda (oculto)
  };

  const handlePriceFilter = (filter: PriceFilter) => {
    setPriceFilter(filter);
    setActiveIndex(1); // Reset to middle boat when filter changes
  };

  const handleBoatClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleShowDetails = (yacht: Yacht) => {
    setSelectedBoat(yacht);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBoat(null);
    setInteriorFilter("Cabin"); // Reset filter when closing
  };

  const handleInteriorFilter = (filter: InteriorFilter) => {
    setInteriorFilter(filter);
    setInteriorImageIndex(0); // Reset to first image when filter changes
    setCarouselMode("Interior"); // Switch to interior mode
  };

  const handlePriceClick = () => {
    setCarouselMode("Price");
    setCarouselActiveIndex(1); // Reset to center
  };

  const handleServiceClick = () => {
    setCarouselMode("Service");
    setCarouselActiveIndex(1); // Reset to center
  };

  // Interior images based on filter - DYNAMIC from yacht data
  const getInteriorImages = () => {
    if (!selectedBoat) return [];
    
    const filterKey = interiorFilter.toLowerCase() as keyof typeof selectedBoat.images;
    return selectedBoat.images[filterKey] || [];
  };

  // Carousel images for Price and Service modes - DYNAMIC from yacht data
  const getCarouselImages = () => {
    if (!selectedBoat) return [];
    
    if (carouselMode === "Price") {
      return selectedBoat.images.charter.map((src, idx) => ({
        id: idx + 1,
        src,
        alt: `Charter option ${idx + 1}`
      }));
    } else if (carouselMode === "Service") {
      return selectedBoat.images.services.map((src, idx) => ({
        id: idx + 1,
        src,
        alt: `Service option ${idx + 1}`
      }));
    }
    return [];
  };

  const interiorImages = getInteriorImages();
  const carouselImages = getCarouselImages();

  return (
    <section
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url(/bg-miami.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay con degradado inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Vista de detalles */}
      {showDetails && selectedBoat && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center px-12 pointer-events-auto" style={{ perspective: "2000px" }}>
          {/* Botón cerrar */}
          <button
            onClick={handleCloseDetails}
            className="absolute top-8 right-8 px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 hover:scale-105 transition-all duration-300 shadow-lg z-50"
            style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}
          >
            ← Back
          </button>

          {/* Texto Max people */}
          <div className="absolute left-1/2 text-white text-center z-50" style={{ top: "calc(2rem + 1cm)", transform: "translateX(-50%)" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: "300", fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}>
              Max <span style={{ fontSize: "2.5rem", fontWeight: "bold", fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}>{selectedBoat.maxPeople}</span> people per boat
            </p>
          </div>

          {/* Botón More photos - Solo en Cabin, Deck, Yacht */}
          {carouselMode === "Interior" && selectedBoat.morePhotosUrl && (
            <a 
              href={selectedBoat.morePhotosUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
              style={{ 
                fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
                position: "absolute",
                top: "calc(28% + 3.5cm)",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 150,
                pointerEvents: "auto",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                backgroundColor: "#930775"
              }}
            >
              More photos
            </a>
          )}

          {/* Carrusel de fotos interiores - Posición absoluta en el centro */}
          <div 
            className="w-auto flex flex-col items-center justify-center" 
            style={{ 
              transform: "translateX(-50%) translateY(calc(-50% - 4.5cm)) scale(0.644)", 
              position: "absolute", 
              top: "50%", 
              left: "50%",
              zIndex: 60,
              pointerEvents: "auto"
            }}
          >
            
            {/* Carrusel estilo Interior (cóncavo 3D) */}
            {carouselMode === "Interior" && (
            <div className="relative w-[900px] h-[400px] flex items-center justify-center" style={{ perspective: "1500px" }}>
              {/* Imágenes en disposición circular */}
              {interiorImages.map((img, idx) => {
                const distance = idx - interiorImageIndex;
                const absDistance = Math.abs(distance);
                
                // Mostrar 5 imágenes (2 a cada lado del centro)
                if (absDistance > 2) return null;
                
                // Calcular transformaciones para efecto circular cóncavo
                const isCenter = distance === 0;
                const translateX = distance * 42; // Espaciado horizontal para 5 imágenes (30% más pegadas)
                const translateY = isCenter ? 0 : Math.abs(distance) * 12; // Crear arco hacia abajo (cóncavo)
                const scale = isCenter ? 1.2 : 1.05 - absDistance * 0.05;
                const zIndex = 10 - absDistance;
                const rotateY = distance * 20; // Rotación para efecto circular
                const rotateZ = distance * 3; // Rotación en Z suavizada
                const opacity = isCenter ? 1 : 0.85 - absDistance * 0.08;
                
                return (
                  <div
                    key={idx}
                    onClick={() => handleInteriorImageClick(idx, img)}
                    className="absolute cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      transform: `translateX(${translateX}%) translateY(${translateY}%) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                      zIndex,
                      opacity,
                      width: "552px",
                      height: "396px",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Interior ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl shadow-2xl"
                      style={{ 
                        transformStyle: "preserve-3d",
                        imageRendering: "auto",
                        filter: isCenter ? "none" : "grayscale(25%)",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            )}

            {/* Carrusel estilo página inicial (Price & Service) */}
            {(carouselMode === "Price" || carouselMode === "Service") && (
            <div className="relative w-[1200px] h-[500px] flex items-center justify-center">
              {carouselImages.map((img, index) => {
                const distance = (index - carouselActiveIndex + carouselImages.length) % carouselImages.length;
                const normalizedDistance = distance > carouselImages.length / 2 ? distance - carouselImages.length : distance;
                const absDistance = Math.abs(normalizedDistance);

                // Mostrar 5 imágenes (2 a cada lado del centro)
                if (absDistance > 2) return null;

                const isCenter = normalizedDistance === 0;

                // Tamaños: central más grande, laterales escalonados
                let width, height, scale;
                if (isCenter) {
                  width = 624; height = 415; scale = 1;
                } else if (absDistance === 1) {
                  width = 480; height = 319; scale = 0.95;
                } else {
                  width = 384; height = 255; scale = 0.9;
                }

                // Calcular posición horizontal para 5 imágenes (separación aumentada)
                const translateX = normalizedDistance * 60;

                return (
                  <div
                    key={img.id}
                    onClick={() => setCarouselActiveIndex(index)}
                    className="absolute cursor-pointer transition-all duration-1000 ease-in-out"
                    style={{
                      width: `${width}px`,
                      height: `${height}px`,
                      left: "50%",
                      transform: `translateX(calc(-50% + ${translateX}%)) scale(${scale})`,
                      zIndex: 20 - absDistance,
                      opacity: isCenter ? 1 : 0.85 - absDistance * 0.05,
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-contain drop-shadow-2xl transition-all duration-1000"
                    />
                  </div>
                );
              })}
            </div>
            )}

          </div>

          {/* Imagen del bote - Abajo - Posición fija */}
          <div 
            className="w-auto flex flex-col items-center justify-center relative z-10" 
            style={{ 
              transform: "scale(1.69)",
              position: "absolute",
              bottom: "calc(8vh - 2cm)",
              left: "50%",
              marginLeft: "-50%",
              width: "100%"
            }}
          >
            <img
              src={selectedBoat.mainImage}
              alt={`${selectedBoat.name} - ${selectedBoat.specs.type}`}
              className="max-w-xl w-auto h-auto object-contain drop-shadow-2xl"
            />
            <h2 className="mt-6 text-4xl font-bold italic text-white" style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif", transform: "translateY(-3.5cm)" }}>
              {selectedBoat.name}
            </h2>
            <p className="mt-4 text-white text-center" style={{ transform: "translateY(-3.5cm)", maxWidth: "600px", fontSize: "0.875rem", fontWeight: "300", letterSpacing: "-0.02em" }}>
              {selectedBoat.description}
            </p>
          </div>

          {/* Botón Book Now - Encima del bote */}
          <button
            className="px-8 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            style={{ 
              fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
              position: "absolute",
              bottom: "calc(8vh + 3cm)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 150,
              pointerEvents: "auto",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              backgroundColor: "#930775"
            }}
          >
            Book Now
          </button>

          {/* Botones de filtro de interiores - Posición absoluta clickeable */}
          <div className="absolute left-1/2 -translate-x-1/2 flex justify-center gap-4" style={{ top: "50%", zIndex: 100, pointerEvents: "auto" }}>
            <button
              onClick={() => handleInteriorFilter("Cabin")}
              className={`px-6 py-1.5 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
                carouselMode === "Interior" && interiorFilter === "Cabin"
                  ? ""
                  : "bg-black hover:bg-gray-900"
              }`}
              style={{ 
                fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
                backgroundColor: carouselMode === "Interior" && interiorFilter === "Cabin" ? "#930775" : undefined,
                pointerEvents: "auto"
              }}
            >
              Cabin
            </button>
            <button
              onClick={() => handleInteriorFilter("Deck")}
              className={`px-6 py-1.5 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
                carouselMode === "Interior" && interiorFilter === "Deck"
                  ? ""
                  : "bg-black hover:bg-gray-900"
              }`}
              style={{ 
                fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
                backgroundColor: carouselMode === "Interior" && interiorFilter === "Deck" ? "#930775" : undefined,
                pointerEvents: "auto"
              }}
            >
              Deck
            </button>
            <button
              onClick={() => handleInteriorFilter("Yacht")}
              className={`px-6 py-1.5 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
                carouselMode === "Interior" && interiorFilter === "Yacht"
                  ? ""
                  : "bg-black hover:bg-gray-900"
              }`}
              style={{ 
                fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
                backgroundColor: carouselMode === "Interior" && interiorFilter === "Yacht" ? "#930775" : undefined,
                pointerEvents: "auto"
              }}
            >
              Yacht
            </button>
            <button
              onClick={handlePriceClick}
              className={`px-6 py-1.5 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
                carouselMode === "Price"
                  ? ""
                  : "bg-black hover:bg-gray-900"
              }`}
              style={{ 
                fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
                backgroundColor: carouselMode === "Price" ? "#930775" : undefined,
                pointerEvents: "auto"
              }}
            >
              Price
            </button>
            <button
              onClick={handleServiceClick}
              className={`px-6 py-1.5 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
                carouselMode === "Service"
                  ? ""
                  : "bg-black hover:bg-gray-900"
              }`}
              style={{ 
                fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
                backgroundColor: carouselMode === "Service" ? "#930775" : undefined,
                pointerEvents: "auto"
              }}
            >
              Service
            </button>
          </div>
        </div>
      )}

      {/* Logo - Solo en vista principal */}
      {!showDetails && (
      <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: "2cm" }}>
        <img src="/logo.png" alt="Logo" className="h-24 md:h-28 lg:h-32 w-auto drop-shadow-2xl" />
      </div>
      )}

      {/* Badge - Solo en vista principal */}
      {!showDetails && (
      <div className="relative z-10 mb-6" style={{ transform: "translateY(-1cm)" }}>
        <span className="inline-block px-6 py-3 text-sm font-semibold tracking-widest uppercase bg-black text-white rounded-xl" style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}>
          TAKE THE RIDE • LIVE THE EXPERIENCE
        </span>
      </div>
      )}

      {/* H1 - Solo en vista principal */}
      {!showDetails && (
      <h1 className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-bold italic text-white mb-12 text-center drop-shadow-2xl" style={{ transform: "translateY(-1cm)", lineHeight: "0.9", letterSpacing: "0.04em" }}>
        MIAMI YACHT RENTALS
      </h1>
      )}

      {/* Carrusel de Barcos Filtrados */}
      {!showDetails && (
      <div className="absolute inset-0 flex items-end justify-center" style={{ bottom: "calc(20% - 3.5cm)" }}>
        {filteredBoats.map((boat, index) => {
          const position = getBoatPosition(index);
          const isCenter = position === "center";
          const isLeft = position === "left";
          const isRight = position === "right";
          const isFarLeft = position === "far-left";
          const isFarRight = position === "far-right";

          // Tamaños: lateral 40% más grande (504x336), central 50% más grande que laterales (756x504)
          const width = isCenter ? 756 : 504;
          const height = isCenter ? 504 : 336;

          // Calcular posición horizontal (separación ajustada)
          let translateX = "0%";
          if (isLeft) translateX = "-105%";
          if (isRight) translateX = "105%";
          if (isFarLeft) translateX = "-210%";   // Oculto a la izquierda
          if (isFarRight) translateX = "210%";   // Oculto a la derecha

          // Ocultar barcos que están muy lejos
          const isVisible = isCenter || isLeft || isRight;

          return (
            <div
              key={boat.id}
              onClick={() => handleBoatClick(index)}
              className="absolute cursor-pointer transition-all duration-1000 ease-in-out group"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                left: "50%",
                transform: `translateX(calc(-50% + ${translateX})) translateY(${isCenter ? "0" : "-1.5cm"}) ${isCenter ? "scale(1)" : "scale(0.95)"}`,
                zIndex: isCenter ? 20 : 10,
                opacity: isVisible ? (isCenter ? 1 : 0.9) : 0,
                pointerEvents: isVisible ? "auto" : "none",
              }}
            >
              <img
                src={boat.mainImage}
                alt={`${boat.name} - ${boat.specs.type}`}
                width={width}
                height={height}
                className={`object-contain drop-shadow-2xl transition-all duration-1000 group-hover:animate-float ${
                  isCenter ? "" : "grayscale"
                }`}
                style={{
                  filter: isCenter ? "none" : "grayscale(100%)",
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              />
              {boat.name && isCenter && (
                <button 
                  onClick={() => handleShowDetails(boat)}
                  className="absolute left-1/2 -translate-x-1/2 px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 hover:scale-105 shadow-lg whitespace-nowrap animate-scale-in"
                  style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif", bottom: "3.5cm" }}
                >
                  {boat.name} Details
                </button>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Botones de precio */}
      {!showDetails && (
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-30">
        <button
          onClick={() => handlePriceFilter("<1000")}
          className={`px-6 py-3 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
            priceFilter === "<1000"
              ? ""
              : "bg-black hover:bg-gray-900"
          }`}
          style={{ 
            fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
            backgroundColor: priceFilter === "<1000" ? "#930775" : undefined
          }}
        >
          &lt;1,000 USD
        </button>
        <button
          onClick={() => handlePriceFilter("<2000")}
          className={`px-6 py-3 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
            priceFilter === "<2000"
              ? ""
              : "bg-black hover:bg-gray-900"
          }`}
          style={{ 
            fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
            backgroundColor: priceFilter === "<2000" ? "#930775" : undefined
          }}
        >
          &lt;2,000 USD
        </button>
        <button
          onClick={() => handlePriceFilter("<3000")}
          className={`px-6 py-3 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
            priceFilter === "<3000"
              ? ""
              : "bg-black hover:bg-gray-900"
          }`}
          style={{ 
            fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
            backgroundColor: priceFilter === "<3000" ? "#930775" : undefined
          }}
        >
          &lt;3,000 USD
        </button>
        <button
          onClick={() => handlePriceFilter(">4000")}
          className={`px-6 py-3 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
            priceFilter === ">4000"
              ? ""
              : "bg-black hover:bg-gray-900"
          }`}
          style={{ 
            fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
            backgroundColor: priceFilter === ">4000" ? "#930775" : undefined
          }}
        >
          &gt;4,000 USD
        </button>
      </div>
      )}

      {/* Image preview overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-6"
          onClick={handleClosePreview}
        >
          <button
            onClick={handleClosePreview}
            className="absolute top-6 right-6 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-gray-900 transition-colors"
            style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}
          >
            Close
          </button>
          <img
            src={previewImage}
            alt="Interior preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
