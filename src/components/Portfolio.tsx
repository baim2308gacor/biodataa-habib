"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUpRightFromSquare, faBars, faBriefcase, faCheck, faChevronRight, faDumbbell, faGamepad, faGraduationCap, faHouse, faMessage, faMoon, faPaperPlane, faSun, faXmark } from "@fortawesome/free-solid-svg-icons";

type Page = "Home" | "Biodata" | "Hobby" | "Kontak";
type ChatMessage = { role: "user" | "assistant"; content: string };

const navItems: { label: Page; icon: typeof faHouse }[] = [
  { label: "Home", icon: faHouse }, { label: "Biodata", icon: faGraduationCap },
  { label: "Hobby", icon: faGamepad }, { label: "Kontak", icon: faMessage }
];

export default function Portfolio() {
  const [page, setPage] = useState<Page>("Home");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hai! Mau tahu lebih banyak tentang Habib? Tanya aja soal biodata, sekolah, hobi, atau cita-citanya." }
  ]);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("habib-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  useEffect(() => { localStorage.setItem("habib-theme", theme); }, [theme]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const navigate = (next: Page) => { setPage(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || data.error || "Maaf, coba tanya lagi ya." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Koneksi lagi bermasalah. Coba beberapa saat lagi ya." }]);
    } finally { setLoading(false); }
  };
  const copyWhatsApp = async () => {
    try { await navigator.clipboard.writeText("083869313223"); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <main className={`site ${theme}`}>
      <div className="canvas-glow glow-one" /><div className="canvas-glow glow-two" /><div className="canvas-glow glow-three" />
      <div className="grain" />
      <header className="topbar">
        <button className="wordmark" onClick={() => navigate("Home")} aria-label="Kembali ke Home">habib<span>.</span></button>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navItems.map(item => <button key={item.label} className={`nav-link ${page === item.label ? "active" : ""}`} onClick={() => navigate(item.label)}><FontAwesomeIcon icon={item.icon} /><span>{item.label}</span></button>)}
        </nav>
        <div className="top-actions">
          <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Ganti tema">
            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} /><span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka menu"><FontAwesomeIcon icon={menuOpen ? faXmark : faBars} /></button>
        </div>
      </header>

      <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav glass" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{navItems.map(item => <button key={item.label} className={page === item.label ? "active" : ""} onClick={() => navigate(item.label)}><FontAwesomeIcon icon={item.icon} />{item.label}<FontAwesomeIcon className="chevron" icon={faChevronRight} /></button>)}</motion.nav>}</AnimatePresence>

      <section className="page-shell">
        <AnimatePresence mode="wait">
          <motion.div key={page} className="page-content" initial={{ opacity: 0, y: 12, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }} transition={{ duration: .35, ease: "easeOut" }}>
            {page === "Home" && <HomePage navigate={navigate} />}
            {page === "Biodata" && <BiodataPage />}
            {page === "Hobby" && <HobbyPage />}
            {page === "Kontak" && <ContactPage copyWhatsApp={copyWhatsApp} copied={copied} />}
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="footer"><span>© {new Date().getFullYear()} Habib Hasibuan</span><span>Dibuat dengan sederhana, dari hal-hal yang gue suka.</span><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Kembali ke atas <FontAwesomeIcon icon={faArrowRight} /></button></footer>

      <button className="assistant-fab" onClick={() => setChatOpen(true)} aria-label="Tanya asisten"><FontAwesomeIcon icon={faMessage} /><span>Tanya tentang Habib</span></button>
      <AnimatePresence>{chatOpen && <motion.aside className="chat-panel glass" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
        <div className="chat-head"><div><span className="status-dot" /><div><strong>Kenalan dengan Habib</strong><small>Asisten informasi · AI</small></div></div><button onClick={() => setChatOpen(false)} aria-label="Tutup chat"><FontAwesomeIcon icon={faXmark} /></button></div>
        <div className="chat-messages">{messages.map((m, i) => <div key={i} className={`chat-bubble ${m.role}`}>{m.content}</div>)}{loading && <div className="chat-bubble assistant typing">Lagi mikir<span>...</span></div>}<div ref={chatEndRef} /></div>
        <div className="suggestions">{["Hobi Habib apa aja?", "Sekolahnya di mana?", "Apa cita-citanya?"].map(q => <button key={q} onClick={() => setInput(q)}>{q}</button>)}</div>
        <form className="chat-form" onSubmit={sendMessage}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Tanya sesuatu..." maxLength={1000} /><button disabled={loading || !input.trim()} aria-label="Kirim pertanyaan"><FontAwesomeIcon icon={faPaperPlane} /></button></form>
        <p className="chat-note">Jawaban berdasarkan info yang tersedia. Hal yang belum diketahui akan dijelaskan apa adanya.</p>
      </motion.aside>}</AnimatePresence>
    </main>
  );
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number}</span><span className="label-line" /><span>{children}</span></div>;
}

