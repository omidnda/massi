"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { business, services } from "@/lib/business";

const chapters = [
  ["salon", "Der Salon"],
  ["services", "Leistungen"],
  ["beauty", "Die Details"],
  ["contact", "Kontakt"],
];
const photos = ["hair", "care", "beauty", "beauty"];
const alts = [
  "Lockiges Haar – redaktionelles Beispielbild",
  "Werkzeuge für Haarpflege und Styling",
  "Make-up-Palette und Pinsel",
  "Beauty-Produkte als redaktionelle Inspiration",
];
const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Experience() {
  const [menu, setMenu] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const infoButton = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.remove("await-reveal"));
      if (mq.matches) return;
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("await-reveal");
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.08 },
      );
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("await-reveal");
        observer?.observe(el);
      });
    };
    setup();
    mq.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      mq.removeEventListener("change", setup);
    };
  }, []);

  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
      if (event.key !== "Tab") return;
      const controls = [
        menuButton.current,
        ...Array.from(
          nav.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
        ),
      ].filter(Boolean) as HTMLElement[];
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth >= 768) setMenu(false);
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
    };
  }, [menu]);

  const closeMenu = (id: string) => {
    setMenu(false);
    requestAnimationFrame(() =>
      document.getElementById(id)?.focus({ preventScroll: true }),
    );
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>
      <div className="demo-banner">
        UNABHÄNGIGES DESIGNKONZEPT <span>· Keine offizielle Website</span>
      </div>
      <header className="site-header">
        <a className="wordmark" href="#intro">
          MASSI<span>HAIR & BEAUTY · HAMBURG</span>
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {chapters.slice(0, 3).map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="header-contact">
          Ihr nächster Moment <Arrow />
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="mobile-nav"
          aria-label={menu ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Schließen −" : "Menü +"}
        </button>
      </header>
      {menu && (
        <nav
          ref={nav}
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile Navigation"
        >
          {chapters.map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={() => closeMenu(id)}>
              <small>0{i + 1}</small>
              {label}
              <Arrow />
            </a>
          ))}
          <p>HAIR. BEAUTY. INDIVIDUALITY.</p>
        </nav>
      )}
      <main id="main">
        <section id="intro" className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-star">✳</span> A NEW PERSPECTIVE ON BEAUTY
            </p>
            <h1 id="hero-title">
              The art of
              <br />
              <em>becoming.</em>
            </h1>
            <p className="hero-description">
              Ein neuer Look. Ein neues Gefühl.
              <br />
              Entdecken Sie die Welt von MASSI.
            </p>
            <a className="button button-dark" href={business.phoneHref}>
              Termin anfragen <Arrow />
            </a>
            <a className="hero-explore" href="#salon">
              Den Salon entdecken <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="hero-image">
            <Image
              src="/images/hair.jpg"
              alt={alts[0]}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 767px) 100vw, 55vw"
              className="hero-portrait"
            />
            <figcaption>EDITORIAL INSPIRATION · BEISPIELBILD</figcaption>
            <span className="image-word" aria-hidden="true">
              individual.
            </span>
          </figure>
          <div className="hero-bottom">
            <span>HAMBURG / BARMBEK</span>
            <span>HAIR. BEAUTY. INDIVIDUALITY.</span>
            <a href="#salon" aria-label="Weiter zum Salon">
              ↓
            </a>
          </div>
        </section>
        <div className="editorial-strip" aria-hidden="true">
          <span>Eine neue Perspektive.</span>
          <span>✳</span>
          <em>Ein gutes Gefühl.</em>
          <span>✳</span>
          <span>Ganz Sie selbst.</span>
        </div>
        <section
          id="salon"
          tabIndex={-1}
          className="salon-section section-pad"
          aria-labelledby="salon-title"
        >
          <div className="salon-visual reveal">
            <figure className="salon-image">
              <Image
                src="/images/salon.jpg"
                alt="Saloninterieur als Stimmungsbild – nicht der tatsächliche Salon Massi"
                fill
                sizes="(max-width: 767px) 90vw, 45vw"
              />
            </figure>
            <p className="image-note">
              01 / THE SPACE <span>STIMMUNGSBILD · NICHT SALON MASSI</span>
            </p>
            <div className="salon-seal" aria-hidden="true">
              M<small>HAIR & BEAUTY</small>
            </div>
          </div>
          <div className="salon-copy reveal">
            <p className="eyebrow">EIN MOMENT NUR FÜR SIE</p>
            <h2 id="salon-title">
              Ein Raum.
              <br />
              <em>Für Sie.</em>
            </h2>
            <p className="lead">
              Die Welt bleibt draußen.
              <br />
              Der Moment gehört Ihnen.
            </p>
            <p>
              Haare, Farbe und Beauty in Hamburg-Barmbek. Beratung auf Deutsch
              und Persisch.
            </p>
            <a className="line-link" href="#services">
              Unsere Leistungen entdecken <Arrow />
            </a>
            <p className="small-note">
              Eine visuelle Inspiration. Die gezeigten Bilder bilden nicht die
              tatsächlichen Räumlichkeiten ab.
            </p>
          </div>
        </section>
        <section
          id="services"
          tabIndex={-1}
          className="services-section section-pad"
          aria-labelledby="services-title"
        >
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">02 / THE CRAFT</p>
              <h2 id="services-title">
                So individuell
                <br />
                wie <em>Sie.</em>
              </h2>
            </div>
            <p>
              Haar & Beauty,
              <br />
              in all ihren Facetten.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <article key={service.number} className="service-card reveal">
                <div className={`service-photo service-photo-${i}`}>
                  <Image
                    src={`/images/${photos[i]}.jpg`}
                    alt={alts[i]}
                    fill
                    sizes="(max-width: 599px) 90vw, (max-width: 1023px) 44vw, 23vw"
                  />
                  <span>{service.number}</span>
                </div>
                <h3>{service.title}</h3>
                <p className="service-detail">{service.detail}</p>
                <details>
                  <summary>
                    Leistungen im Detail <span aria-hidden="true">+</span>
                  </summary>
                  <p>{service.description}</p>
                  <ul>
                    {service.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </div>
          <div className="services-bottom">
            <p className="small-note">
              Öffentlich gelistete Leistungen. Details und Verfügbarkeit bitte
              direkt beim Salon erfragen.
              <br />
              Alle Fotografien sind redaktionelle Beispielbilder.
            </p>
            <a className="line-link" href="#contact">
              Persönlich anfragen <Arrow />
            </a>
          </div>
        </section>
        <section
          id="beauty"
          tabIndex={-1}
          className="beauty-section"
          aria-labelledby="beauty-title"
        >
          <figure className="beauty-photo">
            <Image
              src="/images/hair.jpg"
              alt="Haartextur als redaktionelle Inspiration"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </figure>
          <div className="beauty-copy reveal">
            <p className="eyebrow">03 / THE DETAILS</p>
            <span className="beauty-star" aria-hidden="true">
              ✳
            </span>
            <h2 id="beauty-title">
              Beauty is
              <br />
              in the <em>details.</em>
            </h2>
            <p>
              Eine Linie. Eine Textur. Ein Lichtreflex.
              <br />
              Manchmal liegt das Besondere
              <br />
              im kleinsten Detail.
            </p>
            <span className="beauty-caption">
              FORM. TEXTURE. INDIVIDUALITY.
            </span>
          </div>
        </section>
        <section
          id="contact"
          tabIndex={-1}
          className="contact-section section-pad"
          aria-labelledby="contact-title"
        >
          <div className="contact-heading reveal">
            <p className="eyebrow">04 / LET’S CONNECT</p>
            <h2 id="contact-title">
              Ihr nächster
              <br />
              <em>Moment.</em>
            </h2>
            <p>
              Für Fragen und Terminwünsche
              <br />
              erreichen Sie Salon Massi direkt.
            </p>
            <a className="button button-light" href={business.phoneHref}>
              Jetzt anrufen <Arrow />
            </a>
          </div>
          <div className="contact-info reveal">
            <a className="phone-link" href={business.phoneHref}>
              {business.phone} <Arrow />
            </a>
            <div className="contact-details">
              <div>
                <p className="eyebrow">BESUCHEN SIE UNS</p>
                <address>
                  {business.name}
                  <br />
                  {business.address}
                  <br />
                  {business.city}
                </address>
                <a
                  className="line-link"
                  href={business.maps}
                  target="_blank"
                  rel="noreferrer"
                >
                  Route öffnen <Arrow />
                </a>
              </div>
              <div>
                <p className="eyebrow">SAGEN SIE HALLO</p>
                <a href={`mailto:${business.email}`}>{business.email}</a>
                <a href={business.mobileHref}>{business.mobile}</a>
                <a
                  className="line-link"
                  href={business.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram <Arrow />
                </a>
              </div>
            </div>
            <p className="small-note">
              Keine Onlinebuchung in dieser Demo. Ein Anruf oder eine E-Mail
              stellt noch keine Terminbestätigung dar.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a href="#intro" className="footer-logo">
            MASSI
          </a>
          <p>
            HAIR & BEAUTY
            <br />
            HAMBURG / BARMBEK
          </p>
          <a href="#intro" className="back-top">
            Zurück nach oben ↑
          </a>
        </div>
        <div className="footer-bottom">
          <p>Unabhängiger Entwurf · Nicht die offizielle Website</p>
          <button ref={infoButton} onClick={() => dialog.current?.showModal()}>
            Konzept & Quellen <Arrow />
          </button>
        </div>
      </footer>
      <a className="mobile-call" href={business.phoneHref}>
        Termin telefonisch anfragen <Arrow />
      </a>
      <dialog
        ref={dialog}
        className="info-dialog"
        onClose={() => infoButton.current?.focus()}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        aria-labelledby="info-title"
      >
        <div className="dialog-content">
          <button
            className="dialog-close"
            aria-label="Dialog schließen"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
          <p className="eyebrow">ABOUT THIS CONCEPT</p>
          <h2 id="info-title">
            Ein möglicher
            <br />
            <em>neuer Blick.</em>
          </h2>
          <p>
            Ein unabhängiges, unaufgefordertes Designkonzept für Salon Massi.
            Keine offizielle Website und kein vom Unternehmen beauftragter
            Entwurf.
          </p>
          <p>
            Die Fotografien sind lizenzierte Unsplash-Beispielbilder. Sie zeigen
            weder den tatsächlichen Salon noch dessen Team, Kundschaft oder
            Arbeitsergebnisse.
          </p>
          <p>
            Kontaktdaten und Leistungen wurden am 23.10.2026 mit öffentlichen
            Einträgen abgeglichen. Öffnungszeiten werden wegen abweichender
            Angaben nicht gezeigt. Es werden keine Preise oder Kundenbewertungen
            dargestellt.
          </p>
          <div className="source-links">
            {business.sources.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer">
                {label} <Arrow />
              </a>
            ))}
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noreferrer"
            >
              Bildlizenz <Arrow />
            </a>
          </div>
          <p className="small-note">
            Bilder und Schriften werden lokal bereitgestellt. Keine Tracker oder
            Buchungsdienste.
          </p>
        </div>
      </dialog>
    </>
  );
}
