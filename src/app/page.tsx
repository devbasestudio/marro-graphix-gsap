"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Work = {
  src: string;
  title: string;
  category: "Advertising" | "Campaign" | "Branding";
  shape: "portrait" | "square" | "landscape";
};

type ProfessionalGroup = {
  brand: string;
  service: string;
  summary: string;
  works: Work[];
};

const works: Work[] = [
  { src: "/artworks/dji-osmo.jpg", title: "Capture Every Adventure", category: "Advertising", shape: "portrait" },
  { src: "/artworks/kfc.jpg", title: "Original Taste", category: "Campaign", shape: "square" },
  { src: "/artworks/terra-orange.jpg", title: "No Roads? No Problem", category: "Advertising", shape: "square" },
  { src: "/artworks/pico-vr.jpg", title: "Survive The Night", category: "Campaign", shape: "portrait" },
  { src: "/artworks/shining-star.jpg", title: "Myanmar Shining Star", category: "Branding", shape: "portrait" },
  { src: "/artworks/new-balance.jpg", title: "Urban Heritage", category: "Advertising", shape: "portrait" },
  { src: "/artworks/hanoi.jpg", title: "Hanoi Landmarks", category: "Campaign", shape: "square" },
  { src: "/artworks/ruh.jpg", title: "RUH Lemon Beauty Bar", category: "Advertising", shape: "square" },
  { src: "/artworks/pocari-new.jpg", title: "Go Sweat, Go Ion", category: "Advertising", shape: "portrait" },
  { src: "/artworks/sprite.jpg", title: "Fresh Sprite", category: "Advertising", shape: "portrait" },
  { src: "/artworks/aston-martin.jpg", title: "Aston Martin Heritage", category: "Campaign", shape: "square" },
  { src: "/artworks/pocari-original.jpg", title: "Pocari Sweat", category: "Advertising", shape: "portrait" },
  { src: "/artworks/fitness-original.jpg", title: "HOHO Fitness", category: "Campaign", shape: "square" },
  { src: "/artworks/s25-original.jpg", title: "Galaxy S25 Ultra", category: "Advertising", shape: "portrait" },
  { src: "/artworks/terra-original.jpg", title: "Terra Adventure", category: "Campaign", shape: "square" },
  { src: "/artworks/gopro-original.png", title: "GoPro Travel", category: "Advertising", shape: "portrait" },
  { src: "/artworks/vr-original.png", title: "PICO VR Experience", category: "Campaign", shape: "portrait" },
];

const professionalGroups: ProfessionalGroup[] = [
  {
    brand: "BusyBees",
    service: "Pest control campaigns",
    summary: "Targeted social media creatives that turn pest-control services into clear, attention-grabbing customer messages.",
    works: [
      { src: "/artworks/professional/busybees/termite-dining.jpg", title: "Termite Control for Dining Spaces", category: "Campaign", shape: "portrait" },
      { src: "/artworks/professional/busybees/wood-pest-control.jpg", title: "Wood Pest Protection", category: "Campaign", shape: "portrait" },
      { src: "/artworks/professional/busybees/termite-warning.jpg", title: "Termite Damage Awareness", category: "Advertising", shape: "portrait" },
    ],
  },
  {
    brand: "Clean Pro",
    service: "Cleaning service campaigns",
    summary: "Service-led social media designs for specialist cleaning, construction clean-up, transport, and commercial environments.",
    works: [
      { src: "/artworks/professional/clean-pro/high-rise-cleaning.jpg", title: "High-Rise Cleaning Safety", category: "Advertising", shape: "portrait" },
      { src: "/artworks/professional/clean-pro/construction-cleaning.jpg", title: "Construction Cleaning Service", category: "Campaign", shape: "portrait" },
      { src: "/artworks/professional/clean-pro/bus-cleaning.jpg", title: "Professional Bus Cleaning", category: "Advertising", shape: "portrait" },
    ],
  },
  {
    brand: "Nilfisk",
    service: "Product-focused campaigns",
    summary: "Product advertising that highlights equipment benefits, applications, and specifications with direct visual hierarchy.",
    works: [
      { src: "/artworks/professional/nilfisk/high-pressure-washer.jpg", title: "High Pressure Washer", category: "Advertising", shape: "portrait" },
      { src: "/artworks/professional/nilfisk/manual-sweeper.jpg", title: "SW250 Manual Sweeper", category: "Advertising", shape: "portrait" },
      { src: "/artworks/professional/nilfisk/hp131.jpg", title: "HP131 Industrial Washer", category: "Advertising", shape: "portrait" },
    ],
  },
];

