'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteMotion } from '@/app/lib/useSiteMotion';
import { prefersReducedMotion, whenSiteReady } from '@/app/lib/siteReady';

gsap.registerPlugin(ScrollTrigger);

const tagIconMap: Record<string, string> = {
  'Node.js': '/images/svg/node-fill-svgrepo-com.svg',
  'Express': '/images/svg/express-svgrepo-com.svg',
  'Nest.js': '/images/svg/nestjs-svgrepo-com.svg',
  'NestJS': '/images/svg/nestjs-svgrepo-com.svg',
  'PHP': '/images/svg/php-svgrepo-com.svg',
  'Laravel': '/images/svg/laravel-svgrepo-com.svg',
  'Python': '/images/svg/python-127-svgrepo-com.svg',
  'FastAPI': '/images/svg/fastapi-svgrepo-com.svg',
  'PostgreSQL': '/images/svg/postgresql-svgrepo-com.svg',
  'Redis': '/images/svg/redis-svgrepo-com.svg',
  'Next.js': '/images/svg/next-dot-js-svgrepo-com.svg',
  'React': '/images/svg/react-svgrepo-com.svg',
  'Vue.js': '/images/svg/react-svgrepo-com.svg',
  'Tailwind CSS': '/images/svg/tailwind-css-svgrepo-com.svg',
  'Shadcn UI': '/images/svg/shadcn-ui.svg',
  'Docker': '/images/svg/docker-svgrepo-com.svg',
  'GitHub Actions': '/images/svg/github-142-svgrepo-com.svg',
  'MongoDB': '/images/svg/mongodb-svgrepo-com.svg',
  'MySQL': '/images/svg/mysql-svgrepo-com.svg',
  'AWS': '/images/svg/aws-svgrepo-com.svg',
  'Git': '/images/svg/github-142-svgrepo-com.svg',
  'TypeScript': '/images/svg/node-fill-svgrepo-com.svg',
  'Golang': '/images/svg/node-fill-svgrepo-com.svg',
  'LangChain': '/images/svg/node-fill-svgrepo-com.svg',
  'CI/CD': '/images/svg/github-142-svgrepo-com.svg',
};

const experiences = [
  {
    company: 'Intellux',
    role: 'Fullstack Developer',
    type: 'Autônomo',
    year: 'mai 2026 – presente',
    description: 'Desenvolvimento de aplicações SaaS escaláveis com arquitetura multi-tenant. APIs RESTful com TypeScript (Node.js) e Python. CI/CD com GitHub Actions, AWS, Docker. Colaboração com times de produto, frontend e operações.',
    tags: ['TypeScript', 'Node.js', 'Python', 'AWS', 'CI/CD', 'PostgreSQL', 'Docker'],
    rotate: '1.5deg',
  },
  {
    company: 'Coin Nodes',
    role: 'Software Engineer',
    type: 'Autônomo',
    year: 'fev 2026 – mai 2026',
    description: 'Desenvolvimento de APIs REST com Python (FastAPI) e Golang. Arquitetura modular em camadas, PostgreSQL, Redis, Alembic, Docker. Colaboração com times de Front-End, Produto e Design.',
    tags: ['Python', 'FastAPI', 'Golang', 'PostgreSQL', 'Redis', 'Docker', 'Pydantic', 'SQLAlchemy'],
    rotate: '-2deg',
  },
  {
    company: 'hooney+',
    role: 'Fullstack Developer (Consultoria)',
    type: 'Temporário',
    year: 'dez 2025 – jan 2026',
    description: 'Desenvolvimento de APIs escaláveis com NestJS (Node.js + TypeScript). PostgreSQL, Redis, cache e filas. Colaboração com Front-End, decisões de arquitetura e boas práticas.',
    tags: ['Node.js', 'React-Native', 'NestJS', 'PostgreSQL', 'Redis', 'Prisma ORM', 'Expo Go'],
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

const TICKER_ITEMS = ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'MongoDB', 'Docker', 'REST APIs', 'Next.js', 'Git', 'Testing', 'Cloud'];

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

  useSiteMotion(rootRef);

  useEffect(() => {
    let offReady = () => {};
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      // ── Header intro — waits for the loader / page transition
      const lines = gsap.utils.toArray<HTMLElement>('.work-line');
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');
      gsap.set(lines, { yPercent: 115, rotate: 3 });
      gsap.set(fades, { y: 26, opacity: 0 });

      const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
        .to(lines, { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.12 }, 0.05)
        .to(fades, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.3);
      offReady = whenSiteReady(() => intro.play());

      // ── Header drifts away on scroll
      gsap.to('.work-header', {
        yPercent: -18, opacity: 0.2, ease: 'none',
        scrollTrigger: { trigger: '.work-header', start: 'top top', end: 'bottom top', scrub: true },
      });

      // ── Experience cards scroll reveal
      gsap.utils.toArray<HTMLElement>('.exp-card').forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 90,
          scale: 0.96,
          rotate: parseFloat(card.dataset.rotate ?? '0') * -2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        });
      });
    }, rootRef);

    const handleClick = (e: MouseEvent) => spawnClickBurst(e.clientX, e.clientY);
    window.addEventListener('click', handleClick);

    return () => {
      offReady();
      ctx.revert();
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <main ref={rootRef} className="work-shell">
      <div className="noise-layer" />

      {/* ── Back nav ── */}
      <Link href="/" className="work-back" data-hero-fade data-magnetic="0.3">← voltar ao início</Link>

      {/* ── Header ── */}
      <header className="work-header">
        <p className="work-page-label" data-hero-fade>portfólio / trabalho</p>
        <h1 className="work-page-title" aria-label="Trabalhos Selecionados">
          <span className="line-mask" aria-hidden="true"><span className="work-line">Trabalhos</span></span>
          <span className="line-mask" aria-hidden="true"><span className="work-line">Selecionados</span></span>
        </h1>
        <p className="work-page-sub" data-hero-fade>
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
            data-tilt3d="3"
            style={{ transform: `rotate(${exp.rotate})` }}
          >
            <div className="exp-card-inner">
              <div className="exp-meta">
                <p className="exp-type">{exp.type}</p>
                <h2 className="exp-company" data-split="chars">{exp.company}</h2>
                <p className="exp-role">{exp.role}</p>
                <p className="exp-year">{exp.year}</p>
              </div>
              <div className="exp-body">
                <p className="exp-description">{exp.description}</p>
                <ul className="exp-tags" data-reveal-group>
                  {exp.tags.map((tag) => (
                    <li key={tag} data-reveal-item>
                      {tagIconMap[tag] && (
                        <Image 
                          src={tagIconMap[tag]} 
                          alt={tag} 
                          width={16} 
                          height={16}
                          className="exp-tag-icon"
                        />
                      )}
                      <span>{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ── Ticker footer ── */}
      <footer className="work-footer">
        <div className="work-ticker-wrap" data-marquee="26" aria-hidden="true">
          <div className="marquee-track" data-marquee-track>
            {[0, 1].map((copy) => (
              <div className="marquee-group" key={copy}>
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <span className="work-ticker-item" key={i}>
                    {item}<span className="marquee-star">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="work-footer-credit">Henri Okayama · Desenvolvedor Backend / Fullstack</p>
      </footer>
    </main>
  );
}
