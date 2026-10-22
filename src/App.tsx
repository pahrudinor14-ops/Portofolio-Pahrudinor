import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, Code2,
  Compass, Copy, ExternalLink, Gem, GraduationCap, Layers3, Lightbulb, Mail,
  Search, Sparkles, X, Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Starfield from './Starfield';
import { education, experiences, profile, projects, publications, skillGroups } from './portfolio';

type OrbitFocus = 'education' | 'design' | 'technology' | 'impact';

type OrbitNode = {
  id: OrbitFocus;
  number: string;
  label: string;
  heading: string;
  description: string;
  icon: LucideIcon;
  position: string;
  target: string;
};

const orbitNodes: OrbitNode[] = [
  {
    id: 'education', number: '01', label: 'Pendidikan', heading: 'Learning is the core.',
    description: 'Berangkat dari kebutuhan peserta didik, konteks kelas, dan tujuan pembelajaran sebelum merancang solusi.',
    icon: BookOpen, position: 'node-north', target: 'about',
  },
  {
    id: 'design', number: '02', label: 'Desain', heading: 'Make ideas tangible.',
    description: 'Mengubah gagasan menjadi media belajar, alur kerja, dan antarmuka yang jelas serta mudah digunakan.',
    icon: Lightbulb, position: 'node-west', target: 'works',
  },
  {
    id: 'technology', number: '03', label: 'Teknologi', heading: 'Build with purpose.',
    description: 'Mengembangkan website dan aplikasi yang menyelesaikan kebutuhan nyata di lingkungan pendidikan.',
    icon: Code2, position: 'node-east', target: 'works',
  },
  {
    id: 'impact', number: '04', label: 'Dampak', heading: 'Small systems. Real change.',
    description: 'Menghubungkan penelitian, kolaborasi, dan produk digital agar manfaatnya bisa dirasakan lebih luas.',
    icon: Zap, position: 'node-south', target: 'experience',
  },
];

const navItems = [
  { id: 'home', label: 'Beranda', number: '00' },
  { id: 'about', label: 'Tentang Saya', number: '01' },
  { id: 'works', label: 'Karya', number: '02' },
  { id: 'skills', label: 'Keahlian', number: '03' },
  { id: 'experience', label: 'Pengalaman', number: '04' },
  { id: 'contact', label: 'Kontak', number: '05' },
];

const projectFilters = ['Semua', 'Digital', 'Education', 'Research'] as const;
type ProjectFilter = (typeof projectFilters)[number];

function BrandGlyph() {
  return (
    <span className="brand-glyph" aria-hidden="true">
      <span className="brand-glyph-orbit brand-glyph-orbit-a" />
      <span className="brand-glyph-orbit brand-glyph-orbit-b" />
      <span className="brand-glyph-core" />
      <span className="brand-glyph-spark">✦</span>
    </span>
  );
}

function SectionLabel({ number, eyebrow }: { number: string; eyebrow: string }) {
  return (
    <div className="section-label">
      <span className="section-label-number">{number}</span>
      <span className="section-label-line" />
      <span>{eyebrow}</span>
    </div>
  );
}

