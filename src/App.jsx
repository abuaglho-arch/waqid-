import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { 
  Award, ArrowUpRight, Factory, Flame, Leaf, ChevronRight, 
  HelpCircle, ChevronDown, ChevronUp, Mail, MapPin, Calendar, 
  Users, Send, ShieldCheck, Zap, Sparkles, ArrowRight, Menu, X, BookOpen,
  Globe, Droplets, Hexagon
} from "lucide-react";
import Counter from "./components/Counter";
import ScrollToTop from "./components/ScrollToTop";

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
  // ------------------------
  
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

  const sdgs = [
    { id: 2, name: "SDG 2 Zero Hunger", color: "#e5243b", desc: "Bolsters food security by locking moisture in dry soil." },
    { id: 12, name: "SDG 12 Responsible Production", color: "#d3a029", desc: "Intercepts and recycles raw agricultural palm biomass." },
    { id: 13, name: "SDG 13 Climate Action", color: "#3f7e44", desc: "TLUD pyrolysis fixes carbon, eliminating open burning smoke." },
    { id: 15, name: "SDG 15 Life on Land", color: "#56c02b", desc: "Rebuilds degraded acidic clay soils biologically." },
    { id: 8, name: "SDG 8 Decent Work", color: "#a21942", desc: "Protects smallholder income from synthetic cost shocks." }
  ];

  const galleryItems = [
    {
      title: "V1 Pyrolysis Unit",
      category: "Early Prototype",
      image: "/images/v1-pyrolysis-unit.jpg",
      span: "md:col-span-8",
      desc: "Manual oil drum TLUD reactors tested in Perak to prove complete carbonisation."
    },
    {
      title: "Granular Pellets",
      category: "Material Chemistry",
      image: "/images/organic-biochar.png",
      span: "md:col-span-4",
      desc: "3–6mm dust-free biochar-compost blend pellets compatible with spreaders."
    },
    {
      title: "Mobile Biochar Pyrolysis",
      category: "Pilot Infrastructure",
      image: "https://static.wixstatic.com/media/f8695c_cf70bb98f5284b99b54088b2120cac11~mv2.png/v1/fill/w_809,h_744,al_c,q_90,enc_avif,quality_auto/f8695c_cf70bb98f5284b99b54088b2120cac11~mv2.png",
      span: "md:col-span-4",
      desc: "Semi-automated TLUD reactor featuring active ventilation loops."
    },
    {
      title: "Wild Asia Field Engagement",
      category: "Operational Advisory",
      image: "/images/organic-hero.png",
      span: "md:col-span-8",
      desc: "Actively gaining on-the-ground operational insights and expert crop diagnostics alongside the Wild Asia network in Perak. Connect with us to explore collaborative opportunities."
    }
  ];



  const faqItems = [
    {
      q: "What is biochar?",
      a: "Biochar is a highly stable form of carbon produced by heating agricultural biomass (such as empty fruit bunches and fronds from palm oil mills) in an oxygen-limited environment. The resulting material is highly porous, resembling charcoal, and resists decomposition for hundreds of years. When applied to agricultural land, it acts as a permanent sponge that retains moisture, hosts beneficial soil microbes, and reduces the leaching of nutrients."
    },
    {
      q: "What is TLUD pyrolysis?",
      a: "TLUD stands for Top-Lit Updraft pyrolysis. It is a thermochemical process where biomass is packed in a modular reactor and ignited at the top. Air is restricted, forcing a pyrolysis front to migrate downward through the biomass at 500–700°C. This converts volatile gases into clean thermal energy and leaves behind stable, solid carbon (biochar), instead of allowing the biomass to decay or burn openly, which releases methane and carbon dioxide."
    },
    {
      q: "How is Waqid different from synthetic fertilisers?",
      a: "Synthetic fertilizers feed plants directly with chemical nitrogen, phosphorus, and potassium, but they degrade soil structure, destroy microbial life, and wash away easily. Waqid is a soil rebuilder. Our biochar-compost blend improves the soil's physical structure, holds moisture, and anchors nutrients so plants can absorb them more efficiently. It does not replace nutrients entirely; rather, it makes the soil self-sustaining and cuts chemical fertilizer dependencies by up to 40%."
    },
    {
      q: "What stage is Waqid at?",
      a: "We are an early-stage circular venture founded in May 2024. Having successfully designed and tested our manual V1 burners and V2 pelletised compost formulations with smallholder farmers, we are now preparing to manufacture our V3 semi-automated TLUD unit. We are actively conducting pilot trials in Perak and Kedah, Malaysia, to validate yield gains and build our carbon credit verification data."
    },
    {
      q: "How can I partner with Waqid?",
      a: "We welcome partnerships along three key tracks: mill operators looking to discard biomass liabilities, farmers or cooperatives looking to trial our compost-biochar pellets for healthier crops, and funders or sustainable programs seeking to support early-stage circular climate ventures. Please select your track or fill out the inquiry form, and our team will be in touch with you."
    },
    {
      q: "Where does Waqid operate?",
      a: "Waqid operates locally in Perak and Kedah, Malaysia. Our primary field research, biomass collection, modular pyrolysis, and farmer coaching seminars are conducted on-site in these two northern states in collaboration with Wild Asia."
    }
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
          {/* Logo Brand */}
          <a href="#" className="flex items-center group">
            <img 
              src="/images/waqid-logo-final.png" 
              alt="Waqid" 
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-lighten"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {["Crisis", "Solution", "Partnerships", "Impact", "FAQs"].map((section) => (
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

          {/* CTA Header */}
          <div className="hidden md:block">
            <button
              onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-hover-shadow inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#2E7D32] text-[#FAF9F6] text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#4CAF50] hover:text-[#0C1D13] border border-[#2E7D32]/20 shadow-md"
            >
              Partner With Us
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Btn */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#FAF9F6] hover:text-[#4CAF50] transition-colors p-1"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-[#0C1D13] pt-28 pb-12 px-8 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6">
              {["Crisis", "Solution", "Partnerships", "Impact", "FAQs"].map((section) => (
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
                  document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
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
      <section ref={heroRef} className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#0C1D13] text-[#FAF9F6] border-b border-[#2E7D32]/10">
        
        {/* Dynamic Interactive Glow */}
        <div 
          className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 hidden md:block"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(76, 175, 80, 0.08), transparent 40%)`
          }}
        />

        {/* Parallax Background Layer */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {/* Abstract background image of palm leaves/Malaysian landscape */}
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1920" 
            alt="Tropical Malaysian Landscape Dawn" 
            className="w-full h-full object-cover opacity-15 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C1D13]/40 via-[#0C1D13]/90 to-[#0C1D13]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0C1D13_90%)]" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center"
        >
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/35 text-[#4CAF50] text-[10px] font-sans font-bold uppercase tracking-widest mb-8"
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Active Pilot Phase</span>
          </motion.div>

          <motion.h1
            variants={fadeUpVariant}
            className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight leading-[1.05] text-[#FAF9F6] text-balance"
          >
            Restoring Land. <br />
            Closing the Loop. <br />
            <span className="text-[#4CAF50]">Cooling the Planet.</span>
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="mt-6 text-[#FAF9F6]/75 font-sans text-base md:text-xl max-w-2xl leading-relaxed text-balance"
          >
            Developing a scalable system to convert unmanaged palm agricultural waste into affordable soil amendments and sustainable solid fuels for communities.
          </motion.p>

          {/* Trust Badge Integration: BeVisioneers */}
          <motion.div
            variants={fadeUpVariant}
            className="mt-8 flex flex-col items-center gap-2.5"
          >
            <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#FAF9F6]/40">
              Proudly supported by
            </span>
            <a 
              href="https://bevisioneers.world/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#FAF9F6] rounded-xl px-6 py-3 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border border-transparent hover:border-[#4CAF50]/50"
            >
              <img 
                src="/images/bevisioneers.png" 
                alt="bevisioneers: The Mercedes-Benz Fellowship" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </a>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
          >
            <button
              onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-hover-shadow w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs border border-[#2E7D32]/20 shadow-md"
            >
              Partner With Us
            </button>
            <button
              onClick={() => document.getElementById("crisis")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-hover-shadow w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent hover:bg-[#112417] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs border border-[#2E7D32]/40 shadow-sm"
            >
              Read the Science
            </button>
          </motion.div>
        </motion.div>


      </section>

      {/* 3. THE CRISIS (Why) - Spacious 3-column grid */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="crisis" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-end">
            <div className="lg:col-span-8">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                The Crisis
              </span>
              <h2 className="text-3xl md:text-6xl font-display font-black text-[#0C1D13] leading-tight mt-3 text-balance">
                Three quiet crises.<br />One root cause.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans leading-relaxed text-balance">
                Synthetic fertilizer costs trap smallholders in debt loops, while unmanaged agricultural residues decompose or burn openly across plantations.
              </p>
            </div>
          </div>

          {/* Stats columns */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#0C1D13]/10"
          >
            {/* Crisis 1 */}
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-1">01. The Scale</span>
              <span className="text-4xl md:text-6xl font-display font-extrabold text-[#2E7D32] flex items-baseline gap-1">
                <Counter value="80" />M+
              </span>
              <p className="text-xs md:text-sm text-[#0C1D13]/80 font-sans leading-relaxed mt-2">
                <strong>tonnes</strong> of palm biomass generated annually in Malaysia.
              </p>
            </motion.div>

            {/* Crisis 2 */}
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-1">02. The Waste</span>
              <span className="text-4xl md:text-6xl font-display font-extrabold text-[#2E7D32] flex items-baseline gap-1">
                <Counter value="20-22" />M
              </span>
              <p className="text-xs md:text-sm text-[#0C1D13]/80 font-sans leading-relaxed mt-2">
                <strong>tonnes</strong> of Empty Fruit Bunches left unmanaged or burned openly each year.
              </p>
            </motion.div>

            {/* Crisis 3 */}
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-1">03. The Climate Threat</span>
              <span className="text-4xl md:text-6xl font-display font-extrabold text-[#2E7D32] flex items-baseline gap-1">
                <Counter value="34" />x
              </span>
              <p className="text-xs md:text-sm text-[#0C1D13]/80 font-sans leading-relaxed mt-2">
                Methane released from this rotting waste has <strong>34x</strong> the warming power of CO2 over a 100-year period.
              </p>
            </motion.div>
          </motion.div>

          {/* Under-stat callout card */}
          <div className="mt-16 bg-[#F0EFEA] p-8 rounded-2xl border border-[#2E7D32]/10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="max-w-3xl">
              <h5 className="font-display font-bold text-lg text-[#0C1D13] mb-1">
                The Debt Trap & The Logic Gap
              </h5>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Meanwhile, farmers with tired land are forced to spend nearly half their earnings on synthetic fertilizers that permanently degrade the soil. We refuse to accept a system where one community is starved of resources while another burns potential assets as trash. By closing this logic gap, the waste of our fields becomes the restoration of our soil and the fuel for our industries.
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

      {/* 4. THE WAQID SOLUTION (The "How") - Elegant cards flow */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="solution" className="bg-[#F0EFEA] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              The System
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3 leading-tight">
              A circular loop that closes the gap
            </h2>
          </div>

          {/* Technical Visual Diagram */}
          <div className="mb-20 p-8 md:p-12 bg-[#0C1D13] rounded-3xl border border-[#2E7D32]/20 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,125,50,0.15)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="text-center mb-16 relative z-10 max-w-3xl mx-auto">
              <h4 className="font-display font-bold text-2xl text-[#FAF9F6]">The Pyrolysis Conversion Process</h4>
              <p className="text-[13px] md:text-sm text-[#FAF9F6]/70 font-sans mt-4 leading-relaxed text-balance">
                Our decentralized system operates at the source of the waste. We take raw agricultural biomass, which would otherwise rot and emit methane, and process it through our Top-Lit Updraft (TLUD) reactors. By heating the biomass to 500-700°C in an oxygen-limited environment, we prevent combustion and instead trigger thermal decomposition. This thermochemical reaction breaks the biomass down into three high-value assets: stable biochar for soil restoration, clean thermal energy for mill operations, and sustainable charcoal briquettes.
              </p>
            </div>

            <div className="flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8 relative z-10 max-w-7xl mx-auto">
              
              {/* Step 1: Raw Biomass Input */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="flex flex-col w-full xl:w-[28%]"
              >
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#2E7D32]/20 mb-5 shadow-lg">
                  <img src="/images/raw_biomass.png" alt="Raw Biomass" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <Leaf className="w-5 h-5 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-sm text-[#FAF9F6]">Raw Biomass Input</h5>
                    <p className="text-[11px] text-[#FAF9F6]/60 mt-1.5 font-sans leading-relaxed">Palm fronds and EFB collected directly from local mills and farms.</p>
                  </div>
                </div>
              </motion.div>

              {/* Arrow */}
              <div className="flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-6 h-6 text-[#4CAF50] hidden xl:block opacity-90" />
                <ChevronDown className="w-6 h-6 text-[#4CAF50] xl:hidden opacity-90 my-4" />
              </div>

              {/* Step 2: Reactor Core */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="flex flex-col w-full xl:w-[35%]"
              >
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#2E7D32]/20 mb-5 shadow-lg">
                  <img src="/images/pyrolysis_reactor.jpg" alt="Reactor" className="w-full h-full object-cover object-center" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <Flame className="w-5 h-5 text-[#4CAF50] animate-pulse" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-sm text-[#FAF9F6]">TLUD Pyrolysis Reactor</h5>
                    <p className="text-[11px] text-[#FAF9F6]/60 mt-1.5 font-sans leading-relaxed">Top-Lit Updraft technology migrating at 500-700°C in oxygen-limited environments.</p>
                  </div>
                </div>
              </motion.div>

              {/* Arrow */}
              <div className="flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-6 h-6 text-[#4CAF50] hidden xl:block opacity-90" />
                <ChevronDown className="w-6 h-6 text-[#4CAF50] xl:hidden opacity-90 my-4" />
              </div>

              {/* Step 3: Outputs Group */}
              <div className="w-full xl:w-[30%] grid grid-cols-3 gap-3">
                {/* Stable Biochar */}
                <motion.div whileHover={{ y: -4 }} className="flex flex-col">
                  <div className="w-full h-32 sm:h-48 xl:h-56 rounded-lg overflow-hidden border border-[#2E7D32]/20 mb-4 shadow-sm">
                    <img src="/images/stable_biochar_granular.png" alt="Biochar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <Leaf className="w-3.5 h-3.5 text-[#4CAF50]" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-[10px] sm:text-[11px] text-[#FAF9F6] leading-tight">Stable<br/>Biochar</h5>
                      <p className="text-[9px] text-[#FAF9F6]/50 mt-1.5 font-sans leading-snug">Carbon-locked soil builder.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Clean Thermal Energy */}
                <motion.div whileHover={{ y: -4 }} className="flex flex-col">
                  <div className="w-full h-32 sm:h-48 xl:h-56 rounded-lg overflow-hidden border border-[#2E7D32]/20 mb-4 shadow-sm">
                    <img src="/images/thermal_energy.png" alt="Thermal Energy" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-[#4CAF50]" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-[10px] sm:text-[11px] text-[#FAF9F6] leading-tight">Clean Thermal<br/>Energy</h5>
                      <p className="text-[9px] text-[#FAF9F6]/50 mt-1.5 font-sans leading-snug">Fueling local industry.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Charcoal Briquettes */}
                <motion.div whileHover={{ y: -4 }} className="flex flex-col">
                  <div className="w-full h-32 sm:h-48 xl:h-56 rounded-lg overflow-hidden border border-[#2E7D32]/20 mb-4 shadow-sm">
                    <img src="/images/charcoal_briquettes.png" alt="Charcoal" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <Hexagon className="w-3.5 h-3.5 text-[#4CAF50]" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-[10px] sm:text-[11px] text-[#FAF9F6] leading-tight">Charcoal<br/>Briquettes</h5>
                      <p className="text-[9px] text-[#FAF9F6]/50 mt-1.5 font-sans leading-snug">Sustainable solid fuel alternative.</p>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Step 1 */}
            <div className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col justify-between card-hover">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#152E1E]/5 flex items-center justify-center text-[#2E7D32] mb-6 border border-[#2E7D32]/10">
                  <Factory className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">
                  01. Decentralized Processing
                </h4>
                <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                  Deploying TLUD pyrolysis systems at both mill sites and farm sites to process waste locally, eliminating massive transport logistics.
                </p>
              </div>
              <div className="border-t border-[#0C1D13]/10 pt-4 mt-6">
                <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#2E7D32] block">
                  Logistics Gain
                </span>
                <p className="text-[11px] text-[#0C1D13]/60 font-sans mt-0.5 leading-relaxed">
                  Pyrolysis at source achieves an approximate <strong className="font-bold text-[#0C1D13]">4x reduction</strong> in feedstock volume [Yank et al. 2016].
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col justify-between card-hover">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#152E1E]/5 flex items-center justify-center text-[#2E7D32] mb-6 border border-[#2E7D32]/10">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">
                  02. Circular Economics
                </h4>
                <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                  Our target economic model ensures mills will pay a service fee for legal biomass removal, allowing us to offer farmers a highly accessible target price of <strong className="font-bold text-[#0C1D13]">RM 7/kg</strong> for premium soil-restoring products.
                </p>
              </div>
              <div className="border-t border-[#0C1D13]/10 pt-4 mt-6">
                <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#2E7D32] block">
                  Affordable Price Point
                </span>
                <p className="text-[11px] text-[#0C1D13]/60 font-sans mt-0.5 leading-relaxed">
                  Replaces expensive synthetic nitrogen inputs with stable compost-bonded soil amendments.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm flex flex-col justify-between card-hover">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#152E1E]/5 flex items-center justify-center text-[#2E7D32] mb-6 border border-[#2E7D32]/10">
                  <Leaf className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">
                  03. The Product Innovation
                </h4>
                <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                  Converting raw biochar into uniform, 3-6mm granular biochar-compost pellets. This format is fully compatible with existing mechanical spreaders and eliminates wind drift.
                </p>
              </div>
              <div className="border-t border-[#0C1D13]/10 pt-4 mt-6">
                <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#2E7D32] block">
                  Soil Crystalline Stability
                </span>
                <p className="text-[11px] text-[#0C1D13]/60 font-sans mt-0.5 leading-relaxed">
                  Guarantees verifiable carbon capture in soils for over 100 years [Lehmann & Joseph 2009].
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* NEW: THE ECONOMICS / BUSINESS MODEL */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="economics" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              The Business Model
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              A Venture-Scale Engine
            </h2>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6" />
          </div>

          {/* THE INVESTMENT CASE (TAM, GTM, MOAT) */}
          <div className="bg-[#0C1D13] p-8 md:p-12 rounded-3xl shadow-xl mb-12 flex flex-col md:flex-row gap-8 md:gap-12 relative overflow-hidden border border-[#2E7D32]/20 card-hover">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,125,50,0.15)_0%,transparent_60%)] pointer-events-none" />
            
            {/* TAM */}
            <div className="flex-1 relative z-10">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-2 block">01. Market Size (TAM)</span>
              <h4 className="font-display font-bold text-xl md:text-2xl text-[#FAF9F6] mb-3">The $10B+ Biomass Opportunity</h4>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                Southeast Asia produces millions of tons of unmanaged agricultural waste annually. We are tapping into a massive, subsidized market for waste management, verifiable carbon removal, and regenerative soil amendments.
              </p>
            </div>

            {/* GTM */}
            <div className="flex-1 relative z-10 border-t md:border-t-0 md:border-l border-[#2E7D32]/20 pt-8 md:pt-0 md:pl-12">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-2 block">02. Go-To-Market</span>
              <h4 className="font-display font-bold text-xl md:text-2xl text-[#FAF9F6] mb-3">Hardware-as-a-Service</h4>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                We deploy reactors directly at palm mills (B2B), eliminating their strict disposal liabilities. We then aggregate the high-margin biochar output and distribute it through established agricultural cooperatives.
              </p>
            </div>

            {/* MOAT */}
            <div className="flex-1 relative z-10 border-t md:border-t-0 md:border-l border-[#2E7D32]/20 pt-8 md:pt-0 md:pl-12">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-2 block">03. Competitive Moat</span>
              <h4 className="font-display font-bold text-xl md:text-2xl text-[#FAF9F6] mb-3">Decentralized & Low CAPEX</h4>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                Legacy industrial incinerators require massive centralization and capital ($10M+). Our semi-automated, modular TLUD architecture allows for rapid, decentralized deployment at a fraction of the cost.
              </p>
            </div>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0 [&>div]:min-w-[85vw] md:[&>div]:min-w-0 [&>div]:snap-center">
            {/* Revenue Stream 1: Hardware & Energy */}
            <div className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">
                01. Hardware & Clean Energy
              </h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Mills pay a recurring service fee to deploy our decentralized pyrolysis units, instantly solving their strict disposal liabilities while generating free, clean thermal energy to fuel their own operations.
              </p>
            </div>

            {/* Revenue Stream 2: Biochar */}
            <div className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">
                02. Biochar Distribution
              </h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                We aggregate the produced biochar and process it into premium soil-building pellets, selling them directly to agricultural cooperatives and farmers at high margins to restore degraded soils.
              </p>
            </div>

            {/* Revenue Stream 3: Briquettes & Carbon */}
            <div className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 shadow-sm card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner">
                <Hexagon className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">
                03. Solid Fuels & Carbon
              </h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                We sell the sustainable charcoal briquettes as a solid fuel alternative. Simultaneously, because our biochar locks carbon into the earth, we generate verifiable Carbon Removal Credits (CORCs) for the global market.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. FIELD VALIDATION & TESTIMONIALS */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="partnerships" className="bg-[#0C1D13] text-[#FAF9F6] py-16 md:py-24 text-left relative overflow-hidden border-b border-[#2E7D32]/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(46,125,50,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(46,125,50,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-xl mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50]">
              Field Validation and Advisory
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black leading-tight mt-3">
              Grounded in the field, backed by science
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Quote 1: Ahmad */}
            <div className="bg-[#1E2229] p-8 md:p-12 rounded-3xl border border-[#2E7D32]/15 shadow-xl flex flex-col justify-between relative overflow-hidden group card-hover">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2E7D32]/10 to-transparent pointer-events-none rounded-bl-full" />
              <div>
                <span className="text-6xl font-serif text-[#4CAF50] opacity-35 leading-none font-bold">“</span>
                <p className="text-sm md:text-base text-[#FAF9F6]/85 font-sans leading-relaxed mt-2 italic">
                  The soil needs more every year to produce less, and I know the chemicals are not sustainable. Testing with the Waqid team in the field showed me a real alternative. If these pellets can be produced at scale, they offer a highly practical path to restore our land's health without falling into debt.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8 border-t border-[#FAF9F6]/10 pt-6">
                <img 
                  src="/images/farmer_ahmad.png" 
                  alt="Ahmad, Smallholder Farmer" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#2E7D32] grayscale group-hover:grayscale-0 transition-all duration-350"
                />
                <div>
                  <h4 className="font-display font-bold text-base text-[#FAF9F6]">
                    Ahmad
                  </h4>
                  <p className="text-xs text-[#FAF9F6]/55 font-sans">
                    Smallholder Farmer, Kedah
                  </p>
                </div>
              </div>
            </div>

            {/* Quote 2: Tim */}
            <div className="bg-[#1E2229] p-8 md:p-12 rounded-3xl border border-[#2E7D32]/15 shadow-xl flex flex-col justify-between relative overflow-hidden group card-hover">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2E7D32]/10 to-transparent pointer-events-none rounded-bl-full" />
              <div>
                <span className="text-6xl font-serif text-[#4CAF50] opacity-35 leading-none font-bold">“</span>
                <p className="text-sm md:text-base text-[#FAF9F6]/85 font-sans leading-relaxed mt-2 italic">
                  The Waqid founding team brings a rare combination of ground-level empathy and technical rigor to the biomass crisis. Their approach to closing the loop directly at the mill and farm level is exactly the kind of pragmatic, farmer-first innovation this region needs. As an advisor, it is a privilege to support a venture so deeply committed to rigorous field research and scalable operations.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8 border-t border-[#FAF9F6]/10 pt-6">
                <img 
                  src="/images/tim-asquith.png" 
                  alt="Tim Asquith, Strategic Advisor" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#2E7D32] grayscale group-hover:grayscale-0 transition-all duration-350"
                />
                <div>
                  <h4 className="font-display font-bold text-base text-[#FAF9F6]">
                    Tim Asquith
                  </h4>
                  <p className="text-xs text-[#FAF9F6]/55 font-sans">
                    Mentor and Strategic Advisor
                  </p>
                </div>
              </div>
            </div>
          </div>


        </div>
      </motion.section>

      {/* 4.5. ENVIRONMENTAL IMPACT */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="environment" className="bg-[#0C1D13] py-16 md:py-24 relative overflow-hidden border-b border-[#2E7D32]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,transparent_40%,#152E1E_100%)] pointer-events-none opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-3">
              Environmental Impact
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] leading-tight">
              Healing the ecosystem,<br />one hectare at a time.
            </h2>
            <div className="w-12 h-[1px] bg-[#4CAF50] mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-10 rounded-3xl hover:bg-[#152E1E] transition-colors duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform duration-500">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#FAF9F6] mb-4">Carbon Sequestration</h3>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                By converting agricultural waste into biochar instead of burning or letting it rot, we securely lock carbon into the soil for hundreds of years, actively cooling the planet.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-10 rounded-3xl hover:bg-[#152E1E] transition-colors duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform duration-500">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#FAF9F6] mb-4">Soil Regeneration</h3>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                Our biochar directly rehabilitates highly degraded, acidic clay soils. It acts as a sponge for water and nutrients, restoring microscopic ecosystems essential for healthy crops.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#152E1E]/50 border border-[#2E7D32]/20 p-10 rounded-3xl hover:bg-[#152E1E] transition-colors duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform duration-500">
                <Droplets className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#FAF9F6] mb-4">Methane Mitigation</h3>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                Leaving Empty Fruit Bunches (EFB) to decay in landfills produces immense methane emissions. We divert this waste completely, neutralizing a major climate threat.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. PROJECTED IMPACT & R&D ROADMAP */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="impact" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              R&D Roadmap
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              Target Impact at Scale
            </h2>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Highlight 1 */}
            <div className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 flex flex-col justify-between shadow-sm card-hover">
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#2E7D32]">
                  Pilot Target
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-extrabold text-[#0C1D13] mt-4 flex items-baseline gap-1">
                  ~<Counter value="10" /> <span className="text-lg font-sans font-medium text-[#0C1D13]/60">tonnes</span>
                </h3>
                <h5 className="font-display font-bold text-sm text-[#0C1D13] mt-2">
                  CO2e Sequestered
                </h5>
                <p className="text-xs text-[#0C1D13]/70 font-sans mt-3 leading-relaxed">
                  Targeting ~10 tonnes of CO2e sequestered in our upcoming V3 pilot.
                </p>
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 flex flex-col justify-between shadow-sm card-hover">
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#2E7D32]">
                  Residue Diversion
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-extrabold text-[#0C1D13] mt-4 flex items-baseline gap-1">
                  <Counter value="15000" /> <span className="text-lg font-sans font-medium text-[#0C1D13]/60">kg</span>
                </h3>
                <h5 className="font-display font-bold text-sm text-[#0C1D13] mt-2">
                  Palm Waste Diverted
                </h5>
                <p className="text-xs text-[#0C1D13]/70 font-sans mt-3 leading-relaxed">
                  Diverting 15,000 kg of palm waste from burning or decomposition.
                </p>
              </div>
            </div>

            {/* Highlight 3 */}
            <div className="bg-[#F0EFEA] p-8 rounded-3xl border border-[#2E7D32]/10 flex flex-col justify-between shadow-sm card-hover">
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#2E7D32]">
                  Soil Hydrology
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-extrabold text-[#0C1D13] mt-4 flex items-baseline gap-1">
                  ~<Counter value="18" />% <span className="text-lg font-sans font-medium text-[#0C1D13]/60">gain</span>
                </h3>
                <h5 className="font-display font-bold text-sm text-[#0C1D13] mt-2">
                  Water Retention Improvement
                </h5>
                <p className="text-xs text-[#0C1D13]/70 font-sans mt-3 leading-relaxed">
                  Improving soil water retention by approximately 18% based on established agronomic data.
                </p>
              </div>
            </div>
          </div>

          {/* R&D Roadmap transition timeline */}
          <div className="mt-24 max-w-4xl mx-auto border-t border-[#0C1D13]/10 pt-16">
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32] mb-12 text-center">
              The Transition from V2 to V3 Pilot
            </h4>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#2E7D32]/20 -translate-x-1/2 md:translate-x-0" />
              
              <div className="space-y-12 md:space-y-0">
                {/* Stage 1: V2 Validation */}
                <div className="relative md:flex md:justify-between items-center group">
                  <div className="md:w-5/12 text-left md:text-right md:pr-10 pl-10 md:pl-0">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] text-[10px] font-sans font-bold uppercase tracking-wider mb-2">
                      Completed Phase
                    </span>
                    <h4 className="font-display font-extrabold text-xl text-[#0C1D13]">
                      V2 Formulation & Field Trials
                    </h4>
                    <p className="text-xs text-[#0C1D13]/70 font-sans mt-2 leading-relaxed">
                      Designed V1 manual burners and formulated V2 compost-biochar pellets. Tested with Kedah paddy and Perak palm oil smallholders to validate application parameters.
                    </p>
                  </div>
                  
                  {/* Timeline node */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-[#FAF9F6] border-4 border-[#2E7D32] -translate-x-1/2 flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-120 top-0 md:top-auto" />
                  
                  <div className="md:w-5/12 pl-10 md:pl-10 hidden md:block">
                    {/* Spacer */}
                  </div>
                </div>

                {/* Stage 2: V3 Transition */}
                <div className="relative md:flex md:justify-between items-center group md:mt-16">
                  <div className="md:w-5/12 hidden md:block">
                    {/* Spacer */}
                  </div>
                  
                  {/* Timeline node */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-[#FAF9F6] border-4 border-[#4CAF50] -translate-x-1/2 flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-120 top-0 md:top-auto" />
                  
                  <div className="md:w-5/12 text-left md:pl-10 pl-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#4CAF50]/15 border border-[#4CAF50]/30 text-[#2E7D32] text-[10px] font-sans font-bold uppercase tracking-wider mb-2 animate-pulse">
                      Active Development
                    </span>
                    <h4 className="font-display font-extrabold text-xl text-[#0C1D13]">
                      V3 Semi-Automated Pilot
                    </h4>
                    <p className="text-xs text-[#0C1D13]/70 font-sans mt-2 leading-relaxed">
                      Moving to a custom, semi-automated modular reactor with forced air circulation loops. Validating yield gains at 15,000 kg scale and tracking soil carbon sequestration metrics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* UN Sustainable Development Goals */}
          <div className="mt-24 pt-16 border-t border-[#2E7D32]/10">
            <div className="text-center mb-10">
              <h4 className="text-sm font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                UN Sustainable Development Goals
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {sdgs.map((sdg) => (
                <div
                  key={sdg.id}
                  className="flex flex-col p-6 rounded-3xl bg-[#F0EFEA] border border-[#2E7D32]/10 shadow-sm card-hover relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: sdg.color }} />
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-display font-black" style={{ color: sdg.color }}>
                      {sdg.id}
                    </span>
                    <span className="text-xs font-sans font-bold text-[#0C1D13] leading-tight text-left">
                      {sdg.name.replace(`SDG ${sdg.id} `, '')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#0C1D13]/70 font-sans leading-relaxed text-left">
                    {sdg.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>


      {/* THE ORIGIN STORY */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="origin" className="bg-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              The Origin
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              A Bridge Between Two Worlds
            </h2>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-[#F0EFEA] p-8 md:p-16 rounded-3xl border border-[#2E7D32]/10 shadow-lg overflow-hidden flex flex-col md:flex-row items-center gap-10 card-hover">
              <span className="absolute top-8 left-8 text-8xl font-serif text-[#4CAF50] opacity-10 leading-none font-bold">“</span>
              
              {/* Founder Portrait */}
              <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-4 border-[#4CAF50] overflow-hidden shadow-xl mb-4">
                  <img src="/images/founder.jpg" alt="Osama Mohamed Abuagla" className="w-full h-full object-cover object-center" />
                </div>
                <h4 className="font-display font-bold text-lg text-[#0C1D13] text-center">
                  Osama M. Abuagla
                </h4>
                <p className="text-[10px] text-[#2E7D32] font-sans font-bold uppercase tracking-widest mt-1 text-center">
                  Founder & Innovator
                </p>
              </div>

              {/* The Story */}
              <div className="relative z-10 flex-grow text-center md:text-left border-t md:border-t-0 md:border-l border-[#2E7D32]/15 pt-6 md:pt-0 md:pl-10">
                <p className="text-sm md:text-base text-[#0C1D13]/80 font-sans leading-relaxed text-balance italic">
                  "My motivation is rooted in a bridge between two worlds. It began in Sudan during the war, where I witnessed the heartbreaking reality of energy poverty. I watched families forced to clear our once-great forests just to get enough firewood to prepare a single hot meal. They had no other choice. That experience taught me a vital lesson: environmental destruction is often just a symptom of a missing bridge between a resource and a basic human need.
                  <br /><br />
                  Now, building Waqid in Malaysia, I see the other side of that same tragedy. Vast amounts of agricultural biomass are treated as a burden and left to rot or burn in the open air. I refuse to accept a system where one region is starved of energy while another burns potential fuel as trash. Waqid exists to close this logic gap. We are proving that the waste of our fields can become the restoration of our soil and the energy for our industries."
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TEAM & ADVISORS */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="team" className="bg-[#0C1D13] text-[#FAF9F6] py-16 md:py-24 border-b border-[#2E7D32]/20 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50]">
              The Human Capital
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] mt-3">
              Team & Advisors
            </h2>
            <div className="w-12 h-[1px] bg-[#4CAF50] mx-auto mt-6" />
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch snap-x snap-mandatory pb-8 -mx-6 px-6 sm:mx-0 sm:px-0 [&>div]:min-w-[85vw] sm:[&>div]:min-w-0 [&>div]:snap-center">
            {/* Team Member 1 */}
            <motion.div variants={fadeUpVariant} className="bg-[#1E2229] p-8 md:p-10 rounded-3xl border border-[#2E7D32]/15 shadow-xl flex flex-col items-center text-center group card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2E7D32]/20 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10">
                <img src="/images/founder.jpg" alt="Osama Mohamed Abuagla" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Osama M. Abuagla</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Founder & CEO</p>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed relative z-10">
                Driving the vision and technical execution of Waqid's decentralized pyrolysis infrastructure.
              </p>
            </motion.div>

            {/* Team Member 2 */}
            <motion.div variants={fadeUpVariant} className="bg-[#1E2229] p-8 md:p-10 rounded-3xl border border-[#2E7D32]/15 shadow-xl flex flex-col items-center text-center group card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2E7D32]/20 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10 bg-[#0C1D13] flex items-center justify-center">
                <img src="/images/tim-asquith.png" alt="Tim Asquith" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Tim Asquith</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Strategic Advisor</p>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed relative z-10">
                Providing critical guidance on field validation, commercial scaling, and global agricultural economics.
              </p>
            </motion.div>

            {/* Team Member 3: Venture Coach */}
            <motion.div variants={fadeUpVariant} className="bg-[#1E2229] p-8 md:p-10 rounded-3xl border border-[#2E7D32]/15 shadow-xl flex flex-col items-center text-center group card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2E7D32]/20 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10 bg-[#0C1D13] flex items-center justify-center">
                <img src="/images/joyce.jpg" alt="Joyce Zhang" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Joyce Zhang</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Venture Coach</p>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed relative z-10">
                Guiding WAQID's fundraising strategy and venture scaling architecture for global deployment.
              </p>
            </motion.div>

            {/* Team Member 4: Open Call */}
            <motion.div variants={fadeUpVariant} onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })} className="bg-[#152E1E] p-8 md:p-10 rounded-3xl border border-[#4CAF50]/30 border-dashed shadow-inner flex flex-col items-center text-center group card-hover relative overflow-hidden justify-center cursor-pointer hover:bg-[#1E2229] transition-colors">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#4CAF50]/50 border-dashed mb-6 relative z-10 bg-[#0C1D13] flex items-center justify-center">
                <span className="text-[#4CAF50]/50 font-display text-4xl group-hover:scale-125 transition-transform duration-500">+</span>
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Join The Movement</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Partners & Mavericks</p>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed relative z-10">
                We are actively looking for passionate operators, strategic partners, and early believers to help us complete this mission in any way possible.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 7. PORTFOLIO GALLERY GRID */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="gallery" className="bg-[#F0EFEA] py-16 md:py-24 border-b border-[#2E7D32]/10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Visual Timeline
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              Asymmetric Grid & Gallery
            </h2>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6" />
          </div>

          <div className="marquee-container w-full max-w-[100vw]">
            <div className="marquee-content gap-6 items-stretch pr-6" style={{ animationDuration: '15s' }}>
              {[...galleryItems, ...galleryItems].map((item, idx) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden rounded-3xl border border-[#2E7D32]/10 bg-[#0C1D13] shadow-md flex-shrink-0 w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-[25vw]"
                >
                  <div className="w-full aspect-[16/10] md:h-[400px] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700"
                    />
                  </div>
                  
                  {/* Description card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D13]/90 via-[#0C1D13]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-2 block">
                      {item.category}
                    </span>
                    <h4 className="font-display font-bold text-lg text-[#FAF9F6]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#FAF9F6]/80 font-sans mt-2 max-w-md">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. CALL TO ACTION / FOOTER (Lead capture and contact form) */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="contact-section" className="bg-[#FAF9F6] py-16 md:py-24 text-left">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* THE ASK BANNER */}
          <div className="mb-16 bg-[#0C1D13] border border-[#4CAF50]/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,175,80,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10 max-w-2xl text-center md:text-left">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-3">
                Investment & Partnerships
              </span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-[#FAF9F6] mb-4">
                Current Ask: Raising $30k to build our V3 pilot reactor and secure strategic palm mill and farm partnerships across Malaysia.
              </h3>
              <p className="text-sm text-[#FAF9F6]/70 font-sans leading-relaxed">
                We are syndicating seed capital and strategic partnerships to validate, manufacture, and deploy our first decentralized pyrolysis pilot.
              </p>
            </div>
            <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
              <button 
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full md:w-auto px-8 py-4 bg-[#4CAF50] hover:bg-[#FAF9F6] hover:text-[#0C1D13] text-[#0C1D13] font-sans font-bold uppercase tracking-widest text-xs transition-colors duration-300 rounded-xl shadow-lg flex items-center justify-center gap-3 group"
              >
                <BookOpen className="w-4 h-4" />
                Request Pitch Deck
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left: Proposal Copy (5 columns) */}
            <div className="lg:col-span-5 bg-[#0C1D13] text-[#FAF9F6] p-8 md:p-12 rounded-3xl border border-[#2E7D32]/25 shadow-xl flex flex-col justify-between min-h-[400px]">
              <div className="relative z-10">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50]">
                  Scale The Impact
                </span>
                <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#FAF9F6] mt-3 mb-6">
                  Partner With Us to Scale the Impact.
                </h3>
                <p className="text-xs md:text-sm text-[#FAF9F6]/75 font-sans leading-relaxed mb-8">
                  Waqid is seeking early-stage partners, agronomic advisors, and catalytic capital to move from prototype to pilot deployment and maintain our vital field research. Join us in building the infrastructure for a regenerative future.
                </p>

                <div className="flex flex-col gap-5 font-sans text-xs md:text-sm text-[#FAF9F6]/80 mt-6 border-t border-[#FAF9F6]/10 pt-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                    <span>Perak & Kedah, Malaysia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Flame className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                    <span>Pioneering Circular Biochar Systems</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Leaf className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                    <span>Building a Regenerative Future</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                    <a href="mailto:Abuaglho@gmail.com" className="hover:text-[#4CAF50] transition-colors">
                      Abuaglho@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#FAF9F6]/10 pt-6 mt-8 text-[11px] font-sans text-[#FAF9F6]/40 leading-relaxed">
                * Detailed field trial data and early validation reports are available upon request for prospective partners and investors.
              </div>
            </div>

            {/* Right: Contact Form (7 columns) */}
            <div id="contact" className="lg:col-span-7 bg-[#F0EFEA] p-8 md:p-12 rounded-3xl border border-[#2E7D32]/10 shadow-sm">
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mb-6 border border-[#2E7D32]/20">
                    <Send className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-[#0C1D13] mb-3">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-[#0C1D13]/75 font-sans max-w-sm mb-2 leading-relaxed">
                    Thank you for reaching out! We have successfully received your inquiry and will be in touch with you shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-8 px-6 py-2.5 rounded-full border border-[#2E7D32]/20 hover:border-[#2E7D32] text-[#2E7D32] text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-sans">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#0C1D13]/70">
                        Full Name *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C1D13]/30" />
                        <input
                          type="text"
                          required
                          placeholder="Ahmad Bin Ismail"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] placeholder-[#0C1D13]/30 focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#0C1D13]/70">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C1D13]/30" />
                        <input
                          type="email"
                          required
                          placeholder="ahmad@coop.my"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] placeholder-[#0C1D13]/30 focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#0C1D13]/70">
                        Organisation (Optional)
                      </label>
                      <div className="relative">
                        <Factory className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C1D13]/30" />
                        <input
                          type="text"
                          placeholder="Kedah Paddy Coop"
                          value={formData.org}
                          onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] placeholder-[#0C1D13]/30 focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#0C1D13]/70">
                        Partnership Track *
                      </label>
                      <div className="relative">
                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C1D13]/30 pointer-events-none" />
                        <select
                          required
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] focus:outline-none focus:border-[#2E7D32] text-sm font-sans cursor-pointer transition-colors appearance-none"
                        >
                          <option value="" disabled>Select track...</option>
                          <option value="Investor / Funder">Investor / Funder</option>
                          <option value="Strategic Partner / Advisor">Strategic Partner / Advisor</option>
                          <option value="Grant Program / NGO">Grant Program / NGO</option>
                          <option value="Academic / Researcher">Academic / Researcher</option>
                          <option value="Mill Operator (Pilot Interest)">Mill Operator (Pilot Interest)</option>
                          <option value="Farmer / Cooperative (Trial Interest)">Farmer / Cooperative (Trial Interest)</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C1D13]/30 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#0C1D13]/70">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us how you'd like to support, advise, or partner with us on our pilot journey..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="px-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] placeholder-[#0C1D13]/30 focus:outline-none focus:border-[#2E7D32] text-sm font-sans resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-hover-shadow w-full mt-2 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-widest text-xs transition-colors duration-300 border border-[#2E7D32]/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white group-hover:text-[#0C1D13]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        Partner With Us
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Accordion FAQ Panel */}
          <div id="faqs" className="max-w-3xl mx-auto mt-32">
            <div className="text-center mb-12">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                Deep Dive
              </span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
                Frequently Asked Questions
              </h3>
              <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6" />
            </div>

            <div className="flex flex-col gap-5">
              {faqItems.map((item, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className={`bg-[#F0EFEA] border ${isOpen ? 'border-[#2E7D32]/30 shadow-md' : 'border-[#2E7D32]/10 shadow-sm'} rounded-3xl overflow-hidden text-left transition-all duration-300 card-hover`}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                    >
                      <span className="font-display font-bold text-lg md:text-xl text-[#0C1D13] group-hover:text-[#2E7D32] transition-colors pr-6">
                        {item.q}
                      </span>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-[#2E7D32] text-[#FAF9F6]' : 'bg-[#152E1E]/5 text-[#2E7D32] group-hover:bg-[#2E7D32]/10'}`}>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 md:px-8 pb-8 pt-0 text-sm md:text-base font-sans text-[#0C1D13]/75 leading-relaxed">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      </motion.section>

      {/* 9. persistent clean footer */}
      <footer className="bg-[#0C1D13] text-[#FAF9F6] border-t border-[#2E7D32]/15 pt-16 pb-8 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo Brand */}
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity w-fit focus:outline-none"
            >
              <img 
                src="/images/waqid-logo-final.png" 
                alt="Waqid" 
                className="h-12 w-auto object-contain mix-blend-lighten"
              />
            </button>
            <p className="text-[#FAF9F6]/60 text-xs max-w-xs font-sans mt-2 leading-relaxed">
              A circular system converting agricultural palm waste into affordable, soil-restoring biochar for smallholder farmers.
            </p>
            <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#4CAF50] mt-2">
              Circular Solutions for Soil and Energy.
            </span>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#4CAF50]">
              Ecosystem
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left text-[#FAF9F6]/70 hover:text-[#4CAF50] transition-colors cursor-pointer">
                Home
              </button>
              <button onClick={() => document.getElementById("crisis")?.scrollIntoView({ behavior: "smooth" })} className="text-left text-[#FAF9F6]/70 hover:text-[#4CAF50] transition-colors cursor-pointer">
                Crisis
              </button>
              <button onClick={() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" })} className="text-left text-[#FAF9F6]/70 hover:text-[#4CAF50] transition-colors cursor-pointer">
                Solution
              </button>
              <button onClick={() => document.getElementById("partnerships")?.scrollIntoView({ behavior: "smooth" })} className="text-left text-[#FAF9F6]/70 hover:text-[#4CAF50] transition-colors cursor-pointer">
                Field Trials
              </button>
              <button onClick={() => document.getElementById("impact")?.scrollIntoView({ behavior: "smooth" })} className="text-left text-[#FAF9F6]/70 hover:text-[#4CAF50] transition-colors cursor-pointer col-span-2">
                Measurable Impact
              </button>
            </div>
          </div>

          {/* Operational credentials */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#4CAF50]">
              Operations
            </h4>

            <div className="border border-[#2E7D32]/25 bg-[#0C1D13]/50 p-4 rounded-xl">
              <p className="text-xs font-sans font-bold text-[#FAF9F6]/95">
                Cooperative Program: Wild Asia
              </p>
              <p className="text-[10px] font-sans text-[#FAF9F6]/45 mt-1 leading-relaxed">
                Confirmed collaboration on decentralized pyrolysis reactor diagnostics and agronomic field validation.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-[#FAF9F6]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[10px] text-[#FAF9F6]/40 font-sans">
            &copy; 2026 Waqid. All rights reserved.
          </p>
          <p className="text-[10px] text-[#FAF9F6]/30 max-w-lg font-sans text-center md:text-right leading-relaxed">
            All statistics cited are sourced directly from peer-reviewed scientific databases, Malaysian Palm Oil Board reports, and Wild Asia farm interview registries (2024–2026).
          </p>
        </div>
      </footer>
    </div>
  );
}
