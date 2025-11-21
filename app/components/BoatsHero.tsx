"use client";

import { useEffect, useMemo, useState } from "react";
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

type PriceFilter = string;
type InteriorFilter = "Cabin" | "Deck" | "Yacht";
type CarouselMode = "Interior" | "Price" | "Service";

export function BoatsHero() {
  // Load yachts data from JSON
  const { yachts, loading, error } = useYachts();
  
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle boat active
  const [priceFilter, setPriceFilter] = useState<PriceFilter>(""); // Default filter
  const [showDetails, setShowDetails] = useState(false); // Control detail view
  const [selectedBoat, setSelectedBoat] = useState<Yacht | null>(null); // Selected boat for details
  const [interiorImageIndex, setInteriorImageIndex] = useState(0); // Interior carousel index
  const [interiorFilter, setInteriorFilter] = useState<InteriorFilter>("Cabin"); // Filter for interior photos
  const [carouselMode, setCarouselMode] = useState<CarouselMode>("Interior"); // Control carousel type
  const [carouselActiveIndex, setCarouselActiveIndex] = useState(1); // For Price/Service carousel
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Image preview overlay

  const priceRanges = useMemo(() => {
    const unique = new Set<string>();
    yachts.forEach((yacht) => {
      if (yacht.priceRange) {
        unique.add(yacht.priceRange);
      }
    });

    const parseRangeValue = (range: string) => {
      const normalized = range.replace(/\s+/g, "").replace(/\./g, "");

      if (normalized.startsWith("<")) {
        const numberPart = normalized.replace(/[^\d]/g, "");
        return Number(numberPart) || Number.MAX_SAFE_INTEGER;
      }

      if (normalized.startsWith(">")) {
        const numberPart = normalized.replace(/[^\d]/g, "");
        return (Number(numberPart) || 0) + 1;
      }

      const matches = normalized.match(/\d+/g);
      if (matches && matches.length > 0) {
        return Number(matches[0]) || Number.MAX_SAFE_INTEGER;
      }

      return Number.MAX_SAFE_INTEGER;
    };

    return Array.from(unique).sort(
      (a, b) => parseRangeValue(a) - parseRangeValue(b),
    );
  }, [yachts]);

  useEffect(() => {
    if (priceRanges.length > 0) {
      setPriceFilter((prev) =>
        prev && priceRanges.includes(prev) ? prev : priceRanges[0],
      );
    }
  }, [priceRanges]);

  // Sincronizar el índice del carrusel cuando cambia el filtro interior
  useEffect(() => {
    if (carouselMode === "Interior" && selectedBoat && interiorFilter) {
      const filterKey = interiorFilter.toLowerCase() as keyof typeof selectedBoat.images;
      const images = selectedBoat.images[filterKey] || [];
      if (images.length > 0) {
        // Calcular el índice central real para mostrar la imagen del medio
        // Si hay 3 imágenes: índice 1 (0, 1, 2)
        // Si hay 5 imágenes: índice 2 (0, 1, 2, 3, 4)
        const centerIndex = Math.floor(images.length / 2);
        setInteriorImageIndex(centerIndex);
      } else {
        setInteriorImageIndex(0);
      }
    }
  }, [interiorFilter, carouselMode, selectedBoat]);

  // Filtrar yates según el precio seleccionado
  const getFilteredBoats = () => {
    if (yachts.length === 0) return [];

    if (!priceFilter) {
      return yachts.slice(0, 3);
    }

    // Filtrar por precio
    const filtered = yachts.filter((yacht) => yacht.priceRange === priceFilter);

    // Si no hay resultados, devolver los primeros 3 yates
    if (filtered.length === 0) {
      return yachts.slice(0, 3);
    }

    return filtered;
  };

  const handleInteriorImageClick = (index: number, imageSrc: string) => {
    if (index === interiorImageIndex) {
      setPreviewImage(imageSrc);
      return;
    }
    setInteriorImageIndex(index);
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
    // Solo evitar el cambio si ya estamos en modo Interior con el mismo filtro
    if (carouselMode === "Interior" && interiorFilter === filter) return;
    
    setInteriorFilter(filter);
    setCarouselMode("Interior");
    
    // Actualizar el índice central inmediatamente para transición suave
    if (selectedBoat) {
      const filterKey = filter.toLowerCase() as keyof typeof selectedBoat.images;
      const images = selectedBoat.images[filterKey] || [];
      if (images.length > 0) {
        const centerIndex = Math.floor(images.length / 2);
        setInteriorImageIndex(centerIndex);
      } else {
        setInteriorImageIndex(0);
      }
    }
  };

  const handlePriceClick = () => {
    if (carouselMode === "Price") return; // No hacer nada si ya está en Price
    
    setCarouselMode("Price");
    setCarouselActiveIndex(1); // Reset to center
  };

  const handleServiceClick = () => {
    if (carouselMode === "Service") return; // No hacer nada si ya está en Service
    
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

  const carouselItems =
    carouselMode === "Interior"
      ? interiorImages.map((src, idx) => ({
          id: `interior-${idx}`,
          src,
          alt: `${interiorFilter} view ${idx + 1}`,
        }))
      : carouselImages;

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
              transform: "translateX(-50%) translateY(calc(-50% - 4.5cm)) scale(0.58)", 
              position: "absolute", 
              top: "50%", 
              left: "50%",
              zIndex: 60,
              pointerEvents: "auto"
            }}
          >
            
            {/* Carrusel unificado */}
            <div
              className="relative w-[1200px] h-[400px] flex items-center justify-center transition-all duration-700 ease-out"
              style={{ 
                perspective: "1500px", 
                transform: "scale(0.9)"
              }}
            >
              {carouselItems.map((item, index) => {
                const totalItems = carouselItems.length;
                const isInteriorMode = carouselMode === "Interior";
                const isPriceMode = carouselMode === "Price";
                
                // Usar cálculo circular para ambos modos para transición suave
                let distance = (index - (isInteriorMode ? interiorImageIndex : carouselActiveIndex) + totalItems) % totalItems;

                // Ajustar distancia para que sea circular
                if (distance > totalItems / 2) {
                  distance -= totalItems;
                }
                if (distance < -totalItems / 2) {
                  distance += totalItems;
                }

                const absDistance = Math.abs(distance);

                // Mostrar 3 imágenes (1 a cada lado del centro)
                if (absDistance > 1) return null;

                const isCenter = distance === 0;
                const translateX = distance * (isPriceMode ? 120 : 80); // Mayor separación horizontal
                const translateY = isCenter ? 0 : Math.abs(distance) * 8; // Menos separación vertical
                const baseScale = isInteriorMode ? 1 : isPriceMode ? 1.32 : 0.95;
                const scale =
                  (isCenter ? 1.1 : 0.95) * baseScale; // Menos diferencia de escala entre central y laterales
                const zIndex = 10 - absDistance;
                const rotateY = distance * 15; // Menos rotación
                const rotateZ = distance * 2; // Menos rotación Z
                const opacity = isCenter ? 1 : 0.95; // Mayor opacidad en laterales para que se vean mejor
                const isInteriorImage = isInteriorMode;

                const handleItemClick = () => {
                  if (isInteriorImage) {
                    handleInteriorImageClick(index, item.src);
                  } else {
                    if (index === carouselActiveIndex) {
                      setPreviewImage(item.src);
                      return;
                    }
                    setCarouselActiveIndex(index);
                  }
                };

                return (
                  <div
                    key={item.id}
                    onClick={handleItemClick}
                    className="absolute cursor-pointer transition-all duration-700 ease-out hover:scale-105"
                    style={{
                      transform: `translateX(${translateX}%) translateY(${translateY}%) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                      zIndex,
                      opacity,
                      width: isPriceMode ? "520px" : "552px",
                      height: isPriceMode ? "370px" : "396px",
                      pointerEvents: "auto",
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className={`w-full h-full rounded-xl shadow-2xl ${
                        isInteriorImage ? "object-cover" : "object-contain"
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                        imageRendering: "auto",
                        filter: "none", // Todas las imágenes con color completo
                        backgroundColor: undefined,
                        pointerEvents: "none", // Evita que la imagen bloquee el click
                      }}
                    />
                  </div>
                );
              })}
            </div>
            
          </div>

          {/* Imagen del bote - Abajo - Posición fija */}
          <div 
            className="w-auto flex flex-col items-center justify-center relative z-10" 
            style={{ 
              transform: "scale(1.69)",
              position: "absolute",
              bottom: "calc(8vh - 2.2cm)", // Cambia este valor para mover el bote arriba/abajo (más negativo = más abajo)
              left: "50%",
              marginLeft: "-50%",
              width: "100%"
            }}
          >
            <div 
              className="flex items-center justify-center"
              style={{
                width: "423.36px", // 20% más pequeño que el anterior
                height: "282.24px", // 20% más pequeño que el anterior
                margin: "0 auto" // Centrado horizontal
              }}
            >
              <img
                src={selectedBoat.mainImage}
                alt={`${selectedBoat.name} - ${selectedBoat.specs.type}`}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            <div 
              className="flex items-center justify-center gap-4" 
              style={{ 
                position: "relative",
                top: "-2.5cm", // Cambia este valor para mover el texto arriba/abajo (negativo = más arriba, positivo = más abajo)
                marginTop: "0",
                marginBottom: "0",
                transform: "translateX(0.3cm)" // Mueve todo el contenedor 2 cm a la derecha para centrarlo mejor
              }}
            >
              <h2 
                className="font-bold italic text-white" 
                style={{ 
                  fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif", 
                  fontSize: "2.3rem", // Cambia este valor para el tamaño (ej: "1.8rem" = más pequeño, "2.5rem" = más grande)
                  margin: "0"
                }}
              >
                {selectedBoat.name}
              </h2>
              {selectedBoat.maxPeopleImage && (
                <img
                  src={selectedBoat.maxPeopleImage}
                  alt={`Max ${selectedBoat.maxPeople} people`}
                  className="w-auto object-contain"
                  style={{ height: "3.6rem", maxHeight: "3.6rem" }}
                />
              )}
            </div>
            <p className="mt-4 text-white text-center" style={{ transform: "translateY(-2.89cm)", maxWidth: "600px", fontSize: "0.875rem", fontWeight: "300", letterSpacing: "-0.02em" }}>
              {selectedBoat.description}
            </p>
          </div>

          {/* Botón Book Now - Encima del bote */}
          <a
            href="https://api.whatsapp.com/send?phone=17868043744&text=Hello%2C%20I%20need%20more%20info%20to%20rent%20a%20Yacht"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg inline-block"
            style={{ 
              fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
              position: "absolute",
              bottom: "calc(8vh + 2.3cm)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 150,
              pointerEvents: "auto",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              backgroundColor: "#930775",
              textDecoration: "none"
            }}
          >
            Book Now
          </a>

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
      <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: "3cm" }}>
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-auto drop-shadow-2xl" 
          style={{ 
            height: "9.8rem", // 20% más grande (base: 6rem)
            width: "auto"
          }}
        />
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

          // Tamaño estándar para todos los contenedores
          const containerWidth = 756;
          const containerHeight = 504;
          
          // Escala visual para laterales (más pequeños visualmente pero mismo contenedor)
          const visualScale = isCenter ? 1 : 0.67;

          // Calcular posición horizontal (separación ajustada - 20% más juntos)
          let translateX = "0%";
          if (isLeft) translateX = "-64%";
          if (isRight) translateX = "64%";
          if (isFarLeft) translateX = "-168%";   // Oculto a la izquierda
          if (isFarRight) translateX = "168%";   // Oculto a la derecha

          // Ocultar barcos que están muy lejos
          const isVisible = isCenter || isLeft || isRight;

          return (
            <div
              key={boat.id}
              onClick={() => handleBoatClick(index)}
              className="absolute cursor-pointer transition-all duration-1000 ease-in-out group flex items-center justify-center"
              style={{
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
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
                className={`object-contain drop-shadow-2xl transition-all duration-1000 group-hover:animate-float ${
                  isCenter ? "" : "grayscale"
                }`}
                style={{
                  filter: isCenter ? "none" : "grayscale(100%)",
                  width: `${containerWidth * visualScale}px`,
                  height: `${containerHeight * visualScale}px`,
                  maxWidth: "100%",
                  maxHeight: "100%"
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
        {priceRanges.map((range) => (
          <button
            key={range}
            onClick={() => handlePriceFilter(range)}
            className={`px-6 py-3 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
              priceFilter === range
                ? ""
                : "bg-black hover:bg-gray-900"
            }`}
            style={{ 
              fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
              backgroundColor: priceFilter === range ? "#930775" : undefined
            }}
          >
            {range}
          </button>
        ))}
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