function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return <div className="home-layout">
    <div className="hero-copy">
      <SectionLabel number="01 / 04">SEDIKIT TENTANG GUE</SectionLabel>
      <p className="eyebrow"><span className="live-dot" /> PERSONAL PORTFOLIO</p>
      <h1>Halo, gue<br /><span className="name-gradient">Habib Hasibuan.</span></h1>
      <p className="hero-description">Gue suka olahraga, game, dan punya cita-cita untuk jadi pengusaha. Ini tempat buat kenal gue sedikit lebih dekat.</p>
      <div className="hero-buttons"><button className="button-primary" onClick={() => navigate("Biodata")}>Kenalan lebih dekat <FontAwesomeIcon icon={faArrowRight} /></button><button className="button-quiet" onClick={() => navigate("Hobby")}>Lihat hobi <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></button></div>
      <div className="hero-meta"><span>MEDAN, INDONESIA</span><span className="meta-line" /><span>PERSONAL SPACE · 2026</span></div>
    </div>
    <div className="hero-visual">
      <div className="orbit orbit-a" /><div className="orbit orbit-b" />
      <div className="portrait-card glass"><div className="portrait-top"><span>HH / PROFILE</span><span>01—04</span></div><div className="portrait-frame"><Image src="/images/habib1.jpg" alt="Foto Habib Hasibuan" fill priority sizes="(max-width: 800px) 80vw, 36vw" className="portrait-image" /></div><div className="portrait-caption"><div><strong>Habib Hasibuan</strong><span>Pelajar · Calon pengusaha</span></div><span className="portrait-index">HH.</span></div></div>
      <div className="floating-note glass"><span className="note-icon"><FontAwesomeIcon icon={faBriefcase} /></span><div><small>BIG DREAM</small><strong>Jadi pengusaha.</strong></div><span className="blue-spark">✳</span></div>
      <div className="vertical-note">PERSONAL PORTFOLIO — EST. 2010</div>
    </div>
    <button className="scroll-cue" onClick={() => navigate("Biodata")}><span className="scroll-icon"><FontAwesomeIcon icon={faArrowDown} /></span>SCROLL TO KNOW ME</button>
    <div className="home-bottom"><span>01</span><div /><span>HALAMAN UTAMA</span><span className="home-bottom-right">SIMPLE THINGS, REAL STORIES.</span></div>
  </div>;
}

function BiodataPage() {
  const facts = [
    ["Nama lengkap", "Habib Hasibuan"], ["Tempat lahir", "Medan"], ["Tanggal lahir", "20 Oktober 2010"],
    ["Cita-cita", "Menjadi pengusaha"], ["Hobi", "Olahraga dan game"]
  ];
  return <div className="inner-page">
    <SectionLabel number="02 / 04">BIODATA</SectionLabel>
    <div className="page-heading"><div><p className="eyebrow">INI CERITA SINGKAT GUE</p><h1>Kenalan<br /><span className="name-gradient">lebih dekat.</span></h1></div><p className="heading-side">Nggak banyak yang perlu dibikin rumit. Ini beberapa hal dasar tentang gue.</p></div>
    <div className="bio-grid">
      <div className="bio-photo glass"><Image src="/images/habib2.jpg" alt="Potret Habib Hasibuan" fill sizes="(max-width: 800px) 90vw, 34vw" className="cover-image" /><span className="photo-tag">HABIB HASIBUAN / 001</span></div>
      <div className="bio-details glass"><div className="card-kicker">01 — PERSONAL INFO</div>{facts.map(([label, value], i) => <div className="fact-row" key={label}><span className="fact-index">0{i + 1}</span><span className="fact-label">{label}</span><strong>{value}</strong></div>)}<p className="bio-note">Gue masih terus belajar dan nyari pengalaman baru. Ke depannya, gue pengin bisa membangun usaha sendiri.</p></div>
    </div>
    <div className="school-section"><div className="subheading"><span>02 / RIWAYAT SEKOLAH</span><h2>Perjalanan pendidikan.</h2></div><div className="school-list">
      {[["01","SD","DAHLIA"],["02","SMP","AL WASHLIYAH"],["03","SMK","S TELADAN P SIANTAR"]].map(([n,level,name]) => <div className="school-row" key={n}><span className="school-no">{n}</span><span className="school-level">{level}</span><strong>{name}</strong><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></div>)}
    </div></div>
  </div>;
}

