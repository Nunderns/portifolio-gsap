'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    company: 'Intellux',
    role: 'Fullstack Developer',
    type: 'Remoto',
    year: 'mai 2026 – presente',
    description: 'Desenvolvimento de aplicações SaaS escaláveis com arquitetura multi-tenant. APIs RESTful com TypeScript (Node.js) e Python. CI/CD com GitHub Actions, AWS, Docker. Colaboração com times de produto, frontend e operações.',
    tags: ['TypeScript', 'Node.js', 'Python', 'AWS', 'CI/CD', 'PostgreSQL', 'Docker'],
    rotate: '-2deg',
  },
  {
    company: 'Coin Nodes',
    role: 'Software Engineer',
    type: 'Autônomo',
    year: 'fev 2026 – mai 2026',
    description: 'Desenvolvimento de APIs REST com Python (FastAPI) e Golang. Arquitetura modular em camadas, PostgreSQL, Redis, Alembic, Docker. Colaboração com times de Front-End, Produto e Design.',
    tags: ['Python', 'FastAPI', 'Golang', 'PostgreSQL', 'Redis', 'Docker'],
    rotate: '-2deg',
  },
  {
    company: 'hooney+',
    role: 'Fullstack Developer (Consultoria)',
    type: 'Temporário',
    year: 'dez 2025 – jan 2026',
    description: 'Desenvolvimento de APIs escaláveis com NestJS (Node.js + TypeScript). PostgreSQL, Redis, cache e filas. Colaboração com Front-End, decisões de arquitetura e boas práticas.',
    tags: ['Node.js', 'TypeScript', 'NestJS', 'PostgreSQL', 'Redis'],
    rotate: '1.5deg',
  },
  {
    company: 'PixaFlow',
    role: 'Backend Developer',
    type: 'Tempo integral',
    year: 'out 2025 – nov 2025',
    description: 'Backend Python (IA e Automação). APIs e microsserviços com FastAPI, pipelines de IA com LangChain e RAG, bancos SQL, Pytest, deploy em AWS/GCP.',
    tags: ['Python', 'FastAPI', 'LangChain', 'PostgreSQL', 'AWS', 'Docker'],
    rotate: '-1deg',
  },
  {
    company: 'Momesso Indústria de Máquinas Ltda',
    role: 'Analista de dados',
    type: 'Meio período',
    year: 'abr 2025 – set 2025',
    description: 'Desenvolvimento de dashboards com Power BI e automações com Power Automate.',
    tags: ['Power BI', 'Power Automate'],
    rotate: '2deg',
  },
  {
    company: 'Mídia Sales',
    role: 'Auxiliar Administrativo e Desenvolvedor de backend',
    type: 'Meio período',
    year: 'jun 2024 – abr 2025',
    description: 'Desenvolvimento e manutenção de aplicações web, APIs RESTful, versionamento em equipe. PHP, JavaScript, Laravel, Vue.js, MySQL, Git, Docker, Scrum, TDD.',
    tags: ['PHP', 'Laravel', 'Vue.js', 'MySQL', 'Git', 'Docker'],
    rotate: '-1.5deg',
  },
];

const TICKER_TEXT = 'Node.js · TypeScript · React · PostgreSQL · MongoDB · Docker · REST APIs · Next.js · Git · Testing · Cloud ·\u00A0';

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
  gsap.to(ring, { scale: 3.2, opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: () => ring.remove() });
}

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header entrance
      gsap.from('.work-page-label', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' });
      gsap.from('.work-page-title .wchar', {
        opacity: 0, y: 50, rotate: () => gsap.utils.random(-14, 14),
        duration: 0.55, stagger: 0.04, ease: 'back.out(1.6)', delay: 0.15,
      });
      gsap.from('.work-page-sub', { opacity: 0, y: 18, duration: 0.7, delay: 0.7, ease: 'power3.out' });

      // ── Back link
      gsap.from('.work-back', { opacity: 0, x: -18, duration: 0.5, delay: 0.1, ease: 'power2.out' });

      // ── Experience cards scroll reveal
      gsap.utils.toArray<HTMLElement>('.exp-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 70,
          rotate: parseFloat(card.dataset.rotate ?? '0') * -1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none reverse' },
          delay: i * 0.05,
        });
      });

      // ── Ticker infinite scroll
      const ticker = document.querySelector<HTMLElement>('.work-ticker-inner');
      if (ticker) {
        const clone = ticker.cloneNode(true) as HTMLElement;
        ticker.parentElement?.appendChild(clone);
        gsap.to([ticker, clone], {
          x: `-=${ticker.scrollWidth}`,
          duration: 22,
          repeat: -1,
          ease: 'none',
          modifiers: {
            x: gsap.utils.unitize(gsap.utils.wrap(-ticker.scrollWidth, 0)),
          },
        });
      }
    }, rootRef);

    const handleClick = (e: MouseEvent) => spawnClickBurst(e.clientX, e.clientY);
    window.addEventListener('click', handleClick);

    return () => {
      ctx.revert();
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <main ref={rootRef} className="work-shell">
      <div className="noise-layer" />

      {/* ── Back nav ── */}
      <Link href="/" className="work-back">← voltar ao início</Link>

      {/* ── Header ── */}
      <header className="work-header">
        <p className="work-page-label">portfólio / trabalho</p>
        <h1 className="work-page-title" aria-label="Trabalhos Selecionados">
          <>
            {'Trabalhos'.split('').map((ch, i) => (
              <span className="wchar" key={`line1-${i}`} style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
            <br />
            {'Selecionados'.split('').map((ch, i) => (
              <span className="wchar" key={`line2-${i}`} style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </>
        </h1>
        <p className="work-page-sub">
          Uma coleção de papéis, projetos e sistemas que construí como desenvolvedor fullstack com foco em backend.
        </p>
      </header>

      {/* ── Experience list ── */}
      <section className="exp-list">
        {experiences.map((exp, i) => (
          <article
            className="exp-card"
            key={i}
            data-rotate={exp.rotate}
            style={{ transform: `rotate(${exp.rotate})` }}
          >
            <div className="exp-card-inner">
              <div className="exp-meta">
                <p className="exp-type">{exp.type}</p>
                <h2 className="exp-company">{exp.company}</h2>
                <p className="exp-role">{exp.role}</p>
                <p className="exp-year">{exp.year}</p>
              </div>
              <div className="exp-body">
                <p className="exp-description">{exp.description}</p>
                <ul className="exp-tags">
                  {exp.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ── Ticker footer ── */}
      <footer className="work-footer">
        <div className="work-ticker-wrap">
          <span className="ticker-note">🎵</span>
          <div className="work-ticker-track">
            <span className="work-ticker-inner">{TICKER_TEXT}</span>
          </div>
          <span className="ticker-note">🎵</span>
        </div>
        <p className="work-footer-credit">Henri Okayama · Desenvolvedor Backend / Fullstack</p>
      </footer>
    </main>
  );
}
