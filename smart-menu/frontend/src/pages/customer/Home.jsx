import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, Clock, ChefHat, QrCode, Soup, TrendingUp,
  Heart, Sparkles, ArrowUp, Milk, Utensils,
  ChevronRight, MessageSquare, Quote, BadgePercent, Timer, Truck
} from 'lucide-react';
import API from '../../api/axios';

/* ── Intersection reveal ── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    const targets = document.querySelectorAll('.reveal');
    targets.forEach((el) => observer.observe(el));
    return () => targets.forEach((el) => observer.unobserve(el));
  }, []);
}

/* ── Ripple button ── */
function RippleButton({ children, className, ...props }) {
  const btnRef = useRef(null);
  const handleClick = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };
  return (
    <button ref={btnRef} onClick={handleClick} className={`ripple-btn relative overflow-hidden ${className || ''}`} {...props}>
      {children}
    </button>
  );
}

/* ── Animated counter ring ── */
function CounterRing({ value, label, icon: Icon, color }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const r = 40, circ = 2 * Math.PI * r;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        let start = 0;
        const step = Math.max(1, Math.floor(value / 50));
        const timer = setInterval(() => {
          start += step;
          if (start >= value) { setCount(value); clearInterval(timer); } else setCount(start);
        }, 20);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);
  const offset = visible ? circ - (count / Math.max(value, 1)) * circ : circ;
  return (
    <div ref={ref} className="flex flex-col items-center group cursor-default">
      <div className="relative w-20 h-20 mb-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            style={{ backgroundColor: color }}>
            <Icon className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>
      <div className="text-xl font-bold text-white mb-0.5 tabular-nums">{count}+</div>
      <div className="text-gray-500 text-[10px] uppercase tracking-wider">{label}</div>
    </div>
  );
}

/* ── Floating particles canvas ── */
function ParticlesCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6 ? '#f59e0b' : '#ffffff',
    }));

    let mouse = { x: -9999, y: -9999 };
    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.strokeStyle = '#f59e0b';
            ctx.globalAlpha = (1 - d / 80) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
}

