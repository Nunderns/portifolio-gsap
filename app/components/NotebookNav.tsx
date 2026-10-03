'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { hasFinePointer, prefersReducedMotion, whenSiteReady } from '@/app/lib/siteReady';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

type NavItem = { id: string; label: string; sticker: string; route?: string };

const ITEMS: NavItem[] = [
  { id: 'about', label: 'sobre', sticker: '/images/bird.avif' },
  { id: 'stack', label: 'stack', sticker: '/images/computer_face.avif' },
  { id: 'projects', label: 'projetos', sticker: '/images/gundam.avif' },
  { id: 'connect', label: 'contato', sticker: '/images/maneki-neko.avif' },
  { id: 'experiencias', label: 'experiências', sticker: '/images/map.avif', route: '/work' },
];

const SCRIBBLE = 'M2 8 C 18 2, 30 12, 46 6 S 76 2, 92 8 S 118 12, 138 5';

function spTime() {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export default function NotebookNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const navRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const activeRef = useRef<string | null>(null);

  // Section in view on the home page; route tabs (e.g. /work) are active by pathname.
  const current = isHome ? active : ITEMS.find((i) => i.route === pathname)?.id ?? null;
  const hrefFor = (item: NavItem) => item.route ?? (isHome ? `#${item.id}` : `/#${item.id}`);

  // ── Clock (São Paulo)
  useEffect(() => {
    const update = () => setTime(spTime());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // ── Intro, hide-on-scroll, paper state
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const reduced = prefersReducedMotion();
    let offReady = () => {};

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.set(nav, { yPercent: -120 });
        offReady = whenSiteReady(() => {
          gsap.to(nav, { yPercent: 0, duration: 1, ease: 'power4.out', delay: 0.2 });
        });
      }

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          nav.classList.toggle('is-paper', y > 40);
          if (reduced || menuRef.current?.classList.contains('is-open')) return;
          const hide = self.direction === 1 && y > 320;
          gsap.to(nav, { yPercent: hide ? -120 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        },
      });
    }, nav);

    return () => {
      offReady();
      ctx.revert();
    };
  }, []);

  // ── Highlighter marker follows active / hovered tab
  const moveMarker = (id: string | null, immediate = false) => {
    const marker = markerRef.current;
    const tabs = tabsRef.current;
    if (!marker || !tabs) return;
    const tab = id ? tabs.querySelector<HTMLElement>(`[data-tab="${id}"]`) : null;
    if (!tab) {
      gsap.to(marker, { scaleX: 0, duration: immediate ? 0 : 0.35, ease: 'power3.out' });
      return;
    }
    gsap.to(marker, {
      x: tab.offsetLeft - 6,
      width: tab.offsetWidth + 12,
      scaleX: 1,
      duration: immediate ? 0 : 0.55,
      ease: 'expo.out',
    });
  };

  // ── Track which section is in view
  useEffect(() => {
    if (!isHome) return;
    const triggers = ITEMS.filter((i) => !i.route).flatMap((item) => {
      const el = document.getElementById(item.id);
      if (!el) return [];
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) {
            activeRef.current = item.id;
            setActive(item.id);
          } else if (activeRef.current === item.id) {
            activeRef.current = null;
            setActive(null);
          }
        },
      });
    });
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, [isHome, pathname]);

  useEffect(() => {
    activeRef.current = current;
    moveMarker(current);
  }, [current]);

  useEffect(() => {
    const onResize = () => moveMarker(activeRef.current, true);
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Tab hover: scribble draws in, sticker pops out, marker previews
  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs || !hasFinePointer() || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set('.nav-scribble path', { drawSVG: '0%' });
      gsap.set('.nav-sticker', { opacity: 0, y: -10, scale: 0.6 });
    }, tabs);

    const cleanups = Array.from(tabs.querySelectorAll<HTMLElement>('[data-tab]')).map((tab) => {
      const path = tab.querySelector('.nav-scribble path');
      const sticker = tab.querySelector('.nav-sticker');
      const rot = gsap.utils.random(-14, 14);
      const enter = () => {
        moveMarker(tab.dataset.tab ?? null);
        if (path) gsap.fromTo(path, { drawSVG: '0%' }, { drawSVG: '0% 100%', duration: 0.5, ease: 'power2.out', overwrite: true });
        if (sticker) gsap.to(sticker, { opacity: 1, y: 0, scale: 1, rotate: rot, duration: 0.45, ease: 'back.out(2)', overwrite: true });
      };
      const leave = () => {
        moveMarker(activeRef.current);
        if (path) gsap.to(path, { drawSVG: '100% 100%', duration: 0.35, ease: 'power2.in', overwrite: true });
        if (sticker) gsap.to(sticker, { opacity: 0, y: -10, scale: 0.6, rotate: 0, duration: 0.25, overwrite: true });
      };
      tab.addEventListener('mouseenter', enter);
      tab.addEventListener('mouseleave', leave);
      return () => {
        tab.removeEventListener('mouseenter', enter);
        tab.removeEventListener('mouseleave', leave);
      };
    });

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  // ── Mobile menu: a notebook page unrolls from the top
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const reduced = prefersReducedMotion();
    const links = menu.querySelectorAll('.menu-link');
    const lines = menu.querySelectorAll('.menu-rule');
    if (menuOpen) {
      menu.classList.add('is-open');
      gsap.timeline()
        .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0 : 0.8, ease: 'expo.inOut' })
        .fromTo(lines, { scaleX: 0 }, { scaleX: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, reduced ? 0 : 0.35)
        .fromTo(links, { yPercent: 110, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.06, ease: 'power4.out' }, reduced ? 0 : 0.4);
    } else if (menu.classList.contains('is-open')) {
      gsap.to(menu, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: reduced ? 0 : 0.6,
        ease: 'expo.inOut',
        onComplete: () => menu.classList.remove('is-open'),
      });
    }
  }, [menuOpen]);


  return (
    <>
      <header className={`nb-nav${menuOpen ? ' is-menu' : ''}`} ref={navRef}>
        <div className="nb-nav-inner">
          <Link href="/" className="nb-logo" aria-label="Henri Okayama — início">
            <span className="nb-logo-stamp">H.O.</span>
            <span className="nb-logo-text">
              <strong>Henri Okayama</strong>
              <em>caderno nº 01</em>
            </span>
          </Link>

          <nav className="nb-tabs" ref={tabsRef} aria-label="Navegação principal">
            <span className="nav-marker" ref={markerRef} aria-hidden="true" />
            {ITEMS.map((item, i) => (
              <Link
                key={item.id}
                href={hrefFor(item)}
                className={`nav-tab${current === item.id ? ' is-active' : ''}`}
                data-tab={item.id}
                aria-current={current === item.id ? 'true' : undefined}
              >
                <span className="nav-tab-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="nav-tab-label">{item.label}</span>
                {item.route && <span className="nav-tab-arrow" aria-hidden="true">↗</span>}
                <svg className="nav-scribble" viewBox="0 0 140 14" preserveAspectRatio="none" aria-hidden="true">
                  <path d={SCRIBBLE} />
                </svg>
                <span className="nav-sticker" aria-hidden="true">
                  <Image src={item.sticker} alt="" fill sizes="56px" style={{ objectFit: 'contain' }} />
                </span>
              </Link>
            ))}
          </nav>

          <div className="nb-right">
            <span className="nb-status">
              <span className="nb-status-dot" aria-hidden="true" />
              <span>disponível</span>
              {time && <span className="nb-time">SP {time}</span>}
            </span>
            <a className="nb-cta" href="mailto:henri.okayama@gmail.com">
              vamos conversar
            </a>
            <button
              type="button"
              className={`nb-burger${menuOpen ? ' is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="nb-menu"
            >
              <span className="nb-burger-label">{menuOpen ? 'fechar' : 'menu'}</span>
              <span className="nb-burger-lines" aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>
      </header>

      <div className="nb-menu" id="nb-menu" ref={menuRef} aria-hidden={!menuOpen}>
        <p className="nb-menu-label">sumário</p>
        <ul>
          {ITEMS.map((item, i) => (
            <li key={item.id}>
              <span className="menu-rule" aria-hidden="true" />
              <span className="menu-mask">
                <Link
                  href={hrefFor(item)}
                  className="menu-link"
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span className="menu-num">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </span>
            </li>
          ))}
        </ul>
        <div className="nb-menu-foot">
          <a href="https://github.com/Nunderns" target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>GitHub</a>
          <a href="https://www.linkedin.com/in/henri-okayama-33a091279/" target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>LinkedIn</a>
          <a href="mailto:henri.okayama@gmail.com" tabIndex={menuOpen ? 0 : -1}>Email</a>
        </div>
      </div>
    </>
  );
}
