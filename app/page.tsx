'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Pochita3D from '@/components/Pochita3D';
import { useSiteMotion } from '@/app/lib/useSiteMotion';
import { hasFinePointer, prefersReducedMotion, whenSiteReady } from '@/app/lib/siteReady';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const MARQUEE_ITEMS = ['Backend', 'APIs REST', 'Fullstack', 'Node.js', 'Arquitetura', 'Next.js', 'PostgreSQL', 'Docker'];
const TOC = [
  { id: 'about', label: 'sobre mim', page: '02' },
  { id: 'beliefs', label: 'crenças', page: '03' },
  { id: 'stack', label: 'stack', page: '04' },
  { id: 'work', label: 'trabalho', page: '05' },
  { id: 'projects', label: 'projetos', page: '06' },
  { id: 'connect', label: 'contato', page: '07' },
];

const SPINE_RINGS = Array.from({ length: 13 });

const FOOTER_MARQUEE = ['vamos conversar', 'henri.okayama@gmail.com', 'disponível para projetos'];

const tagIconMap: Record<string, string> = {
  'Node.js': '/images/svg/node-fill-svgrepo-com.svg',
  'Express': '/images/svg/express-svgrepo-com.svg',
  'Nest.js': '/images/svg/nestjs-svgrepo-com.svg',
  'PHP': '/images/svg/php-svgrepo-com.svg',
  'Laravel': '/images/svg/laravel-svgrepo-com.svg',
  'Python': '/images/svg/python-127-svgrepo-com.svg',
  'FastAPI': '/images/svg/fastapi-svgrepo-com.svg',
  'PostgreSQL': '/images/svg/postgresql-svgrepo-com.svg',
  'Redis': '/images/svg/redis-svgrepo-com.svg',
  'Next.js': '/images/svg/next-dot-js-svgrepo-com.svg',
  'React': '/images/svg/react-svgrepo-com.svg',
  'Tailwind CSS': '/images/svg/tailwind-css-svgrepo-com.svg',
  'Shadcn UI': '/images/svg/shadcn-ui.svg',
  'Docker': '/images/svg/docker-svgrepo-com.svg',
  'GitHub Actions': '/images/svg/github-142-svgrepo-com.svg',
  'MongoDB': '/images/svg/mongodb-svgrepo-com.svg',
  'MySQL': '/images/svg/mysql-svgrepo-com.svg',
  'AWS': '/images/svg/aws-svgrepo-com.svg',
};

const skills = [
  'Node.js', 'React', 'Next.js',
  'REST APIs', 'PostgreSQL', 'MongoDB', 'Docker',
  'Git', 'Tailwind CSS', 'Testing', 'Cloud',
];

const values = [
  { 
    label: 'perseguir incansavelmente a clareza.', 
    rotate: '-4deg', 
    color: '#efe1ca', 
    textColor: '#252822',
    font: 'mono',
    image: '/images/notes-pages/0aKOwaR29QHg04I7MHlsi9j1g4.webp'
  },
  { 
    label: 'projetar para momentos.', 
    rotate: '3deg', 
    color: '#f2a65a', 
    textColor: '#252822',
    font: 'serif',
    image: '/images/notes-pages/m0nSd9OmKrRp1nvRHVH89tLs0mg.webp'
  },
  { 
    label: 'o software deve empoderar.', 
    rotate: '10deg', 
    color: '#252822', 
    textColor: '#f2e3cf',
    font: 'gochi',
    image: '/images/notes-pages/rhT0iPheLHJdGQAZ04lGqNb0I.webp'
  },
];

const LOOK_FOR_ITEMS = [
  'Trabalho impactante',
  'Trabalho significativo',
  'Equipe diversificada de pessoas talentosas',
];

