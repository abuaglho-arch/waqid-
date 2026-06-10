import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { 
  ArrowUpRight, Leaf, Flame, RotateCw, Globe, 
  Sprout, Factory, MapPin, Mail, ChevronDown, Activity, CheckCircle2, ShieldCheck,
  Hexagon, Zap, Users, Coins, Trees, Wind,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import './index.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const driftVariant = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const popVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const blurFadeVariant = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.8 } }
};

const Counter = ({ value, duration = 2, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const elementRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let startTime;
    let animationFrame;
    const cleanValue = value.toString().replace(/[^0-9.-]/g, "");
    const target = parseFloat(cleanValue);
    
    if (isNaN(target)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(value);
      return;
    }

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(target * easeOutQuart);
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, inView]);

  const displayValue = typeof count === 'number' 
    ? (Number.isInteger(parseFloat(value)) ? Math.round(count) : count.toFixed(1)) 
    : count;
  return (
    <span ref={elementRef}>
      {prefix}
      {isNaN(parseFloat(value)) ? value : displayValue}
      {value.includes('-') && !prefix ? `-${value.split('-')[1]}` : ''}
      {suffix}
    </span>
  );
};

const crisisCards = [
  { index: "01", image: "/images/waste-accumulates.jpg", title: "Waste Accumulates", desc: "Organic residues pile up when they are treated as waste instead of resources. Palm biomass, rice husks, and farm by-products are often left unused, creating pressure at farms and processing sites." },
  { index: "02", image: "/images/methane-rises.png", title: "Methane Rises", desc: "When organic waste decomposes without proper management, it can release gases that make the climate problem worse. What looks like simple waste becomes part of a larger environmental cost." },
  { index: "03", image: "/images/farmers-pay-more.jpg", title: "Farmers Pay More", desc: "Small farmers face rising costs for fertilizers, soil inputs, and fuel. As prices increase, maintaining productivity becomes harder, especially for communities already working with limited resources." },
  { index: "04", image: "/images/problem_cracked_soil_1780739623976.png", title: "Soils Decline", desc: "Overused land gradually loses nutrients, structure, and fertility. Without better soil support, farms become less resilient and harvests become harder to sustain over time." },
  { index: "05", image: "/images/forests-suffer.jpg", title: "Forests Suffer", desc: "When systems depend on extracting more resources instead of reusing what already exists, natural ecosystems carry the burden. Forests, land, and biodiversity are affected by this pressure." },
  { index: "06", image: "/images/problem-visual.png", title: "Value is Lost", desc: "Useful materials are often discarded before they can return value to the system. What is seen as waste could become part of a circular solution for soil, farming, and sustainability." }
];

