import React, { useState, useEffect, useRef } from 'react';
import { 
 Mail, 
  ExternalLink, 
  ChevronRight, 
  Maximize2,
  X,
  Code2,
  Database,
  Terminal,
  Smartphone,
  MapPin,    
  Phone,    
  Send,
  FileText
} from 'lucide-react';

// ==========================================
// 0. GLOBAL CSS INJECTION (SMOOTH SCROLL & ANIMATIONS)
// ==========================================
const GlobalStyles = () => (
  <style>{`
    html { scroll-behavior: smooth; }
    
    @keyframes fadeInZoom {
      0% { opacity: 0; transform: scale(0.95) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .tab-animate { animation: fadeInZoom 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .preserve-3d { transform-style: preserve-3d; }

    @keyframes float1 {
      0%, 100% { transform: rotateY(-12deg) rotateX(8deg) translateZ(30px) translateY(0px); }
      50% { transform: rotateY(-12deg) rotateX(8deg) translateZ(30px) translateY(-10px); }
    }
    @keyframes float2 {
      0%, 100% { transform: rotateY(-12deg) rotateX(8deg) translateZ(50px) translateY(0px); }
      50% { transform: rotateY(-12deg) rotateX(8deg) translateZ(50px) translateY(-15px); }
    }
    @keyframes float3 {
      0%, 100% { transform: rotateY(-12deg) rotateX(8deg) translateZ(20px) translateY(0px); }
      50% { transform: rotateY(-12deg) rotateX(8deg) translateZ(20px) translateY(-8px); }
    }

    .float-badge-1 { animation: float1 4s ease-in-out infinite; }
    .float-badge-2 { animation: float2 5s ease-in-out infinite; }
    .float-badge-3 { animation: float3 4.5s ease-in-out infinite; }
  `}</style>
);

// ==========================================
// 1. BACKGROUND CANVAS INTERAKTIF
// ==========================================
const NetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(161, 161, 170, 0.4)'; 

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(161, 161, 170, ${0.12 - distance / 1000})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.x != null && mouse.y != null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - distance / 1000})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    init();
    draw();

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-30" />;
};

