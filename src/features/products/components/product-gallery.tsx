'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Counter from 'yet-another-react-lightbox/plugins/counter';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const FALLBACK_IMAGE = '/images/placeholder-product.svg';
const LENS_SIZE = 180; // Diameter of circular magnifier lens in pixels

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryImages =
    images && images.length > 0 ? images : [FALLBACK_IMAGE];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});

  const touchStartX = useRef<number | null>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const currentImage = imageErrorMap[selectedImageIndex]
    ? FALLBACK_IMAGE
    : galleryImages[selectedImageIndex] || FALLBACK_IMAGE;

  const slides = galleryImages.map((src, i) => ({
    src: imageErrorMap[i] ? FALLBACK_IMAGE : src,
    alt: `${productName} image ${i + 1}`,
  }));

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // Desktop Circular Lens Mouse Follower
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const xPx = e.clientX - left;
    const yPx = e.clientY - top;

    const xPercent = Math.min(Math.max(0, (xPx / width) * 100), 100);
    const yPercent = Math.min(Math.max(0, (yPx / height) * 100), 100);

    setLensPos({ x: xPx, y: yPx });
    setZoomPos({ x: xPercent, y: yPercent });
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNextImage();
      else handlePrevImage();
    }

    touchStartX.current = null;
  };

  const hasMultipleImages = galleryImages.length > 1;

  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        {/* Navigation Arrow Left (Desktop Side Positioned) */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={handlePrevImage}
            aria-label="Previous product image"
            className="hidden lg:flex absolute -left-12 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1b1c1c] border border-[#e3e2e2] shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 stroke-[1.8]" />
          </button>
        )}

        {/* Main Single Image Container Stage */}
        <div
          ref={mainImageRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[3/4] w-full max-w-lg overflow-hidden bg-[#efeded] group cursor-zoom-in border border-[#e3e2e2] shadow-xs"
        >
          {/* Base Image with Framer Motion Crossfade */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage}
                alt={productName}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={() =>
                  setImageErrorMap((prev) => ({
                    ...prev,
                    [selectedImageIndex]: true,
                  }))
                }
              />
            </motion.div>
          </AnimatePresence>

          {/* Desktop Circular Magnifier Lens Glass */}
          {isHovering && (
            <div
              className="pointer-events-none absolute hidden sm:block rounded-full border-2 border-[#1b1c1c]/40 bg-no-repeat shadow-2xl transition-opacity duration-150 z-20 overflow-hidden"
              style={{
                width: `${LENS_SIZE}px`,
                height: `${LENS_SIZE}px`,
                left: `${lensPos.x - LENS_SIZE / 2}px`,
                top: `${lensPos.y - LENS_SIZE / 2}px`,
                backgroundImage: `url('${currentImage}')`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '260%',
                boxShadow: '0 12px 32px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.4)',
              }}
            />
          )}

          {/* Image Counter Badge */}
          {hasMultipleImages && (
            <div className="absolute top-3 right-3 z-10 bg-black/75 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white tracking-wider rounded-none">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          )}

          {/* Expand Fullscreen / Zoom Hint Overlay */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-[11px] font-medium text-[#1b1c1c] shadow-sm transition group-hover:bg-[#1b1c1c] group-hover:text-white">
            <ZoomIn className="h-3.5 w-3.5 stroke-[1.8]" />
            <span className="hidden sm:inline">Hover Magnifier / Click Fullscreen</span>
            <span className="sm:hidden">Tap Lightbox</span>
          </div>

          {/* Mobile Overlay Arrows */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                aria-label="Previous image"
                className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1b1c1c] shadow-sm hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                aria-label="Next image"
                className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1b1c1c] shadow-sm hover:bg-white"
              >
                <ChevronRight className="h-4 w-4 stroke-[2]" />
              </button>
            </>
          )}

          {/* Bottom Indicator Dots */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === selectedImageIndex
                      ? 'w-5 bg-[#e05638]'
                      : 'w-2 bg-white/80 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Navigation Arrow Right (Desktop Side Positioned) */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={handleNextImage}
            aria-label="Next product image"
            className="hidden lg:flex absolute -right-12 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1b1c1c] border border-[#e3e2e2] shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 stroke-[1.8]" />
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={selectedImageIndex}
        slides={slides}
        plugins={[Zoom, Fullscreen, Thumbnails, Counter]}
        on={{
          view: ({ index }) => setSelectedImageIndex(index),
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      />
    </>
  );
}