const useCardTransforms = (scrollYProgress, index, isMobile, totalCards = 6) => {
  const dx = isMobile ? 6 : 12;
  
  if (index === 1) {
    // Card 1 starts and stays in position so it reveals synchronously with the text
    const x = useTransform(scrollYProgress, [0, 1], [dx, dx]);
    return { x };
  }

  // Cards 2-6 start earlier, move faster, from a closer distance
  const step = 0.85 / 5;
  const start = 0.02 + (index - 2) * step;
  const end = 0.02 + (index - 1) * step;

  const x = useTransform(scrollYProgress, [start, end], [800, index * dx]);

  return { x };
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);
  const crisisScrollRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1024px)").matches : false
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 1024px)");
    const mobileListener = (e) => setIsMobile(e.matches);
    mobileQuery.addEventListener("change", mobileListener);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    return () => {
      mobileQuery.removeEventListener("change", mobileListener);
      motionQuery.removeEventListener("change", motionListener);
    };
  }, []);

  const crisisSectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: crisisSectionRef,
    offset: ["start start", "end end"]
  });

  const [activeCardIndex, setActiveCardIndex] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalCards = 6;
    const step = 0.85 / 5;
    
    // Calculate index based on the midpoint of the card's entry animation
    // so the text changes when the new card is halfway in.
    let index = 1;
    if (latest >= 0) {
      const cardStep = Math.floor((latest - 0.02) / step + 0.5) + 1;
      index = Math.min(Math.max(cardStep, 1), totalCards);
    }

    if (index !== activeCardIndex) {
      setActiveCardIndex(index);
    }
  });

  const handleCardClick = (index) => {
    if (crisisSectionRef.current) {
      const rect = crisisSectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = crisisSectionRef.current.clientHeight;
      const scrollableHeight = sectionHeight - Math.min(window.innerHeight, 620);
      
      // Scroll to exactly the point where the chosen card finishes entering
      const targetProgress = index === 1 ? 0.0 : 0.02 + ((index - 1) * (0.85 / 5));
      const targetScroll = sectionTop + (targetProgress * scrollableHeight);
      
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const card1 = useCardTransforms(scrollYProgress, 1, isMobile, 6);
  const card2 = useCardTransforms(scrollYProgress, 2, isMobile, 6);
  const card3 = useCardTransforms(scrollYProgress, 3, isMobile, 6);
  const card4 = useCardTransforms(scrollYProgress, 4, isMobile, 6);
  const card5 = useCardTransforms(scrollYProgress, 5, isMobile, 6);
  const card6 = useCardTransforms(scrollYProgress, 6, isMobile, 6);

  const cardTransforms = [
    null,
    card1,
    card2,
    card3,
    card4,
    card5,
    card6
  ];

  const scrollCrisis = (direction) => {
    if (crisisScrollRef.current) {
      const cardWidth = 380 + 24; // Card width + gap
      crisisScrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTrackSelect = (track) => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    const select = document.getElementById("partner-track");
    if (select) select.value = track;
  };

  const faqItems = [
    {
      q: "What stage is WAQID currently in?",
      a: "WAQID is currently in the prototype stage. We have tested our manual V1 and V2 reactors and are raising $30k to build our semi-automated V3 Pilot Reactor to validate operations at the palm mill level."
    },
    {
      q: "How does the TLUD Pyrolysis technology work?",
      a: "Top-Lit Updraft (TLUD) pyrolysis limits oxygen during the heating process. Instead of burning biomass to ash, it extracts the thermal energy (clean heat) and leaves behind a stable, carbon-rich material called biochar."
    },
    {
      q: "What is the difference between your biochar and normal fertilizer?",
      a: "Biochar is not a direct fertilizer; it acts like a permanent sponge in the soil. It retains water and nutrients, preventing them from washing away in the rain. Over time, it helps farmers reduce the amount of expensive synthetic fertilizer they need to apply."
    },
    {
      q: "Who is the ideal strategic partner?",
      a: "We are looking for early-adopter palm oil mills willing to co-locate our V3 pilot unit, smallholder farmers interested in testing our biochar pellets, and environmental-impact organizations who can provide technical validation."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#4CAF50]/30 selection:text-[#0C1D13] font-sans antialiased overflow-x-clip">
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#0C1D13]/95 backdrop-blur-xl py-3 border-[#2E7D32]/20 shadow-lg' : 'bg-transparent py-6 border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/waqid-logo-transparent.png" alt="WAQID Logo" className="h-8 md:h-10 object-contain drop-shadow-md" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[
              { id: 'crisis', name: 'Crisis' },
              { id: 'solution', name: 'Solution' },
              { id: 'impact', name: 'Impact' },
              { id: 'assumptions', name: 'Roadmap' },
              { id: 'traction', name: 'Field Trials' },
              { id: 'team', name: 'Team' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
                className="text-xs font-bold uppercase tracking-widest text-[#FAF9F6]/80 hover:text-[#4CAF50] transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
          <button 
            onClick={() => handleTrackSelect("Strategic Partner")}
            className="px-5 py-2.5 bg-[#4CAF50] hover:bg-[#2E7D32] text-[#0C1D13] hover:text-[#FAF9F6] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors shadow-[0_0_15px_rgba(76,175,80,0.3)]"
          >
            Partner With Us
          </button>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section 
        style={{ minHeight: '100vh' }}
        className="relative flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0C1D13] w-full"
      >
        <div className="absolute inset-0 bg-hero-pattern opacity-[0.03] pointer-events-none mix-blend-overlay z-1" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1D13]/70 via-[#0C1D13]/55 to-[#0C1D13] pointer-events-none z-1" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2E7D32]/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#4CAF50]/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen z-1" />

        <motion.div style={{ y: heroY }} className="absolute inset-0 opacity-55 z-0 scale-110">
          <img src="/images/waqid_circular_restoration_hero.png" alt="WAQID Operations" className="w-full h-full object-cover object-center" />
        </motion.div>

        {/* Floating Sparks/Embers overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="ember animate-ember-1 left-[10%]" style={{ animationDelay: '0s' }} />
          <div className="ember animate-ember-2 left-[25%]" style={{ animationDelay: '2s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-3 left-[40%]" style={{ animationDelay: '4s', width: '5px', height: '5px' }} />
          <div className="ember animate-ember-1 left-[55%]" style={{ animationDelay: '1s', width: '2px', height: '2px' }} />
          <div className="ember animate-ember-2 left-[70%]" style={{ animationDelay: '5s', width: '4px', height: '4px' }} />
          <div className="ember animate-ember-3 left-[85%]" style={{ animationDelay: '3s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-1 left-[20%]" style={{ animationDelay: '7s', width: '4px', height: '4px' }} />
          <div className="ember animate-ember-2 left-[45%]" style={{ animationDelay: '9s', width: '2px', height: '2px' }} />
          <div className="ember animate-ember-3 left-[65%]" style={{ animationDelay: '6s', width: '5px', height: '5px' }} />
          <div className="ember animate-ember-1 left-[80%]" style={{ animationDelay: '8s', width: '3px', height: '3px' }} />
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#152E1E]/80 backdrop-blur-md border border-[#2E7D32]/30 text-[#4CAF50] text-[10px] font-sans font-bold uppercase tracking-widest mb-6 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
            PROTOTYPE-STAGE CLIMATE VENTURE
          </motion.div>

          <motion.h1 variants={fadeUpVariant} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.1] text-[#FAF9F6] text-balance mb-6">
            Restoring Land. <br />
            Closing the Loop. <br />
            <span className="text-[#4CAF50]">Cooling the Planet.</span>
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="mt-4 text-[#FAF9F6]/85 font-sans text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-balance">
            WAQID is a prototype-stage climate venture developing decentralized biochar and clean heat systems that turn palm biomass waste into soil restoration, cleaner fuel, and rural climate resilience.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <button
              onClick={() => handleTrackSelect("Investor / Pitch Deck Request")}
              className="btn-hover-shadow w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs border border-[#2E7D32]/20 shadow-md flex items-center justify-center"
            >
              Request Pitch Deck
            </button>
            <button
              onClick={() => handleTrackSelect("Strategic Partner")}
              className="btn-hover-shadow w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent hover:bg-[#112417] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs border border-[#2E7D32]/40 shadow-sm flex items-center justify-center"
            >
              Partner With Us
            </button>
          </motion.div>

          <motion.p variants={fadeUpVariant} className="mt-8 text-[#FAF9F6]/50 font-sans text-[10px] sm:text-xs tracking-wider uppercase font-bold">
            Built for palm mills, smallholder farmers, and rural communities.
          </motion.p>
        </motion.div>

      </section>

      {/* 2. WHY WAQID EXISTS */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="why-waqid" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left relative overflow-hidden">
        <div className="absolute -left-32 top-10 w-96 h-96 bg-[#4CAF50]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                Origin Story
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] leading-tight mt-3">
                Why WAQID Exists
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-base md:text-xl text-[#0C1D13]/80 font-serif leading-relaxed italic border-l-4 border-[#2E7D32] pl-6 py-2">
                "WAQID began from a simple contradiction: some communities lack affordable clean energy, while others burn valuable biomass as waste. We close this logic gap by turning waste into soil restoration, cleaner fuel, and local climate resilience."
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2.5 ECOSYSTEM & SUPPORT NETWORK */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} className="bg-[#FAF9F6] border-b border-[#2E7D32]/10">
        <div className="ecosystem-strip">
          {/* Heading */}
          <div className="relative z-[4] h-full flex flex-col justify-center pl-6 md:pl-[5vw] pr-7">
            <span className="block mb-2 text-[10.5px] font-sans font-black uppercase tracking-[2px] text-[#254D44]">
              Ecosystem
            </span>
            <h2 className="m-0 max-w-[330px] text-[25px] font-display font-black text-[#19362F] leading-[1.04] tracking-tight">
              Ecosystem &amp; Support Network
            </h2>
          </div>

          {/* Logo Marquee */}
          <div className="logo-flow">
            <div className="logo-line">
              {/* Set 1 */}
              <img className="green-logo" src="https://static.wixstatic.com/media/8b5fa1_35df3b37b25c48a1bf832807ef97d248~mv2.png" alt="GreenEers Club" />
              <img className="medium-logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAbe3ABsVePiQMlFP8h2HV56YB8PB1zSl_2g&s" alt="Support Network" />
              <img className="medium-logo" src="https://iylp.tzuchi.org/wp-content/uploads/2024/11/Logo-IYLP-2.png" alt="IYLP" />
              <img className="wide-logo" src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Albukhary_International_University_horizontal_logo_%28Black%29.png" alt="Albukhary International University" />
              <img className="wide-logo" src="https://d102smnvqbot52.cloudfront.net/shrine_store/uploads/networks/3234/networks/3234/wide-d664d30128a78ec2565b1154565f0653.webp?Expires=1781098257&Signature=AFSHjKMrANQWJeKvZJUpi75Dhked8t29rAeqbp8oLoV3v2Lau42QSckUTZhXyTT~BjobpHwWMjuLIfXDerhdqau76tqVqDMCWE6TMSwrzo6MXFPwQStGy~i-2KKNosvUe9iegOmpnbHg~hEP~bKv9NsBHUyU2YtPRm07sC~Pl83zkNNX6rdQenyIRmZQ6rrmZN7FYjBrQ2Ygp-kddx6hmlJxvFBg~Sqla3FSgFkk9Usd3Ls3XspundXTTuf5uHg7l7H9-MlBgIkklr-LF-QIkKp5FCH9IHog7drUeyms11Xf01AwqYh43OYMsp64ZHJNsl6N8FpzL-jWr675UUW~OA__&Key-Pair-Id=K2FGAUSZJ303Q5" alt="Support Network" />

              {/* Set 2 — duplicate for seamless loop */}
              <img className="green-logo" src="https://static.wixstatic.com/media/8b5fa1_35df3b37b25c48a1bf832807ef97d248~mv2.png" alt="GreenEers Club" />
              <img className="medium-logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAbe3ABsVePiQMlFP8h2HV56YB8PB1zSl_2g&s" alt="Support Network" />
              <img className="medium-logo" src="https://iylp.tzuchi.org/wp-content/uploads/2024/11/Logo-IYLP-2.png" alt="IYLP" />
              <img className="wide-logo" src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Albukhary_International_University_horizontal_logo_%28Black%29.png" alt="Albukhary International University" />
              <img className="wide-logo" src="https://d102smnvqbot52.cloudfront.net/shrine_store/uploads/networks/3234/networks/3234/wide-d664d30128a78ec2565b1154565f0653.webp?Expires=1781098257&Signature=AFSHjKMrANQWJeKvZJUpi75Dhked8t29rAeqbp8oLoV3v2Lau42QSckUTZhXyTT~BjobpHwWMjuLIfXDerhdqau76tqVqDMCWE6TMSwrzo6MXFPwQStGy~i-2KKNosvUe9iegOmpnbHg~hEP~bKv9NsBHUyU2YtPRm07sC~Pl83zkNNX6rdQenyIRmZQ6rrmZN7FYjBrQ2Ygp-kddx6hmlJxvFBg~Sqla3FSgFkk9Usd3Ls3XspundXTTuf5uHg7l7H9-MlBgIkklr-LF-QIkKp5FCH9IHog7drUeyms11Xf01AwqYh43OYMsp64ZHJNsl6N8FpzL-jWr675UUW~OA__&Key-Pair-Id=K2FGAUSZJ303Q5" alt="Support Network" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. THE CRISIS WE CAN NO LONGER IGNORE */}
      {prefersReducedMotion ? (
        <motion.section 
          variants={sectionReveal} 
          initial="initial" 
          whileInView="whileInView" 
          viewport={{ once: true, margin: "-50px" }} 
          id="crisis" 
          className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-2xl text-left">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                  The Crisis
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] leading-tight mt-3">
                  The Crisis We Can No Longer Ignore
                </h2>
                <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans mt-4 leading-relaxed">
                  Every year, organic waste is left behind while farmers face rising costs, soils lose fertility, and natural ecosystems absorb the pressure.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button 
                  onClick={() => scrollCrisis('left')}
                  className="w-12 h-12 rounded-full border border-[#2E7D32]/20 hover:border-[#2E7D32] bg-[#FAF9F6] hover:bg-[#2E7D32]/5 text-[#2E7D32] flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer z-20"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollCrisis('right')}
                  className="w-12 h-12 rounded-full border border-[#2E7D32]/20 hover:border-[#2E7D32] bg-[#FAF9F6] hover:bg-[#2E7D32]/5 text-[#2E7D32] flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer z-20"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full relative overflow-hidden">
            <div 
              ref={crisisScrollRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar scroll-smooth w-full px-6 md:px-[calc((100vw-1280px)/2+1.5rem)]"
              style={{ 
                scrollPaddingLeft: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))' 
              }}
            >
              <div 
                style={{ 
                  position: 'sticky', 
                  left: '1.5rem',
                  zIndex: 11
                }}
                className="snap-center shrink-0 w-[85vw] sm:w-[420px] h-[450px] sm:h-[480px] bg-[#FAF9F6] p-6 md:p-8 rounded-3xl border border-[#2E7D32]/10 shadow-xl flex flex-col justify-between text-left card-hover transition-all duration-300"
              >
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Key Metrics</span>
                  <h3 className="text-2xl md:text-3xl font-display font-black text-[#0C1D13] mt-2 mb-6 leading-tight">The Magnitude of the Problem</h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="border-b border-[#2E7D32]/10 pb-3">
                    <h4 className="text-3xl md:text-4xl font-serif font-bold text-[#2E7D32] mb-1">
                      <Counter value="80" suffix="M+" /> <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-1.5">tonnes</span>
                    </h4>
                    <p className="text-xs text-[#0C1D13]/70 font-sans">Palm biomass generated annually in Malaysia.</p>
                  </div>
                  <div className="border-b border-[#2E7D32]/10 pb-3">
                    <h4 className="text-3xl md:text-4xl font-serif font-bold text-[#2E7D32] mb-1">
                      <Counter value="22" prefix="20-" suffix="M" /> <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-1.5">tonnes</span>
                    </h4>
                    <p className="text-xs text-[#0C1D13]/70 font-sans">Empty Fruit Bunches left unmanaged or burned openly each year.</p>
                  </div>
                  <div>
                    <h4 className="text-3xl md:text-4xl font-serif font-bold text-[#2E7D32] mb-1">
                      <Counter value="34" suffix="x" /> <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-1.5">threat</span>
                    </h4>
                    <p className="text-xs text-[#0C1D13]/70 font-sans">Methane from rotting waste has 34x the warming power of CO2.</p>
                  </div>
                </div>
              </div>

              {crisisCards.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    position: 'sticky', 
                    left: `calc(1.5rem + ${(idx + 1) * 16}px)`,
                    zIndex: 12 + idx
                  }}
                  className="snap-center shrink-0 w-[85vw] sm:w-[380px] h-[450px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 relative group card-hover border border-[#2E7D32]/10"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D13] via-[#0C1D13]/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-left z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-sans font-bold text-[#4CAF50]">[ {item.index} ]</span>
                      <h4 className="font-display font-bold text-xl md:text-2xl text-[#FAF9F6]">{item.title}</h4>
                    </div>
                    <p className="text-xs md:text-sm text-[#FAF9F6]/85 font-sans leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      ) : (
        <section 
          ref={crisisSectionRef} 
          id="crisis" 
          className="relative h-[150vh] bg-[#FAF9F6] border-b border-[#2E7D32]/10 text-left"
        >
          <div className="sticky top-0 h-[100vh] max-h-[620px] w-full overflow-hidden flex items-center bg-[#FAF9F6]">
            <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 lg:gap-8">
              
              {/* Left Column: Static Text & Reading Panel */}
              <motion.div 
                variants={sectionReveal}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-50px" }}
                className="w-full lg:w-[28%] flex flex-col justify-center gap-3 text-left shrink-0"
              >
                <div>
                  <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                    The Crisis
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-[#0C1D13] leading-tight mt-1.5">
                    The Crisis We Can No Longer Ignore
                  </h2>
                  <p className="text-sm text-[#0C1D13]/70 font-sans leading-relaxed mt-1.5">
                    Every year, organic waste is left behind while farmers face rising costs, soils lose fertility, and natural ecosystems absorb the pressure.
                  </p>
                </div>

                {/* Compact Reading Panel (Desktop Only) */}
                <div className="hidden lg:block min-h-[120px] border-l-2 border-[#2E7D32]/20 pl-4 py-1 transition-all duration-300">
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                      Crisis [ {crisisCards[activeCardIndex - 1]?.index || "01"} ]
                    </span>
                    <h4 className="font-display font-bold text-base text-[#0C1D13] mt-1 mb-1">
                      {crisisCards[activeCardIndex - 1]?.title}
                    </h4>
                    <p className="text-xs text-[#0C1D13]/85 font-sans leading-relaxed">
                      {crisisCards[activeCardIndex - 1]?.desc}
                    </p>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex flex-col gap-2 max-w-xs">
                  <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#0C1D13]/50">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                      Scroll or tap to view
                    </span>
                    <span>{`${activeCardIndex} / 6`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => handleCardClick(dotIdx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeCardIndex === dotIdx 
                            ? 'w-7 bg-[#2E7D32]' 
                            : 'w-2 bg-[#2E7D32]/20 hover:bg-[#2E7D32]/50'
                        }`}
                        aria-label={`Go to card ${dotIdx}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Center Column: Static Key Metrics Panel */}
              <motion.div 
                variants={sectionReveal}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-50px" }}
                className="hidden lg:flex w-[24%] shrink-0"
              >
                <div className="w-full bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 shadow-[0_8px_30px_rgba(12,29,19,0.05)] flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Key Metrics</span>
                    <h3 className="text-base lg:text-lg font-display font-black text-[#0C1D13] mt-1 mb-3 leading-tight">The Magnitude of the Problem</h3>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="border-b border-[#2E7D32]/10 pb-2">
                      <h4 className="text-xl lg:text-2xl font-serif font-bold text-[#2E7D32] mb-0.5">
                        <Counter value="80" suffix="M+" /> <span className="text-[9px] font-sans font-normal text-[#0C1D13]/50 ml-1">tonnes</span>
                      </h4>
                      <p className="text-[10px] text-[#0C1D13]/70 font-sans">Palm biomass generated annually in Malaysia.</p>
                    </div>
                    <div className="border-b border-[#2E7D32]/10 pb-2">
                      <h4 className="text-xl lg:text-2xl font-serif font-bold text-[#2E7D32] mb-0.5">
                        <Counter value="22" prefix="20-" suffix="M" /> <span className="text-[9px] font-sans font-normal text-[#0C1D13]/50 ml-1">tonnes</span>
                      </h4>
                      <p className="text-[10px] text-[#0C1D13]/70 font-sans">Empty Fruit Bunches left unmanaged or burned openly each year.</p>
                    </div>
                    <div>
                      <h4 className="text-xl lg:text-2xl font-serif font-bold text-[#2E7D32] mb-0.5">
                        <Counter value="34" suffix="x" /> <span className="text-[9px] font-sans font-normal text-[#0C1D13]/50 ml-1">threat</span>
                      </h4>
                      <p className="text-[10px] text-[#0C1D13]/70 font-sans">Methane from rotting waste has 34x the warming power of CO2.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Stacking Crisis Cards Only */}
              <motion.div 
                variants={sectionReveal}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-50px" }}
                className="w-full lg:w-[42%] flex items-center justify-center relative"
              >
                <div className="relative w-[85vw] sm:w-[360px] h-[360px] sm:h-[380px] max-w-[340px] sm:max-w-none overflow-visible">
                  
                  {/* Cards 1 to 6 — all fully solid, no transparency */}
                  {crisisCards.map((item, idx) => {
                    const cardIndex = idx + 1;
                    const transform = cardTransforms[cardIndex];
                    const isActive = cardIndex === activeCardIndex || (activeCardIndex === 0 && cardIndex === 1);
                    const isStacked = cardIndex < activeCardIndex;

                    return (
                      <motion.div 
                        key={idx} 
                        onClick={() => handleCardClick(cardIndex)}
                        style={{ 
                          x: transform.x
                        }}
                        animate={{
                          y: 0,
                          scale: isActive ? 1.02 : isStacked ? 0.97 - (activeCardIndex - cardIndex) * 0.015 : 0.98,
                          rotate: isActive ? 0 : isStacked ? (cardIndex % 2 === 0 ? 1.5 : -1.5) : 0,
                          zIndex: isActive ? 50 : isStacked ? 40 - (activeCardIndex - cardIndex) : 10 + cardIndex,
                          opacity: 1
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(12,29,19,0.12)] border border-[#2E7D32]/10 bg-[#0C1D13] cursor-pointer group select-none"
                      >
                        {/* Image Background */}
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Dark Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D13] via-[#0C1D13]/50 to-transparent" />

                        {/* Text content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left z-10">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] sm:text-xs font-sans font-bold text-[#4CAF50]">[ {item.index} ]</span>
                            <h4 className="font-display font-bold text-base sm:text-lg md:text-xl text-[#FAF9F6]">{item.title}</h4>
                          </div>
                          <p className="text-[10px] sm:text-xs text-[#FAF9F6]/90 font-sans leading-relaxed lg:hidden">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      )}

      {/* 4. THE WAQID SOLUTION */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="solution" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              The WAQID Solution
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3 leading-tight">
              A Circular System for Waste, Energy, and Soil
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                <RotateCw className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Waste Recovery</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Converts unmanaged palm biomass into useful outputs instead of burning or decomposition.
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Clean Heat</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Produces thermal energy that can support mill or local operations.
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                <Sprout className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Soil Restoration</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Creates biochar-based soil products designed to improve soil health and reduce input dependency.
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                <Hexagon className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Sustainable Briquettes</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Produces smokeless solid fuels as a direct, forest-friendly alternative to wood charcoal.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 5. ENVIRONMENTAL IMPACT PATHWAY */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="impact" className="bg-[#0C1D13] py-16 md:py-24 relative overflow-hidden border-b border-[#2E7D32]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,transparent_40%,#152E1E_100%)] pointer-events-none opacity-50" />
        


        {/* Floating Sparks/Embers overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="ember animate-ember-1 left-[15%]" style={{ animationDelay: '1s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-2 left-[35%]" style={{ animationDelay: '3s', width: '2px', height: '2px' }} />
          <div className="ember animate-ember-3 left-[50%]" style={{ animationDelay: '5s', width: '4px', height: '4px' }} />
          <div className="ember animate-ember-1 left-[65%]" style={{ animationDelay: '2s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-2 left-[85%]" style={{ animationDelay: '6s', width: '2px', height: '2px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-3">
              Measurable Outcomes
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] leading-tight">
              Environmental Impact Pathway
            </h2>
            <div className="w-12 h-[1px] bg-[#4CAF50] mt-8 mb-4" />
          </div>
        </div> {/* Close max-w-7xl */}

        {/* Full-bleed marquee */}
        <div className="w-full relative overflow-hidden my-4">
          <div className="marquee-container w-full max-w-[100vw]">
            <div className="marquee-content animate-marquee gap-6 items-stretch pr-6" style={{ animationDuration: '40s' }}>
              {[1, 2].map((iteration) => (
                <div key={iteration} className="flex gap-6 shrink-0">
                  <motion.div variants={popVariant} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-8 rounded-3xl dark-card-hover group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Factory className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#FAF9F6] mb-3">Waste Diverted</h3>
                    <p className="text-xs text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Designed to convert palm waste and rice husks into useful outputs instead of letting them become emissions or haze.
                    </p>
                  </motion.div>

                  <motion.div variants={driftVariant} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-8 rounded-3xl dark-card-hover group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Wind className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#FAF9F6] mb-3">Methane Reduction</h3>
                    <p className="text-xs text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Our pyrolysis pathway limits the decomposition of unmanaged biomass, directly mitigating the risk of methane release.
                    </p>
                  </motion.div>

                  <motion.div variants={blurFadeVariant} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-8 rounded-3xl dark-card-hover group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#FAF9F6] mb-3">Soil Carbon Pathway</h3>
                    <p className="text-xs text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Validating the capacity for biochar to lock stable carbon into the soil while simultaneously improving water and nutrient retention.
                    </p>
                  </motion.div>

                  <motion.div variants={driftVariant} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-8 rounded-3xl dark-card-hover group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Trees className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#FAF9F6] mb-3">Reduced Forest Pressure</h3>
                    <p className="text-xs text-[#FAF9F6]/70 font-sans leading-relaxed">
                      WAQID's briquettes are designed as a direct, forest-friendly alternative to traditional wood-based charcoal, reducing deforestation pressure.
                    </p>
                  </motion.div>

                  <motion.div variants={blurFadeVariant} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-8 rounded-3xl dark-card-hover group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Wind className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#FAF9F6] mb-3">Cleaner Local Air</h3>
                    <p className="text-xs text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Offers communities a smokeless alternative to open burning and traditional charcoal, improving local air quality.
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Re-open max-w-7xl container for stats */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* PILOT TARGET STATS */}
          <div className="text-center mb-8 mt-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] text-[10px] font-sans font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              V3 Pilot Targets — Not Yet Achieved
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 card-hover relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20">
                <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Target</span>
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Residue Diversion</span>
              <h3 className="text-4xl font-serif font-bold text-[#0C1D13] mt-4 mb-1"><Counter value="15000" /> <span className="text-xl font-sans font-normal text-[#0C1D13]/50">kg</span></h3>
              <p className="font-bold text-[#0C1D13] mb-4 text-sm">Palm Waste to Divert</p>
              <p className="text-xs text-[#0C1D13]/60 font-sans leading-relaxed">Our first V3 pilot aims to divert 15,000 kg of palm waste from burning or decomposition.</p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 card-hover relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20">
                <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Target</span>
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Soil Hydrology</span>
              <h3 className="text-4xl font-serif font-bold text-[#0C1D13] mt-4 mb-1">~ <Counter value="18" suffix=" %" /> <span className="text-xl font-sans font-normal text-[#0C1D13]/50">gain</span></h3>
              <p className="font-bold text-[#0C1D13] mb-4 text-sm">Water Retention Goal</p>
              <p className="text-xs text-[#0C1D13]/60 font-sans leading-relaxed">We aim to improve soil water retention by approximately 18% based on established agronomic data and our early lab results.</p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 card-hover relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20">
                <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Target</span>
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Carbon Sequestration</span>
              <h3 className="text-4xl font-serif font-bold text-[#0C1D13] mt-4 mb-1">~ <Counter value="10" /> <span className="text-xl font-sans font-normal text-[#0C1D13]/50">tonnes</span></h3>
              <p className="font-bold text-[#0C1D13] mb-4 text-sm">CO2e to Sequester</p>
              <p className="text-xs text-[#0C1D13]/60 font-sans leading-relaxed">Targeting ~10 tonnes of CO2e sequestered through biochar soil application in our upcoming V3 pilot.</p>
            </motion.div>
          </div>
        </div>


      </motion.section>

      {/* 6. COMMUNITY IMPACT */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="community" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end mb-16">
            <div className="md:col-span-8">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                Who Benefits
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3 leading-tight">
                Community Impact
              </h2>
            </div>
            <div className="md:col-span-4">
              <p className="text-sm text-[#0C1D13]/80 font-sans leading-relaxed border-l-2 border-[#2E7D32] pl-4">
                WAQID is not only reducing waste. It is helping communities turn a local burden into soil health, cleaner fuel, and economic value.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col md:flex-row gap-6 items-start group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-2">Smallholder Farmers</h4>
                <p className="text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                  They face tired soil, fertilizer dependency, and rising input costs. WAQID provides locally produced biochar amendments to restore their land.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col md:flex-row gap-6 items-start group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-2">Local Food & Heat Businesses</h4>
                <p className="text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                  Satay vendors, grill houses, and small industries need cleaner fuel. We offer a smokeless, sustainable alternative to wood charcoal.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col md:flex-row gap-6 items-start group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Factory className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-2">Palm Mills & Cooperatives</h4>
                <p className="text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                  They need practical, decentralized waste-management solutions to handle daily biomass output without resorting to open burning.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#152E1E] p-8 rounded-3xl border border-[#2E7D32]/30 shadow-lg flex flex-col md:flex-row gap-6 items-start group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50] shrink-0 border border-[#4CAF50]/30 shadow-inner group-hover:scale-105 transition-transform">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-2">Rural Communities</h4>
                <p className="text-sm text-[#FAF9F6]/80 font-sans leading-relaxed">
                  They benefit from cleaner waste handling, locally manufactured products, and the circular economic value created directly in their district.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 7. WHAT WE MUST PROVE NEXT */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="assumptions" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Prototype to Pilot
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              What We Must Prove Next
            </h2>
            <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans mt-4 leading-relaxed">
              We have defined our prototype roadmap. Now, we are raising funds to build the V3 Pilot and validate these core assumptions in the field.
            </p>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/20 shadow-sm border-t-4 border-t-[#2E7D32]">
              <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-3">Technical Assumption</h4>
              <p className="text-sm text-[#0C1D13]/80 font-sans leading-relaxed font-bold mb-2">
                Can the TLUD kiln produce consistent biochar and briquettes?
              </p>
              <p className="text-xs text-[#0C1D13]/70 font-sans leading-relaxed">
                We must validate the continuous throughput and yield ratios of the V3 reactor under real-world mill conditions.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/20 shadow-sm border-t-4 border-t-[#4CAF50]">
              <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-3">User Assumption</h4>
              <p className="text-sm text-[#0C1D13]/80 font-sans leading-relaxed font-bold mb-2">
                Will farmers easily adopt pelletized biochar?
              </p>
              <p className="text-xs text-[#0C1D13]/70 font-sans leading-relaxed">
                We must test our 3-6mm granular formulation in the field to ensure it fits existing farming practices without friction.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/20 shadow-sm border-t-4 border-t-[#2E7D32]">
              <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-3">Value Assumption</h4>
              <p className="text-sm text-[#0C1D13]/80 font-sans leading-relaxed font-bold mb-2">
                Will businesses switch to smokeless sustainable charcoal?
              </p>
              <p className="text-xs text-[#0C1D13]/70 font-sans leading-relaxed">
                We must validate the burn-time and heat profile of our briquettes with early adopter grill houses and hospitality users.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#152E1E] p-8 rounded-3xl border border-[#4CAF50]/30 shadow-lg border-t-4 border-t-[#4CAF50] relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#4CAF50]/20 border border-[#4CAF50]/30">
                <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Validated</span>
              </div>
              <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-3">Scientific Validation</h4>
              <p className="text-sm text-[#FAF9F6] font-sans leading-relaxed font-bold mb-2">
                Can biochar measurably improve water and nutrient retention?
              </p>
              <p className="text-xs text-[#FAF9F6]/70 font-sans leading-relaxed">
                We have already conducted lab testing and established farmer demo plots that confirm biochar mixed with compost improves soil health. These early results validate our core hypothesis and provide the foundation for scaling our V3 pilot.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 8. TRACTION GALLERY */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="traction" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Traction</span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">Built in the Dirt</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <motion.div variants={fadeUpVariant} className="rounded-3xl overflow-hidden border border-[#2E7D32]/20 shadow-lg relative group aspect-[4/3]">
              <img src="/images/v1-pyrolysis-unit.jpg" alt="V1 Pyrolysis Unit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0C1D13] to-transparent p-6 pt-20 text-left">
                <h4 className="text-[#FAF9F6] font-display font-bold text-xl">V1 Pyrolysis Unit</h4>
                <p className="text-[#FAF9F6]/80 text-sm font-sans mt-1">Manual oil drum TLUD reactor tested in Perak.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="rounded-3xl overflow-hidden border border-[#2E7D32]/20 shadow-lg relative group aspect-[4/3]">
              <img src="/images/v3-reactor-real.jpg" alt="V3 Pyrolysis Reactor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0C1D13] to-transparent p-6 pt-20 text-left">
                <h4 className="text-[#FAF9F6] font-display font-bold text-xl">Mobile Biochar Pyrolysis</h4>
                <p className="text-[#FAF9F6]/80 text-sm font-sans mt-1">Semi-automated V3 Pilot Unit.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="rounded-3xl overflow-hidden border border-[#2E7D32]/20 shadow-lg relative group aspect-[4/3]">
              <img src="/images/organic-biochar.png" alt="Granular Pellets" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0C1D13] to-transparent p-6 pt-20 text-left">
                <h4 className="text-[#FAF9F6] font-display font-bold text-xl">Granular Pellets</h4>
                <p className="text-[#FAF9F6]/80 text-sm font-sans mt-1">3–6mm dust-free biochar-compost blend.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 9. WHAT FUNDING UNLOCKS */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="ask" className="bg-[#0C1D13] py-16 md:py-24 text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(46,125,50,0.15)_0%,transparent_60%)] pointer-events-none" />
        


        {/* Floating Sparks/Embers overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="ember animate-ember-2 left-[20%]" style={{ animationDelay: '2s', width: '2px', height: '2px' }} />
          <div className="ember animate-ember-1 left-[40%]" style={{ animationDelay: '0s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-3 left-[60%]" style={{ animationDelay: '4s', width: '4px', height: '4px' }} />
          <div className="ember animate-ember-1 left-[80%]" style={{ animationDelay: '1s', width: '3px', height: '3px' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-4">
              INVESTMENT & PARTNERSHIPS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[#FAF9F6] leading-tight mb-6">
              Current Ask: Raising $30k to build our V3 pilot reactor and secure strategic palm mill and farm partnerships across Malaysia.
            </h2>
            <p className="text-base md:text-lg text-[#FAF9F6]/60 font-sans leading-relaxed max-w-4xl mx-auto">
              We are syndicating seed capital and strategic partnerships to validate, manufacture, and deploy our first decentralized pyrolysis pilot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <div className="bg-[#152E1E] p-8 rounded-3xl border border-[#2E7D32]/30 shadow-lg">
              <h4 className="text-[#4CAF50] font-sans font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                <Coins className="w-5 h-5" /> Use of Funds ($30k)
              </h4>
              <ul className="space-y-4">
                {[
                  "Technical fabricator", 
                  "TLUD kiln fabrication", 
                  "Storage and operating space", 
                  "Biomass transport", 
                  "Lab testing", 
                  "Farmer demo plots", 
                  "Pelletization testing", 
                  "Pilot operations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#FAF9F6]/90 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#152E1E] p-8 rounded-3xl border border-[#2E7D32]/30 shadow-lg">
              <h4 className="text-[#4CAF50] font-sans font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                <Activity className="w-5 h-5" /> Measurable Milestones
              </h4>
              <ul className="space-y-4">
                {[
                  "Build and test V3 TLUD pilot unit", 
                  "Process first batches of palm waste and rice husks", 
                  "Produce test biochar and briquettes", 
                  "Run farmer demo plots", 
                  "Test biochar quality in lab", 
                  "Validate pellet usability", 
                  "Collect early adopter feedback", 
                  "Prepare investor and partner pilot report"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#FAF9F6]/90 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => handleTrackSelect("Investor / Pitch Deck Request")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-sm transition-colors border border-[#2E7D32]/20 shadow-lg"
            >
              Request Pitch Deck <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>


      </motion.section>

      {/* 10. SCALABLE REVENUE MODEL */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="revenue" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Future Economics
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              Scalable Revenue Model
            </h2>
            <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans mt-4 leading-relaxed">
              Once validated, WAQID will transition from a prototype project to a scalable venture with 3 clear revenue streams.
            </p>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6 mb-4" />
          </div>
        </div> {/* Close max-w-7xl */}

        {/* Full-bleed marquee */}
        <div className="w-full relative overflow-hidden my-4">
          <div className="marquee-container w-full max-w-[100vw]">
            <div className="marquee-content animate-marquee gap-8 items-stretch pr-8" style={{ animationDuration: '35s' }}>
              {[1, 2].map((iteration) => (
                <div key={iteration} className="flex gap-8 shrink-0">
                  <motion.div variants={driftVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Service Model</h4>
                    <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                      Palm oil mills can pay a recurring service fee to deploy decentralized pyrolysis units that address biomass disposal.
                    </p>
                  </motion.div>

                  <motion.div variants={popVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Biochar Pellets</h4>
                    <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                      WAQID will process and sell biochar soil restoring products to farmers, cooperatives, and agricultural partners.
                    </p>
                  </motion.div>

                  <motion.div variants={blurFadeVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                      <Hexagon className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Sustainable Briquettes</h4>
                    <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                      Revenue generated by selling smokeless solid fuels to local businesses as an alternative to wood charcoal.
                    </p>
                  </motion.div>

                  <motion.div variants={driftVariant} className="bg-[#152E1E] p-8 rounded-3xl border border-[#4CAF50]/40 shadow-xl dark-card-hover w-[85vw] sm:w-[320px] shrink-0 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ShieldCheck className="w-24 h-24 text-[#4CAF50]" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50] mb-6 border border-[#4CAF50]/30 shadow-inner relative z-10">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-3 relative z-10">Future Carbon Pathway</h4>
                    <p className="text-xs md:text-sm text-[#FAF9F6]/80 font-sans leading-relaxed relative z-10">
                      Once pilot validation and LCAs are complete, WAQID aims to access verified carbon removal markets to unlock further value.
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 11. TEAM & ADVISORS */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="team" className="bg-[#0C1D13] py-16 md:py-24 text-left text-[#FAF9F6] relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#2E7D32]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4CAF50]/5 rounded-full blur-[120px] pointer-events-none" />



        {/* Floating Sparks/Embers overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="ember animate-ember-3 left-[15%]" style={{ animationDelay: '3s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-1 left-[30%]" style={{ animationDelay: '1s', width: '2px', height: '2px' }} />
          <div className="ember animate-ember-2 left-[55%]" style={{ animationDelay: '5s', width: '4px', height: '4px' }} />
          <div className="ember animate-ember-1 left-[75%]" style={{ animationDelay: '2s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-2 left-[90%]" style={{ animationDelay: '7s', width: '2px', height: '2px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50]">
              Team & Advisors
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] mt-3">
              Built on Field Expertise
            </h2>
            <div className="w-12 h-[1px] bg-[#4CAF50] mx-auto mt-6 mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Osama M. Abuagla - Founder */}
            <motion.div variants={fadeUpVariant} className="bg-[#1E2229] p-8 rounded-3xl border border-[#2E7D32]/15 text-center group dark-card-hover flex flex-col items-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#2E7D32]/15 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10">
                <img src="/images/founder.jpg" alt="Osama M. Abuagla" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Osama M. Abuagla</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Founder</p>
              <p className="text-sm text-[#FAF9F6]/75 leading-relaxed px-2 relative z-10">Built the V1 and V2 manual reactors. Driving WAQID's vision to scale circular field systems.</p>
            </motion.div>

            {/* Tim Asquith - Strategic Advisor */}
            <motion.div variants={fadeUpVariant} className="bg-[#1E2229] p-8 rounded-3xl border border-[#2E7D32]/15 text-center group dark-card-hover flex flex-col items-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#2E7D32]/15 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10">
                <img src="/images/tim-asquith.png" alt="Tim Asquith" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Tim Asquith</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Strategic Advisor</p>
              <p className="text-sm text-[#FAF9F6]/75 leading-relaxed px-2 relative z-10">Providing commercial scaling insights, global agricultural advisory, and critical validation strategies for decentralized deployment.</p>
            </motion.div>

            {/* Joyce Zhang - Venture Coach */}
            <motion.div variants={fadeUpVariant} className="bg-[#1E2229] p-8 rounded-3xl border border-[#2E7D32]/15 text-center group dark-card-hover flex flex-col items-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#2E7D32]/15 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10">
                <img src="/images/joyce.jpg" alt="Joyce Zhang" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Joyce Zhang</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Venture Coach</p>
              <p className="text-sm text-[#FAF9F6]/75 leading-relaxed px-2 relative z-10">Guided WAQID in prototyping and designing with community.</p>
            </motion.div>

            {/* Join the Movement - Call to Action */}
            <motion.div 
              variants={fadeUpVariant} 
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} 
              className="bg-[#152E1E] p-8 rounded-3xl border border-[#4CAF50]/30 border-dashed text-center dark-card-hover flex flex-col items-center justify-center cursor-pointer hover:bg-[#1E2229] transition-all duration-300 relative overflow-hidden group shadow-xl"
            >
              <div className="w-24 h-24 rounded-full border-2 border-[#4CAF50]/50 border-dashed mb-6 flex items-center justify-center bg-[#0C1D13] group-hover:scale-105 transition-transform duration-500">
                <span className="text-[#4CAF50] font-display text-3xl font-bold group-hover:scale-110 transition-transform">+</span>
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Join The Movement</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Partners & Team</p>
              <p className="text-sm text-[#FAF9F6]/70 leading-relaxed px-2 relative z-10">
                We are actively seeking early adopter mills, research collaborators, and catalytic capital to scale our pilot.
              </p>
            </motion.div>
          </div>
        </div>


      </motion.section>

      {/* 12. FAQ & FORM */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="contact" className="bg-[#FAF9F6] py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          
          {/* FAQ Section */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                Knowledge Base
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`border ${activeFaq === index ? 'border-[#2E7D32]/30 bg-[#F0EFEA]' : 'border-[#0C1D13]/10 bg-transparent'} rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="font-display font-bold text-[#0C1D13] pr-4">{item.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#2E7D32] shrink-0 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-sm text-[#0C1D13]/75 font-sans leading-relaxed border-t border-[#2E7D32]/10 pt-4">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#F0EFEA] rounded-[2rem] p-8 md:p-12 border border-[#2E7D32]/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CAF50]/10 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-2xl font-display font-black text-[#0C1D13] mb-2 relative z-10">Partner With Us to Scale the Impact</h3>
            <p className="text-sm text-[#0C1D13]/70 font-sans mb-8 relative z-10">Waqid is seeking early-stage partners, agronomic advisors, and catalytic capital to move from prototype to pilot deployment and maintain our vital field research. Join us in building the infrastructure for a regenerative future.</p>
            
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-5 relative z-10">
              <input type="hidden" name="access_key" value="091c7841-f761-469b-980b-8d0afcceea0b" />
              <input type="hidden" name="subject" value="New WAQID Partnership Inquiry" />
              <input type="hidden" name="from_name" value="WAQID Website" />
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  required
                  className="w-full bg-[#FAF9F6] border border-[#2E7D32]/20 text-[#0C1D13] px-4 py-3.5 rounded-xl text-sm font-sans placeholder:text-[#0C1D13]/40 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors"
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email" 
                  required
                  className="w-full bg-[#FAF9F6] border border-[#2E7D32]/20 text-[#0C1D13] px-4 py-3.5 rounded-xl text-sm font-sans placeholder:text-[#0C1D13]/40 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors"
                />
                <input 
                  type="text" 
                  name="organization" 
                  placeholder="Organization / Fund Name" 
                  required
                  className="w-full bg-[#FAF9F6] border border-[#2E7D32]/20 text-[#0C1D13] px-4 py-3.5 rounded-xl text-sm font-sans placeholder:text-[#0C1D13]/40 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors"
                />
                <select 
                  name="interest"
                  id="partner-track"
                  required
                  className="w-full bg-[#FAF9F6] border border-[#2E7D32]/20 text-[#0C1D13] px-4 py-3.5 rounded-xl text-sm font-sans focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Select Track</option>
                  <option value="Investor / Pitch Deck Request">Investor / Pitch Deck Request</option>
                  <option value="Strategic Partner">Strategic Partner</option>
                  <option value="Mill Operator">Mill Operator</option>
                  <option value="Farm Cooperative">Farm Cooperative</option>
                  <option value="Other">Other</option>
                </select>
                <textarea 
                  name="message" 
                  placeholder="Tell us about your interest in WAQID..." 
                  rows="3"
                  className="w-full bg-[#FAF9F6] border border-[#2E7D32]/20 text-[#0C1D13] px-4 py-3.5 rounded-xl text-sm font-sans placeholder:text-[#0C1D13]/40 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors resize-none"
                ></textarea>
              </div>

              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <button 
                type="submit" 
                className="w-full bg-[#152E1E] hover:bg-[#2E7D32] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mt-4"
              >
                Submit Inquiry <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-[#0C1D13] text-[#FAF9F6] pt-16 pb-12 border-t border-[#2E7D32]/20 relative overflow-hidden">

        {/* Soft background green glow */}
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#2E7D32]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Logo and Description (5 columns) */}
            <div className="lg:col-span-5 flex flex-col items-start gap-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-left cursor-pointer focus:outline-none"
              >
                <img 
                  src="/images/waqid-logo-transparent.png" 
                  alt="WAQID Logo" 
                  className="h-10 w-auto object-contain opacity-90"
                />
              </button>
              <p className="text-[#FAF9F6]/60 text-xs max-w-sm font-sans mt-2 leading-relaxed">
                A circular system converting agricultural palm waste into affordable, soil-restoring biochar for smallholder farmers.
              </p>
              <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#4CAF50] mt-2 block">
                Circular Solutions for Soil and Energy.
              </span>
              <div className="flex gap-4 text-xs font-sans text-[#FAF9F6]/50 mt-1">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#4CAF50]" /> Malaysia</span>
                <a href="mailto:Abuaglho@gmail.com" className="flex items-center gap-1.5 hover:text-[#4CAF50] transition-colors"><Mail className="w-3.5 h-3.5 text-[#4CAF50]" /> Abuaglho@gmail.com</a>
              </div>
            </div>

            {/* Quick links (3 columns) */}
            <div className="lg:col-span-3 flex flex-col items-start gap-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#4CAF50] mb-2">
                Ecosystem
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-sans text-[#FAF9F6]/70">
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left hover:text-[#4CAF50] transition-colors cursor-pointer focus:outline-none">
                  Home
                </button>
                <button onClick={() => document.getElementById("crisis")?.scrollIntoView({ behavior: "smooth" })} className="text-left hover:text-[#4CAF50] transition-colors cursor-pointer focus:outline-none">
                  Crisis
                </button>
                <button onClick={() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" })} className="text-left hover:text-[#4CAF50] transition-colors cursor-pointer focus:outline-none">
                  Solution
                </button>
                <button onClick={() => document.getElementById("traction")?.scrollIntoView({ behavior: "smooth" })} className="text-left hover:text-[#4CAF50] transition-colors cursor-pointer focus:outline-none">
                  Field Trials
                </button>
                <button onClick={() => document.getElementById("impact")?.scrollIntoView({ behavior: "smooth" })} className="text-left hover:text-[#4CAF50] transition-colors cursor-pointer col-span-2 focus:outline-none">
                  Measurable Impact
                </button>
              </div>
            </div>

            {/* Operational Credentials (4 columns) */}
            <div className="lg:col-span-4 flex flex-col items-start gap-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#4CAF50] mb-2">
                Operations
              </h4>
              <div className="border border-[#2E7D32]/30 rounded-2xl p-6 bg-[#0C1D13] w-full max-w-sm">
                <h5 className="font-display font-bold text-sm text-[#FAF9F6] mb-2">Cooperative Program: Wild Asia</h5>
                <p className="text-xs text-[#FAF9F6]/60 font-sans leading-relaxed">
                  Confirmed collaboration on decentralized pyrolysis reactor diagnostics and agronomic field validation.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="mt-12 pt-8 border-t border-[#2E7D32]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-xs text-[#FAF9F6]/40 font-sans text-center md:text-left">
              &copy; 2026 Waqid. All rights reserved.
            </p>
            <p className="text-[10px] text-[#FAF9F6]/30 max-w-xl font-sans text-center md:text-right leading-relaxed">
              All statistics cited are sourced directly from peer-reviewed scientific databases, Malaysian Palm Oil Board reports, and Wild Asia farm interview registries (2024–2026).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
