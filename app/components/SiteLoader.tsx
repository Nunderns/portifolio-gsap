'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion, setSiteReady } from '@/app/lib/siteReady';

const SEEN_KEY = 'henri-loader-seen';

/** Intro curtain: 000→100 counter, progress hairline, then the panels split open. */
export default function SiteLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const html = document.documentElement;

    const reveal = () => {
      html.classList.remove('is-loading');
      setSiteReady(true);
    };
    const finish = () => {
      reveal();
      setDone(true);
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {}
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {}

    html.classList.add('is-loading');
    window.scrollTo(0, 0);

    const q = gsap.utils.selector(el);
    const count = q('[data-ld-count]')[0] as HTMLElement;
    const hair = q('[data-ld-hair]');
    const meta = q('[data-ld-meta]');
    const stamp = q('[data-ld-stamp]');
    const progress = { v: 0 };
    const render = () => {
      count.textContent = String(Math.round(progress.v * 100)).padStart(3, '0');
      gsap.set(hair, { scaleX: progress.v });
    };

    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') return resolve();
      window.addEventListener('load', () => resolve(), { once: true });
      window.setTimeout(resolve, 3000);
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } }).timeScale(seen ? 1.9 : 1);
    tl.set(hair, { scaleX: 0 })
      .fromTo(meta, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0)
      .fromTo(count, { yPercent: 105 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, 0.05)
      .fromTo(stamp, { scale: 0, rotate: -40 }, { scale: 1, rotate: -8, duration: 0.8, ease: 'back.out(2.2)' }, 0.1)
      .to(progress, { v: 0.92, duration: 1.3, ease: 'power2.out', onUpdate: render }, 0.45)
      .call(() => {
        tl.pause();
        pageLoaded.then(() => tl.resume());
      })
      .to(progress, { v: 1, duration: 0.45, ease: 'power2.inOut', onUpdate: render })
      .to(count, { yPercent: -105, duration: 0.7, ease: 'power3.in' }, '+=0.14')
      .to(meta, { opacity: 0, y: -8, duration: 0.4, ease: 'power2.in' }, '<')
      .to(stamp, { scale: 0, rotate: 30, duration: 0.5, ease: 'back.in(2)' }, '<')
      .to(hair, { opacity: 0, duration: 0.3 }, '<0.25')
      .addLabel('open', '<0.05')
      .to(q('[data-ld-panel="top"]'), { yPercent: -100, duration: 1.25, ease: 'expo.inOut' }, 'open')
      .to(q('[data-ld-panel="bottom"]'), { yPercent: 100, duration: 1.25, ease: 'expo.inOut' }, 'open')
      .call(reveal, [], 'open+=0.35')
      .call(finish);

    const safety = window.setTimeout(finish, 9000);

    return () => {
      window.clearTimeout(safety);
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div className="site-loader" ref={rootRef} aria-hidden="true">
      <noscript>
        <style>{'.site-loader{display:none}'}</style>
      </noscript>
      <div className="ld-panel ld-top" data-ld-panel="top">
        <span className="ld-meta ld-meta-left" data-ld-meta>henri okayama</span>
        <span className="ld-meta ld-meta-right" data-ld-meta>portfólio ©2026</span>
      </div>
      <div className="ld-panel ld-bottom" data-ld-panel="bottom">
        <span className="ld-meta ld-meta-left" data-ld-meta>backend / fullstack</span>
        <span className="ld-meta ld-meta-right" data-ld-meta>carregando…</span>
      </div>
      <div className="ld-center">
        <span className="ld-stamp" data-ld-stamp>✦</span>
        <div className="ld-count-mask">
          <span className="ld-count" data-ld-count>000</span>
        </div>
        <span className="ld-hair" data-ld-hair />
      </div>
    </div>
  );
}