const projects = [
  { title: 'Backend', description: 'Arquitetura e desenvolvimento de APIs escaláveis com foco em performance, integrações, autenticação e manutenção de aplicações distribuídas.', tags: ['Node.js', 'Express', 'Nest.js', 'PHP', 'Laravel', 'Python', 'FastAPI','PostgreSQL', 'Redis'] },
  { title: 'Frontend', description: 'Interfaces modernas e responsivas conectadas a serviços backend, priorizando experiência do usuário, performance e animações fluidas.', tags: ['Next.js', 'React', 'Tailwind CSS', 'Shadcn UI', 'GSAP'] },
  { title: 'DevOps & Automation', description: 'Containerização, automações e pipelines para ambientes escaláveis, integração contínua e produtividade operacional.', tags: ['n8n', 'Docker', 'GitHub Actions'] },
  { title: 'Arquitetura de Software & Práticas', description: 'Boas práticas de engenharia de software aplicadas em ambientes colaborativos e produtos escaláveis.', tags: ['Clean Architecture', 'SOLID', 'Design Patterns', 'CI/CD', 'Microservices', 'Testing'] },
];

const sideImages = [
  { src: '/images/bird.avif', left: '1vw', top: '18vh', width: 110, height: 130, rotate: '-8deg' },
  { src: '/images/bunny_face.avif', left: '2vw', top: '55vh', width: 90, height: 110, rotate: '5deg' },
  { src: '/images/computer_face.avif', left: '1.5vw', top: '95vh', width: 80, height: 95, rotate: '-4deg' },
  { src: '/images/flower.avif', left: '0.5vw', top: '145vh', width: 100, height: 120, rotate: '7deg' },
  { src: '/images/flowers_more.avif', left: '1vw', top: '210vh', width: 90, height: 105, rotate: '-6deg' },
  { src: '/images/gundam.avif', right: '1vw', top: '30vh', width: 120, height: 155, rotate: '6deg' },
  { src: '/images/map.avif', right: '1.5vw', top: '75vh', width: 95, height: 115, rotate: '-5deg' },
  { src: '/images/rat.avif', right: '0.8vw', top: '120vh', width: 90, height: 110, rotate: '4deg' },
  { src: '/images/bird.avif', right: '1vw', top: '180vh', width: 85, height: 100, rotate: '-7deg' },
  { src: '/images/box_juice.avif', left: '1.2vw', top: '250vh', width: 95, height: 110, rotate: '3deg' },
  { src: '/images/chick.avif', right: '1.3vw', top: '220vh', width: 88, height: 105, rotate: '-3deg' },
  { src: '/images/godzilla.avif', left: '0.8vw', top: '280vh', width: 105, height: 125, rotate: '5deg' },
  { src: '/images/maneki-neko.avif', right: '0.9vw', top: '260vh', width: 92, height: 108, rotate: '-4deg' },
  { src: '/images/ramen.avif', left: '1.5vw', top: '310vh', width: 98, height: 115, rotate: '6deg' },
  { src: '/images/toucan.avif', right: '1.1vw', top: '300vh', width: 110, height: 130, rotate: '-5deg' },
  { src: '/images/bird.avif', left: '1vw', top: '350vh', width: 100, height: 115, rotate: '4deg' },
  { src: '/images/flower.avif', right: '1.2vw', top: '340vh', width: 85, height: 100, rotate: '-6deg' },
  { src: '/images/gundam.avif', left: '0.8vw', top: '390vh', width: 110, height: 135, rotate: '5deg' },
  { src: '/images/map.avif', right: '1vw', top: '380vh', width: 90, height: 110, rotate: '-4deg' },
  { src: '/images/bunny_face.avif', left: '1.5vw', top: '430vh', width: 95, height: 115, rotate: '3deg' },
];

