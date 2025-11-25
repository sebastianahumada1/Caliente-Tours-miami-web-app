"use client";

import { useEffect, useMemo, useState } from "react";
import { useYachts, type Yacht } from "@/lib/hooks/useYachts";
import { useSwipe } from "@/lib/hooks/useSwipe";

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
  const [isMobile, setIsMobile] = useState(false); // Mobile detection

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
        // Restamos 1 para que "< 1000" (999) aparezca antes que "1000-1500" (1000)
        return (Number(numberPart) || Number.MAX_SAFE_INTEGER) - 1;
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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Swipe handlers for main carousel
  const mainCarouselSwipe = useSwipe(
    () => {
      // Swipe left - next boat
      if (!showDetails) {
        const nextIndex = (activeIndex + 1) % filteredBoats.length;
        setActiveIndex(nextIndex);
      }
    },
    () => {
      // Swipe right - previous boat
      if (!showDetails) {
        const prevIndex = (activeIndex - 1 + filteredBoats.length) % filteredBoats.length;
        setActiveIndex(prevIndex);
      }
    }
  );

  // Swipe handlers for detail carousel
  const detailCarouselSwipe = useSwipe(
    () => {
      // Swipe left - next image
      if (showDetails) {
        if (carouselMode === "Interior") {
          const nextIndex = (interiorImageIndex + 1) % interiorImages.length;
          setInteriorImageIndex(nextIndex);
        } else {
          const nextIndex = (carouselActiveIndex + 1) % carouselItems.length;
          setCarouselActiveIndex(nextIndex);
        }
      }
    },
    () => {
      // Swipe right - previous image
      if (showDetails) {
        if (carouselMode === "Interior") {
          const prevIndex = (interiorImageIndex - 1 + interiorImages.length) % interiorImages.length;
          setInteriorImageIndex(prevIndex);
        } else {
          const prevIndex = (carouselActiveIndex - 1 + carouselItems.length) % carouselItems.length;
          setCarouselActiveIndex(prevIndex);
        }
      }
    }
  );

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
    
    // Calcular la diferencia relativa circular
    let diff = (index - activeIndex + totalBoats) % totalBoats;
    
    // Ajustar diff para que esté en el rango [-totalBoats/2, totalBoats/2]
    if (diff > totalBoats / 2) diff -= totalBoats;
    
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === -1) return "left";
    
    // Cualquier otro bote está "lejos" y debe ocultarse
    // Distinguimos dirección para la animación de salida
    if (diff > 0) return "far-right";
    return "far-left";
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
              className="px-6 md:px-8 text-white text-xs md:text-base font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
              style={{ 
                fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
                position: "absolute",
                top: window.innerWidth < 1024 ? "calc(50% - 2rem)" : "calc(28% + 3.5cm)",
                left: window.innerWidth < 1024 ? "5%" : "50%",
                transform: window.innerWidth < 1024 
                  ? "translateY(-50%) rotate(-90deg)" 
                  : "translateX(-50%)",
                transformOrigin: window.innerWidth < 1024 ? "center center" : "center",
                zIndex: 150,
                pointerEvents: "auto",
                paddingTop: window.innerWidth < 1024 ? "0.4rem" : "0.5rem",
                paddingBottom: window.innerWidth < 1024 ? "0.4rem" : "0.5rem",
                paddingLeft: window.innerWidth < 1024 ? "0.8rem" : undefined,
                paddingRight: window.innerWidth < 1024 ? "0.8rem" : undefined,
                backgroundColor: "#930775",
                fontSize: window.innerWidth < 1024 ? "0.65rem" : undefined
              }}
            >
              More photos
            </a>
          )}

          {/* Carrusel de fotos interiores - Posición absoluta en el centro */}
          <div 
            className={`w-auto flex flex-col items-center ${isMobile ? 'justify-center pt-24' : 'justify-center'}`}
            style={{ 
              transform: isMobile
                ? "translateX(-50%) translateY(-50%)"
                : "translateX(-50%) translateY(calc(-50% - 4.5cm)) scale(0.58)", 
              position: "absolute", 
              top: "50%", 
              left: "50%",
              zIndex: 60,
              pointerEvents: "none"
            }}
            {...detailCarouselSwipe}
          >
            
            {isMobile ? (
              // Mobile layout: vertical with main image on top, two small below
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                {/* Imagen principal arriba */}
                <div className="flex items-center justify-center mb-6">
                  {carouselItems.map((item, index) => {
                    const totalItems = carouselItems.length;
                    const isInteriorMode = carouselMode === "Interior";
                    let distance = (index - (isInteriorMode ? interiorImageIndex : carouselActiveIndex) + totalItems) % totalItems;
                    
                    if (distance > totalItems / 2) distance -= totalItems;
                    if (distance < -totalItems / 2) distance += totalItems;
                    
                    if (distance !== 0) return null; // Solo mostrar la imagen central
                    
                    const handleItemClick = () => {
                      if (isInteriorMode) {
                        handleInteriorImageClick(index, item.src);
                      } else {
                        setPreviewImage(item.src);
                      }
                    };
                    
                    return (
                      <div
                        key={item.id}
                        onClick={handleItemClick}
                        className="cursor-pointer transition-all duration-500 w-[90%] max-w-[300px]"
                        style={{ pointerEvents: "auto" }}
                      >
                        <img
                          src={item.src}
                          alt={item.alt}
                          className={`w-full rounded-xl shadow-2xl ${
                            isInteriorMode ? "object-cover" : "object-contain"
                          }`}
                          style={{
                            height: "180px",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Imágenes de navegación abajo */}
                <div className="flex gap-4 justify-center items-center">
                  {carouselItems.map((item, index) => {
                    const totalItems = carouselItems.length;
                    const isInteriorMode = carouselMode === "Interior";
                    let distance = (index - (isInteriorMode ? interiorImageIndex : carouselActiveIndex) + totalItems) % totalItems;
                    
                    if (distance > totalItems / 2) distance -= totalItems;
                    if (distance < -totalItems / 2) distance += totalItems;
                    
                    // Mostrar solo left (-1) y right (+1)
                    if (distance !== -1 && distance !== 1) return null;
                    
                    const handleItemClick = () => {
                      if (isInteriorMode) {
                        setInteriorImageIndex(index);
                      } else {
                        setCarouselActiveIndex(index);
                      }
                    };
                    
                    return (
                      <div
                        key={item.id}
                        onClick={handleItemClick}
                        className="relative cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95"
                        style={{
                          width: "35vw",
                          maxWidth: "160px",
                          opacity: 0.85,
                          pointerEvents: "auto"
                        }}
                      >
                        <img
                          src={item.src}
                          alt={item.alt}
                          className={`w-full h-auto rounded-xl shadow-xl grayscale ${
                            isInteriorMode ? "object-cover" : "object-contain"
                          }`}
                          style={{
                            transform: "scale(0.6)",
                            filter: "grayscale(100%)"
                          }}
                        />
                        <div 
                          className="absolute inset-0 rounded-xl border-2 border-white/40 pointer-events-none"
                          style={{
                            boxShadow: "0 4px 8px rgba(0,0,0,0.4)"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Desktop layout: horizontal carousel
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

                  // Desktop: mostrar 3 imágenes
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
            )}
            
          </div>

          {/* Imagen del bote - Abajo - Posición fija */}
          <div 
            className="w-auto flex flex-col items-center justify-center relative z-10" 
            style={{ 
              transform: window.innerWidth < 1024 ? "scale(1)" : "scale(1.69)",
              position: "absolute",
              bottom: window.innerWidth < 1024 ? "calc(5vh - 1cm)" : "calc(8vh - 2.2cm)",
              left: "50%",
              marginLeft: "-50%",
              width: "100%"
            }}
          >
            <div 
              className="flex items-center justify-center"
              style={{
                width: window.innerWidth < 1024 ? "336px" : "423.36px",
                height: window.innerWidth < 1024 ? "223.2px" : "282.24px",
                margin: "0 auto"
              }}
            >
              <img
                src={selectedBoat.mainImage}
                alt={`${selectedBoat.name} - ${selectedBoat.specs.type}`}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            <div 
              className="flex items-center justify-center gap-2 md:gap-4 px-4" 
              style={{ 
                position: "relative",
                top: window.innerWidth < 1024 ? "-1.5cm" : "-2.5cm",
                marginTop: "0",
                marginBottom: "0",
                transform: window.innerWidth < 1024 ? "translateX(0)" : "translateX(0.3cm)"
              }}
            >
              <h2 
                className="font-bold italic text-white text-center" 
                style={{ 
                  fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif", 
                  fontSize: window.innerWidth < 1024 ? "1.3rem" : "2.3rem",
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
                  style={{ height: window.innerWidth < 1024 ? "2rem" : "3.6rem", maxHeight: window.innerWidth < 1024 ? "2rem" : "3.6rem" }}
                />
              )}
            </div>
            <p 
              className="mt-4 text-white text-center px-4" 
              style={{ 
                transform: window.innerWidth < 1024 ? "translateY(-1.2cm)" : "translateY(-2.89cm)", 
                maxWidth: window.innerWidth < 1024 ? "90%" : "600px", 
                fontSize: window.innerWidth < 1024 ? "0.75rem" : "0.875rem", 
                fontWeight: "300", 
                letterSpacing: "-0.02em",
                display: window.innerWidth < 1024 ? "none" : "block"
              }}
            >
              {selectedBoat.description}
            </p>
          </div>

          {/* Botón Book Now - Encima del bote */}
          <a
            href="https://api.whatsapp.com/send?phone=17868043744&text=Hello%2C%20I%20need%20more%20info%20to%20rent%20a%20Yacht"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 md:px-8 text-white text-sm md:text-base font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg inline-block"
            style={{ 
              fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
              position: "absolute",
              bottom: window.innerWidth < 1024 ? "calc(5vh + 1.5cm)" : "calc(8vh + 2.3cm)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 150,
              pointerEvents: "auto",
              paddingTop: window.innerWidth < 1024 ? "0.4rem" : "0.5rem",
              paddingBottom: window.innerWidth < 1024 ? "0.4rem" : "0.5rem",
              backgroundColor: "#930775",
              textDecoration: "none"
            }}
          >
            Book Now
          </a>

          {/* Botones de filtro de interiores - Posición absoluta clickeable */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 px-4 ${isMobile ? 'top-[12%] w-[90%] max-w-[300px]' : 'top-[50%] w-auto'}`}
            style={{ pointerEvents: "auto", zIndex: 200 }}
          >
            <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex justify-center gap-4 overflow-x-auto pb-2 scrollbar-hide'}`}>
              <button
                onClick={() => handleInteriorFilter("Cabin")}
                className={`px-4 py-1.5 md:px-6 md:py-1.5 text-xs md:text-base text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap ${isMobile ? 'w-full' : 'flex-shrink-0'} ${
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
                className={`px-4 py-1.5 md:px-6 md:py-1.5 text-xs md:text-base text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap ${isMobile ? 'w-full' : 'flex-shrink-0'} ${
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
                className={`px-4 py-1.5 md:px-6 md:py-1.5 text-xs md:text-base text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap ${isMobile ? 'w-full' : 'flex-shrink-0'} ${
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
                className={`px-4 py-1.5 md:px-6 md:py-1.5 text-xs md:text-base text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap ${isMobile ? 'w-full' : 'flex-shrink-0'} ${
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
                className={`px-4 py-1.5 md:px-6 md:py-1.5 text-xs md:text-base text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap ${isMobile ? 'w-full' : 'flex-shrink-0'} ${
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
        </div>
      )}

      {/* Logo - Solo en vista principal */}
      {!showDetails && (
      <div 
        className={`absolute left-1/2 -translate-x-1/2 z-20 ${isMobile ? '' : 'top-[3cm]'}`}
        style={isMobile ? { top: '4rem' } : undefined}
      >
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-auto drop-shadow-2xl" 
          style={{ 
            height: isMobile ? "4rem" : "9.8rem",
            width: "auto"
          }}
        />
      </div>
      )}

      {/* Badge - Solo en vista principal */}
      {!showDetails && (
      <div 
        className={`z-10 ${isMobile ? 'absolute left-1/2 -translate-x-1/2' : 'relative mb-6 -translate-y-[1cm]'}`}
        style={isMobile ? { top: 'calc(4rem + 4rem + 1cm)' } : undefined}
      >
        <span 
          className={`inline-block px-4 py-2 md:px-6 md:py-3 font-semibold tracking-widest uppercase bg-black text-white rounded-xl ${isMobile ? 'whitespace-nowrap' : ''}`}
          style={{ 
            fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
            fontSize: isMobile ? '0.65rem' : undefined
          }}
        >
          TAKE THE RIDE • LIVE THE EXPERIENCE
        </span>
      </div>
      )}

      {/* H1 - Solo en vista principal */}
      {!showDetails && (
      <h1 
        className={`z-10 font-bold italic text-white text-center drop-shadow-2xl ${
          isMobile ? 'absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2' : 'relative text-7xl lg:text-8xl mb-12 -translate-y-[1cm] px-4'
        }`}
        style={isMobile ? { 
          top: 'calc(4rem + 4rem + 1cm + 2.5rem)', 
          lineHeight: "0.9", 
          letterSpacing: "0.04em",
          fontSize: '1.1rem'
        } : { 
          lineHeight: "0.9", 
          letterSpacing: "0.04em" 
        }}
      >
        MIAMI YACHT RENTALS
      </h1>
      )}

      {/* Carrusel de Barcos Filtrados */}
      {!showDetails && (
      <div 
        className={`absolute ${
          isMobile 
            ? "inset-0 flex flex-col items-center pt-40" 
            : "inset-0 flex items-end justify-center"
        }`}
        style={!isMobile ? { bottom: "calc(20% - 3.5cm)" } : undefined}
        {...mainCarouselSwipe}
      >
        {isMobile ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* Bote principal en el centro */}
            <div className="flex items-center justify-center">
              {filteredBoats.map((boat, index) => {
                const position = getBoatPosition(index);
                if (position !== "center") return null;
                
                return (
                  <div
                    key={boat.id}
                    className="flex flex-col items-center justify-center transition-all duration-500"
                    style={{
                      width: "85vw",
                      maxWidth: "500px"
                    }}
                  >
                    <img
                      src={boat.mainImage}
                      alt={`${boat.name} - ${boat.specs.type}`}
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      style={{
                        transform: "scale(1.04)"
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Botón Details justo debajo del bote */}
            <div className="mt-4">
              {filteredBoats.map((boat, index) => {
                const position = getBoatPosition(index);
                if (position !== "center") return null;
                
                return (
                  <button 
                    key={boat.id}
                    onClick={() => handleShowDetails(boat)}
                    className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 hover:scale-105 shadow-lg whitespace-nowrap"
                    style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}
                  >
                    {boat.name} Details
                  </button>
                );
              })}
            </div>
            
            {/* Botes de navegación abajo */}
            <div className="flex gap-6 justify-center items-center mt-8 mb-24">
              {filteredBoats.map((boat, index) => {
                const position = getBoatPosition(index);
                if (position !== "left" && position !== "right") return null;
                
                return (
                  <div
                    key={boat.id}
                    onClick={() => handleBoatClick(index)}
                    className="relative cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95"
                    style={{
                      width: "42vw",
                      maxWidth: "210px",
                      opacity: 0.85
                    }}
                  >
                    <img
                      src={boat.mainImage}
                      alt={`${boat.name} - ${boat.specs.type}`}
                      className="w-full h-auto object-contain drop-shadow-xl grayscale"
                      style={{
                        transform: "scale(0.715)",
                        filter: "grayscale(100%)"
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-xl border-2 border-white/40 pointer-events-none"
                      style={{
                        boxShadow: "0 4px 8px rgba(0,0,0,0.4)"
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Desktop layout
          filteredBoats.map((boat, index) => {
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

            // Calcular posición horizontal
            let translateXDesktop = "0%";
            if (isLeft) translateXDesktop = "-64%";
            if (isRight) translateXDesktop = "64%";
            if (isFarLeft) translateXDesktop = "-200%";
            if (isFarRight) translateXDesktop = "200%";

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
                  transform: `translateX(calc(-50% + ${translateXDesktop})) translateY(${isCenter ? "0" : "-1.5cm"}) ${isCenter ? "scale(1)" : "scale(0.95)"}`,
                  zIndex: isCenter ? 20 : 10,
                  opacity: isVisible ? (isCenter ? 1 : 0.9) : 0,
                  pointerEvents: isVisible ? "auto" : "none",
                  visibility: isVisible ? "visible" : "hidden",
                  transitionProperty: "transform, opacity, visibility",
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
                    className="absolute left-1/2 -translate-x-1/2 px-6 py-3 bg-black text-white text-base font-semibold rounded-xl hover:bg-gray-900 hover:scale-105 shadow-lg whitespace-nowrap animate-scale-in"
                    style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif", bottom: "3.5cm" }}
                  >
                    {boat.name} Details
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      )}

      {/* Botones de precio */}
      {!showDetails && (
      <div 
        className="absolute left-0 right-0 z-30 px-4"
        style={{ bottom: isMobile ? "1.5rem" : "2rem" }}
      >
        <div className={`${isMobile ? 'flex flex-col gap-2 items-center' : 'flex justify-center gap-4 overflow-x-auto pb-2 scrollbar-hide'}`}>
          {priceRanges.map((range) => (
            <button
              key={range}
              onClick={() => handlePriceFilter(range)}
              className={`px-4 py-2 md:px-6 md:py-3 text-xs md:text-base text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap ${
                isMobile ? 'w-[85%] max-w-[300px]' : 'flex-shrink-0'
              } ${
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
      </div>
      )}

      {/* Image preview overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 md:p-6"
          onClick={handleClosePreview}
        >
          <button
            onClick={handleClosePreview}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-gray-900 transition-colors flex items-center justify-center"
            style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}
          >
            <span className="hidden md:inline">Close</span>
            <span className="md:hidden text-2xl">×</span>
          </button>
          <img
            src={previewImage}
            alt="Interior preview"
            className="max-h-[70vh] max-w-[90vw] md:max-h-[90vh] md:max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
