import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { 
  Award, ArrowUpRight, Factory, Flame, Leaf, ChevronRight, 
  HelpCircle, ChevronDown, ChevronUp, Mail, MapPin, Calendar, 
  Users, Send, ShieldCheck, Zap, Sparkles, ArrowRight, Menu, X, BookOpen,
  Globe, Droplets, Hexagon, RotateCw, Activity, Target, TestTube, Coins, PlayCircle, Sprout, HandHeart, CheckCircle2
} from "lucide-react";
import Counter from "./components/Counter";
import ScrollToTop from "./components/ScrollToTop";
import { Link } from "react-router-dom";

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    role: "",
    message: "",
    source: ""
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  // --- Animation System ---
  const fadeUpVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };
  
  const sectionReveal = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  };

  const blurFadeVariant = {
    hidden: { opacity: 0, filter: "blur(10px)", y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)", 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const popVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, type: "spring", stiffness: 100 }
    }
  };

  const driftVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  // ------------------------

  // --- JS Auto-Carousel Engine ---
  useEffect(() => {
    const containers = document.querySelectorAll('.marquee-container');
    if (!containers.length) return;

    const states = Array.from(containers).map(container => ({
      el: container,
      isPaused: false,
      isDragging: false,
      exactScrollLeft: container.scrollLeft // Safari Subpixel Bypass
    }));

    states.forEach(state => {
      const handleEnter = () => state.isPaused = true;
      const handleLeave = () => state.isPaused = false;
      const handleTouchStart = () => state.isDragging = true;
      const handleTouchEnd = () => {
        setTimeout(() => { 
          state.isDragging = false; 
          state.isPaused = false; 
        }, 800);
      };
      
      state.el.addEventListener('mouseenter', handleEnter);
      state.el.addEventListener('mouseleave', handleLeave);
      state.el.addEventListener('touchstart', handleTouchStart, { passive: true });
      state.el.addEventListener('touchend', handleTouchEnd);
      state.el.addEventListener('touchcancel', handleTouchEnd);
      
      state.cleanup = () => {
        state.el.removeEventListener('mouseenter', handleEnter);
        state.el.removeEventListener('mouseleave', handleLeave);
        state.el.removeEventListener('touchstart', handleTouchStart);
        state.el.removeEventListener('touchend', handleTouchEnd);
        state.el.removeEventListener('touchcancel', handleTouchEnd);
      };
    });

    let animationFrameId;
    let lastTime = performance.now();
    const speed = 1.5; 

    const scroll = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      states.forEach(state => {
        if (!state.isPaused && !state.isDragging) {
          state.exactScrollLeft += speed * (deltaTime / 16);
          if (state.exactScrollLeft >= state.el.scrollWidth / 2) {
            state.exactScrollLeft -= state.el.scrollWidth / 2;
          }
          state.el.scrollLeft = Math.floor(state.exactScrollLeft);
        } else {
          state.exactScrollLeft = state.el.scrollLeft;
        }
      });
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      states.forEach(state => state.cleanup());
    };
  }, []);
  
  // Parallax transform for hero background
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "eabe6c61-3923-400f-98b6-8964a51a06e4",
          from_name: formData.name,
          subject: `New Waqid Partner Inquiry from ${formData.name}`,
          Name: formData.name,
          Email: formData.email,
          Organization: formData.org || "Not provided",
          Role: formData.role,
          Message: formData.message
        })
      });
      
      if (response.ok) {
        setFormSubmitted(true);
        setFormData({ name: "", email: "", org: "", role: "", message: "", source: "" });
      } else {
        throw new Error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      setSubmitError(error.message || "An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSelect = (roleValue) => {
    setFormData((prev) => ({ ...prev, role: roleValue }));
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  };

  const faqItems = [
    { q: "What stage is WAQID at?", a: "We are a prototype stage circular venture. Having successfully designed and tested early manual burners and pelletised compost formulations, we are now preparing to manufacture our V3 pilot reactor." },
    { q: "What is biochar?", a: "Biochar is a highly stable form of carbon produced by heating agricultural biomass in an oxygen limited environment. It acts as a permanent sponge in the soil that retains moisture and hosts beneficial microbes." },
    { q: "What is TLUD pyrolysis?", a: "TLUD stands for Top Lit Updraft pyrolysis. It is a thermochemical process where biomass is ignited at the top with restricted air, forcing a pyrolysis front downward to convert volatile gases into clean thermal energy and leaving behind stable biochar." },
    { q: "Who does WAQID support?", a: "We support palm oil mills seeking circular waste management, and smallholder farmers needing affordable, locally produced soil restoration alternatives to expensive synthetic fertilizers." },
    { q: "How does WAQID create environmental impact?", a: "By intercepting unmanaged palm biomass, we prevent massive methane emissions from decay and open burning smoke, while permanently locking carbon into the soil via biochar." },
    { q: "How does WAQID support smallholder farmers?", a: "We provide affordable biochar compost pellets that improve soil health, retain moisture, and reduce long-term dependency on costly synthetic inputs." },
    { q: "How can I partner with WAQID?", a: "We are looking for strategic partners for our pilot phase, including funding partners, palm mill operators, and agronomic advisors. Please use the contact form to get in touch." },
    { q: "What does the $30k funding support?", a: "This seed capital directly funds the manufacturing of our V3 pilot reactor, field testing, transport, and initial biochar validation with local farm partners." }
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#0C1D13] antialiased font-sans">
      <ScrollToTop />
      
      {/* 1. STICKY STYLISH NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-[#152E1E]/95 border-[#2E7D32]/20 py-4 shadow-lg backdrop-blur-md"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center group">
            <img 
              src="/images/waqid-logo-transparent.png" 
              alt="Waqid" 
              className="w-[160px] md:w-[220px] h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {["Crisis", "Solution", "Impact", "Pilot", "Roadmap", "Team"].map((section) => (
              <button
                key={section}
                onClick={() => {
                  const target = section.toLowerCase();
                  document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="nav-link text-xs font-sans font-bold uppercase tracking-widest text-[#FAF9F6]/80 hover:text-[#4CAF50] transition-colors cursor-pointer pb-1"
              >
                {section}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              onClick={() => handleTrackSelect("Strategic Partner")}
              className="btn-hover-shadow inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#2E7D32] text-[#FAF9F6] text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#4CAF50] hover:text-[#0C1D13] border border-[#2E7D32]/20 shadow-md"
            >
              Partner With Us
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#FAF9F6] hover:text-[#4CAF50] transition-colors p-1"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-[#0C1D13] pt-28 pb-12 px-8 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6">
              {["Crisis", "Solution", "Impact", "Pilot", "Roadmap", "Team"].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.getElementById(section.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xl font-display font-bold text-[#FAF9F6] text-left hover:text-[#4CAF50] transition-colors"
                >
                  {section}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleTrackSelect("Strategic Partner");
                }}
                className="w-full py-4 rounded-xl bg-[#2E7D32] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-center"
              >
                Partner With Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative h-screen sm:h-[90vh] md:h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#0C1D13] text-[#FAF9F6] border-b border-[#2E7D32]/10">
        <div 
          className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 hidden md:block"
          style={{ background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(76, 175, 80, 0.08), transparent 40%)` }}
        />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0 pointer-events-none">
          <motion.img 
            initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1920" 
            alt="Tropical Malaysian Landscape Dawn" 
            className="w-full h-full object-cover opacity-15 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C1D13]/40 via-[#0C1D13]/90 to-[#0C1D13]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0C1D13_90%)]" />
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/35 text-[#4CAF50] text-[10px] font-sans font-bold uppercase tracking-widest mb-8 mt-12 sm:mt-0">
            <Leaf className="w-3.5 h-3.5" />
            <span>Prototype Stage Climate Venture</span>
          </motion.div>

          <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight leading-[1.05] text-[#FAF9F6] text-balance">
            Restoring Land. <br />
            Closing the Loop. <br />
            <span className="text-[#4CAF50]">Cooling the Planet.</span>
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="mt-6 text-[#FAF9F6]/75 font-sans text-base md:text-xl max-w-2xl leading-relaxed text-balance">
            WAQID is developing decentralized biochar and clean heat infrastructure that turns palm biomass waste into soil restoration, energy value, and climate impact for farming communities.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
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
        </motion.div>
      </section>

      {/* 2. THE CRISIS */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="crisis" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-end">
            <div className="lg:col-span-8">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                The Crisis
              </span>
              <h2 className="text-3xl md:text-6xl font-display font-black text-[#0C1D13] leading-tight mt-3 text-balance">
                Three quiet crises.<br />One broken loop.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans leading-relaxed text-balance">
                Palm biomass waste, rising input costs, and soil degradation are connected by one system failure: valuable agricultural residues are treated as waste while farmers pay more to restore declining soils.
              </p>
            </div>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#0C1D13]/10">
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-1">01. Environmental</span>
              <span className="text-4xl md:text-6xl font-display font-extrabold text-[#2E7D32] flex items-baseline gap-1">
                <Counter value="80" />M+
              </span>
              <p className="text-xs md:text-sm text-[#0C1D13]/80 font-sans leading-relaxed mt-2">
                <strong>tonnes</strong> of palm biomass generated annually in Malaysia.
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-1">02. Waste</span>
              <span className="text-4xl md:text-6xl font-display font-extrabold text-[#2E7D32] flex items-baseline gap-1">
                <Counter value="20-22" />M
              </span>
              <p className="text-xs md:text-sm text-[#0C1D13]/80 font-sans leading-relaxed mt-2">
                <strong>tonnes</strong> of Empty Fruit Bunches left unmanaged or burned each year.
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-1">03. Climate</span>
              <span className="text-4xl md:text-6xl font-display font-extrabold text-[#2E7D32] flex items-baseline gap-1">
                <Counter value="34" />x
              </span>
              <p className="text-xs md:text-sm text-[#0C1D13]/80 font-sans leading-relaxed mt-2">
                Methane has <strong>34x</strong> the warming power of CO2 over a 100-year period.
              </p>
            </motion.div>
          </motion.div>

          <div className="mt-16 bg-[#F0EFEA] p-8 rounded-2xl border border-[#2E7D32]/10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="max-w-3xl">
              <h5 className="font-display font-bold text-lg text-[#0C1D13] mb-1">
                The Debt Trap & The Logic Gap
              </h5>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Farmers spend heavily on synthetic inputs while valuable biomass is wasted. WAQID closes this loop by converting residues into soil restoring biochar and clean heat.
              </p>
            </div>
            <button 
              onClick={() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" })}
              className="flex-shrink-0 px-6 py-3 bg-[#152E1E] hover:bg-[#2E7D32] text-[#FAF9F6] text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              See Our Solution
            </button>
          </div>
        </div>
      </motion.section>

      {/* 3. THE WAQID SOLUTION */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="solution" className="bg-[#F0EFEA] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              The WAQID Solution
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3 leading-tight">
              A Circular System for Waste, Energy, Soil, and Communities
            </h2>
            <p className="text-sm text-[#0C1D13]/70 font-sans mt-4 leading-relaxed font-bold">
              Palm biomass waste → Decentralized pyrolysis → Clean heat + biochar + future carbon value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E]/5 flex items-center justify-center text-[#2E7D32] mb-6 border border-[#2E7D32]/10">
                <RotateCw className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Waste Recovery</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Converts unmanaged palm biomass into useful outputs instead of burning or decomposition.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E]/5 flex items-center justify-center text-[#2E7D32] mb-6 border border-[#2E7D32]/10">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Clean Heat</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Produces thermal energy that can support mill or local operations.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E]/5 flex items-center justify-center text-[#2E7D32] mb-6 border border-[#2E7D32]/10">
                <Sprout className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Soil Restoration</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Creates biochar based soil products designed to improve soil health and reduce input dependency.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E]/5 flex items-center justify-center text-[#2E7D32] mb-6 border border-[#2E7D32]/10">
                <HandHeart className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Community Resilience</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Supports smallholder farmers through more affordable, circular, and locally relevant soil restoration pathways.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 4. ENVIRONMENTAL & SOCIAL IMPACT */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="impact" className="bg-[#0C1D13] py-16 md:py-24 relative overflow-hidden border-b border-[#2E7D32]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,transparent_40%,#152E1E_100%)] pointer-events-none opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-3">
              Impact Beyond Carbon
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] leading-tight">
              WAQID is designed to create environmental value while supporting the farmers and communities closest to the problem.
            </h2>
            <div className="w-12 h-[1px] bg-[#4CAF50] mt-8 mb-4" />
          </div>

          <div className="marquee-container w-full max-w-[100vw]">
            <div className="marquee-content gap-8 items-stretch pr-8" style={{ animationDuration: '40s' }}>
              {[1, 2].map((iteration) => (
                <div key={iteration} className="flex gap-8 shrink-0">
                  <motion.div variants={popVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-10 rounded-3xl hover:bg-[#152E1E] transition-colors duration-500 group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform duration-500">
                      <Globe className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-[#FAF9F6] mb-4">Climate Impact</h3>
                    <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Reduces emissions from unmanaged biomass while creating a pathway toward durable carbon removal through biochar.
                    </p>
                  </motion.div>

                  <motion.div variants={driftVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-10 rounded-3xl hover:bg-[#152E1E] transition-colors duration-500 group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform duration-500">
                      <Leaf className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-[#FAF9F6] mb-4">Soil Health</h3>
                    <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Supports degraded soils by returning stable carbon rich material back into agricultural systems.
                    </p>
                  </motion.div>

                  <motion.div variants={blurFadeVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-10 rounded-3xl hover:bg-[#152E1E] transition-colors duration-500 group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform duration-500">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-[#FAF9F6] mb-4">Farmer Resilience</h3>
                    <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Helps reduce dependence on costly synthetic inputs by developing locally produced soil restoration alternatives.
                    </p>
                  </motion.div>

                  <motion.div variants={driftVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-10 rounded-3xl hover:bg-[#152E1E] transition-colors duration-500 group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform duration-500">
                      <RotateCw className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-[#FAF9F6] mb-4">Rural Circular Economy</h3>
                    <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Keeps value closer to palm mill and farming communities by turning waste into useful local products.
                    </p>
                  </motion.div>

                  <motion.div variants={blurFadeVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-10 rounded-3xl hover:bg-[#152E1E] transition-colors duration-500 group w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform duration-500">
                      <Factory className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-[#FAF9F6] mb-4">Cleaner Waste Management</h3>
                    <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                      Offers palm mills and communities a practical alternative to open burning, unmanaged decomposition, and disposal pressure.
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. PROTOTYPE TO PILOT */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="pilot" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Current Stage
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              From Prototype to Pilot Deployment
            </h2>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6 mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <span className="text-3xl font-display font-bold text-[#2E7D32]/30 mb-4 block">01</span>
              <h4 className="font-display font-bold text-lg text-[#0C1D13] mb-3">Prototype Stage</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                WAQID has developed its early system concept and prototype direction for decentralized biochar production.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#152E1E] p-8 rounded-3xl border border-[#2E7D32]/30 shadow-lg flex flex-col card-hover transform md:-translate-y-4">
              <span className="text-3xl font-display font-bold text-[#4CAF50]/40 mb-4 block">02</span>
              <h4 className="font-display font-bold text-lg text-[#FAF9F6] mb-3">V3 Pilot Reactor</h4>
              <p className="text-xs md:text-sm text-[#FAF9F6]/80 font-sans leading-relaxed">
                The next milestone is manufacturing and testing a pilot ready V3 reactor.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <span className="text-3xl font-display font-bold text-[#2E7D32]/30 mb-4 block">03</span>
              <h4 className="font-display font-bold text-lg text-[#0C1D13] mb-3">Field Validation</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                WAQID will validate biochar performance, farmer feedback, and operational fit with palm mill and farm partners.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col card-hover">
              <span className="text-3xl font-display font-bold text-[#2E7D32]/30 mb-4 block">04</span>
              <h4 className="font-display font-bold text-lg text-[#0C1D13] mb-3">Pilot to Scale</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Pilot results will guide future deployment, product refinement, and commercial partnerships.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 6. EVIDENCE LED DEVELOPMENT */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="evidence" className="bg-[#0C1D13] text-[#FAF9F6] py-16 md:py-24 text-left relative overflow-hidden border-b border-[#2E7D32]/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(46,125,50,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(46,125,50,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-xl mb-12">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50]">
              Field Validation & Evidence
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] leading-tight mt-3">
              Evidence-Led Development
            </h2>
            <p className="text-sm md:text-base text-[#FAF9F6]/70 font-sans mt-4 leading-relaxed">
              WAQID is building around field research, farmer feedback, technical advisory, and measurable biochar performance before commercial scale up.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
             {["Farmer Feedback", "Advisor Support", "Agronomic Testing", "Field Trial Roadmap", "Soil Performance Tracking", "Pilot Validation"].map(tag => (
               <div key={tag} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#152E1E] border border-[#2E7D32]/30 text-xs font-bold font-sans uppercase tracking-wider text-[#4CAF50]">
                 <CheckCircle2 className="w-3.5 h-3.5" />
                 {tag}
               </div>
             ))}
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 lg:pb-0 gap-6 mt-2 relative">
            <motion.div variants={driftVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-[85vw] sm:w-[400px] shrink-0 snap-center lg:w-auto lg:shrink bg-gradient-to-br from-[#1E2229]/95 to-[#121519]/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-[#FAF9F6]/5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-[#2E7D32]/20 to-transparent pointer-events-none rounded-bl-full blur-2xl" />
              <div className="absolute top-4 right-8 md:top-8 md:right-12">
                <span className="text-7xl md:text-8xl font-serif text-[#4CAF50] opacity-20 leading-none font-black drop-shadow-lg">“</span>
              </div>
              <div className="relative z-10 mt-6 md:mt-0">
                <p className="text-base md:text-lg text-[#FAF9F6]/95 font-serif font-medium leading-relaxed italic tracking-wide">
                  The soil needs more every year to produce less, and I know the chemicals are not sustainable. Testing with the Waqid team in the field showed me a real alternative. If these pellets can be produced at scale, they offer a highly practical path to restore our lands health without falling into debt.
                </p>
              </div>
              <div className="flex items-center gap-5 md:gap-6 mt-8 pt-6 border-t border-[#FAF9F6]/5 relative z-10">
                <img src="/images/farmer_ahmad.png" alt="Ahmad" style={{ width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' }} className="aspect-square shrink-0 rounded-full object-cover border-2 border-[#4CAF50] shadow-[0_0_15px_rgba(76,175,80,0.3)] grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div>
                  <h4 className="font-display font-bold text-lg md:text-xl text-[#FAF9F6] tracking-wide">Ahmad</h4>
                  <p className="text-xs md:text-sm text-[#4CAF50] font-sans font-medium mt-1">Smallholder Farmer, Kedah</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={blurFadeVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="w-[85vw] sm:w-[400px] shrink-0 snap-center lg:w-auto lg:shrink bg-gradient-to-br from-[#1E2229]/95 to-[#121519]/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-[#FAF9F6]/5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-[#2E7D32]/20 to-transparent pointer-events-none rounded-bl-full blur-2xl" />
              <div className="absolute top-4 right-8 md:top-8 md:right-12">
                <span className="text-7xl md:text-8xl font-serif text-[#4CAF50] opacity-20 leading-none font-black drop-shadow-lg">“</span>
              </div>
              <div className="relative z-10 mt-6 md:mt-0">
                <p className="text-base md:text-lg text-[#FAF9F6]/95 font-serif font-medium leading-relaxed italic tracking-wide">
                  Waqid combines ground level empathy with technical rigor. Their approach to closing the biomass loop directly at the mill and farm level is the exact pragmatic, farmer first innovation this region needs. It is a privilege to support a venture so committed to scalable operations.
                </p>
              </div>
              <div className="flex items-center gap-5 md:gap-6 mt-8 pt-6 border-t border-[#FAF9F6]/5 relative z-10">
                <img src="/images/tim-asquith.png" alt="Tim Asquith" style={{ width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' }} className="aspect-square shrink-0 rounded-full object-cover border-2 border-[#4CAF50] shadow-[0_0_15px_rgba(76,175,80,0.3)] grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div>
                  <h4 className="font-display font-bold text-lg md:text-xl text-[#FAF9F6] tracking-wide">Tim Asquith</h4>
                  <p className="text-xs md:text-sm text-[#4CAF50] font-sans font-medium mt-1">Mentor and Strategic Advisor</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 7. SCALABLE REVENUE MODEL */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="revenue" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Scalable Revenue Model
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              Building for Commercial Scale
            </h2>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6 mb-4" />
          </div>

          <div className="marquee-container w-full max-w-[100vw]">
            <div className="marquee-content gap-8 items-stretch pr-8" style={{ animationDuration: '35s' }}>
              {[1, 2].map((iteration) => (
                <div key={iteration} className="flex gap-8 shrink-0">
                  <motion.div variants={driftVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Hardware & Clean Energy</h4>
                    <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                      Palm oil mills can pay a recurring service fee to deploy decentralized pyrolysis units that help address biomass disposal while generating useful thermal energy.
                    </p>
                  </motion.div>

                  <motion.div variants={popVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Biochar Distribution</h4>
                    <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                      WAQID will process biochar into soil restoring products for farmers, cooperatives, and agricultural partners.
                    </p>
                  </motion.div>

                  <motion.div variants={blurFadeVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover w-[85vw] sm:w-[320px] shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                      <Hexagon className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Solid Fuels & Carbon Pathway</h4>
                    <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                      Future revenue may come from sustainable briquettes and verified carbon removal credits as monitoring and validation systems mature.
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. PILOT ROADMAP */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="roadmap" className="bg-[#F0EFEA] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Pilot Roadmap
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              The Path to Scale
            </h2>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6 mb-4" />
          </div>

          <div className="relative border-l-2 border-[#2E7D32]/20 pl-8 md:pl-12 max-w-3xl mx-auto">
            {[
              { title: "Prototype Refinement", desc: "Iterating on manual V1/V2 learnings." },
              { title: "V3 Reactor Manufacturing", desc: "Building the first semi-automated pilot unit.", active: true },
              { title: "Partner Onboarding", desc: "Securing palm mill and farm partnerships." },
              { title: "Field Testing & Validation", desc: "Validating biochar yield and soil performance." },
              { title: "Pilot Deployment", desc: "Operating the V3 reactor on-site." },
              { title: "Commercial Scale Up Pathway", desc: "Data driven expansion and product commercialization." }
            ].map((step, index) => (
              <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} key={index} className="mb-10 relative">
                <div className={`absolute -left-[41px] md:-left-[57px] w-4 h-4 rounded-full border-4 border-[#F0EFEA] ${step.active ? 'bg-[#4CAF50] shadow-[0_0_10px_rgba(76,175,80,0.5)]' : 'bg-[#2E7D32]/30'}`} />
                <h4 className={`font-display font-bold text-lg md:text-xl mb-1 ${step.active ? 'text-[#2E7D32]' : 'text-[#0C1D13]'}`}>{step.title}</h4>
                <p className="text-sm text-[#0C1D13]/70 font-sans">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 9. TEAM & ADVISORS */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="team" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Team & Advisors
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              Built on Field Expertise
            </h2>
            <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans mt-4 leading-relaxed">
              A lean founding team supported by venture, commercial, and field advisory expertise.
            </p>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6 mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-6 rounded-3xl border border-[#2E7D32]/10 text-center card-hover flex flex-col items-center">
              <img src="/images/shahir.jpeg" alt="Shahir" className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#2E7D32]/20" />
              <h4 className="font-display font-bold text-lg text-[#0C1D13]">Shahir</h4>
              <p className="text-xs text-[#2E7D32] font-bold uppercase tracking-wider mb-2">Founder</p>
              <p className="text-xs text-[#0C1D13]/70 leading-relaxed px-2">Driving prototype development and community engagement.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-6 rounded-3xl border border-[#2E7D32]/10 text-center card-hover flex flex-col items-center">
              <img src="/images/tim-asquith.png" alt="Tim Asquith" className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#2E7D32]/20" />
              <h4 className="font-display font-bold text-lg text-[#0C1D13]">Tim Asquith</h4>
              <p className="text-xs text-[#2E7D32] font-bold uppercase tracking-wider mb-2">Venture Coach</p>
              <p className="text-xs text-[#0C1D13]/70 leading-relaxed px-2">Strategic guidance and commercial scale up advisory.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#F0EFEA] p-6 rounded-3xl border border-[#2E7D32]/10 text-center card-hover flex flex-col items-center">
              <img src="/images/advisors.jpg" alt="Commercial Advisory" className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#2E7D32]/20" />
              <h4 className="font-display font-bold text-lg text-[#0C1D13]">Industry Experts</h4>
              <p className="text-xs text-[#2E7D32] font-bold uppercase tracking-wider mb-2">Advisory Network</p>
              <p className="text-xs text-[#0C1D13]/70 leading-relaxed px-2">Supporting WAQID with agronomy, engineering, and climate tech insights.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-[#152E1E] p-6 rounded-3xl border border-[#2E7D32]/30 text-center card-hover flex flex-col items-center justify-center">
              <TestTube className="w-12 h-12 text-[#4CAF50] mb-4" />
              <h4 className="font-display font-bold text-lg text-[#FAF9F6]">Research & Validation</h4>
              <p className="text-xs text-[#FAF9F6]/70 leading-relaxed mt-2 px-2">WAQID is building its pilot around field research, farmer feedback, and measurable biochar performance before commercial scale up.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 10. CURRENT ASK */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="ask" className="bg-[#0C1D13] py-16 md:py-24 border-b border-[#2E7D32]/20 text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(46,125,50,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2E7D32]/20 border border-[#2E7D32]/50 text-[#4CAF50] text-[10px] font-sans font-bold uppercase tracking-widest mb-6">
            <Target className="w-3.5 h-3.5" />
            Seed Funding Round
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] leading-tight mb-6">
            Current Ask: Raising $30k to build our V3 pilot reactor and secure strategic partnerships across Malaysia.
          </h2>
          <p className="text-base md:text-lg text-[#FAF9F6]/75 font-sans leading-relaxed max-w-3xl mx-auto mb-12">
            We are seeking seed capital, technical support, and field partnerships to manufacture, validate, and deploy WAQID's first decentralized pyrolysis pilot.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12 text-left">
            <div className="bg-[#152E1E] p-6 rounded-2xl border border-[#2E7D32]/30">
              <h4 className="text-[#4CAF50] font-sans font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                <Coins className="w-4 h-4" /> Use of Funds
              </h4>
              <ul className="space-y-3">
                {["Reactor manufacturing", "Materials and fabrication", "Field testing and transport"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#FAF9F6]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#152E1E] p-6 rounded-2xl border border-[#2E7D32]/30">
              <h4 className="text-[#4CAF50] font-sans font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Milestones
              </h4>
              <ul className="space-y-3">
                {["Biochar testing and validation", "Partner onboarding", "Pilot operations"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#FAF9F6]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => handleTrackSelect("Investor / Pitch Deck Request")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-sm transition-colors border border-[#2E7D32]/20 shadow-lg"
          >
            Request Pitch Deck <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </motion.section>

      {/* 11 & 12. FAQ & FORM */}
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
                    <span className="font-display font-bold text-base md:text-lg text-[#0C1D13] pr-4">{item.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${activeFaq === index ? 'bg-[#2E7D32] text-[#FAF9F6]' : 'bg-[#152E1E]/5 text-[#2E7D32]'}`}>
                      {activeFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="p-5 pt-0 text-sm text-[#0C1D13]/70 font-sans leading-relaxed border-t border-[#0C1D13]/5 mt-2">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-[#0C1D13] p-8 md:p-12 rounded-3xl shadow-xl border border-[#2E7D32]/20 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,125,50,0.1)_0%,transparent_50%)] pointer-events-none" />
            
            <div className="relative z-10 mb-8 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-display font-black text-[#FAF9F6] mb-2">Connect With Us</h3>
              <p className="text-sm text-[#FAF9F6]/60 font-sans">We are actively seeking pilot partners and seed funding.</p>
            </div>

            {formSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 bg-[#152E1E] border border-[#4CAF50]/30 rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-[#4CAF50]" />
                </div>
                <h4 className="text-xl font-display font-bold text-[#FAF9F6] mb-2">Inquiry Sent</h4>
                <p className="text-sm text-[#FAF9F6]/70">Thank you for reaching out. Our team will review your inquiry and get back to you shortly.</p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 text-xs text-[#4CAF50] uppercase tracking-wider font-bold hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="relative z-10 flex flex-col gap-4">
                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center">
                    {submitError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF9F6]/70">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-[#152E1E]/50 border border-[#2E7D32]/30 rounded-xl px-4 py-3 text-sm text-[#FAF9F6] placeholder-[#FAF9F6]/30 focus:outline-none focus:border-[#4CAF50] transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF9F6]/70">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-[#152E1E]/50 border border-[#2E7D32]/30 rounded-xl px-4 py-3 text-sm text-[#FAF9F6] placeholder-[#FAF9F6]/30 focus:outline-none focus:border-[#4CAF50] transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF9F6]/70">Organisation</label>
                    <input 
                      type="text" 
                      value={formData.org}
                      onChange={(e) => setFormData({...formData, org: e.target.value})}
                      className="bg-[#152E1E]/50 border border-[#2E7D32]/30 rounded-xl px-4 py-3 text-sm text-[#FAF9F6] placeholder-[#FAF9F6]/30 focus:outline-none focus:border-[#4CAF50] transition-colors"
                      placeholder="Company or Farm Name"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF9F6]/70">Partnership Track *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full bg-[#152E1E]/50 border border-[#2E7D32]/30 rounded-xl px-4 py-3 text-sm text-[#FAF9F6] appearance-none focus:outline-none focus:border-[#4CAF50] transition-colors"
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="Investor / Pitch Deck Request">Investor / Pitch Deck Request</option>
                        <option value="Palm Oil Mill Partner">Palm Oil Mill Partner</option>
                        <option value="Farm / Cooperative Partner">Farm / Cooperative Partner</option>
                        <option value="Agronomy Advisor">Agronomy Advisor</option>
                        <option value="Engineering / Technical Partner">Engineering / Technical Partner</option>
                        <option value="Community / NGO Partner">Community / NGO Partner</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Strategic Partner" className="hidden">Strategic Partner</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF9F6]/50 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF9F6]/70">Message</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-[#152E1E]/50 border border-[#2E7D32]/30 rounded-xl px-4 py-3 text-sm text-[#FAF9F6] placeholder-[#FAF9F6]/30 focus:outline-none focus:border-[#4CAF50] transition-colors resize-none"
                    placeholder="Tell us how we can collaborate..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-2 w-full py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs border border-[#2E7D32]/20 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> Sending...</span>
                  ) : (
                    <>Submit Inquiry <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-center text-[10px] text-[#FAF9F6]/40 mt-2">
                  This form is fully operational and routes directly to the WAQID team.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-[#0C1D13] pt-16 pb-8 border-t border-[#2E7D32]/20 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center mb-12">
            <img 
              src="/images/waqid-logo-transparent.png" 
              alt="Waqid" 
              className="w-32 h-auto object-contain mb-6 opacity-80 hover:opacity-100 transition-opacity"
            />
            <p className="text-sm text-[#FAF9F6]/60 font-sans max-w-md">
              A prototype-stage circular climate venture turning palm biomass waste into clean heat, soil restoring biochar, and community resilience.
            </p>
          </div>
          <div className="pt-8 border-t border-[#FAF9F6]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#FAF9F6]/40 font-sans">
              &copy; {new Date().getFullYear()} WAQID. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-[#FAF9F6]/40 hover:text-[#4CAF50] transition-colors font-sans">Privacy Policy</a>
              <a href="#" className="text-xs text-[#FAF9F6]/40 hover:text-[#4CAF50] transition-colors font-sans">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
