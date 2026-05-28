'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

const TransitionContext = createContext<{ isPageVisible: boolean }>({
  isPageVisible: false,
});

export const useTransition = () => useContext(TransitionContext);

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const pathname = usePathname();

  const runAnimation = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const gridSize = 8; // 8x8 grid
    const totalPixels = gridSize * gridSize;
    const pixels: HTMLDivElement[] = [];

    // Clear existing pixels
    overlay.innerHTML = '';

    // Create pixel divs
    for (let i = 0; i < totalPixels; i++) {
      const pixel = document.createElement('div');
      pixel.className = 'pixel-transition';
      overlay.appendChild(pixel);
      pixels.push(pixel);
    }

    // Hide page initially
    setIsPageVisible(false);

    // Animate pixels: cover screen -> hold -> reveal
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setIsPageVisible(true);
      },
    });

    setIsAnimating(true);

    // Phase 1: Cover screen with pixels
    tl.fromTo(
      pixels,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        stagger: { amount: 0.5, from: 'random' },
        ease: 'power2.out',
      }
    )
    // Phase 2: Hold briefly
    .to(pixels, {
      duration: 0.4,
    })
    // Phase 3: Reveal page by removing pixels
    .to(
      pixels,
      {
        opacity: 0,
        scale: 0,
        duration: 0.15,
        stagger: { amount: 0.6, from: 'random' },
        ease: 'power2.in',
      }
    );

    return tl;
  };

  useEffect(() => {
    const tl = runAnimation();

    return () => {
      if (tl) tl.kill();
    };
  }, [pathname]); // Re-run animation when pathname changes

  return (
    <TransitionContext.Provider value={{ isPageVisible }}>
      <div
        ref={overlayRef}
        className={`page-transition-overlay${isAnimating ? ' is-active' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
        }}
      />
      <div style={{ opacity: isPageVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        {children}
      </div>
    </TransitionContext.Provider>
  );
}