function spawnClickBurst(x: number, y: number) {
  const count = 8;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'click-burst-dot';
    document.body.appendChild(dot);
    const angle = (i / count) * Math.PI * 2;
    const dist = 36 + Math.random() * 28;
    gsap.set(dot, { x, y, xPercent: -50, yPercent: -50 });
    gsap.to(dot, {
      x: x + Math.cos(angle) * dist,
      y: y + Math.sin(angle) * dist,
      opacity: 0,
      scale: 0.2,
      duration: 0.55 + Math.random() * 0.2,
      ease: 'power2.out',
      onComplete: () => dot.remove(),
    });
  }
  const ring = document.createElement('div');
  ring.className = 'click-burst-ring';
  document.body.appendChild(ring);
  gsap.set(ring, { x, y, xPercent: -50, yPercent: -50 });
  gsap.to(ring, {
    scale: 3.2,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
    onComplete: () => ring.remove(),
  });
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [lookFor, setLookFor] = useState<boolean[]>([false, false, false]);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useSiteMotion(rootRef);

  const toggleLookFor = (i: number) =>
    setLookFor(prev => prev.map((v, j) => (j === i ? !v : v)));

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const fine = hasFinePointer();
    let offReady = () => {};
    const navCleanups: (() => void)[] = [];
    let mm: gsap.MatchMedia | null = null;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // ── 1. Notebook drops onto the desk once the loader is gone
      gsap.set('.book-drop', { y: 160, rotate: -10, opacity: 0 });
      gsap.set('.book-hint', { opacity: 0, y: 16 });
      const drop = gsap.timeline({ paused: true })
        .to('.book-drop', { y: 0, rotate: 0, opacity: 1, duration: 1.4, ease: 'expo.out' })
        .to('.book-hint', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.7);
      offReady = whenSiteReady(() => drop.play());
      gsap.to('.book-hint-arrow', { y: 6, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      // ── 2. Scroll opens the notebook: elastic off, cover flips, chapter page flips, hero writes itself
      mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 769px)', mobile: '(max-width: 768px)' }, (c) => {
        const desktop = !!c.conditions?.desktop;
        const lines = gsap.utils.toArray<HTMLElement>('.hero-line');

        gsap.set('.book-leaf', { transformOrigin: '0% 50%' });
        gsap.set('.book', { xPercent: desktop ? -25 : 0, rotate: -3, scale: desktop ? 0.92 : 0.96 });

        const flip = (tl: gsap.core.Timeline, leaf: string, at: number, zAfter: number) => {
          tl.to(leaf, { rotationY: -180, duration: 1.2, ease: 'power2.inOut' }, at)
            .fromTo(`${leaf} .leaf-front .leaf-shade`, { opacity: 0 }, { opacity: 0.45, duration: 0.6, ease: 'power1.in' }, at)
            .fromTo(`${leaf} .leaf-back .leaf-shade`, { opacity: 0.45 }, { opacity: 0, duration: 0.6, ease: 'power1.out' }, at + 0.6)
            .set(leaf, { zIndex: zAfter }, at + 0.6);
          if (!desktop) tl.to(leaf, { autoAlpha: 0, duration: 0.25 }, at + 1);
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.book-intro',
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });

        tl.to('.book-hint', { opacity: 0, y: 24, duration: 0.3 }, 0)
          .to('.cover-elastic', { xPercent: 220, rotate: 8, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
          .to('.book', { xPercent: 0, rotate: 0, scale: 1, duration: 1.4, ease: 'power2.inOut' }, 0.3);
        flip(tl, '.leaf-1', 0.4, 5);
        flip(tl, '.leaf-2', 1.7, 6);
        tl.fromTo(lines, { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, 2.5)
          .fromTo('[data-page-in]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power2.out' }, 2.75)
          .fromTo('.role-underline path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, 2.9)
          .fromTo('.toc-list li', { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.06 }, 2.6)
          .to('.book', { scale: desktop ? 1.03 : 1, duration: 0.9 }, 3.4);
      });

      // ── 5. Panels scroll reveal
      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel) => {
        gsap.from(panel, {
          opacity: 0, y: 90, rotationX: -22, transformOrigin: '50% 0%', transformPerspective: 1400,
          rotate: panel.dataset.tilt === 'right' ? 1.8 : -1.8,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 92%', once: true },
        });
      });

      // ── 6. Torn paper value cards: drop in, then parallax on scroll
      gsap.from('.value-card', {
        yPercent: 40, opacity: 0, rotate: () => gsap.utils.random(-14, 14),
        duration: 1.1, stagger: 0.12, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.values-stack', start: 'top 85%', once: true },
      });
      gsap.utils.toArray<HTMLElement>('.value-card').forEach((card, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.to(card, {
          y: dir * 40,
          ease: 'none',
          scrollTrigger: {
            trigger: '.values-scene',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });

      if (!fine) return;

      // ── 7. Skill pills hover
      gsap.utils.toArray<HTMLElement>('.skill-pill').forEach((el) => {
        el.addEventListener('mouseenter', () => gsap.to(el, { y: -7, scale: 1.06, rotate: gsap.utils.random(-4, 4), duration: 0.25, ease: 'back.out(2)' }));
        el.addEventListener('mouseleave', () => gsap.to(el, { y: 0, scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' }));
      });

      // ── 8. Project rows: title slides, follower card shows the stack
      const follower = followerRef.current;
      const frame = follower?.querySelector<HTMLElement>('.proj-frame');
      const badge = follower?.querySelector<HTMLElement>('.proj-badge');
      if (follower && frame) {
        gsap.set(follower, { opacity: 0, scale: 0.85, rotate: -4 });
        if (badge) gsap.to(badge, { rotation: 360, duration: 14, repeat: -1, ease: 'none' });
        const toX = gsap.quickTo(follower, 'x', { duration: 0.45, ease: 'power3' });
        const toY = gsap.quickTo(follower, 'y', { duration: 0.45, ease: 'power3' });
        const toRot = gsap.quickTo(frame, 'rotation', { duration: 0.6, ease: 'power3' });
        let lastX = 0;
        const onMove = (e: MouseEvent) => {
          const w = frame.offsetWidth || 280;
          const h = frame.offsetHeight || 200;
          const flip = e.clientX > window.innerWidth - w - 80;
          toX(e.clientX + (flip ? -w - 32 : 32));
          toY(e.clientY - h / 2);
          toRot(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
        };
        window.addEventListener('mousemove', onMove);
        navCleanups.push(() => window.removeEventListener('mousemove', onMove));

        gsap.utils.toArray<HTMLElement>('.work-card').forEach((row) => {
          const title = row.querySelector('.g-title-inner');
          const index = row.querySelector('.g-index');
          row.addEventListener('mouseenter', () => {
            setHoveredProject(row.dataset.project ?? null);
            if (title) gsap.to(title, { x: 14, duration: 0.45, ease: 'power3.out' });
            if (index) gsap.to(index, { x: 4, duration: 0.35, ease: 'power3.out' });
            gsap.to(follower, { opacity: 1, scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.4)' });
            gsap.fromTo(frame, { scale: 0.94 }, { scale: 1, duration: 0.45, ease: 'power3.out' });
          });
          row.addEventListener('mouseleave', () => {
            if (title) gsap.to(title, { x: 0, duration: 0.5, ease: 'power3.out' });
            if (index) gsap.to(index, { x: 0, duration: 0.4, ease: 'power3.out' });
            gsap.to(follower, { opacity: 0, scale: 0.85, rotate: -4, duration: 0.3, ease: 'power3.in' });
          });
        });
      }
    }, rootRef);

    // ── Mouse click burst
    const handleClick = (e: MouseEvent) => spawnClickBurst(e.clientX, e.clientY);
    window.addEventListener('click', handleClick);

    return () => {
      offReady();
      mm?.revert();
      ctx.revert();
      navCleanups.forEach(fn => fn());
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // ── Tags popup animations
  useEffect(() => {
    if (expandedProject && popupRef.current) {
      gsap.fromTo(popupRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
      gsap.fromTo('.popup-tags li',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, [expandedProject]);

  return (
    <main ref={rootRef} className="site-shell">
      <div className="noise-layer" />

      {/* ── Notebook intro — the closed notebook opens as you scroll ── */}
      <section className="book-intro" id="home">
        <div className="book-scene">
          <div className="book-drop">
            <div className="book">
              <div className="book-board" aria-hidden="true" />

              {/* Right page — the hero */}
              <div className="book-page book-right">
                <div className="page-inner page-paper">
                  <p className="page-eyebrow" data-page-in>backend / desenvolvedor fullstack</p>
                  <h1 className="page-title" aria-label="Olá, sou Henri Okayama.">
                    <span className="line-mask" aria-hidden="true"><span className="hero-line">Olá, sou</span></span>
                    <span className="line-mask" aria-hidden="true"><span className="hero-line">Henri Okayama.</span></span>
                  </h1>
                  <p className="page-role" aria-label="Desenvolvedor Fullstack">
                    <span className="line-mask" aria-hidden="true"><span className="hero-line">Desenvolvedor Fullstack</span></span>
                    <svg className="role-underline" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M3 11 C 60 3, 120 14, 180 7 S 260 4, 297 9" />
                    </svg>
                  </p>
                  <p className="page-intro" data-page-in>
                    Construo sistemas web confiáveis que ajudam produtos a se moverem mais rápido — com arquitetura backend pensada e execução fullstack limpa.
                  </p>
                  <div className="page-actions" data-page-in>
                    <a className="hero-cta" href="#projects">ver projetos <span className="hero-cta-arrow" aria-hidden="true">↗</span></a>
                    <a className="hero-cta is-ghost" href="#connect">contato</a>
                  </div>
                  <span className="page-number">p. 01</span>
                </div>
                <div className="page-pochita" data-page-in>
                  <Pochita3D fill />
                </div>
              </div>

              {/* Leaf 2 — chapter page (front) / table of contents (back, ends on the left) */}
              <div className="book-leaf leaf-2">
                <div className="leaf-face leaf-front">
                  <div className="face-body page-paper chapter-page">
                  <span className="chapter-kicker">capítulo 01</span>
                  <p className="chapter-title">olá,<br />mundo.</p>
                  <p className="chapter-sub">notas, sistemas e rabiscos de um dev backend.</p>
                  <div className="chapter-doodle" aria-hidden="true">
                    <Image src="/images/flower.avif" alt="" fill sizes="160px" style={{ objectFit: 'contain' }} />
                  </div>
                  </div>
                  <span className="leaf-shade" />
                </div>
                <div className="leaf-face leaf-back">
                  <div className="face-body page-paper toc-sheet">
                  <p className="toc-title">sumário</p>
                  <ol className="toc-list">
                    {TOC.map((item, i) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}>
                          <span className="toc-num">{String(i + 1).padStart(2, '0')}</span>
                          <span className="toc-label">{item.label}</span>
                          <span className="toc-dots" aria-hidden="true" />
                          <span className="toc-page">p. {item.page}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                  <p className="toc-note">✎ continue rolando para folhear</p>
                  <div className="toc-doodle" aria-hidden="true">
                    <Image src="/images/ramen.avif" alt="" fill sizes="120px" style={{ objectFit: 'contain' }} />
                  </div>
                  <span className="page-number is-left">p. 00</span>
                  </div>
                  <span className="leaf-shade" />
                </div>
              </div>

              {/* Leaf 1 — the cover (front) / inside cover (back) */}
              <div className="book-leaf leaf-1">
                <div className="leaf-face leaf-front">
                  <div className="face-body book-cover">
                  <span className="cover-corner is-tl" />
                  <span className="cover-corner is-bl" />
                  <span className="cover-corner is-tr" />
                  <span className="cover-corner is-br" />
                  <div className="cover-label">
                    <span className="cover-label-kicker">caderno nº 01</span>
                    <strong>Henri Okayama</strong>
                    <span>desenvolvedor fullstack</span>
                    <span className="cover-label-rule" />
                    <span className="cover-label-year">portfólio · 2026</span>
                  </div>
                  <div className="cover-sticker is-1" aria-hidden="true">
                    <Image src="/images/gundam.avif" alt="" fill sizes="120px" style={{ objectFit: 'contain' }} />
                  </div>
                  <div className="cover-sticker is-2" aria-hidden="true">
                    <Image src="/images/maneki-neko.avif" alt="" fill sizes="120px" style={{ objectFit: 'contain' }} />
                  </div>
                  <div className="cover-sticker is-3" aria-hidden="true">
                    <Image src="/images/toucan.avif" alt="" fill sizes="120px" style={{ objectFit: 'contain' }} />
                  </div>
                  <span className="cover-elastic" aria-hidden="true" />
                  </div>
                  <span className="leaf-shade" />
                </div>
                <div className="leaf-face leaf-back">
                  <div className="face-body book-inside">
                  <p className="inside-kicker">este caderno pertence a:</p>
                  <p className="inside-name">Henri Okayama</p>
                  <p className="inside-note">se encontrado, por favor devolver →<br />henri.okayama@gmail.com</p>
                  <div className="inside-amuleto" aria-hidden="true">
                    <span className="tape" />
                    <Image src="/images/amuleto.png" alt="" fill sizes="90px" style={{ objectFit: 'contain' }} />
                  </div>
                  <figure className="inside-polaroid" aria-hidden="true">
                    <span className="tape" />
                    <div className="inside-polaroid-img">
                      <Image src="/images/bunny_face.avif" alt="" fill sizes="140px" style={{ objectFit: 'cover' }} />
                    </div>
                    <figcaption>eu, debugando</figcaption>
                  </figure>
                  </div>
                  <span className="leaf-shade" />
                </div>
              </div>

              <div className="book-spine" aria-hidden="true">
                {SPINE_RINGS.map((_, i) => <span key={i} />)}
              </div>
            </div>
          </div>

          <p className="book-hint" aria-hidden="true">
            role para abrir o caderno <span className="book-hint-arrow">↓</span>
          </p>
        </div>
      </section>

      {/* ── Side decorative images — scattered along the pages below the notebook ── */}
      <div className="side-img-layer" aria-hidden="true">
      {sideImages.map((img, i) => (
        <div
          key={i}
          className="side-img-abs"
          data-parallax={40 + (i % 4) * 30}
          style={{
            left: img.left,
            right: img.right,
            top: img.top,
            width: img.width,
            height: img.height,
            transform: `rotate(${img.rotate})`,
          }}
          aria-hidden="true"
        >
          <Image src={img.src} alt="" fill style={{objectFit:'contain'}} />
        </div>
      ))}
      </div>

      {/* ── Marquee band ── */}
      <div className="marquee-band" data-marquee="32" aria-hidden="true">
        <div className="marquee-track" data-marquee-track>
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy}>
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span className="marquee-item" key={i}>
                  {item}<span className="marquee-star">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <section className="content-panel about-panel" id="about" data-panel data-tilt="left">
        <span className="panel-label">01 / sobre</span>
        <div className="panel-grid">
          <h2 data-split="words">Desenvolvedor focado em lógica backend confiável e interfaces úteis.</h2>
          <div className="panel-text" data-reveal-group>
            <p data-reveal-item>Gosto de transformar necessidades de negócio em aplicações estáveis — conectando APIs, bancos de dados e fluxos frontend em produtos que parecem simples de usar.</p>
            <p data-reveal-item>Meu trabalho é guiado por estrutura limpa, código mantível, performance e os pequenos detalhes que fazem uma experiência digital parecer polida.</p>
          </div>
        </div>
      </section>

      {/* ── Values — torn paper cards with scroll parallax ── */}
      <section className="values-scene" id="beliefs" data-panel data-tilt="right">
        <span className="panel-label">crenças</span>
        <p className="values-headline" data-split="chars">3 coisas em que acredito fortemente</p>
        <div className="values-stack">
          {values.map((v, i) => (
            <div
              className="value-card"
              key={i}
              data-tilt3d="14"
              style={{
                transform: `rotate(${v.rotate}) perspective(1200px)`,
              }}
            >
              <Image 
                src={v.image} 
                alt={v.label}
                fill
                className="value-card-image"
              />
              <p className={`value-card-text value-font-${v.font}`}>{v.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stack ── */}
      <section className="content-panel skills-panel" id="stack" data-panel data-tilt="left">
        <span className="panel-label">02 / stack</span>
        <h2 data-split="words">Ferramentas que uso para entregar aplicações web sólidas.</h2>
        <div className="skill-cloud" data-reveal-group>
          {skills.map((skill) => (
            <span className="skill-pill" key={skill} data-reveal-item>
              {tagIconMap[skill] && (
                <Image 
                  src={tagIconMap[skill]} 
                  alt={skill} 
                  width={18} 
                  height={18}
                  className="skill-icon"
                />
              )}
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Work ── */}
      <section className="content-panel work-panel" id="work" data-panel data-tilt="right">
        <span className="panel-label">03 / trabalho</span>
        <div className="panel-grid">
          <h2 data-split="words">Experiência moldada em torno de qualidade backend e entrega fullstack.</h2>
          <div className="timeline" data-reveal-group>
            <article data-reveal-item data-tilt3d="6">
              <span>Presente</span>
              <h3>Desenvolvedor Fullstack</h3>
              <p>Construindo e mantendo aplicações web, APIs, integrações e interfaces responsivas.</p>
            </article>
            <article data-reveal-item data-tilt3d="6">
              <span>Foco</span>
              <h3>Sistemas Backend</h3>
              <p>Projetando lógica de serviço, modelos de dados, endpoints REST e fluxos de aplicação confiáveis.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="project-stack" id="projects" data-panel data-tilt="left" data-reveal-group>
        <span className="panel-label">04 / projetos selecionados</span>
        {projects.map((project, index) => (
          <article
            className="work-card"
            key={project.title}
            data-project={project.title}
            data-cursor="stack"
            data-reveal-item
          >
            <span className="g-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3><span className="g-title-inner">{project.title}</span></h3>
              <p>{project.description}</p>
            </div>
            <ul>
              {project.tags.slice(0, 5).map((tag) => (
                <li key={tag}>
                  {tagIconMap[tag] && (
                    <Image 
                      src={tagIconMap[tag]} 
                      alt={tag} 
                      width={16} 
                      height={16}
                      className="tag-icon"
                    />
                  )}
                  <span>{tag}</span>
                </li>
              ))}
              {project.tags.length > 5 && (
                <li 
                  className="show-more-btn" 
                  onClick={() => setExpandedProject(project.title)}
                >
                  Mostrar mais +
                </li>
              )}
            </ul>
          </article>
        ))}
      </section>

      {/* ── Project follower — shows the hovered project's stack ── */}
      <div className="proj-follower" ref={followerRef} aria-hidden="true">
        <div className="proj-frame">
          <span className="proj-frame-label">stack</span>
          <strong className="proj-frame-title">{hoveredProject}</strong>
          <div className="proj-frame-icons">
            {projects.find(p => p.title === hoveredProject)?.tags.map((tag) => (
              <span className="proj-frame-chip" key={tag}>
                {tagIconMap[tag] && <Image src={tagIconMap[tag]} alt="" width={18} height={18} />}
                {tag}
              </span>
            ))}
          </div>
        </div>
        <svg className="proj-badge" viewBox="0 0 100 100">
          <defs>
            <path id="proj-badge-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
          </defs>
          <circle cx="50" cy="50" r="49" />
          <text>
            <textPath href="#proj-badge-circle">ver mais • ver mais • ver mais •</textPath>
          </text>
        </svg>
      </div>

      {/* ── Tags Popup ── */}
      {expandedProject && (
        <div 
          className="tags-popup-overlay" 
          onClick={() => setExpandedProject(null)}
        >
          <div 
            ref={popupRef}
            className="tags-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="popup-close" 
              onClick={() => setExpandedProject(null)}
            >
              ✕
            </button>
            <h3>{projects.find(p => p.title === expandedProject)?.title}</h3>
            <ul className="popup-tags">
              {projects.find(p => p.title === expandedProject)?.tags.map((tag) => (
                <li key={tag}>
                  {tagIconMap[tag] && (
                    <Image 
                      src={tagIconMap[tag]} 
                      alt={tag} 
                      width={20} 
                      height={20}
                      className="tag-icon"
                    />
                  )}
                  <span>{tag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── What I look for — interactive checklist with progressive illustration ── */}
      <section className="lookfor-section" data-panel data-tilt="left">
        <div className="lookfor-card">
          <div className="lookfor-left">
            <h3 className="lookfor-title" data-split="chars">O que busco</h3>
            <ul className="lookfor-list" data-reveal-group>
              {LOOK_FOR_ITEMS.map((label, i) => (
                <li className="lookfor-row" key={label} data-reveal-item>
                  <button
                    type="button"
                    className={`lookfor-check${lookFor[i] ? ' is-checked' : ''}`}
                    onClick={() => toggleLookFor(i)}
                    aria-pressed={lookFor[i]}
                    aria-label={`Toggle ${label}`}
                  >
                    {lookFor[i] && <span className="lookfor-tick" aria-hidden="true">✓</span>}
                  </button>
                  <span className="lookfor-label">{label}</span>
                </li>
              ))}
            </ul>
            <a className="lookfor-cta" href="mailto:henri.okayama@gmail.com" data-magnetic="0.4">vamos conversar!</a>
          </div>

          <div className="lookfor-right" aria-hidden="true">
            <Image
              src="/images/look-part/look-part0.avif"
              alt=""
              fill
              priority
              style={{ objectFit: 'contain' }}
              className="lookfor-frame"
            />
            {[1, 2, 3].map((n) => {
              const checkedCount = lookFor.filter(Boolean).length;
              const isShown = checkedCount >= n;
              return (
                <div
                  key={n}
                  className={`lookfor-overlay lookfor-overlay-${n}${isShown ? ' is-shown' : ''}`}
                >
                  <Image
                    src={`/images/look-part/look-part${n}.webp`}
                    alt=""
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Connect ── */}
      <section className="connect-panel" id="connect" data-panel data-tilt="right">
        <p className="eyebrow">disponível para colaboração</p>
        <h2 data-split="chars">Vamos construir algo confiável, rápido e fácil de manter.</h2>
        <div className="connect-actions" data-reveal-group>
          <a href="https://www.linkedin.com/in/henri-okayama-33a091279/" target="_blank" rel="noreferrer" data-magnetic data-reveal-item>LinkedIn</a>
          <a href="https://github.com/Nunderns" target="_blank" rel="noreferrer" data-magnetic data-reveal-item>GitHub</a>
          <a href="mailto:henri.okayama@gmail.com" data-magnetic data-reveal-item>Email</a>
        </div>
      </section>

      {/* ── Footer marquee ── */}
      <a className="footer-marquee" href="mailto:henri.okayama@gmail.com" data-marquee="24" data-marquee-dir="right" data-cursor="email">
        <div className="marquee-track" data-marquee-track>
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy}>
              {[...FOOTER_MARQUEE, ...FOOTER_MARQUEE].map((item, i) => (
                <span className="footer-marquee-item" key={i}>
                  {item}<span className="marquee-star">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </a>
    </main>
  );
}
