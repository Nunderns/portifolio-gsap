'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROLE_CHARS = 'Desenvolvedor Fullstack'.split('');

const skills = [
  'Node.js', 'TypeScript', 'React', 'Next.js',
  'REST APIs', 'PostgreSQL', 'MongoDB', 'Docker',
  'Git', 'Tailwind CSS', 'Testing', 'Cloud',
];

const values = [
  { label: 'perseguir incansavelmente a clareza.', rotate: '-4deg', color: '#efe1ca', textColor: '#252822' },
  { label: 'projetar para momentos.', rotate: '3deg', color: '#f2a65a', textColor: '#252822' },
  { label: 'o software deve empoderar.', rotate: '10deg', color: '#252822', textColor: '#f2e3cf' },
];

const LOOK_FOR_ITEMS = [
  'Trabalho impactante',
  'Trabalho significativo',
  'Equipe diversificada de pessoas talentosas',
];

const projects = [
  { title: 'Plataforma de API', description: 'Arquitetura de serviços focada em backend com autenticação, persistência de dados e limites de API limpos.', tags: ['Node.js', 'TypeScript', 'PostgreSQL'] },
  { title: 'Dashboard Fullstack', description: 'Interface web responsiva conectada a workflows backend, projetada para clareza e interações rápidas.', tags: ['Next.js', 'React', 'REST'] },
  { title: 'Ferramentas de Automação', description: 'Utilitários de produtividade para desenvolvedores que reduzem tarefas repetitivas e melhoram visibilidade operacional.', tags: ['JavaScript', 'APIs', 'Docker'] },
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

  const toggleLookFor = (i: number) =>
    setLookFor(prev => prev.map((v, j) => (j === i ? !v : v)));

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Eyebrow fade in
      gsap.from('.eyebrow', { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' });

      // ── 2. Hero h1 char-by-char
      const heroChars = gsap.utils.toArray<HTMLElement>('.hero-char');
      gsap.from(heroChars, {
        opacity: 0, y: 48, rotate: () => gsap.utils.random(-12, 12),
        duration: 0.6, stagger: 0.035, ease: 'back.out(1.6)', delay: 0.2,
      });

      // ── 3. Role title char-by-char (accent colour)
      const roleChars = gsap.utils.toArray<HTMLElement>('.role-char');
      gsap.from(roleChars, {
        opacity: 0, y: 32, rotate: () => gsap.utils.random(-8, 8),
        duration: 0.5, stagger: 0.04, ease: 'back.out(1.4)', delay: 0.55,
      });

      // ── 4. Intro paragraph
      gsap.from('.intro', { opacity: 0, y: 22, duration: 0.8, delay: 1.1, ease: 'power3.out' });

      // ── 5. Face card elastic entrance
      gsap.from('.face-card', {
        opacity: 0, scale: 0.88, rotate: -6,
        duration: 1.2, delay: 0.3, ease: 'elastic.out(1, 0.7)',
      });

      // ── 6. Floating orbits loop
      gsap.to('.orbit-one', { y: -16, rotate: 6, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.orbit-two', { y: 14, rotate: -5, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6 });

      // ── 7. Panels scroll reveal
      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel) => {
        gsap.from(panel, {
          opacity: 0, y: 60,
          rotate: panel.dataset.tilt === 'right' ? 1.8 : -1.8,
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });

      // ── 8. Torn paper value cards parallax on scroll
      gsap.utils.toArray<HTMLElement>('.value-card').forEach((card, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.to(card, {
          y: dir * 40,
          rotate: `+=${dir * 3}`,
          ease: 'none',
          scrollTrigger: {
            trigger: '.values-scene',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });

      // ── 9. Skill pills hover
      gsap.utils.toArray<HTMLElement>('.skill-pill, .work-card').forEach((el) => {
        el.addEventListener('mouseenter', () => gsap.to(el, { y: -7, scale: 1.04, duration: 0.22, ease: 'power2.out' }));
        el.addEventListener('mouseleave', () => gsap.to(el, { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }));
      });

    }, rootRef);

    // ── Nav face travels to hovered link (outside ctx so listeners survive revert)
    const face = document.querySelector<HTMLElement>('.nav-face');
    const navCleanups: (() => void)[] = [];

    if (face) {
      // Snapshot every item's deco images so we can hard-reset others on enter
      const items = Array.from(document.querySelectorAll<HTMLElement>('.nav-link-item'));
      const allDecoSets = items.map(it => Array.from(it.querySelectorAll<HTMLElement>('.nav-deco-img')));
      const allOvals    = items.map(it => it.querySelector<HTMLElement>('.nav-oval'));

      const SIDE_GAP = 14;
      const TOP_GAP  = 8;
      const firstLink = items[0]?.querySelector<HTMLElement>('a');

      // Face natural rect (BEFORE any GSAP transform). Recomputed when layout changes.
      let faceNaturalRect = face.getBoundingClientRect();
      let faceNaturalCentreX = faceNaturalRect.left + faceNaturalRect.width  / 2;
      let faceNaturalCentreY = faceNaturalRect.top  + faceNaturalRect.height / 2;
      let home = { x: 0, y: 0 };

      const restPos = (link: HTMLElement) => {
        const lr = link.getBoundingClientRect();
        return {
          x: (lr.left - SIDE_GAP) - faceNaturalRect.right,
          y: (lr.top + lr.height / 2) - faceNaturalCentreY,
        };
      };

      const hoverPos = (link: HTMLElement) => {
        const lr = link.getBoundingClientRect();
        return {
          x: (lr.left + lr.width / 2) - faceNaturalCentreX,
          y: (lr.top - TOP_GAP - faceNaturalRect.height) - faceNaturalRect.top,
        };
      };

      // Reset face transform to read its true natural rect, then compute home and snap face there.
      const recomputeHome = () => {
        if (!firstLink) return;
        gsap.set(face, { x: 0, y: 0 });
        faceNaturalRect = face.getBoundingClientRect();
        faceNaturalCentreX = faceNaturalRect.left + faceNaturalRect.width  / 2;
        faceNaturalCentreY = faceNaturalRect.top  + faceNaturalRect.height / 2;
        home = restPos(firstLink);
        gsap.set(face, { x: home.x, y: home.y });
      };

      // Initial position: defer until layout settles (fonts, hydration, images).
      // Fixes face appearing at wrong location after client-side route transitions.
      requestAnimationFrame(() => recomputeHome());
      document.fonts?.ready.then(() => recomputeHome()).catch(() => {});

      // Recompute on resize so layout shifts don't break alignment
      const onResize = () => recomputeHome();
      window.addEventListener('resize', onResize);
      navCleanups.push(() => window.removeEventListener('resize', onResize));

      items.forEach((item, idx) => {
        const oval   = allOvals[idx];
        const decos  = allDecoSets[idx];
        const link   = item.querySelector<HTMLElement>('a');

        const onEnter = () => {
          if (!link) return;

          // hard-reset OTHER items so no stale animations remain
          allDecoSets.forEach((set, i) => {
            if (i === idx) return;
            gsap.killTweensOf(set);
            gsap.set(set, { opacity: 0, y: 0, scale: 1 });
            const o = allOvals[i];
            if (o) { gsap.killTweensOf(o); gsap.set(o, { opacity: 0, scale: 0.6 }); }
          });

          // face travels to sit CENTRED ABOVE the hovered link
          const target = hoverPos(link);
          gsap.to(face, { x: target.x, y: target.y, duration: 0.42, ease: 'back.out(1.5)', overwrite: true });

          if (oval) gsap.to(oval, { scale: 1, opacity: 1, duration: 0.26, ease: 'back.out(1.8)', overwrite: true });
          if (decos.length) {
            gsap.killTweensOf(decos);
            gsap.fromTo(decos,
              { y: 18, opacity: 0, scale: 0.85 },
              { y: 0, opacity: 1, scale: 1, stagger: 0.07, duration: 0.42, ease: 'back.out(1.6)', overwrite: true });
          }
        };

        const onLeave = () => {
          gsap.to(face, { x: home.x, y: home.y, duration: 0.55, delay: 0.2, ease: 'back.inOut(1.4)', overwrite: true });
          if (oval) gsap.to(oval, { scale: 0.6, opacity: 0, duration: 0.16, overwrite: true });
          if (decos.length) {
            gsap.killTweensOf(decos);
            gsap.to(decos, { opacity: 0, y: -10, duration: 0.2, stagger: 0.04, overwrite: true });
          }
        };

        item.addEventListener('mouseenter', onEnter);
        item.addEventListener('mouseleave', onLeave);
        navCleanups.push(() => {
          item.removeEventListener('mouseenter', onEnter);
          item.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    // ── Mouse click burst
    const handleClick = (e: MouseEvent) => spawnClickBurst(e.clientX, e.clientY);
    window.addEventListener('click', handleClick);

    return () => {
      ctx.revert();
      navCleanups.forEach(fn => fn());
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <main ref={rootRef} className="site-shell">
      <div className="noise-layer" />

      {/* ── Amuleto stamp (top-right fixed) ── */}
      <div className="amuleto-wrap" aria-hidden="true">
        <Image src="/images/amuleto.png" alt="" width={72} height={118} priority />
      </div>

      {/* ── Side decorative images — absolute, scattered across page ── */}
      {sideImages.map((img, i) => (
        <div
          key={i}
          className="side-img-abs"
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

      {/* ── Topbar nav — absolute, disappears on scroll ── */}
      <nav className="topbar" aria-label="Main navigation">
        {/* Links row — face floats above this via absolute positioning */}
        <div className="nav-links-row">

          {/* Face — absolute above links, travels horizontally on hover */}
          <div className="nav-face" aria-hidden="true">
            <span className="nf-eye left" />
            <span className="nf-eye right" />
            <span className="nf-smile" />
            <span className="nf-crown" />
          </div>

          {/* About — 3 decorative images on hover (like Navie1/2/3 in reference) */}
          <div className="nav-link-item">
            <div className="nav-deco-img ndi-1">
              <Image src="/images/bird.avif" alt="" fill style={{objectFit:'contain'}} />
            </div>
            <div className="nav-deco-img ndi-2">
              <Image src="/images/bunny_face.avif" alt="" fill style={{objectFit:'cover'}} />
            </div>
            <div className="nav-deco-img ndi-3">
              <Image src="/images/computer_face.avif" alt="" fill style={{objectFit:'cover'}} />
            </div>
            <a href="#about">sobre</a>
            <span className="nav-oval" />
            <span className="nav-sub">em andamento</span>
          </div>

          {/* Work — 2 decorative images on hover (Navie4 large + Navie5 small) */}
          <div className="nav-link-item">
            <div className="nav-deco-img ndi-1">
              <Image src="/images/flowers_more.avif" alt="" fill style={{objectFit:'cover'}} />
            </div>
            <div className="nav-deco-img ndi-7">
              <Image src="/images/flower.avif" alt="" fill style={{objectFit:'cover'}} />
            </div>
            <a href="/work">Trabalho</a>
            <span className="nav-oval" />
          </div>

          {/* Connect — small social-style deco */}
          <div className="nav-link-item">
            <div className="nav-deco-img ndi-1">
              <Image src="/images/gundam.avif" alt="" fill style={{objectFit:'cover'}} />
            </div>
            <div className="nav-deco-img ndi-2">
              <Image src="/images/map.avif" alt="" fill style={{objectFit:'cover'}} />
            </div>
            <a href="#connect">Conectar</a>
            <span className="nav-oval" />
          </div>

        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-stage" id="home">
        <div className="hero-copy">
          <p className="eyebrow">backend / desenvolvedor fullstack</p>

          {/* char-by-char headline */}
          <h1 aria-label="Olá, sou Henri Okayama.">
            <>
              {'Olá, sou Henri'.split('').map((ch, i) => (
                <span className="hero-char" key={`line1-${i}`} style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
              <br />
              {'Okayama.'.split('').map((ch, i) => (
                <span className="hero-char" key={`line2-${i}`} style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </>
          </h1>

          {/* role title char-by-char with accent colour */}
          <p className="role-title" aria-label="Desenvolvedor Fullstack">
            {ROLE_CHARS.map((ch, i) => (
              <span className="role-char" key={i} style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </p>

          <p className="intro">
            Construo sistemas web confiáveis que ajudam produtos a se moverem mais rápido — com arquitetura backend pensada e execução fullstack limpa.
          </p>
        </div>

        <div className="portrait-zone">
          <div className="floating-orbit orbit-one">Backend</div>
          <div className="floating-orbit orbit-two">Frontend</div>
          <div className="face-card">
            <span className="face-eye left" />
            <span className="face-eye right" />
            <span className="face-smile" />
          </div>
          <div className="book-strip" />
        </div>
      </section>

      {/* ── About ── */}
      <section className="content-panel about-panel" id="about" data-panel data-tilt="left">
        <span className="panel-label">01 / sobre</span>
        <div className="panel-grid">
          <h2>Desenvolvedor focado em lógica backend confiável e interfaces úteis.</h2>
          <div className="panel-text">
            <p>Gosto de transformar necessidades de negócio em aplicações estáveis — conectando APIs, bancos de dados e fluxos frontend em produtos que parecem simples de usar.</p>
            <p>Meu trabalho é guiado por estrutura limpa, código mantível, performance e os pequenos detalhes que fazem uma experiência digital parecer polida.</p>
          </div>
        </div>
      </section>

      {/* ── Values — torn paper cards with scroll parallax ── */}
      <section className="values-scene" data-panel data-tilt="right">
        <span className="panel-label">crenças</span>
        <p className="values-headline">3 coisas em que acredito fortemente</p>
        <div className="values-stack">
          {values.map((v, i) => (
            <div
              className="value-card"
              key={i}
              style={{
                background: v.color,
                color: v.textColor,
                transform: `rotate(${v.rotate}) perspective(1200px)`,
              }}
            >
              <div className="value-card-tear" />
              <p>{v.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stack ── */}
      <section className="content-panel skills-panel" data-panel data-tilt="left">
        <span className="panel-label">02 / stack</span>
        <h2>Ferramentas que uso para entregar aplicações web sólidas.</h2>
        <div className="skill-cloud">
          {skills.map((skill) => (
            <span className="skill-pill" key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      {/* ── Work ── */}
      <section className="content-panel work-panel" id="work" data-panel data-tilt="right">
        <span className="panel-label">03 / trabalho</span>
        <div className="panel-grid">
          <h2>Experiência moldada em torno de qualidade backend e entrega fullstack.</h2>
          <div className="timeline">
            <article>
              <span>Presente</span>
              <h3>Desenvolvedor Fullstack</h3>
              <p>Construindo e mantendo aplicações web, APIs, integrações e interfaces responsivas.</p>
            </article>
            <article>
              <span>Foco</span>
              <h3>Sistemas Backend</h3>
              <p>Projetando lógica de serviço, modelos de dados, endpoints REST e fluxos de aplicação confiáveis.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="project-stack" data-panel data-tilt="left">
        <span className="panel-label">04 / projetos selecionados</span>
        {projects.map((project, index) => (
          <article className="work-card" key={project.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <ul>
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* ── What I look for — interactive checklist with progressive illustration ── */}
      <section className="lookfor-section" data-panel data-tilt="left">
        <div className="lookfor-card">
          <div className="lookfor-left">
            <h3 className="lookfor-title">O que busco</h3>
            <ul className="lookfor-list">
              {LOOK_FOR_ITEMS.map((label, i) => (
                <li className="lookfor-row" key={label}>
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
            <a className="lookfor-cta" href="mailto:henri.okayama@gmail.com">vamos conversar!</a>
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
        <h2>Vamos construir algo confiável,<br />rápido e fácil de manter.</h2>
        <div className="connect-actions">
          <a href="https://www.linkedin.com/in/henri-okayama-33a091279/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Nunderns" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:henri.okayama@gmail.com">Email</a>
        </div>
      </section>
    </main>
  );
}
