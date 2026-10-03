'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { hasFinePointer, prefersReducedMotion } from './siteReady';

gsap.registerPlugin(ScrollTrigger, SplitText);

type Vars = Record<string, string | number>;

const REVEALS: Record<string, Vars> = {
  up: { y: 36, opacity: 0 },
  left: { x: -48, opacity: 0 },
  right: { x: 48, opacity: 0 },
  scale: { scale: 0.92, opacity: 0, y: 18 },
  blur: { y: 24, opacity: 0, filter: 'blur(10px)' },
  clip: { clipPath: 'inset(0% 0% 100% 0%)', y: 30 },
};

const NEUTRAL: Vars = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
  filter: 'blur(0px)',
  clipPath: 'inset(0% 0% 0% 0%)',
};

const toNeutral = (from: Vars) =>
  Object.fromEntries(Object.keys(from).map((k) => [k, NEUTRAL[k]])) as Vars;

/**
 * Declarative scroll motion, driven by data attributes inside `rootRef`:
 *  - data-split="lines|words|chars"   masked text reveal (SplitText)
 *  - data-reveal="up|left|right|scale|blur|clip"  (+ data-reveal-delay)
 *  - data-reveal-group > data-reveal-item          staggered children
 *  - data-parallax="80"               scrubbed vertical drift in px
 *  - data-magnetic="0.35"             element follows the cursor
 *  - data-tilt3d="10"                 3D tilt towards the cursor
 *  - data-marquee="28" > data-marquee-track        velocity-reactive loop
 */
export function useSiteMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const fine = hasFinePointer();
    const listeners: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
    ) => {
      el.addEventListener(type, fn);
      listeners.push(() => el.removeEventListener(type, fn));
    };

    const ctx = gsap.context(() => {
      // ── Masked text reveals
      root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
        const mode = el.dataset.split || 'lines';
        SplitText.create(el, {
          type: mode === 'chars' ? 'words,chars' : mode === 'words' ? 'words' : 'lines',
          mask: mode === 'lines' ? 'lines' : 'words',
          autoSplit: true,
          onSplit(self) {
            const targets = mode === 'chars' ? self.chars : mode === 'words' ? self.words : self.lines;
            return gsap.fromTo(
              targets,
              { yPercent: 110, rotate: mode === 'chars' ? 6 : 2, opacity: 0 },
              {
                yPercent: 0,
                rotate: 0,
                opacity: 1,
                duration: mode === 'chars' ? 0.9 : 1.05,
                stagger: mode === 'chars' ? 0.018 : mode === 'words' ? 0.05 : 0.1,
                ease: 'power4.out',
                scrollTrigger: { trigger: el, start: el.dataset.splitStart || 'top 86%', once: true },
              },
            );
          },
        });
      });

      // ── Single element reveals
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const from = REVEALS[el.dataset.reveal || 'up'] ?? REVEALS.up;
        gsap.fromTo(el, from, {
          ...toNeutral(from),
          duration: 1,
          delay: parseFloat(el.dataset.revealDelay || '0'),
          ease: 'power3.out',
          clearProps: 'clipPath,filter',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      // ── Staggered groups
      root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 86%', once: true },
          },
        );
      });

      // ── Parallax drift
      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const distance = parseFloat(el.dataset.parallax || '60');
        gsap.fromTo(
          el,
          { y: -distance },
          {
            y: distance,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      // ── Marquees that speed up / reverse with scroll velocity
      root.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
        const track = el.querySelector<HTMLElement>('[data-marquee-track]');
        if (!track) return;
        const reverse = el.dataset.marqueeDir === 'right';
        const duration = parseFloat(el.dataset.marquee || '28');
        const loop = gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 },
        );
        // Leave room to play backwards when the user scrolls up.
        loop.totalTime(duration * 100);
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const dir = self.direction === -1 ? -1 : 1;
            const boost = Math.min(4, 1 + Math.abs(self.getVelocity()) / 4000);
            loop.timeScale(boost * dir);
            gsap.to(loop, { timeScale: dir, duration: 0.6, delay: 0.15, overwrite: true });
          },
        });
      });

      if (!fine) return;

      // ── Magnetic elements
      root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic || '0.35');
        const toX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
        const toY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
        let cx = 0;
        let cy = 0;
        on(el, 'mouseenter', () => {
          const r = el.getBoundingClientRect();
          cx = r.left + r.width / 2;
          cy = r.top + r.height / 2;
        });
        on(el, 'mousemove', (e) => {
          toX((e.clientX - cx) * strength);
          toY((e.clientY - cy) * strength);
        });
        on(el, 'mouseleave', () => {
          toX(0);
          toY(0);
        });
      });

      // ── 3D tilt
      root.querySelectorAll<HTMLElement>('[data-tilt3d]').forEach((el) => {
        const max = parseFloat(el.dataset.tilt3d || '10');
        const toRX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' });
        const toRY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' });
        gsap.set(el, { transformPerspective: 800 });
        let rect = el.getBoundingClientRect();
        on(el, 'mouseenter', () => {
          rect = el.getBoundingClientRect();
        });
        on(el, 'mousemove', (e) => {
          toRY(((e.clientX - rect.left) / rect.width - 0.5) * max);
          toRX(-((e.clientY - rect.top) / rect.height - 0.5) * max);
        });
        on(el, 'mouseleave', () => {
          toRX(0);
          toRY(0);
        });
      });
    }, root);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      listeners.forEach((off) => off());
      ctx.revert();
    };
  }, [rootRef]);
}
