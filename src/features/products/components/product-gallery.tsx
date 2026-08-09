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

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryImages =
    images && images.length > 0 ? images : [FALLBACK_IMAGE];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
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

  // Desktop Mouse Zoom Follower
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, ((e.clientX - left) / width) * 100), 100);
    const y = Math.min(Math.max(0, ((e.clientY - top) / height) * 100), 100);
    setZoomPos({ x, y });
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

  return (
    <>
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {/* Thumbnail Navigation Strip */}
        {galleryImages.length > 1 && (
          <div className="flex flex-row gap-3 sm:flex-col sm:w-24 shrink-0 overflow-x-auto sm:overflow-y-auto no-scrollbar">
            {galleryImages.map((img, index) => {
              const isSelected = index === selectedImageIndex;
              const imgSrc = imageErrorMap[index] ? FALLBACK_IMAGE : img;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View image ${index + 1} of ${galleryImages.length}`}
                  className={`relative aspect-[3/4] w-20 sm:w-full overflow-hidden bg-[#efeded] border-2 transition-all cursor-pointer shrink-0 ${isSelected
                      ? 'border-[#1b1c1c] opacity-100 ring-1 ring-[#1b1c1c]'
                      : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                >
                  <Image
                    src={imgSrc}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                    onError={() =>
                      setImageErrorMap((prev) => ({ ...prev, [index]: true }))
                    }
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Main Image Stage */}
        <div
          ref={mainImageRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[3/4] w-full flex-1 overflow-hidden bg-[#efeded] group cursor-zoom-in border border-[#e3e2e2]"
        >
          {/* Base Image with Framer Motion Crossfade */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage}
                alt={productName}
                fill
                priority
                className={`object-cover transition-opacity duration-300 ${
                  isHovering ? 'opacity-0 sm:opacity-100' : 'opacity-100'
                }`}
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

          {/* Desktop Lens Zoom Effect */}
          {isHovering && (
            <div
              className="absolute inset-0 pointer-events-none hidden sm:block bg-no-repeat transition-all duration-75"
              style={{
                backgroundImage: `url('${currentImage}')`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '220%',
              }}
            />
          )}

          {/* Image Counter Badge */}
          {galleryImages.length > 1 && (
            <div className="absolute top-3 right-3 z-10 bg-black/75 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white tracking-wider rounded-none">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          )}

          {/* Expand Fullscreen / Zoom Hint Overlay */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-[11px] font-medium text-[#1b1c1c] shadow-sm transition group-hover:bg-black group-hover:text-white">
            <ZoomIn className="h-3.5 w-3.5 stroke-[1.8]" />
            <span className="hidden sm:inline">Hover to Zoom / Click Fullscreen</span>
            <span className="sm:hidden">Tap Fullscreen</span>
          </div>

          {/* Mobile Swipe Hints (Arrows on Hover) */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#1b1c1c] shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#1b1c1c] shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-white"
              >
                <ChevronRight className="h-4 w-4 stroke-[2]" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Yet Another React Lightbox Modal */}
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