/* ── Magnetic cursor glow ── */
function CursorGlow() {
  const glowRef = useRef(null);
  useEffect(() => {
    const glow = glowRef.current;
    const onMove = (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return (
    <div ref={glowRef} className="fixed pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2"
      style={{ transition: 'left 0.05s, top 0.05s' }}>
      <div className="w-48 h-48 rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', filter: 'blur(20px)' }} />
    </div>
  );
}

const heroSlides = [
  { icon: Utensils, text: 'Fresh Ingredients', color: 'text-amber-400' },
  { icon: Star, text: 'Top Rated', color: 'text-yellow-400' },
  { icon: Clock, text: 'Fast Service', color: 'text-amber-300' },
  { icon: ChefHat, text: 'Expert Chefs', color: 'text-yellow-300' },
];
/* ── Ethiopian Mesob section divider ── */
function MesobDivider() {
  return (
    <div className="flex items-center justify-center py-1 px-4 max-w-lg mx-auto">
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.35))' }} />
      <div className="mx-3">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-500/50"
          style={{ boxShadow: '0 0 12px rgba(245,158,11,0.3)' }}>
          <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="" className="w-full h-full object-cover scale-110" />
        </div>
      </div>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.35))' }} />
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [popularMeals, setPopularMeals] = useState([]);
  const [newMeals, setNewMeals] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favMeals') || '[]'); } catch { return []; }
  });
  const [showBackTop, setShowBackTop] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const testimonialTimerRef = useRef(null);

  useReveal();

  const fetchAll = useCallback(() => {
    API.get('/categories').then(({ data }) => setCategories(data)).catch(() => { });
    API.get('/meals?available=true').then(({ data }) => {
      const sorted = [...data].sort((a, b) => b.popularity - a.popularity);
      setPopularMeals(sorted.slice(0, 6));
      const newest = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNewMeals(newest.slice(0, 4));
    }).catch(() => { });
    API.get('/feedback').then(({ data }) => setFeedbacks(data.sort(() => Math.random() - 0.5))).catch(() => { });
  }, []);

  useEffect(() => { fetchAll(); const i = setInterval(fetchAll, 20000); return () => clearInterval(i); }, [fetchAll]);
  useEffect(() => { localStorage.setItem('favMeals', JSON.stringify(favorites)); }, [favorites]);

  useEffect(() => {
    const fullText = 'Digitally Served';
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) { setTypedText(fullText.slice(0, i)); i++; } else clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => setHeroSlideIdx((prev) => (prev + 1) % heroSlides.length), 2500);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    if (feedbacks.length <= 1) return;
    testimonialTimerRef.current = setInterval(() => setTestimonialIdx((prev) => (prev + 1) % feedbacks.length), 4000);
    return () => clearInterval(testimonialTimerRef.current);
  }, [feedbacks.length]);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleFav = useCallback((id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  }, []);

  const features = [
    { icon: QrCode, title: 'Scan & Order', desc: 'Scan QR code to access menu instantly' },
    { icon: ChefHat, title: 'Chef Specials', desc: "Discover our chef's handpicked creations" },
    { icon: Clock, title: 'Real-time Updates', desc: 'Menu updates in real-time, always fresh' },
    { icon: TrendingUp, title: 'Easy Payments', desc: 'Pay digitally with screenshot upload' },
  ];

  const howItWorks = [
    { icon: QrCode, step: '01', title: 'Scan QR', desc: 'Scan the QR code at your table' },
    { icon: Soup, step: '02', title: 'Browse Menu', desc: 'Explore our digital menu' },
    { icon: ChefHat, step: '03', title: 'Place Order', desc: 'Select & customize your meal' },
    { icon: TrendingUp, step: '04', title: 'Pay & Enjoy', desc: 'Pay digitally & enjoy your food' },
  ];

  return (
    <div className="overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300">
      <CursorGlow />

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center border ${showBackTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        style={{ background: '#f59e0b', borderColor: '#f59e0b', boxShadow: '0 0 20px rgba(245,158,11,0.5)' }}>
        <ArrowUp className="w-5 h-5 text-black" />
      </button>


      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-[#111] transition-colors duration-300">

        {/* Particles */}
        <ParticlesCanvas />



        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="flex justify-center">
            <div className="text-center max-w-3xl">

              {/* ── Mesob Logo centrepiece ── */}
              <div className="flex justify-center mb-8">
                <div className="relative group cursor-pointer" onClick={() => window.location.href = '/menu'}>
                  {/* outer spin ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30 animate-spin"
                    style={{ animationDuration: '12s', margin: '-14px' }} />
                  {/* mid ring */}
                  <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-spin"
                    style={{ animationDuration: '8s', animationDirection: 'reverse', margin: '-6px' }} />
                  {/* glow */}
                  <div className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ boxShadow: '0 0 40px 8px rgba(245,158,11,0.2)', margin: '-4px' }} />
                  {/* logo */}
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-amber-500/50 group-hover:border-amber-400 transition-all duration-500"
                    style={{ boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 60px rgba(245,158,11,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(245,158,11,0.3)'}>
                    <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Smart Menu" className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700" />
                  </div>
                </div>
              </div>

              {/* Badge */}
              {(() => {
                const SlideIcon = heroSlides[heroSlideIdx].icon; return (
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-6 border"
                    style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b' }}>
                    <SlideIcon className={`w-3.5 h-3.5 ${heroSlides[heroSlideIdx].color} transition-all duration-500`} />
                    <span className="transition-all duration-500 font-medium">{heroSlides[heroSlideIdx].text}</span>
                  </div>
                );
              })()}

              <h1 className="font-bold text-gray-900 dark:text-white leading-tight mb-4" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)' }}>
                Delicious Food,
                <span className="block" style={{ color: '#f59e0b', textShadow: '0 0 40px rgba(245,158,11,0.4)' }}>
                  {typedText}<span className="animate-pulse">|</span>
                </span>
              </h1>

              {/* Mesob-inspired divider */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, #f59e0b)' }} />
                <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-500/50" style={{ boxShadow: '0 0 8px rgba(245,158,11,0.4)' }}>
                  <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="" className="w-full h-full object-cover scale-110" />
                </div>
                <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, #f59e0b)' }} />
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto" style={{ fontSize: '1rem' }}>
                Experience the future of dining. Browse our menu, order your favorites, and pay seamlessly — all from your phone.
              </p>

              <div className="flex flex-wrap gap-3 justify-center mb-10">
                <Link to="/menu"
                  className="inline-flex items-center gap-2 font-bold py-3 px-8 rounded-full transition-all duration-300 group"
                  style={{ background: '#f59e0b', color: '#000', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(245,158,11,0.7)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(245,158,11,0.4)'}>
                  View Menu
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/payment"
                  className="inline-flex items-center gap-2 font-bold py-3 px-8 rounded-full transition-all duration-300"
                  style={{ border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.borderColor = '#f59e0b'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; }}>
                  Make Payment
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center gap-8 text-xs text-gray-500">
                {[
                  { icon: Star, label: '4.9 Rating', color: '#f59e0b' },
                  { icon: Soup, label: `${popularMeals.length || 50}+ Dishes`, color: '#f59e0b' },
                  { icon: Clock, label: 'Fast Service', color: '#f59e0b' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 group cursor-default">
                    <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" style={{ color: item.color }} />
                    <span className="transition-colors duration-300 group-hover:text-amber-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #000, transparent)' }} />
      </section>

      {/* ─── STATS RING COUNTERS ─── */}
      <section className="relative py-10 z-10 bg-white dark:bg-[#050505] border-t border-amber-500/10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CounterRing value={50} label="Dishes" icon={Soup} color="#f59e0b" />
            <CounterRing value={12} label="Categories" icon={Milk} color="#f59e0b" />
            <CounterRing value={500} label="Happy Customers" icon={Star} color="#f59e0b" />
            <CounterRing value={4} label="Chefs" icon={ChefHat} color="#f59e0b" />
          </div>
        </div>
      </section>

      <MesobDivider />

      {/* ─── FEATURES ─── */}
      <section className="py-16 bg-gray-50 dark:bg-[#080808] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 reveal">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-3"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Sparkles className="w-3 h-3" /> Why Choose Us
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">What Makes <span style={{ color: '#f59e0b' }}>Smart Menu</span> Special</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">We make dining easier, faster, and more enjoyable.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="reveal group cursor-default rounded-2xl p-6 text-center transition-all duration-500 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10"
                style={{ transitionDelay: `${i * 100}ms` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,158,11,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <f.icon className="w-7 h-7" style={{ color: '#f59e0b' }} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-amber-400 transition-colors">{f.title}</h3>
                <p className="text-gray-500 text-xs">{f.desc}</p>
                <div className="mt-3 h-0.5 w-0 mx-auto transition-all duration-500 group-hover:w-10 rounded-full" style={{ background: '#f59e0b' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <MesobDivider />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 relative overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-300">
        {/* Decorative golden line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px opacity-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 reveal">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-3"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Sparkles className="w-3 h-3" /> How It Works
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order in <span style={{ color: '#f59e0b' }}>4 Easy Steps</span></h2>
            <p className="text-gray-500 text-sm">From scan to savor in minutes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="reveal group relative text-center cursor-default" style={{ transitionDelay: `${i * 120}ms` }}>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[65%] w-[50%] h-px opacity-20"
                    style={{ background: 'linear-gradient(to right, #f59e0b, transparent)' }} />
                )}
                <div className="relative mx-auto mb-4 w-20 h-20">
                  <div className="absolute inset-0 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <step.icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" style={{ color: '#f59e0b' }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow"
                    style={{ background: '#f59e0b', color: '#000' }}>
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-amber-400 transition-colors">{step.title}</h3>
                <p className="text-gray-500 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MesobDivider />

      {/* ─── POPULAR MEALS ─── */}
      {
        popularMeals.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-[#080808] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8 reveal">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Popular <span style={{ color: '#f59e0b' }}>Meals</span></h2>
                  <p className="text-gray-500 text-sm">Our most loved dishes</p>
                </div>
                <Link to="/menu" className="hidden sm:flex items-center gap-1.5 text-xs font-medium transition-all duration-300 px-4 py-2 rounded-full"
                  style={{ border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularMeals.map((meal, idx) => (
                  <div key={meal._id} className="reveal group/meal relative" style={{ transitionDelay: `${idx * 80}ms` }}>
                    <Link to={`/menu?meal=${meal._id}`} className="block rounded-2xl overflow-hidden transition-all duration-400 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10"
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,158,11,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                      <div className="h-36 flex items-center justify-center relative overflow-hidden">
                        {meal.image ? (
                          <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover/meal:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1200, #2a1c00)' }}>
                            <Soup className="w-12 h-12 transition-transform duration-700 group-hover/meal:scale-110 group-hover/meal:rotate-12" style={{ color: '#f59e0b' }} />
                          </div>
                        )}
                        {/* Shimmer */}
                        <div className="absolute inset-0 -translate-x-full group-hover/meal:translate-x-full transition-transform duration-700"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.1), transparent)' }} />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover/meal:text-amber-400 transition-colors">{meal.name}</h3>
                          <span className="font-bold text-xs px-2 py-0.5 rounded-lg" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>ETB {meal.price}</span>
                        </div>
                        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{meal.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-600">
                          <span>🔥 {meal.calories} cal</span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbohydrates}g</span>
                          <span>F: {meal.fat}g</span>
                        </div>
                      </div>
                    </Link>
                    <RippleButton onClick={(e) => { e.preventDefault(); toggleFav(meal._id); }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${favorites.includes(meal._id) ? 'scale-110' : ''}`}
                      style={{
                        background: favorites.includes(meal._id) ? '#ef4444' : 'rgba(0,0,0,0.6)',
                        border: favorites.includes(meal._id) ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(4px)',
                      }}>
                      <Heart className={`w-3.5 h-3.5 ${favorites.includes(meal._id) ? 'fill-current text-white' : 'text-gray-400'}`} />
                    </RippleButton>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6 sm:hidden reveal">
                <Link to="/menu" className="inline-flex items-center gap-2 font-bold text-xs py-2 px-6 rounded-full transition-all"
                  style={{ background: '#f59e0b', color: '#000' }}>View Full Menu <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </div>
          </section>
        )
      }

      <MesobDivider />

      {/* ─── TESTIMONIALS ─── */}
      {
        feedbacks.length > 0 && (
          <section className="py-16 relative overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-300">
            {/* Decorative corners */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t border-l" style={{ borderColor: 'rgba(245,158,11,0.2)' }} />
            <div className="absolute top-8 right-8 w-12 h-12 border-t border-r" style={{ borderColor: 'rgba(245,158,11,0.2)' }} />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l" style={{ borderColor: 'rgba(245,158,11,0.2)' }} />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r" style={{ borderColor: 'rgba(245,158,11,0.2)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 reveal">
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-3"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <Star className="w-3 h-3 fill-current" /> What Our Customers Say
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Loved by <span style={{ color: '#f59e0b' }}>Our Guests</span></h2>
                <p className="text-gray-500 text-sm">Real reviews from real customers</p>
              </div>
              <div className="max-w-xl mx-auto">
                <div className="relative min-h-[160px]">
                  {feedbacks.slice(0, 5).map((fb, idx) => (
                    <div key={fb._id} className={`transition-all duration-500 absolute inset-0 ${idx === testimonialIdx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}>
                      <div className="rounded-2xl p-6 text-center bg-white dark:bg-[#111] border border-gray-200 dark:border-amber-500/20 shadow-sm">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <Quote className="w-6 h-6" style={{ color: '#f59e0b' }} />
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">"{fb.comment || 'Amazing food and great service! Highly recommend this place.'}"</p>
                        <div className="flex justify-center gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'}`} />
                          ))}
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{fb.customerName}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {feedbacks.slice(0, Math.min(5, feedbacks.length)).map((_, idx) => (
                    <button key={idx} onClick={() => setTestimonialIdx(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx === testimonialIdx ? 'w-6' : 'w-1.5 bg-gray-700 hover:bg-amber-700'}`}
                      style={idx === testimonialIdx ? { background: '#f59e0b', width: '1.5rem' } : {}} />
                  ))}
                </div>
                <div className="text-center mt-6 reveal">
                  <Link to="/feedback" className="inline-flex items-center gap-2 text-xs font-medium transition-all duration-300 px-4 py-2 rounded-full"
                    style={{ border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    Read All Reviews <MessageSquare className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )
      }

      <MesobDivider />

      {/* ─── NEW ARRIVALS ─── */}
      {
        newMeals.length > 0 && (
          <section className="py-16 relative overflow-hidden bg-gray-50 dark:bg-[#080808] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8 reveal">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#f59e0b' }}>Fresh from kitchen</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-0.5">New <span style={{ color: '#f59e0b' }}>Arrivals</span></h2>
                  <p className="text-gray-500 text-xs">Just added to our menu</p>
                </div>
                <Link to="/menu" className="hidden sm:flex items-center gap-1.5 text-xs font-medium transition-all duration-300 px-4 py-2 rounded-full"
                  style={{ border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {newMeals.map((meal, idx) => (
                  <div key={meal._id} className="reveal group/new" style={{ transitionDelay: `${idx * 100}ms` }}>
                    <Link to={`/menu?meal=${meal._id}`} className="block rounded-2xl overflow-hidden relative transition-all duration-400 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10"
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,158,11,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                      <div className="absolute top-2 left-2 z-10 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
                        style={{ background: '#f59e0b', color: '#000' }}>
                        <Sparkles className="w-2 h-2" /> NEW
                      </div>
                      <div className="h-28 flex items-center justify-center overflow-hidden">
                        {meal.image ? (
                          <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover/new:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1200, #2a1c00)' }}>
                            <Soup className="w-10 h-10 transition-transform duration-700 group-hover/new:scale-110 group-hover/new:rotate-12" style={{ color: '#f59e0b' }} />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover/new:text-amber-400 transition-colors text-xs">{meal.name}</h3>
                          <span className="font-bold text-[10px]" style={{ color: '#f59e0b' }}>ETB {meal.price}</span>
                        </div>
                        <p className="text-gray-500 text-[10px] line-clamp-1">{meal.description}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* ─── TRUST BAR ─── */}
      <section className="py-8" style={{ background: '#050505', borderTop: '1px solid rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Timer, label: 'Fast Delivery', desc: '30 min or less' },
              { icon: BadgePercent, label: 'Best Prices', desc: 'Daily deals & offers' },
              { icon: Truck, label: 'Free Shipping', desc: 'Over ETB 20' },
              { icon: MessageSquare, label: '24/7 Support', desc: "We're here to help" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-default p-3 rounded-xl transition-all duration-300"
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <item.icon className="w-5 h-5" style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">{item.label}</p>
                  <p className="text-gray-500 text-[10px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      {
        categories.length > 0 && (
          <section className="py-16" style={{ background: '#080808' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 reveal">
                <h2 className="text-3xl font-bold text-white mb-1">Explore <span style={{ color: '#f59e0b' }}>Categories</span></h2>
                <p className="text-gray-500 text-sm">Tap to discover dishes in each category</p>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat, idx) => (
                  <Link key={cat._id} to={`/menu?category=${cat._id}`}
                    className="reveal rounded-2xl p-6 text-center group relative overflow-hidden cursor-pointer transition-all duration-500"
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', transitionDelay: `${idx * 80}ms` }}
                    onMouseEnter={e => { setActiveCategory(cat._id); e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(245,158,11,0.1)'; }}
                    onMouseLeave={e => { setActiveCategory(null); e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'radial-gradient(circle at center, rgba(245,158,11,0.04) 0%, transparent 70%)' }} />
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                      <Soup className="w-8 h-8" style={{ color: '#f59e0b' }} />
                    </div>
                    <h3 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition-colors">{cat.name}</h3>
                    <p className="text-gray-500 text-xs mb-3">{cat.description}</p>
                    <div className="inline-flex items-center gap-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                      style={{ color: '#f59e0b' }}>
                      Explore <ChevronRight className="w-3 h-3" />
                    </div>
                    <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 ${activeCategory === cat._id ? 'w-full' : 'w-0'}`}
                      style={{ background: 'linear-gradient(to right, #f59e0b, #fbbf24)' }} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* ─── CTA ─── */}
      <section className="py-16 relative overflow-hidden" style={{ background: '#050505' }}>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Corner decors */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: 'rgba(245,158,11,0.3)' }} />
        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 rounded-tr-2xl" style={{ borderColor: 'rgba(245,158,11,0.3)' }} />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 rounded-bl-2xl" style={{ borderColor: 'rgba(245,158,11,0.3)' }} />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: 'rgba(245,158,11,0.3)' }} />

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10 reveal">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs mb-4"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
            <Sparkles className="w-3 h-3" /> Ready to eat?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to <span style={{ color: '#f59e0b' }}>Order?</span></h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #f59e0b)' }} />
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #f59e0b)' }} />
          </div>
          <p className="text-gray-400 text-sm mb-8">Scan the QR code at your table or browse our menu now.</p>
          <Link to="/menu"
            className="inline-flex items-center gap-2 font-bold py-3 px-10 rounded-full transition-all duration-300 group"
            style={{ background: '#f59e0b', color: '#000', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 60px rgba(245,158,11,0.7)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(245,158,11,0.4)'; e.currentTarget.style.transform = ''; }}>
            Start Ordering
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div >
  );
}
