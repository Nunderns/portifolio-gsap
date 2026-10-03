'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hasFinePointer, isSiteReady, prefersReducedMotion, whenSiteReady } from '@/app/lib/siteReady';

gsap.registerPlugin(ScrollTrigger);

/** Smooth scroll (Lenis), scroll progress bar and custom cursor. */
export default function SiteChrome() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // ── Lenis smooth scroll synced with ScrollTrigger
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let offReady = () => {};
    if (!isSiteReady()) {
      lenis.stop();
      offReady = whenSiteReady(() => lenis.start());
    }

    return () => {
      offReady();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ── Reset scroll on route change
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // ── Scroll progress bar
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.3 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // ── Custom cursor: fast dot + lagging ring that grows over interactive elements
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label || !hasFinePointer() || prefersReducedMotion()) return;

    const html = document.documentElement;
    html.classList.add('has-cursor');
    gsap.set([dot, ring], { x: innerWidth / 2, y: innerHeight / 2, xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    let visible = false;
    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    let current: Element | null = null;
    let ringScale = 1;
    let dotScale = 1;
    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.('[data-cursor], a, button') ?? null;
      if (target === current) return;
      current = target;
      const text = target?.getAttribute('data-cursor') ?? '';
      label.textContent = text;
      ring.classList.toggle('is-hover', !!target);
      ring.classList.toggle('has-label', !!text);
      ringScale = text ? 2.6 : target ? 1.7 : 1;
      dotScale = text ? 0 : 1;
      gsap.to(ring, { scale: ringScale, duration: 0.35, ease: 'power3.out' });
      gsap.to(dot, { scale: dotScale, duration: 0.25 });
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };
    const onDown = () => {
      gsap.to(ring, { scale: ringScale * 0.8, duration: 0.2 });
      gsap.to(dot, { scale: dotScale * 0.8, duration: 0.2 });
    };
    const onUp = () => {
      gsap.to(ring, { scale: ringScale, duration: 0.3 });
      gsap.to(dot, { scale: dotScale, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      html.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <div className="cur-dot" ref={dotRef} aria-hidden="true" />
      <div className="cur-ring" ref={ringRef} aria-hidden="true">
        <span className="cur-label" ref={labelRef} />
      </div>
    </>
  );
}
