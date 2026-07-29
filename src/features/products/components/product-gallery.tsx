'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Thumbnail Selector Strip */}
      <div className="flex flex-row gap-3 sm:flex-col sm:w-24 shrink-0 overflow-x-auto sm:overflow-y-auto">
        {images.map((img, index) => {
          const isSelected = index === selectedImageIndex;
          return (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-[3/4] w-20 sm:w-full overflow-hidden bg-[#efeded] border-2 transition-all cursor-pointer ${
                isSelected ? 'border-[#1b1c1c]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          );
        })}
      </div>

      {/* Main Image Stage */}
      <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden bg-[#efeded]">
        <Image
          src={images[selectedImageIndex] || images[0]}
          alt={productName}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