// ==========================================
// 2. TILT CARD 3D 
// ==========================================
const TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
  const [glare, setGlare] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;

    setStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    });
    
    setGlare({
      opacity: 0.15,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setStyle({ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
    setGlare({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div 
      ref={cardRef}
      className={`relative transition-all duration-300 ease-out transform-gpu preserve-3d ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="absolute inset-0 z-50 pointer-events-none transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)`,
          opacity: glare.opacity,
          mixBlendMode: 'overlay'
        }}
      />
      {children}
    </div>
  );
};

// ==========================================
// 3. MAIN APP COMPONENT
// ==========================================
export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedCert, setSelectedCert] = useState(null);

  const projectsData = [
    {
      title: "SekaShoesApp Booking & Tracking",
      role: "Full-Stack & Mobile Dev (Tugas Akhir)",
      description: "Membangun ekosistem aplikasi pemesanan dan pelacakan cuci sepatu end-to-end. Terdiri dari web admin panel untuk manajemen operasional dan aplikasi mobile Android untuk pelanggan. Sistem ini berfokus pada efisiensi transaksi melalui integrasi pembayaran QRIS dan pembuatan e-receipt otomatis.",
      tech: ["Laravel", "Kotlin", "MySQL", "PHP"],
      githubLink: "https://github.com/karelwidi/AplikasiSekahoes.git", 
      demoLink: "https://drive.google.com/file/d/1Tq4i9SfUHq1ufaDV3-0PO6hsDibGymqe/view?usp=sharing"
    },
    {
      title: "Internal Attendance & Merchant App",
      role: "Mobile Developer Intern (PT TKI)",
      description: "Mengembangkan aplikasi Android internal perusahaan untuk automasi pencatatan presensi karyawan dan manajemen data merchant. Dibangun menggunakan Kotlin dengan arsitektur MVVM, serta mengimplementasikan Retrofit untuk integrasi REST API, Hilt untuk Dependency Injection, dan pemanfaatan fitur native device (Kamera & GPS).",
      tech: ["Kotlin", "SQLite", "Retrofit", "MVVM"],
      githubLink: "https://github.com/karelwidi/absensi_kp.git", 
      demoLink: "https://www.figma.com/design/d3qBWQ2duNGK4UD2wVQc5X/Absensi-Seleksi?node-id=0-1&t=7Yjx3B3FNzvoVjEX-1"
    },
    {
      title: "Sekashoes Official Web Platform",
      role: "Full-Stack Web Developer",
      description: "Membangun website resmi Sekashoes secara end-to-end. Antarmuka publik dirancang modern dan responsif untuk memaksimalkan pengalaman pengguna (UX), yang terintegrasi penuh dengan arsitektur Backend berbasis Laravel untuk manajemen konten dinamis dan sinkronisasi katalog layanan.",
      tech: ["Next.js", "Laravel", "Tailwind CSS", "MySQL"],
      githubLink: "https://github.com/karelwidi/sekashoes-frontend.git", 
      demoLink: "https://sekashoes.my.id/"
    }
  ];

  const certificatesData = [
    {
      title: "Database Design Award of Completion",
      issuer: "Oracle Academy",
      date: "Agustus 2026",
      image: "images/oracle-desain.png", 
      verifyLink: "https://mail.google.com/mail/u/0/?tab=rm&ogbl#search/or/FMfcgzQhVrBXZLhwvZrBmWvMlsvSSkMP"
    },
    {
      title: "Database Programming with SQL Award of Completion",
      issuer: "Oracle Academy",
      date: "Agustus 2026",
      image: "images/oracle-programming.png", 
      verifyLink: "https://mail.google.com/mail/u/0/?tab=rm&ogbl#search/or/FMfcgzQhVrBXZLhwvZrBmWvMlsvSSkMP"
    },
    {
      title: "Sertifikat Belajar Laravel Award of Completion",
      issuer: "WPU Course",
      date: "Oktober 2026",
      image: "images/wpu-laravel.png", 
      verifyLink: "https://learn.wpucourse.id/certificate/RTREFOS6"
    },
    {
      title: "Belajar Dasar Pengembangan Aplikasi Android Award of Completion",
      issuer: "Dicoding Academy",
      date: "Maret 2026",
      image: "images/dicoding-mobile.png", 
      verifyLink: "https://www.dicoding.com/certificates/RVZK0K4WQZD5"
    },
    {
      title: "Belajar Dasar Pengembangan Aplikasi Android Award of Completion",
      issuer: "PT. Teknologi Kartu Indonesia",
      date: "Januari - Maret 2026",
      image: "images/Intern-tki.png", 
      verifyLink: "https://www.linkedin.com/in/elieserkarelwidiyanto/overlay/Position/2989138410/treasury/?profileId=ACoAAEPKGuoBqICN7MiDZTd_Vu4GQr7KOr4PKgM"
    }
  ];  

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white overflow-hidden relative">
      <GlobalStyles />
      <NetworkCanvas />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-mono text-zinc-100 font-bold tracking-tighter text-lg">
            Karel<span className="text-zinc-500">.Portofolio</span>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            <div className="flex gap-4 sm:gap-6 text-sm font-medium">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
              <a href="#resume" className="hover:text-white transition-colors">Resume</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>

            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

            {/* Ikon GitHub & LinkedIn (Menggunakan Native SVG) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <a 
                href="https://github.com/karelwidi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
              </a>
              <a 
                href="https://linkedin.com/in/elieserkarelwidiyanto" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a 
                href="https://instagram.com/karelwidi_" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Instagram Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section id="about" className="max-w-6xl mx-auto px-6 mb-32 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1.5 border border-white/10 rounded-full text-[11px] font-mono tracking-widest bg-white/5 text-zinc-400">
              AVAILABLE FOR WORK
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
              Hi, saya Elieser Karel. <br />
              <span className="text-zinc-500">Software Developer.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl leading-relaxed font-light">
              Lulusan <span className="text-white font-medium">D3 Teknik Informatika UKSW</span>. Berpengalaman membangun aplikasi <span className="text-white font-medium">full-stack</span> dengan fokus utama pada ekosistem <span className="text-white font-medium">PHP (Laravel)</span> dan <span className="text-white font-medium">React</span>, serta didukung oleh keahlian pengembangan <span className="text-white font-medium">mobile</span> (Kotlin, Android).
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#portfolio" className="bg-white text-zinc-950 px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10">
                Lihat Pekerjaan
              </a>
              <a href="#contact" className="px-6 py-2.5 rounded-lg font-medium border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> Kontak
              </a>
              <a 
                href="https://drive.google.com/file/d/1uJYMLOnOR6-L8RcfSe49NwGkk31sUmdZ/view?usp=drive_link" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="border border-white/10 hover:border-white/30 bg-zinc-900/50 hover:bg-zinc-800 text-white px-6 py-3.5 rounded-xl font-medium transition-all flex items-center gap-2 group"
              >
                <FileText className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                Lihat CV
              </a>
            </div>
            
          </div>
          
          {/* FLOATING 3D BADGES (HERO RIGHT) */}
          <div className="hidden md:flex flex-col gap-5 preserve-3d" style={{ perspective: '1200px' }}>
             
             {/* KOTAK 1: BAHASA */}
             <div className="float-badge-1 bg-zinc-900/60 border border-white/10 backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 shadow-2xl">
                <div className="p-3 bg-white/5 rounded-xl"><Code2 className="text-zinc-200 w-6 h-6" /></div>
                <div>
                  <div className="text-white font-medium">Programming Languages</div>
                  <div className="text-xs text-zinc-500 mt-1">PHP, JavaScript, Kotlin</div>
                </div>
             </div>
             
             {/* KOTAK 2: FRAMEWORK */}
             <div className="float-badge-2 bg-zinc-900/60 border border-white/10 backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 shadow-2xl ml-12">
                <div className="p-3 bg-white/5 rounded-xl"><Terminal className="text-zinc-200 w-6 h-6" /></div>
                <div>
                  <div className="text-white font-medium">Frameworks & Libraries</div>
                  <div className="text-xs text-zinc-500 mt-1">Laravel, React, Tailwind CSS</div>
                </div>
             </div>
             
             {/* KOTAK 3: DATABASE & TOOLS */}
             <div className="float-badge-3 bg-zinc-900/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 shadow-xl ml-4">
                <div className="p-3 bg-white/5 rounded-xl"><Database className="text-zinc-400 w-6 h-6" /></div>
                <div>
                  <div className="text-white font-medium">Database & Tools</div>
                  <div className="text-xs text-zinc-500 mt-1">MySQL, Android Studio, Git</div>
                </div>
             </div>

          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section id="portfolio" className="max-w-6xl mx-auto px-6 mb-32 border-t border-white/5 pt-20">
          <div className="flex justify-center mb-16 relative z-20">
            <div className="bg-zinc-900/60 p-1.5 rounded-xl border border-white/5 backdrop-blur-md inline-flex shadow-xl">
              {['projects', 'certificates', 'techstack'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 capitalize ${
                    activeTab === tab 
                      ? 'bg-zinc-800 text-white shadow-md border border-white/5' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  {tab === 'techstack' ? 'Tech Stack' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[400px]">
            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 tab-animate preserve-3d">
                {projectsData.map((project, idx) => (
                  <TiltCard key={idx} className="h-full">
                    <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl h-full flex flex-col backdrop-blur-sm relative group preserve-3d">
                      
                      <div style={{ transform: 'translateZ(40px)' }} className="relative z-10 transition-transform duration-300">
                        <Terminal className="w-8 h-8 text-zinc-500 mb-5 group-hover:text-zinc-300 transition-colors" />
                        <h3 className="text-xl font-semibold text-white mb-2 leading-tight">{project.title}</h3>
                        <p className="text-xs font-mono text-zinc-500 mb-5">{project.role}</p>
                      </div>
                      
                      <p style={{ transform: 'translateZ(25px)' }} className="text-sm text-zinc-400 mb-8 flex-grow leading-relaxed relative z-10 transition-transform duration-300">
                        {project.description}
                      </p>
                      
                      {/* TECH STACK */}
                      <div style={{ transform: 'translateZ(35px)' }} className="flex flex-wrap gap-2 mt-auto relative z-10 transition-transform duration-300 mb-5">
                        {project.tech.map((t, i) => (
                          <span key={i} className="px-2.5 py-1 bg-zinc-950/50 border border-white/10 rounded-md text-xs font-medium text-zinc-300">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* TOMBOL LINK (GITHB & DEMO) */}
                      <div style={{ transform: 'translateZ(45px)' }} className="flex flex-wrap gap-3 relative z-10 transition-transform duration-300 border-t border-white/10 pt-5 mt-auto">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-white/5">
                            <Code2 className="w-4 h-4" /> Source Code
                          </a>
                        )}
                        {project.demoLink && (
                          <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-white/10">
                            <ExternalLink className="w-4 h-4" /> Lihat Demo
                          </a>
                        )}
                      </div>

                    </div>
                  </TiltCard>
                ))}
              </div>
            )}

            {/* CERTIFICATES TAB */}
            {activeTab === 'certificates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 tab-animate preserve-3d">
                {certificatesData.map((cert, idx) => (
                  <TiltCard key={idx}>
                    <div 
                      onClick={() => setSelectedCert(cert)}
                      className="bg-zinc-900/50 border border-white/5 hover:border-zinc-700 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center cursor-pointer group backdrop-blur-sm transition-colors relative preserve-3d"
                    >
                      <div style={{ transform: 'translateZ(30px)' }} className="w-full sm:w-2/5 aspect-[4/3] bg-zinc-950 rounded-xl overflow-hidden relative flex-shrink-0 border border-white/5 shadow-xl transition-transform duration-300">
                        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="flex-1 w-full transition-transform duration-300" style={{ transform: 'translateZ(45px)' }}>
                        <h3 className="text-lg font-semibold text-white mb-2 leading-snug">{cert.title}</h3>
                        <p className="text-sm text-zinc-400">{cert.issuer}</p>
                        <p className="text-xs text-zinc-500 mt-2 font-mono">{cert.date}</p>
                        <div className="mt-5 inline-flex items-center text-xs font-semibold text-zinc-300 bg-white/5 group-hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-colors">
                          Lihat Dokumen <ChevronRight className="w-3 h-3 ml-1.5" />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            )}
     
            {/* TECH STACK TAB */}
            {activeTab === 'techstack' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 tab-animate">
                
                {/* Kategori 1: Web Development */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-sm">
                      <Code2 className="w-6 h-6 text-zinc-200" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Web Development</h3>
                      <p className="text-zinc-500 text-sm mt-1">Core technologies & frameworks</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { name: 'Laravel (PHP)', desc: 'Backend Architecture & API', level: 'Advanced', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" alt="Laravel" className="w-5 h-5" /> },
                      { name: 'React', desc: 'Frontend UI & SPA', level: 'Advanced', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" className="w-5 h-5 animate-[spin_10s_linear_infinite]" /> },
                      { name: 'Tailwind CSS', desc: 'Utility-first Styling', level: 'Advanced', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind" className="w-5 h-5" /> },
                      { name: 'MySQL', desc: 'Relational Database', level: 'Intermediate', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" alt="MySQL" className="w-5 h-5" /> }
                    ].map((tech, i) => (
                      <div key={i} className="group relative flex items-center justify-between p-4 bg-zinc-950/50 border border-white/5 rounded-xl hover:bg-zinc-900 hover:border-zinc-600 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)] transition-all duration-300 overflow-hidden cursor-default">
                        
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10 flex items-center gap-4 pl-2">
                          {/* Wadah Ikon Asli */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                            {tech.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-zinc-200 font-semibold group-hover:text-white transition-colors">{tech.name}</span>
                            <span className="text-zinc-500 text-xs mt-0.5">{tech.desc}</span>
                          </div>
                        </div>
                        
                        <div className="relative z-10 hidden sm:block">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium px-3 py-1.5 bg-zinc-900/80 rounded-lg border border-white/5 group-hover:border-zinc-400 group-hover:text-white transition-all shadow-sm">
                            {tech.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kategori 2: Tools & Supporting */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-sm">
                      <Terminal className="w-6 h-6 text-zinc-200" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Tools & Supporting</h3>
                      <p className="text-zinc-500 text-sm mt-1">Mobile, version control & design</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { name: 'Kotlin & Android', desc: 'Mobile App Development', level: 'Intermediate', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" alt="Kotlin" className="w-5 h-5" /> },
                      { name: 'Git & GitHub', desc: 'Version Control System', level: 'Advanced', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" className="w-5 h-5 invert opacity-90" /> },
                      { name: 'Figma', desc: 'UI/UX Prototyping', level: 'Intermediate', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma" className="w-5 h-5" /> },
                      { name: 'Postman', desc: 'API Testing & Debugging', level: 'Advanced', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" alt="Postman" className="w-5 h-5" /> }
                    ].map((tech, i) => (
                      <div key={i} className="group relative flex items-center justify-between p-4 bg-zinc-950/50 border border-white/5 rounded-xl hover:bg-zinc-900 hover:border-zinc-600 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)] transition-all duration-300 overflow-hidden cursor-default">
                        
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10 flex items-center gap-4 pl-2">
                          {/* Wadah Ikon Asli */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-lg">
                            {tech.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-zinc-200 font-semibold group-hover:text-white transition-colors">{tech.name}</span>
                            <span className="text-zinc-500 text-xs mt-0.5">{tech.desc}</span>
                          </div>
                        </div>
                        
                        <div className="relative z-10 hidden sm:block">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium px-3 py-1.5 bg-zinc-900/80 rounded-lg border border-white/5 group-hover:border-zinc-400 group-hover:text-white transition-all shadow-sm">
                            {tech.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>

        {/* RESUME SECTION (EXPERIENCE & EDUCATION) */}
        <section id="resume" className="max-w-4xl mx-auto px-6 mb-20 border-t border-white/5 pt-20">
          
          {/* EXPERIENCE */}
          <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
            <span className="w-8 h-px bg-zinc-700 block"></span>
            Pengalaman Profesional
          </h2>
          <div className="space-y-12 border-l border-zinc-800 ml-3 pl-8 relative mb-20">
            
            <div className="relative group">
              <div className="absolute w-3 h-3 bg-zinc-300 rounded-full -left-[38px] top-1.5 ring-4 ring-zinc-950 group-hover:bg-white transition-colors" />
              <h3 className="text-white font-semibold text-xl">Founder & Developer</h3>
              <p className="text-zinc-400 text-sm mb-4 font-mono mt-1">Sekashoes (Usaha Jasa Cuci Sepatu) • 2025 - Sekarang</p>
              <p className="text-zinc-500 text-base leading-relaxed max-w-2xl">
                Membangun dan mengelola operasional bisnis secara digital. Mengembangkan sistem kasir dan admin berbasis web menggunakan <span className="text-zinc-300 font-medium">Laravel</span> serta aplikasi pendukung berbasis <span className="text-zinc-300 font-medium">Android</span> untuk automasi manajemen order.
              </p>
            </div>
            
            <div className="relative group">
              <div className="absolute w-3 h-3 bg-zinc-600 rounded-full -left-[38px] top-1.5 ring-4 ring-zinc-950 group-hover:bg-zinc-400 transition-colors" />
              <h3 className="text-white font-semibold text-xl">Mobile Development Intern</h3>
              <p className="text-zinc-400 text-sm mb-4 font-mono mt-1">PT Teknologi Kartu Indonesia • Feb - Sep 2026</p>
              <p className="text-zinc-500 text-base leading-relaxed max-w-2xl">
                Berkolaborasi dalam tim untuk membangun aplikasi Android absensi dan merchant internal. Menggunakan bahasa <span className="text-zinc-300 font-medium">Kotlin</span>, pola desain arsitektur <span className="text-zinc-300 font-medium">MVVM</span>, ViewBinding, Retrofit untuk API, dan Hilt untuk Dependency Injection.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute w-3 h-3 bg-zinc-500 rounded-full -left-[38px] top-1.5 ring-4 ring-zinc-950 group-hover:bg-zinc-300 transition-colors" />
              <h3 className="text-white font-semibold text-xl">Asisten Dosen (Teaching Assistant)</h3>
              <p className="text-zinc-400 text-sm mb-4 font-mono mt-1">Universitas Kristen Satya Wacana (UKSW) • 2025 - 2026</p>
              <p className="text-zinc-500 text-base leading-relaxed max-w-2xl">
                Mendampingi mahasiswa dalam sesi praktikum intensif dengan fokus pada mata kuliah <span className="text-zinc-300 font-medium">Algoritma Pemrograman</span> dan <span className="text-zinc-300 font-medium">Pemrograman Web</span>. Bertanggung jawab memberikan <span className="text-zinc-300 font-medium">code review</span>, melatih logika pemecahan masalah (problem-solving), serta memandu proses troubleshooting untuk memastikan penerapan kode yang efisien.
              </p>
            </div>

          </div>

          {/* EDUCATION */}
          <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
            <span className="w-8 h-px bg-zinc-700 block"></span>
            Riwayat Pendidikan
          </h2>
          <div className="space-y-12 border-l border-zinc-800 ml-3 pl-8 relative">
            
           <div className="relative group">
              <div className="absolute w-3 h-3 bg-zinc-400 rounded-full -left-[38px] top-1.5 ring-4 ring-zinc-950 group-hover:bg-white transition-colors" />
              
              {/* BUNGKUSAN LOGO & JUDUL */}
              <div className="flex items-center gap-4 mb-3 mt-1">
                {/* Kotak Logo */}
                <div className="w-14 h-14 bg-white/5 rounded-xl p-2.5 flex-shrink-0 border border-white/10 group-hover:border-zinc-600 transition-colors">
                  <img 
                    src="/images/logo-uksw.png" 
                    alt="Logo UKSW" 
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                
                {/* Teks Judul */}
                <div>
                  <h3 className="text-white font-semibold text-xl">Universitas Kristen Satya Wacana</h3>
                  <p className="text-zinc-400 text-sm font-mono mt-1">Fakultas Teknologi Informasi - D3 Teknik Informatika • 2023 - 2026</p>
                </div>
              </div>

              <p className="text-zinc-500 text-base leading-relaxed max-w-2xl">
                Lulus sebagai lulusan terbaik dengan predikat <span className="text-zinc-300 font-medium">Dengan Pujian (Cum Laude)</span> meraih IPK tertinggi <span className="text-zinc-300 font-medium">3.55 </span>. Selama masa studi, dipercaya secara akademis sebagai <span className="text-zinc-300 font-medium">Asisten Dosen</span> untuk berbagai mata kuliah pemrograman, serta membuktikan kemampuan manajerial dengan mengelola tata kelola keuangan sebagai <span className="text-zinc-300 font-medium">Bendahara Himpunan Mahasiswa Prodi (HMP)</span> D3 Teknik Informatika.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute w-3 h-3 bg-zinc-400 rounded-full -left-[38px] top-1.5 ring-4 ring-zinc-950 group-hover:bg-white transition-colors" />
              
              {/* BUNGKUSAN LOGO & JUDUL */}
              <div className="flex items-center gap-4 mb-3 mt-1">
                {/* Kotak Logo */}
                <div className="w-14 h-14 bg-white/5 rounded-xl p-2.5 flex-shrink-0 border border-white/10 group-hover:border-zinc-600 transition-colors">
                  <img 
                    src="/images/logo-smada.png" 
                    alt="Logo SMADA" 
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                
                {/* Teks Judul */}
                <div>
                  <h3 className="text-white font-semibold text-xl">SMA Negeri 2 Ungaran</h3>
                  <p className="text-zinc-400 text-sm font-mono mt-1">Jurusan IPA • 2020 - 2023</p>
                </div>
              </div>

              <p className="text-zinc-500 text-base leading-relaxed max-w-2xl">
                Menempuh pendidikan dengan peminatan <span className="text-zinc-300 font-medium">Ilmu Pengetahuan Alam (IPA)</span>, yang membangun fondasi berpikir logis, analitis, dan sistematis yang kuat. Aktif mengasah keterampilan <span className="text-zinc-300 font-medium">problem solving</span> serta pemahaman dasar eksakta yang menjadi landasan penting dalam dunia logika pemrograman.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-32 border-t border-white/5 relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Get in <span className="text-zinc-500">Touch</span></h2>
          <p className="text-zinc-400 max-w-xl text-lg">Tertarik untuk berkolaborasi atau memiliki peluang menarik? Jangan ragu untuk menghubungi saya melalui pesan di bawah ini.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Bagian Kiri: Info Kontak */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl flex items-start gap-5 hover:bg-zinc-900/50 transition-colors">
              <div className="p-4 bg-zinc-800/50 rounded-xl text-zinc-300">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-medium text-lg mb-1">Email</h4>
                <a href="mailto:widikarel@gmail.com" className="text-zinc-400 hover:text-white transition-colors">widikarel@gmail.com</a>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl flex items-start gap-5 hover:bg-zinc-900/50 transition-colors">
              <div className="p-4 bg-zinc-800/50 rounded-xl text-zinc-300">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-medium text-lg mb-1">Lokasi</h4>
                <p className="text-zinc-400">Ungaran, Jawa Tengah</p>
                <p className="text-zinc-500 text-sm mt-1">Indonesia</p>
              </div>
            </div>

           <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl flex items-start gap-5 hover:bg-zinc-900/50 transition-colors">
              <div className="p-4 bg-zinc-800/50 rounded-xl text-zinc-300">
                {/* SVG Native LinkedIn pengganti import */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-medium text-lg mb-1">LinkedIn</h4>
                <a href="https://www.linkedin.com/in/elieserkarelwidiyanto/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Mari terhubung!</a>
              </div>
            </div>

          </div>

          {/* Bagian Kanan: Form Pesan */}
          <div className="lg:col-span-3">
            <form className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl backdrop-blur-sm flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-300">Nama Lengkap</label>
                  <input type="text" placeholder="John Doe" className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-300">Alamat Email</label>
                  <input type="email" placeholder="john@example.com" className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-300">Subjek</label>
                <input type="text" placeholder="Peluang Kolaborasi" className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-300">Pesan</label>
                <textarea rows="5" placeholder="Tulis pesan Anda di sini..." className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600 resize-none"></textarea>
              </div>

              <button type="button" className="mt-2 bg-white text-zinc-950 font-semibold py-4 px-8 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group w-full md:w-auto self-start">
                Kirim Pesan
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-zinc-950 py-10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-sm">
          <div className="font-mono">© {new Date().getFullYear()} Elieser Karel Widiyanto.</div>
        
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm tab-animate" 
            onClick={() => setSelectedCert(null)}
          ></div>
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden tab-animate">
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-zinc-800 p-2.5 rounded-full text-zinc-400 hover:text-white backdrop-blur transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[1.414/1] md:aspect-[16/9] bg-[#09090b] relative flex items-center justify-center p-2 sm:p-8">
               <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 font-mono text-sm z-0">
                  <Maximize2 className="w-12 h-12 mb-4 opacity-30" />
                  Ganti 'image' path di kode dengan gambar asli
               </div>
               <img 
                src={selectedCert.image} 
                alt={selectedCert.title}
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl rounded"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
            <div className="p-6 md:p-8 border-t border-white/5 bg-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{selectedCert.title}</h3>
                <p className="text-zinc-400 text-sm font-medium">{selectedCert.issuer} • <span className="font-mono text-zinc-500">{selectedCert.date}</span></p>
              </div>
              <a 
                href={selectedCert.verifyLink}
                target="_blank"
                rel="noopener noreferrer" 
                className="px-6 py-3 bg-white text-zinc-950 text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 flex-shrink-0"
              >
                Verifikasi Dokumen <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}