const services = [
  {
    number: "01",
    name: "Basic Pack",
    price: "15,000",
    note: "MMK / package",
    features: ["3 Custom Designs", "3 Content Copies", "High-Resolution Files", "1 Revision Round"],
  },
  {
    number: "02",
    name: "Growth Pack",
    price: "30,000",
    note: "MMK / package",
    features: ["5 Custom Designs", "5 Content Copies", "+1 Bonus Design & Content", "2 Revision Rounds"],
  },
  {
    number: "03",
    name: "Premium Pack",
    price: "300,000",
    note: "MMK / package",
    features: ["30 Custom Designs", "30 Content Copies", "+5 Bonus Designs", "Unlimited Revisions", "Priority Support"],
  },
];

const categories = ["All", "Advertising", "Campaign", "Branding"] as const;

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selected, setSelected] = useState<Work | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredWorks = useMemo(
    () => (category === "All" ? works : works.filter((work) => work.category === category)),
    [category],
  );

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".project-card");
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 28, scale: 0.985 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.055, ease: "power3.out" },
    );
    ScrollTrigger.refresh();
  }, [category]);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const intro = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onStart: () => {
          document.body.style.overflow = "hidden";
        },
        onComplete: () => {
          document.body.style.overflow = "";
        },
      });

      intro
        .from(".intro-word span", { yPercent: 120, duration: 0.9, stagger: 0.08 })
        .to(".intro-line", { scaleX: 1, duration: 0.65 }, "-=0.45")
        .to(".site-intro", { yPercent: -100, duration: 1.05, delay: 0.25 })
        .from(".hero-kicker, .hero-title-line, .hero-copy, .hero-actions", {
          y: 44,
          opacity: 0,
          duration: 0.9,
          stagger: 0.09,
        }, "-=0.45")
        .from(".hero-visual", { clipPath: "inset(100% 0 0 0)", duration: 1.15 }, "-=1.1");

      gsap.to(".hero-profile", {
        yPercent: 9,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".marquee-track", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".marquee",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 72,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".service-row").forEach((row) => {
        gsap.from(row.children, {
          y: 55,
          opacity: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 86%",
            once: true,
          },
        });
      });
    },
    { scope: mainRef },
  );

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

    const move = (event: MouseEvent) => {
      gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.18, ease: "power2.out" });
    };
    const grow = () => cursor.classList.add("is-active");
    const shrink = () => cursor.classList.remove("is-active");
    const targets = document.querySelectorAll("a, button, .project-card");
    window.addEventListener("mousemove", move);
    targets.forEach((target) => {
      target.addEventListener("mouseenter", grow);
      target.addEventListener("mouseleave", shrink);
    });
    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((target) => {
        target.removeEventListener("mouseenter", grow);
        target.removeEventListener("mouseleave", shrink);
      });
    };
  }, [category]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main ref={mainRef}>
      <div ref={cursorRef} className="cursor-dot" aria-hidden="true" />

      <div className="site-intro" aria-hidden="true">
        <div className="intro-word">
          <span>MARRO</span>
        </div>
        <div className="intro-line" />
        <div className="intro-word intro-word-outline">
          <span>GRAPHIX</span>
        </div>
      </div>

      <header className="nav-wrap">
        <a href="#home" className="brand" aria-label="MARRO GRAPHIX home" onClick={closeMenu}>
          <Image src="/logo.jpg" width={44} height={44} alt="" priority />
          <span>MARRO<br />GRAPHIX</span>
        </a>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#resume" onClick={closeMenu}>Resume</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      <section id="home" className="hero">
        <div className="hero-content">
          <p className="hero-kicker"><span /> Graphic Designer · Myanmar</p>
          <h1 className="hero-title" aria-label="Ideas made visible">
            <span className="hero-title-line">IDEAS MADE</span>
            <span className="hero-title-line hero-title-accent">VISIBLE.</span>
          </h1>
          <p className="hero-copy">
            Freelance graphic design experience since 2024—plus one year at Clean Pro
            creating targeted social media designs for Clean Pro, BusyBees, and Nilfisk.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#work">Explore selected work <span>↘</span></a>
            <a className="text-link" href="#contact">Start a project <span>→</span></a>
          </div>
        </div>

        <div className="hero-visual">
          <Image className="hero-profile" src="/profile.jpg" fill priority sizes="(max-width: 900px) 100vw, 42vw" alt="MARRO, graphic designer" />
          <div className="hero-visual-label">
            <span>Available for opportunities</span>
            <strong>2026</strong>
          </div>
        </div>

        <div className="hero-index">
          <span>2+ years freelance</span>
          <span>1 year at Clean Pro</span>
          <span>3 brands</span>
        </div>
      </section>

      <section className="marquee" aria-label="Design disciplines">
        <div className="marquee-track">
          <span>ART DIRECTION</span><i>✦</i>
          <span>SOCIAL MEDIA</span><i>✦</i>
          <span>BRAND IDENTITY</span><i>✦</i>
          <span>PHOTO MANIPULATION</span><i>✦</i>
          <span>ART DIRECTION</span><i>✦</i>
          <span>SOCIAL MEDIA</span><i>✦</i>
        </div>
      </section>

      <section id="work" className="section work-section">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">Professional work · 2025—2026</p>
            <h2>Visual stories<br />built to move.</h2>
          </div>
          <p className="heading-copy">
            Professional social media design created around each brand&apos;s audience,
            service category, campaign target, and marketing objective.
          </p>
        </div>

        <div className="professional-groups">
          {professionalGroups.map((group, groupIndex) => (
            <section className="brand-group reveal" key={group.brand} aria-labelledby={`brand-${groupIndex}`}>
              <div className="brand-group-heading">
                <span className="brand-index">0{groupIndex + 1}</span>
                <div>
                  <p>{group.service}</p>
                  <h3 id={`brand-${groupIndex}`}>{group.brand}</h3>
                </div>
                <p className="brand-summary">{group.summary}</p>
              </div>
              <div className="brand-work-grid">
                {group.works.map((work) => (
                  <button
                    type="button"
                    className="brand-work-card project-card"
                    key={work.src}
                    onClick={() => setSelected(work)}
                    aria-label={`Open ${work.title}`}
                  >
                    <span className="project-image">
                      <Image src={work.src} fill sizes="(max-width: 760px) 100vw, 33vw" alt={work.title} />
                    </span>
                    <span className="project-meta">
                      <span>
                        <strong>{work.title}</strong>
                        <small>{group.brand} · {group.service}</small>
                      </span>
                      <span className="project-number">↗</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="student-work-heading reveal">
          <div>
            <p className="eyebrow">Student practice work · Selected assignments</p>
            <h3>Learning through<br />visual exploration.</h3>
          </div>
          <p>
            The following concepts were created during my student years as assignments
            and self-directed practice to develop composition, typography, photo manipulation,
            and advertising design skills.
          </p>
        </div>

        <div className="filter-bar reveal" role="group" aria-label="Filter portfolio work">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "filter active" : "filter"}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
          <span className="work-count">{String(filteredWorks.length).padStart(2, "0")} practice pieces</span>
        </div>

        <div className="project-grid">
          {filteredWorks.map((work, index) => (
            <button
              type="button"
              className={`project-card ${work.shape}`}
              key={work.src}
              onClick={() => setSelected(work)}
              aria-label={`Open ${work.title}`}
            >
              <span className="project-image">
                <Image src={work.src} fill sizes="(max-width: 760px) 100vw, 33vw" alt={work.title} />
              </span>
              <span className="project-meta">
                <span>
                  <strong>{work.title}</strong>
                  <small>{work.category}</small>
                </span>
                <span className="project-number">{String(index + 1).padStart(2, "0")} ↗</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="about-lead reveal">
          <p className="eyebrow">About the designer</p>
          <h2>Simple enough to understand.<br /><em>Bold enough to remember.</em></h2>
        </div>

        <div className="about-grid">
          <div className="about-logo reveal">
            <Image src="/logo.jpg" fill sizes="(max-width: 760px) 100vw, 40vw" alt="MARRO GRAPHIX logo" />
          </div>
          <div className="about-copy reveal">
            <p className="about-big">
              Hi, I&apos;m Marro — a freelance graphic designer since 2024 with an additional
              year of professional experience at Clean Pro.
            </p>
            <p>
              At Clean Pro, I produced an average of six designs per day for Clean Pro,
              BusyBees, and Nilfisk, while also creating business cards, name cards,
              promotional materials, and other brand assets.
            </p>
            <div className="skill-list">
              {["Social Media Design", "Brand Identity", "Poster Design", "Product Mockup", "Photo Manipulation", "Typography"].map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section services-section">
        <div className="section-heading light reveal">
          <div>
            <p className="eyebrow">Services & packages</p>
            <h2>Choose the right<br />creative rhythm.</h2>
          </div>
          <p className="heading-copy">
            Flexible packages for campaigns of every size. Clear deliverables,
            thoughtful craft, and ready-to-publish files.
          </p>
        </div>

        <div className="services-list">
          {services.map((service, index) => (
            <article className="service-row" key={service.name}>
              <span className="service-number">{service.number}</span>
              <div className="service-name">
                <h3>{service.name}</h3>
                {index === 1 && <span className="popular-tag">Popular</span>}
              </div>
              <div className="service-features">
                {service.features.map((feature) => <span key={feature}>+ {feature}</span>)}
              </div>
              <div className="service-price">
                <strong>{service.price}</strong>
                <span>{service.note}</span>
              </div>
              <a href="#contact" aria-label={`Enquire about ${service.name}`}>↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section process-section">
        <div className="process-copy reveal">
          <p className="eyebrow">Behind the work</p>
          <h2>Built with craft.<br />Grounded in practice.</h2>
          <p>
            From hands-on production to certified Photoshop training, every project is
            shaped through research, composition, typography, and detail-driven iteration.
          </p>
        </div>
        <div className="process-gallery">
          <button type="button" className="process-card process-tall reveal" onClick={() => setSelected({ src: "/artworks/bts-photoshop.jpg", title: "Behind the scenes", category: "Branding", shape: "portrait" })}>
            <Image src="/artworks/bts-photoshop.jpg" fill sizes="(max-width: 760px) 100vw, 32vw" alt="MARRO GRAPHIX design process in Photoshop" />
            <span>In the studio · Photoshop</span>
          </button>
          <button type="button" className="process-card reveal" onClick={() => setSelected({ src: "/artworks/certificate.jpg", title: "Photoshop certification", category: "Branding", shape: "landscape" })}>
            <Image src="/artworks/certificate.jpg" fill sizes="(max-width: 760px) 100vw, 32vw" alt="Certificate of completion for Photoshop course" />
            <span>Certified · Adobe Photoshop</span>
          </button>
          <button type="button" className="process-card reveal" onClick={() => setSelected({ src: "/artworks/bts-sign.jpg", title: "Real-world production", category: "Branding", shape: "portrait" })}>
            <Image src="/artworks/bts-sign.jpg" fill sizes="(max-width: 760px) 100vw, 32vw" alt="Installed sign designed by MARRO GRAPHIX" />
            <span>From screen to street</span>
          </button>
        </div>
      </section>

      <section id="resume" className="section resume-section">
        <div className="resume-heading reveal">
          <div>
            <p className="eyebrow">CV + Portfolio · Ye Naing Thant</p>
            <h2>Creative profile meets<br /><em>visual proof.</em></h2>
          </div>
          <div className="resume-intro">
            <p>
              A six-page graphic design CV and portfolio covering freelance experience,
              one year at Clean Pro, professional work for three brands, and clearly labeled
              student practice projects.
            </p>
            <div className="resume-actions">
              <a className="button button-dark" href="/resume/ye-naing-thant-cv.pdf" target="_blank" rel="noreferrer">
                View full PDF <span>↗</span>
              </a>
              <a className="resume-download" href="/resume/ye-naing-thant-cv.pdf" download>
                Download CV <span>↓</span>
              </a>
            </div>
          </div>
        </div>
        <div className="resume-frame reveal">
          <iframe
            src="/resume/ye-naing-thant-cv.pdf#view=FitH&toolbar=0&navpanes=0"
            title="Ye Naing Thant resume PDF"
          />
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-top reveal">
          <p className="eyebrow">Have a project in mind?</p>
          <h2>LET&apos;S MAKE<br /><span>IT VISIBLE.</span></h2>
        </div>
        <div className="contact-bottom reveal">
          <p>Tell me about the idea, the audience, and what success looks like. I&apos;ll bring the visual direction.</p>
          <div className="contact-actions">
            <a className="button button-dark" href="https://t.me/SuperMarro" target="_blank" rel="noreferrer">Telegram · @SuperMarro <span>↗</span></a>
            <a className="contact-email" href="mailto:supermarro89@gmail.com">supermarro89@gmail.com <span>↗</span></a>
          </div>
        </div>
        <footer>
          <a href="#home" className="footer-brand">MARRO GRAPHIX</a>
          <span>Graphic Designer · Myanmar</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </section>

      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${selected.title} preview`} onClick={() => setSelected(null)}>
          <button type="button" className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close project preview">Close ×</button>
          <div className={`lightbox-frame ${selected.shape}`} onClick={(event) => event.stopPropagation()}>
            <Image src={selected.src} fill sizes="94vw" alt={selected.title} priority />
          </div>
          <div className="lightbox-caption">
            <strong>{selected.title}</strong>
            <span>{selected.category}</span>
          </div>
        </div>
      )}
    </main>
  );
}