function HobbyPage() {
  const hobbies = [
    { n:"01", title:"Olahraga", tag:"AKTIF & BERGERAK", image:"/images/olahraga.jpg", icon:faDumbbell, description:"Gue suka olahraga karena bisa bikin badan tetap aktif dan jadi cara buat ngisi waktu dengan kegiatan yang positif. Selain itu, olahraga juga ngingetin gue kalau hasil yang bagus butuh usaha dan konsistensi." },
    { n:"02", title:"Game", tag:"MAIN & STRATEGI", image:"/images/game.jpg", icon:faGamepad, description:"Kalau lagi pengin santai, gue suka main game. Buat gue, game bukan cuma soal menang atau kalah, tapi juga jadi hiburan dan tantangan kecil buat mikir strategi." }
  ];
  return <div className="inner-page">
    <SectionLabel number="03 / 04">HAL YANG GUE SUKA</SectionLabel>
    <div className="page-heading"><div><p className="eyebrow">DI LUAR KESEHARIAN</p><h1>Waktu luang,<br /><span className="name-gradient">cara gue recharge.</span></h1></div><p className="heading-side">Dua hal yang sering gue pilih buat bikin hari terasa lebih seru.</p></div>
    <div className="hobby-grid">{hobbies.map(h => <article className="hobby-card glass" key={h.n}><div className="hobby-image"><Image src={h.image} alt={h.title} fill sizes="(max-width: 800px) 90vw, 40vw" className="cover-image" /><span className="hobby-number">{h.n}</span><span className="hobby-icon"><FontAwesomeIcon icon={h.icon} /></span></div><div className="hobby-body"><div className="card-kicker">{h.tag}</div><h2>{h.title}</h2><p>{h.description}</p><div className="hobby-footer"><span>ALASAN GUE SUKA</span><span className="hobby-line" /><FontAwesomeIcon icon={faArrowRight} /></div></div></article>)}</div>
    <div className="hobby-outro glass"><span className="outro-star">✳</span><p>Intinya, gue suka punya waktu buat bergerak, main, dan tetap nyoba hal-hal baru. Nggak harus selalu produktif setiap saat — yang penting seimbang.</p></div>
  </div>;
}

function ContactPage({ copyWhatsApp, copied }: { copyWhatsApp: () => void; copied: boolean }) {
  return <div className="inner-page">
    <SectionLabel number="04 / 04">KONTAK & SOSIAL</SectionLabel>
    <div className="page-heading"><div><p className="eyebrow">PINTU BUAT TERHUBUNG</p><h1>Yuk, ngobrol<br /><span className="name-gradient">lebih lanjut.</span></h1></div><p className="heading-side">Kalau mau nyapa atau terhubung, bisa lewat akun di bawah ini.</p></div>
    <div className="contact-layout"><div className="contact-intro glass"><span className="contact-orb">HH<span>.</span></span><p>Gue terbuka buat kenalan dan ngobrol hal-hal baru. Pilih aja cara yang paling nyaman buat lo.</p><div className="contact-small">SOCIAL LINKS / 2026</div></div>
      <div className="social-list">
        <a className="social-card glass" href="https://www.instagram.com/habibb_tk/" target="_blank" rel="noreferrer"><span className="social-icon instagram"><FontAwesomeIcon icon={faInstagram} /></span><span className="social-text"><small>INSTAGRAM</small><strong>@habibb_tk</strong><span>Follow buat lihat update gue.</span></span><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="social-arrow" /></a>
        <a className="social-card glass" href="https://wa.me/6283869313223" target="_blank" rel="noreferrer"><span className="social-icon whatsapp"><FontAwesomeIcon icon={faWhatsapp} /></span><span className="social-text"><small>WHATSAPP</small><strong>Chat langsung</strong><span>Kalau ada yang mau ditanyain.</span></span><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="social-arrow" /></a>
        <button className="copy-number glass" onClick={copyWhatsApp}><span>NO. WHATSAPP</span><strong>0838 6931 3223</strong><span className="copy-action"><FontAwesomeIcon icon={copied ? faCheck : faArrowRight} /> {copied ? "Nomor disalin" : "Salin nomor"}</span></button>
      </div>
    </div>
    <p className="privacy-note">Catatan: nomor WhatsApp akan terlihat oleh pengunjung website publik. Pastikan memang nyaman untuk membagikannya.</p>
  </div>;
}