"use client";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { business, services } from "@/lib/business";
const SalonScene = dynamic(() => import("./SalonScene"), { ssr: false });
const chapters = [
  { id: "intro", label: "Intro" },
  { id: "salon", label: "Der Raum" },
  { id: "services", label: "Leistungen" },
  { id: "beauty", label: "Die Details" },
  { id: "contact", label: "Kontakt" },
];
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "↗"}</span>;
}
export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [quality, setQuality] = useState("high");
  const [activeService, setActiveService] = useState(0);
  const [info, setInfo] = useState(false);
  const reduced = systemReduced || paused;
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setSupported(false);
    setReady(false);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setSystemReduced(mq.matches || params.get("motion") === "reduced");
    update();
    mq.addEventListener("change", update);
    setQuality(window.innerWidth < 700 ? "eco" : "high");
    try {
      const c = document.createElement("canvas");
      const context = c.getContext("webgl2");
      setSupported(Boolean(context) && params.get("view") !== "static");
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setSupported(false);
    }
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.current = self.progress;
          document.documentElement.style.setProperty(
            "--journey",
            String(self.progress),
          );
          setChapter(
            chapters.reduce((active, c, i) => {
              const top = document
                .getElementById(c.id)
                ?.getBoundingClientRect().top;
              return top !== undefined && top < window.innerHeight * 0.55
                ? i
                : active;
            }, 0),
          );
        },
      });
      if (!reduced)
        gsap.utils
          .toArray<HTMLElement>(".reveal")
          .forEach((el) =>
            gsap.fromTo(
              el,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              },
            ),
          );
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  useEffect(() => {
    document.body.style.overflow = menu || info ? "hidden" : "";
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setInfo(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [menu, info]);
  useEffect(() => {
    if (!menu && !info) return;
    const container = document.querySelector<HTMLElement>(
      info ? ".info-dialog" : "#mobile-nav",
    );
    if (!container) return;
    const previous = document.activeElement as HTMLElement | null;
    const controls = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled])",
        ),
      );
    controls()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = controls();
      const first = list[0],
        last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", trap);
    return () => {
      window.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [menu, info]);
  const navigate = (id: string) => {
    setMenu(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };
  return (
    <>
      <a className="skip-link" href="#services">
        Zum Inhalt
      </a>
      <div
        className={`scene-shell ${supported === false ? "no-webgl" : ""}`}
        aria-hidden="true"
      >
        {supported && (
          <SceneBoundary onError={onFailure}>
            <SalonScene
              progress={progress}
              reduced={reduced}
              quality={quality}
              onReady={onReady}
              onFailure={onFailure}
            />
          </SceneBoundary>
        )}
        <div className="fallback-architecture">
          <div className="fallback-arch" />
          <div className="fallback-arch second" />
          <div className="fallback-floor" />
        </div>
      </div>
      <div className="cinema-shade" />
      <div className="grain" aria-hidden="true" />
      <header className={`site-header ${chapter > 0 ? "scrolled" : ""}`}>
        <a
          href="#intro"
          className="wordmark"
          onClick={(e) => {
            e.preventDefault();
            navigate("intro");
          }}
          aria-label="MASSI – Start"
        >
          MASSI<span>HAIR & BEAUTY · HAMBURG</span>
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          <button onClick={() => navigate("salon")}>Der Salon</button>
          <button onClick={() => navigate("services")}>Leistungen</button>
        </nav>
        <button className="contact-link" onClick={() => navigate("contact")}>
          Kontakt aufnehmen <Arrow />
        </button>
        <button
          className="menu-toggle"
          aria-label={menu ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={menu}
          aria-controls="mobile-nav"
          onClick={() => setMenu(!menu)}
        >
          <span />
          <span />
        </button>
      </header>
      {menu && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile Navigation"
        >
          {chapters.map((c, i) => (
            <button key={c.id} onClick={() => navigate(c.id)}>
              <small>0{i + 1}</small>
              {c.label}
              <Arrow />
            </button>
          ))}
          <p>Ein unabhängiges Designkonzept.</p>
        </nav>
      )}
      <div className="concept-tag">
        <span /> INDEPENDENT DESIGN CONCEPT
      </div>
      <aside className="chapter-rail" aria-label="Kapitel">
        {chapters.map((c, i) => (
          <button
            key={c.id}
            onClick={() => navigate(c.id)}
            aria-label={c.label}
            aria-current={chapter === i ? "step" : undefined}
          >
            <span className="rail-label">{c.label}</span>
            <span className="rail-dot" />
          </button>
        ))}
      </aside>
      <main ref={root} id="journey">
        <section
          id="intro"
          className="chapter hero"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="short-rule" /> A NEW PERSPECTIVE ON BEAUTY
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
            <button className="text-cta" onClick={() => navigate("salon")}>
              Den Salon entdecken <span className="circle-arrow">↓</span>
            </button>
          </div>
          <div className="hero-caption">
            <span className="caption-mark">M</span>
            <div>
              HAIR. BEAUTY. INDIVIDUALITY.
              <br />
              <small>Hamburg · Dehnhaide 44</small>
            </div>
          </div>
          <div className="hero-bottom">
            <span>
              SCROLL TO EXPLORE <span className="scroll-line" />
            </span>
            <span className="architect-note">
              VIRTUELLER RAUM · FREIER ENTWURF
            </span>
          </div>
        </section>
        <section
          id="salon"
          className="chapter salon-section"
          aria-labelledby="salon-title"
        >
          <div className="editorial-copy reveal">
            <p className="eyebrow">01 / THE SPACE</p>
            <h2 id="salon-title">
              Ein Raum.
              <br />
              <em>Für Sie.</em>
            </h2>
            <p>
              Die Welt bleibt draußen.
              <br />
              Der Moment gehört Ihnen.
            </p>
            <p className="body-copy">
              Haare, Farbe und Beauty in Hamburg-Barmbek. Beratung auf Deutsch
              und Persisch.
            </p>
            <div className="fine-line" />
            <p className="small-note">
              Das gezeigte 3D-Interieur ist eine freie Designstudie und bildet
              nicht den tatsächlichen Salon ab.
            </p>
          </div>
          <div className="room-coordinate">
            53° N <span>HAMBURG / BARMBEK</span>
          </div>
        </section>
        <section
          id="services"
          className="chapter services-section"
          aria-labelledby="services-title"
        >
          <div className="services-panel reveal">
            <p className="eyebrow">02 / THE CRAFT</p>
            <h2 id="services-title">
              So individuell
              <br />
              wie <em>Sie.</em>
            </h2>
            <p className="section-intro">
              Haar & Beauty, in all ihren Facetten.
            </p>
            <div className="service-list">
              {services.map((service, i) => (
                <div
                  className={`service ${activeService === i ? "active" : ""}`}
                  key={service.number}
                >
                  <button
                    aria-expanded={activeService === i}
                    aria-controls={`service-${i}`}
                    id={`service-button-${i}`}
                    onClick={() => setActiveService(i)}
                  >
                    <span className="service-number">{service.number}</span>
                    <span>{service.title}</span>
                    <span className="service-plus" aria-hidden="true">
                      {activeService === i ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    id={`service-${i}`}
                    role="region"
                    aria-labelledby={`service-button-${i}`}
                    hidden={activeService !== i}
                  >
                    <p>{service.detail}</p>
                    <ul>
                      {service.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <p className="small-note">
              Öffentlich gelistete Leistungen. Details und Verfügbarkeit bitte
              direkt beim Salon erfragen.
            </p>
            <button
              className="text-cta compact"
              onClick={() => navigate("contact")}
            >
              Persönlich anfragen <Arrow />
            </button>
          </div>
        </section>
        <section
          id="beauty"
          className="chapter beauty-section"
          aria-labelledby="beauty-title"
        >
          <div className="editorial-copy reveal">
            <p className="eyebrow">03 / THE DETAILS</p>
            <h2 id="beauty-title">
              Beauty is
              <br />
              in the <em>details.</em>
            </h2>
            <p className="body-copy">
              Eine Linie. Eine Textur. Ein Lichtreflex.
              <br />
              Manchmal liegt das Besondere
              <br />
              im kleinsten Detail.
            </p>
            <span className="art-note">
              FORM STUDY No. 01
              <br />
              <small>Originale digitale Skulptur · 2026</small>
            </span>
          </div>
        </section>
        <section
          id="contact"
          className="chapter contact-section"
          aria-labelledby="contact-title"
        >
          <div className="contact-panel reveal">
            <p className="eyebrow">04 / LET’S CONNECT</p>
            <h2 id="contact-title">
              Ihr nächster
              <br />
              <em>Moment.</em>
            </h2>
            <p className="section-intro">
              Für Fragen und Terminwünsche
              <br />
              erreichen Sie Salon Massi direkt.
            </p>
            <a className="phone-link" href={business.phoneHref}>
              {business.phone}
              <Arrow />
            </a>
            <div className="contact-details">
              <div>
                <span className="eyebrow">FIND US</span>
                <address>
                  {business.address}
                  <br />
                  {business.city}
                </address>
                <a href={business.maps} target="_blank" rel="noreferrer">
                  Route öffnen <Arrow />
                </a>
              </div>
              <div>
                <span className="eyebrow">SAY HELLO</span>
                <a href={`mailto:${business.email}`}>{business.email}</a>
                <a href={business.mobileHref}>{business.mobile}</a>
                <a href={business.instagram} target="_blank" rel="noreferrer">
                  Instagram <Arrow />
                </a>
              </div>
            </div>
            <p className="contact-note">
              Keine Onlinebuchung in dieser Demo. Ein Anruf oder eine E-Mail
              stellt noch keine Terminbestätigung dar.
            </p>
          </div>
          <footer>
            <a
              href="#intro"
              className="footer-logo"
              onClick={(e) => {
                e.preventDefault();
                navigate("intro");
              }}
            >
              MASSI
            </a>
            <span>Unabhängiger Entwurf · Nicht die offizielle Website</span>
            <button onClick={() => setInfo(true)}>
              Konzept & Quellen <Arrow />
            </button>
          </footer>
        </section>
      </main>
      <div className="journey-controls">
        <span className="chapter-counter">
          0{chapter + 1}
          <span>/ 05</span>
        </span>
        <div className="progress-track">
          <div />
        </div>
        <button
          onClick={() => setPaused(!paused)}
          disabled={systemReduced}
          aria-pressed={reduced}
          aria-label={
            reduced ? "Kamerabewegung fortsetzen" : "Kamerabewegung pausieren"
          }
        >
          {reduced ? "Ⅱ REDUCED MOTION" : "Ⅱ PAUSE MOTION"}
        </button>
        <button
          className="quality-toggle"
          aria-label="3D Qualität umschalten"
          onClick={() => setQuality(quality === "high" ? "eco" : "high")}
        >
          {quality === "high" ? "3D / HIGH" : "3D / ECO"}
        </button>
      </div>
      <div id="scene-status" className="scene-status" role="status">
        {supported === false
          ? "EDITORIAL VIEW · 3D NICHT VERFÜGBAR"
          : !ready
            ? "DIE WELT VON MASSI WIRD GELADEN"
            : "LIVE 3D · SCROLL TO EXPLORE"}
      </div>
      {info && (
        <div className="info-backdrop" onClick={() => setInfo(false)}>
          <section
            className="info-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dialog-close"
              onClick={() => setInfo(false)}
              autoFocus
              aria-label="Dialog schließen"
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
              Interieur, Materialien, Skulptur und Typografie sind eine neue
              visuelle Richtung. Sie sind keine Darstellung der tatsächlichen
              Räumlichkeiten oder bestätigter Markenrichtlinien.
            </p>
            <p>
              Kontaktdaten und Leistungen wurden am 23.10.2026 mit öffentlichen
              Einträgen abgeglichen. Öffnungszeiten werden wegen abweichender
              Angaben nicht gezeigt. Treatwell nimmt laut aktuellem Profil keine
              Buchungen entgegen.
            </p>
            <div className="source-links">
              {business.sources.map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noreferrer">
                  {label} <Arrow />
                </a>
              ))}
            </div>
            <p className="small-note">
              Alle 3D-Objekte sind prozedural erstellt. Keine externen Bilder,
              Tracker oder Buchungsdienste werden geladen.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