function SectionTitle({ number, eyebrow, title, accent, description, id }: {
  number: string; eyebrow: string; title: string; accent?: string; description: string; id?: string;
}) {
  return (
    <div className="section-title reveal">
      <SectionLabel number={number} eyebrow={eyebrow} />
      <h2 id={id}>{title}{accent && <> <em>{accent}</em></>}</h2>
      <p>{description}</p>
    </div>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState('home');
  const [activeOrbit, setActiveOrbit] = useState<OrbitFocus>('education');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [filter, setFilter] = useState<ProjectFilter>('Semua');
  const [projectSearch, setProjectSearch] = useState('');
  const projectSearchRef = useRef<HTMLInputElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activeOrbitNode = orbitNodes.find((node) => node.id === activeOrbit) ?? orbitNodes[0];
  const ActiveOrbitIcon = activeOrbitNode.icon;
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;
  const canEmail = Boolean(profile.email && !profile.email.includes('example.com') && !profile.email.includes('ganti-email'));

  const visibleProjects = useMemo(() => {
    const query = projectSearch.trim().toLocaleLowerCase('id-ID');
    return projects.filter((project) => {
      const matchesFilter = filter === 'Semua' || project.category === filter;
      const searchable = `${project.title} ${project.eyebrow} ${project.description} ${project.tags.join(' ')}`.toLocaleLowerCase('id-ID');
      return matchesFilter && (!query || searchable.includes(query));
    });
  }, [filter, projectSearch]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));
    const sectionObserver = new IntersectionObserver((entries) => {
      const candidate = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (candidate?.target.id) setActiveNav(candidate.target.id);
    }, { rootMargin: '-24% 0px -58% 0px', threshold: [0, 0.12, 0.3, 0.55] });
    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    return () => {
      window.removeEventListener('scroll', onScroll);
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const onSlashShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
      if (event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        document.getElementById('works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => projectSearchRef.current?.focus(), 300);
      }
    };
    window.addEventListener('keydown', onSlashShortcut);
    return () => window.removeEventListener('keydown', onSlashShortcut);
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProjectId(null);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProjectId]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const copyEmail = async () => {
    if (!canEmail) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = encodeURIComponent(String(formData.get('subject') || 'Kolaborasi profesional'));
    const message = encodeURIComponent(`Halo Pahrudinor,\n\n${String(formData.get('message') || '')}\n\nNama: ${String(formData.get('name') || '')}`);
    if (canEmail) window.location.href = `mailto:${profile.email}?subject=${subject}&body=${message}`;
  };

  return (
    <div className={`portfolio-app ${motionEnabled ? 'motion-on' : 'motion-off'}`}>
      <div className="universe-backdrop" aria-hidden="true">
        <div className="nebula-cloud nebula-cloud-a" />
        <div className="nebula-cloud nebula-cloud-b" />
        <div className="nebula-cloud nebula-cloud-c" />
        <div className="galactic-rift" />
        <div className="cosmic-vignette" />
      </div>
      <Starfield enabled={motionEnabled} />
      <div className="page-grain" aria-hidden="true" />

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#home" onClick={closeMobileMenu} aria-label="Pahrudinor, kembali ke beranda">
          <BrandGlyph />
          <span className="brand-copy">
            <strong>Pahrudinor</strong>
            <small>PERSONAL PORTFOLIO <i /> 2026</small>
          </span>
        </a>
        <div className="header-right">
          <nav className={`main-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Navigasi utama">
            {navItems.map((item) => (
              <a key={item.id} className={activeNav === item.id ? 'active' : ''} href={`#${item.id}`} onClick={closeMobileMenu}>
                <span>{item.number}</span>{item.label}
              </a>
            ))}
          </nav>
          <button className="motion-toggle" type="button" aria-pressed={motionEnabled} onClick={() => setMotionEnabled((current) => !current)} title={motionEnabled ? 'Jeda animasi bintang' : 'Aktifkan animasi bintang'}>
            <span className={`motion-indicator ${motionEnabled ? 'is-running' : ''}`} />
            <span>{motionEnabled ? 'STARFIELD LIVE' : 'STARFIELD PAUSED'}</span>
          </button>
          <button className="mobile-menu-button" type="button" aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
            {mobileMenuOpen ? <X size={19} /> : <Layers3 size={19} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section section-anchor" id="home" aria-labelledby="hero-title">
          <div className="hero-coordinate coordinate-a" aria-hidden="true">RA 18h 36m 56s <span>·</span> DEC +38° 47′</div>
          <div className="hero-coordinate coordinate-b" aria-hidden="true">EDUCATION / TECHNOLOGY / IMPACT</div>
          <div className="content-width hero-layout">
            <div className="hero-copy">
              <div className="hero-overline"><span className="overline-star">✦</span> A PERSONAL UNIVERSE OF IDEAS <span className="overline-rule" /></div>
              <h1 id="hero-title">Pendidikan<br />bertemu <span>teknologi.</span></h1>
              <p className="hero-role">{profile.role}</p>
              <p className="hero-description">{profile.tagline} Saya percaya teknologi terbaik bukan sekadar terlihat canggih, tetapi membuat belajar, bekerja, dan bertumbuh menjadi lebih bermakna.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#works">Jelajahi semesta karya <ArrowUpRight size={17} /></a>
                <a className="text-link" href="#about">Kenali perjalanan saya <ArrowDownRight size={16} /></a>
              </div>
              <div className="hero-footnote"><span className="footnote-index">FIG. 01</span><span>EXPLORING THE INTERSECTION OF</span><strong>PRIMARY EDUCATION × DIGITAL INNOVATION</strong></div>
            </div>

            <div className="constellation-panel" aria-label="Peta interaktif bidang keahlian">
              <div className="panel-cap"><span><span className="status-led" /> CONSTELLATION MAP</span><span>CLICK A STAR TO EXPLORE</span></div>
              <div className={`constellation-stage selected-${activeOrbit}`}>
                <div className="galaxy-aura" />
                <div className="constellation-ring ring-one" />
                <div className="constellation-ring ring-two" />
                <div className="constellation-ring ring-three" />
                <div className="constellation-axis axis-one" />
                <div className="constellation-axis axis-two" />
                <div className="constellation-core"><span /><i /><b>PH</b></div>
                <svg className="constellation-lines" viewBox="0 0 520 440" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M256 85 L130 165 L355 190 L285 345" />
                  <path d="M130 165 L285 345" />
                  <path d="M256 85 L355 190" />
                </svg>
                {orbitNodes.map((node) => {
                  const Icon = node.icon;
                  return (
                    <button key={node.id} type="button" className={`constellation-node ${node.position} ${activeOrbit === node.id ? 'is-selected' : ''}`} onClick={() => setActiveOrbit(node.id)} aria-pressed={activeOrbit === node.id} aria-label={`Jelajahi bidang ${node.label}`}>
                      <span className="node-halo" /><span className="node-star"><Icon size={17} strokeWidth={1.8} /></span>
                      <span className="node-caption"><small>{node.number}</small><strong>{node.label}</strong></span>
                    </button>
                  );
                })}
                <div className="map-legend map-legend-a"><span>DECLINATION</span><strong>+38° 47′</strong></div>
                <div className="map-legend map-legend-b"><span>ORBITAL SYSTEM</span><strong>EDU / TECH</strong></div>
              </div>
              <div className="constellation-info" aria-live="polite">
                <div className="active-info-icon"><ActiveOrbitIcon size={18} /></div>
                <div className="active-info-copy"><small>{activeOrbitNode.number} / {activeOrbitNode.label.toUpperCase()}</small><strong>{activeOrbitNode.heading}</strong><p>{activeOrbitNode.description}</p></div>
                <a href={`#${activeOrbitNode.target}`} aria-label={`Lihat bagian ${activeOrbitNode.label}`}><ArrowUpRight size={18} /></a>
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#about"><span className="scroll-cue-line" /><span>SCROLL TO EXPLORE</span><ArrowDownRight size={14} /></a>
          <div className="hero-lowerline" aria-hidden="true"><span>PAHRUDINOR</span><span>PORTFOLIO INDEX / 2026</span><span>03°19′ S · 114°35′ E</span></div>
        </section>

        <section className="about-section section-anchor" id="about" aria-labelledby="about-title">
          <div className="content-width section-content">
            <SectionTitle id="about-title" number="01" eyebrow="ORIGIN & PURPOSE" title="Satu fondasi." accent="Banyak kemungkinan." description="Saya bergerak di antara dunia pembelajaran dan teknologi—menerjemahkan kebutuhan nyata menjadi pengalaman, media, dan sistem yang berguna." />
            <div className="about-layout">
              <figure className="about-portrait-card reveal">
                <span className="portrait-coordinate">PERSONAL PROFILE / PHR-01</span>
                <span className="portrait-index"><i /> PGSD · EDTECH</span>
                <span className="portrait-orbit portrait-orbit-a" aria-hidden="true" />
                <span className="portrait-orbit portrait-orbit-b" aria-hidden="true" />
                <img className="about-portrait-image" src="/pahrudinor-formal.png" alt="Foto formal Pahrudinor mengenakan jas hitam" />
                <figcaption className="portrait-caption">
                  <span className="portrait-caption-name"><small>EDUCATION & TECHNOLOGY</small><strong>{profile.name}</strong></span>
                  <span className="portrait-status"><i /> OPEN TO COLLABORATE</span>
                </figcaption>
              </figure>
              <div className="about-copy reveal">
                <div className="about-intro-label"><span className="status-led" /> PROFILE / PHR-01</div>
                <h3>Halo, saya <em>{profile.name}.</em></h3>
                <p>{profile.summary}</p>
                <p>Perjalanan saya mencakup pengembangan media belajar, pengelolaan informasi sekolah, aplikasi manajemen, penelitian pendidikan, serta kolaborasi organisasi. Setiap proyek menjadi kesempatan untuk menghubungkan tujuan pedagogis dengan solusi digital yang terukur.</p>
                <div className="about-data-grid">
                  <div><span>BASE OF OPERATION</span><strong>{profile.location}</strong></div>
                  <div><span>ACADEMIC BACKGROUND</span><strong>Pendidikan Guru Sekolah Dasar</strong></div>
                  <div><span>ACADEMIC PERFORMANCE</span><strong>IPK 3,81 / 4,00</strong></div>
                  <div><span>FOCUS AREA</span><strong>Primary Education · EdTech</strong></div>
                </div>
              </div>
            </div>
            <div className="education-line reveal">
              <div className="education-heading"><GraduationCap size={19} /><span>ACADEMIC TRACK</span></div>
              {education.map((item) => (
                <div className="education-stop" key={item.title}>
                  <span className="education-period">{item.period}</span><strong>{item.title}</strong><span>{item.place}</span><small>{item.note}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="works-section section-anchor" id="works" aria-labelledby="works-title">
          <div className="content-width section-content">
            <SectionTitle id="works-title" number="02" eyebrow="SELECTED MISSIONS" title="Karya yang" accent="menjadi bukti." description="Setiap karya berangkat dari kebutuhan yang berbeda. Pilih sinyal, jelajahi konteks, dan lihat bagaimana sebuah ide berubah menjadi produk atau kontribusi." />
            <div className="project-controls reveal">
              <div className="project-count"><span className="status-led" /><strong>{String(visibleProjects.length).padStart(2, '0')}</strong><span>PROJECT SIGNALS FOUND</span></div>
              <div className="project-filters" role="group" aria-label="Filter kategori karya">
                {projectFilters.map((item) => <button type="button" key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}
              </div>
              <label className="project-search"><Search size={15} /><input ref={projectSearchRef} value={projectSearch} onChange={(event) => setProjectSearch(event.target.value)} placeholder="Cari karya..." aria-label="Cari karya" /><kbd>/</kbd></label>
            </div>
            <div className="project-grid">
              {visibleProjects.map((project, index) => (
                <article className={`project-card project-${project.visual} reveal`} key={project.id} style={{ animationDelay: `${index * 65}ms` }}>
                  <button className="project-open-area" type="button" onClick={() => setSelectedProjectId(project.id)} aria-label={`Lihat detail ${project.title}`}>
                    <div className="project-art" aria-hidden="true">
                      <div className="project-art-grid" />
                      <div className="project-nebula project-nebula-a" /><div className="project-nebula project-nebula-b" />
                      <div className="project-orb"><span /><i /></div>
                      <span className="project-index">PROJECT / {project.number}</span>
                      <span className="project-art-label">{project.eyebrow}</span>
                      <span className="project-open-icon"><ArrowUpRight size={17} /></span>
                    </div>
                    <div className="project-card-copy">
                      <div className="project-category"><span>{project.category}</span><span>↗ EXPLORE SIGNAL</span></div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    </div>
                  </button>
                  <div className="project-card-foot"><span>FIELD NOTE {project.number}</span><button type="button" onClick={() => setSelectedProjectId(project.id)}>Baca studi kasus <ArrowRight size={14} /></button></div>
                </article>
              ))}
              {visibleProjects.length === 0 && <div className="empty-projects"><Search size={22} /><strong>Tidak ada sinyal yang cocok.</strong><span>Coba kata kunci atau kategori lain.</span><button type="button" onClick={() => { setProjectSearch(''); setFilter('Semua'); }}>Reset pencarian</button></div>}
            </div>
            <div className="works-footer reveal"><span>END OF TRANSMISSION <i /></span><p>Lebih dari sekadar tampilan—setiap proyek perlu menjawab kebutuhan dan menjelaskan alasan di balik solusinya.</p><a href="#contact">Bicarakan sebuah ide <ArrowUpRight size={16} /></a></div>
          </div>
        </section>

        <section className="skills-section section-anchor" id="skills" aria-labelledby="skills-title">
          <div className="content-width section-content">
            <SectionTitle id="skills-title" number="03" eyebrow="CAPABILITY NETWORK" title="Keahlian dalam" accent="satu sistem." description="Keahlian terbaik bekerja sebagai jaringan. Pedagogi memberi arah, desain memperjelas pengalaman, dan teknologi membantu gagasan bertumbuh." />
            <div className="skills-network-head reveal"><span><Layers3 size={15} /> SYSTEM MAP / 03 NODES</span><span>SELECTED CAPABILITIES</span></div>
            <div className="skills-grid">
              {skillGroups.map((group, index) => (
                <article key={group.number} className={`skill-card skill-card-${index + 1} reveal`}>
                  <div className="skill-card-top"><span>{group.number} / CAPABILITY NODE</span><span className="skill-pulse" /></div>
                  <div className="skill-symbol" aria-hidden="true">{index === 0 ? <BookOpen size={26} /> : index === 1 ? <Code2 size={26} /> : <Gem size={26} />}</div>
                  <small>{group.subtitle}</small>
                  <h3>{group.title}</h3>
                  <div className="skill-list">{group.skills.map((skill) => <span key={skill}><i />{skill}</span>)}</div>
                  <div className="skill-card-bottom"><span>NODE STATUS</span><strong><Check size={12} /> ACTIVE</strong></div>
                </article>
              ))}
            </div>
            <div className="skills-note reveal"><Sparkles size={17} /><p>Teknologi yang saya gunakan menyesuaikan kebutuhan proyek. Daftar ini merepresentasikan pengalaman dan area kerja, bukan klaim sertifikasi profesional.</p></div>
          </div>
        </section>

        <section className="experience-section section-anchor" id="experience" aria-labelledby="experience-title">
          <div className="content-width section-content">
            <SectionTitle id="experience-title" number="04" eyebrow="MISSION LOG" title="Jejak perjalanan." accent="Pelajaran yang dibawa." description="Pengalaman dalam pendidikan, organisasi, dan publikasi membentuk cara saya mengelola proyek: mendengarkan kebutuhan, menyusun proses, lalu bekerja bersama hingga tuntas." />
            <div className="experience-layout">
              <div className="experience-timeline reveal">
                <div className="timeline-spine" />
                {experiences.map((item, index) => (
                  <article className="timeline-entry" key={`${item.title}-${item.period}`}>
                    <div className="timeline-node"><span>{String(index + 1).padStart(2, '0')}</span></div>
                    <div className="timeline-entry-top"><span>{item.period}</span><small>{item.type}</small></div>
                    <h3>{item.title}</h3><div className="timeline-place">{item.place}</div><p>{item.detail}</p>
                  </article>
                ))}
              </div>
              <aside className="research-panel reveal">
                <div className="research-panel-head"><span><BookOpen size={15} /> RESEARCH & PUBLICATION</span><span>FIELD NOTES</span></div>
                <div className="research-abstract"><div className="research-orbit-icon"><Sparkles size={24} /></div><span>ACADEMIC CONTRIBUTION</span><h3>Penelitian, media, dan literasi ilmiah.</h3><p>Minat kerja saya mencakup pengembangan media pembelajaran dan dukungan editorial dalam proses publikasi ilmiah.</p></div>
                <div className="publication-list">{publications.map((publication, index) => <div className="publication-item" key={publication}><span>0{index + 1}</span><p>{publication}</p><ArrowUpRight size={14} /></div>)}</div>
                <div className="research-panel-bottom"><span>RESEARCH TRACE</span><span><i /> DOCUMENTED</span></div>
              </aside>
            </div>
          </div>
        </section>

        <section className="contact-section section-anchor" id="contact" aria-labelledby="contact-title">
          <div className="contact-nebula" aria-hidden="true" />
          <div className="content-width section-content">
            <SectionTitle id="contact-title" number="05" eyebrow="OPEN TRANSMISSION" title="Mari bertemu di" accent="orbit berikutnya." description="Terbuka untuk kolaborasi di bidang pendidikan dasar, pengembangan media pembelajaran, teknologi pendidikan, dan solusi digital untuk sekolah." />
            <div className="contact-layout">
              <div className="contact-message reveal">
                <div className="contact-planet" aria-hidden="true"><div className="contact-planet-ring" /><div className="contact-planet-core" /><span className="contact-planet-moon" /></div>
                <div className="contact-message-caption"><span className="status-led" /> SIGNAL OPEN</div>
                <h3>Ide baik layak<br /><em>menemukan orbitnya.</em></h3>
                <p>Mulai percakapan tentang proyek, peluang kolaborasi, atau gagasan yang dapat mendukung pembelajaran dan layanan pendidikan.</p>
                <div className="contact-links">
                  <a href={profile.links.dinoEdu} target="_blank" rel="noreferrer"><span><Compass size={17} /></span><span><small>PRODUCT SPACE</small><strong>Pahrudinor</strong></span><ExternalLink size={15} /></a>
                  <a href={profile.links.github} target="_blank" rel="noreferrer"><span><Code2 size={17} /></span><span><small>SOURCE & DEVELOPMENT</small><strong>GitHub project</strong></span><ExternalLink size={15} /></a>
                  {canEmail && <button type="button" onClick={copyEmail}><span><Mail size={17} /></span><span><small>DIRECT CONTACT</small><strong>{profile.email}</strong></span>{copiedEmail ? <Check size={15} /> : <Copy size={15} />}</button>}
                </div>
                {!canEmail && <p className="contact-config-note">Alamat email dapat diatur di <code>src/portfolio.ts</code> sebelum website dipublikasikan.</p>}
              </div>
              <form className="contact-form reveal" onSubmit={handleContactSubmit}>
                <div className="form-heading"><span>TRANSMISSION FORM / 01</span><span className="form-asterisk">✳</span></div>
                <label>Nama / organisasi<input type="text" name="name" placeholder="Bagaimana kami memanggil Anda?" required /></label>
                <label>Topik percakapan<select name="subject" defaultValue="Kolaborasi pendidikan"><option>Kolaborasi pendidikan</option><option>Pengembangan teknologi</option><option>Media pembelajaran</option><option>Penelitian & publikasi</option><option>Peluang profesional</option></select></label>
                <label>Pesan<textarea name="message" placeholder="Ceritakan singkat apa yang ingin Anda kembangkan..." rows={4} required /></label>
                <button className="button button-primary form-submit" type="submit" disabled={!canEmail}>Siapkan pesan <ArrowUpRight size={17} /></button>
                {!canEmail && <small className="form-note">Formulir aktif setelah alamat email penerima diatur pada data profil.</small>}
                <div className="form-secure-note"><span /> NO SPAM · NO BACKEND REQUIRED</div>
              </form>
            </div>
          </div>
          <div className="contact-coordinate" aria-hidden="true">ENDLESS CURIOSITY / RESPONSIBLE INNOVATION / HUMAN IMPACT</div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#home"><BrandGlyph /><span>Pahrudinor</span></a>
        <p>Dirancang untuk belajar. Dibangun untuk memberi dampak.</p>
        <div className="footer-right"><span>© {new Date().getFullYear()} {profile.name}</span><a href="#home">Kembali ke orbit <ArrowUpRight size={13} /></a></div>
      </footer>

      {selectedProject && (
        <div className="project-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProjectId(null); }}>
          <section className={`project-modal project-${selectedProject.visual}`} role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
            <div className="modal-art" aria-hidden="true"><div className="project-art-grid" /><div className="project-nebula project-nebula-a" /><div className="project-nebula project-nebula-b" /><div className="project-orb"><span /><i /></div><span className="modal-art-coord">PROJECT SIGNAL / {selectedProject.number}</span></div>
            <button className="modal-close" type="button" onClick={() => setSelectedProjectId(null)} aria-label="Tutup detail proyek"><X size={20} /></button>
            <div className="modal-copy"><div className="project-category"><span>{selectedProject.category}</span><span>{selectedProject.eyebrow}</span></div><h2 id="project-modal-title">{selectedProject.title}</h2><p>{selectedProject.description}</p><div className="modal-tags">{selectedProject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="modal-note"><span>MY CONTRIBUTION</span><p>Peran, fitur, teknologi, dan hasil detail proyek dapat dilengkapi pada <code>src/portfolio.ts</code> agar setiap studi kasus akurat dan sesuai bukti yang tersedia.</p></div>
              <div className="modal-actions">
                {selectedProject.href.startsWith('http') ? <a className="button button-primary" href={selectedProject.href} target="_blank" rel="noreferrer">Buka proyek <ExternalLink size={16} /></a> : <a className="button button-primary" href={selectedProject.href} onClick={() => setSelectedProjectId(null)}>Lihat bagian terkait <ArrowUpRight size={16} /></a>}
                <button className="button button-quiet" type="button" onClick={() => setSelectedProjectId(null)}>Kembali ke karya</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
