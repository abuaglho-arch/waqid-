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

const staggerDetailContainer = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.05,
      duration: 0.4,
      ease: "easeOut"
    } 
  }
};

const staggerDetailItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
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
  { index: "01", image: "/images/waste-accumulates.jpg", title: "Waste Becomes a Burden", desc: "Palm biomass, rice husks, and farm by-products are often left unused, burned, or poorly managed. WAQID starts by treating this waste as feedstock, not as a disposal problem." },
  { index: "02", image: "/images/methane-rises.png", title: "Methane Rises", desc: "When empty fruit bunches (EFBs) decay in wet piles, they release high-warming methane gases. WAQID intercepts these residue streams before anaerobic decomposition starts." },
  { index: "03", image: "/images/farmers-pay-more.jpg", title: "Farmers Pay More", desc: "Smallholders face soaring chemical fertilizer prices and degrading soil productivity. WAQID converts palm biomass into affordable soil amendments that restore fertility." },
  { index: "04", image: "/images/problem_cracked_soil_1780739623976.png", title: "Soils Decline", desc: "Intense farming strips Malaysian soils of essential moisture, nutrients, and carbon. WAQID's biochar acts as a permanent sponge, restoring structural health." },
  { index: "05", image: "/images/forests-suffer.jpg", title: "Forests Suffer", desc: "Clearing lands to offset falling yields threatens native ecosystems. By boosting existing farm productivity, WAQID limits the need to expand agricultural boundaries." },
  { index: "06", image: "/images/problem-visual.png", title: "Value is Lost", desc: "Millions of tonnes of crop energy and carbon are wasted every season. WAQID closes this loop, converting raw residues into stable carbon, heat, and rural value." }
];

const impactSteps = [
  {
    num: "01",
    tag: "Resource Recovery",
    title: "Waste Diversion & Upcycling",
    desc: "We divert palm waste, rice husks, and agricultural residues from open burning and natural decomposition, converting them into valuable resources.",
    metric: "100% Upcycled Biomass",
    detail: "Rather than letting residues pile up at palm oil processing mills, we intercept the waste streams to fuel local economic cycles.",
    icon: Factory
  },
  {
    num: "02",
    tag: "Atmospheric Protection",
    title: "Methane & Carbon Mitigation",
    desc: "By pyrolyzing palm biomass instead of leaving it to rot in wet fields, we prevent the anaerobic decay that produces high-warming methane gases.",
    metric: "Methane Decay Prevented",
    detail: "Rotting palm empty fruit bunches (EFB) release methane, which holds 34x more heat than CO2. Our pyrolysis pathway mitigates this atmospheric release.",
    icon: Wind
  },
  {
    num: "03",
    tag: "Carbon Storage",
    title: "Soil Carbon Sequestration",
    desc: "We lock stable carbon into a porous biochar structure that remains inert in agricultural soils for hundreds of years, preventing carbon return to the air.",
    metric: "Centuries-Long Storage",
    detail: "Biochar acts as a permanent soil sponge, holding water and nitrogen nutrients in place while keeping carbon out of the global carbon cycle.",
    icon: Globe
  },
  {
    num: "04",
    tag: "Habitat Conservation",
    title: "Reduced Deforestation Pressure",
    desc: "Our briquette fuels are produced from agricultural waste, providing local industries and satay vendors with a direct substitute for wood charcoal.",
    metric: "Alternative to Wood Fuel",
    detail: "Traditional charcoal requires cutting down local trees. By using agricultural waste briquettes, we keep forests intact and preserve local biodiversity.",
    icon: Trees
  },
  {
    num: "05",
    tag: "Social Benefits",
    title: "Cleaner Local Air & Health",
    desc: "We offer rural families and street food vendors a virtually smokeless combustion solution, reducing toxic particulate matter in the air.",
    metric: "Smokeless Burning",
    detail: "Replacing dirty biomass burning and traditional wood fuels improves indoor and ambient air quality, reducing respiratory health risks.",
    icon: ShieldCheck
  }
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

const partnerLogos = [
  { src: "/images/wild-asia.png", alt: "Wild Asia" },
  { src: "/images/bevisioneers.png", alt: "beVisioneers" },
  { src: "/images/tzuchi-logo.png", alt: "Tzu Chi Foundation" },
  { src: "/images/albukhary-university.png", alt: "Albukhary International University" },
  { src: "/images/iylp-logo.png", alt: "Tzu Chi IYLP" }
];

const hypotheses = [
  {
    type: "Technical Hypothesis",
    question: "Can the TLUD kiln produce consistent biochar & briquettes?",
    method: "Continuous 24-hour throughput runs under real-world palm mill conditions.",
    metric: "Carbon content > 75%, thermal efficiency > 40%.",
    status: "Scheduled for V3 Pilot",
    statusType: "scheduled",
    color: "#2E7D32"
  },
  {
    type: "User Hypothesis",
    question: "Will smallholder farmers easily adopt pelletized biochar?",
    method: "Field trials with 20+ smallholders applying pellets with standard fertilizer spreaders.",
    metric: "Zero extra labor reported, > 80% willingness-to-recommend index.",
    status: "Scheduled for V3 Pilot",
    statusType: "scheduled",
    color: "#4CAF50"
  },
  {
    type: "Value Hypothesis",
    question: "Will local businesses switch to smokeless sustainable charcoal?",
    method: "Blind testing of heating value, burn-time, and smoke profile with 10 commercial satay vendors.",
    metric: "Burn-time > 4 hours, equivalent heat output to wood charcoal.",
    status: "Scheduled for V3 Pilot",
    statusType: "scheduled",
    color: "#2E7D32"
  },
  {
    type: "Scientific Validation",
    question: "Can biochar measurably improve water & nutrient retention?",
    method: "Lab soil columns and early test-pot trials comparing biochar-compost mixtures against raw soil.",
    metric: "Nutrient leaching reduced by 25-30%, water retention increased > 18%.",
    status: "Validated in Lab",
    statusType: "validated",
    color: "#4CAF50"
  }
];

const reactorStages = [
  {
    num: "01",
    title: "Feedstock Preparation",
    subtitle: "Drying & Sizing",
    desc: "Raw palm Empty Fruit Bunches (EFBs), rice husks, and agricultural residues are shredded and pre-dried using reclaimed pyrolysis waste heat to achieve an optimal moisture level below 15%.",
    metric: "Moisture < 15%",
    temp: "Ambient to 100°C",
    detail: "Pre-treatment is essential. Removing excess moisture ensures rapid heating in the reactor core and prevents energy-wasting steam formation.",
    icon: RotateCw
  },
  {
    num: "02",
    title: "Oxygen-Depleted Pyrolysis",
    subtitle: "Thermochemical Carbonization",
    desc: "Biomass is fed into a sealed, oxygen-restricted pyrolysis chamber. Without oxygen, the organic matter carbonizes instead of burning, breaking down complex polymers.",
    metric: "Carbon Content > 75%",
    temp: "450°C - 600°C",
    detail: "This is where the magic happens. Thermal heat vaporizes volatile elements, leaving behind a highly porous, stable solid carbon matrix (biochar).",
    icon: Flame
  },
  {
    num: "03",
    title: "Clean Syngas Capture",
    subtitle: "Self-Sustaining Energy",
    desc: "Volatile gases (syngas) released during carbonization are captured, redirected, and burned in a high-temperature secondary combustion chamber to heat the reactor.",
    metric: "Zero External Fuel",
    temp: "800°C - 1000°C",
    detail: "Once initialized, the pyrolysis process runs entirely on its own volatile by-products, requiring zero external fuel or electrical inputs.",
    icon: Zap
  },
  {
    num: "04",
    title: "Biochar & Heat Output",
    subtitle: "Circular Yields",
    desc: "Stable biochar is discharged and cooled, locking carbon away permanently. The remaining clean, high-grade heat is harvested to dry new feedstock or offset agricultural energy needs.",
    metric: "Dual Value Loop",
    temp: "150°C Output",
    detail: "The reactor yields agronomy-ready biochar to restore farms, while simultaneously venting clean thermal heat for local mill processes.",
    icon: Sprout
  }
];

const sdgGoals = [
  {
    label: "SDG 1",
    title: "No Poverty",
    image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg",
    description: "By supplying affordable biochar and briquettes, we help smallholder farmers reduce synthetic fertilizer expenses and satay vendors reduce fuel costs."
  },
  {
    label: "SDG 2",
    title: "Zero Hunger",
    image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg",
    description: "Our biochar pellets act as a permanent soil sponge, retaining water and nutrients to restore degraded soils and boost crop yields."
  },
  {
    label: "SDG 7",
    title: "Affordable & Clean Energy",
    image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg",
    description: "We recover clean syngas and thermal energy to heat reactors and dry biomass, producing sustainable briquettes as a clean wood-charcoal alternative."
  },
  {
    label: "SDG 8",
    title: "Decent Work & Economic Growth",
    image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg",
    description: "We create rural economic value and local processing jobs by upcycling palm residues directly within farm districts."
  },
  {
    label: "SDG 12",
    title: "Responsible Consumption & Production",
    image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg",
    description: "We convert wet palm Empty Fruit Bunches (EFBs) and farm residues into high-value carbon products, closing the circular agricultural loop."
  },
  {
    label: "SDG 13",
    title: "Climate Action",
    image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg",
    description: "By carbonizing biomass, we prevent methane emissions from decaying crop wastes and sequester stable carbon in soils for hundreds of years."
  },
  {
    label: "SDG 15",
    title: "Life on Land",
    image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg",
    description: "We transform harmful waste into stable carbon, rehabilitating ecosystems by replacing toxic chemical fertilizers with natural soil amendments."
  },
  {
    label: "SDG 17",
    title: "Partnerships for the Goals",
    image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg",
    description: "We collaborate with local smallholders, palm oil mills, and regional partners (like Tzu Chi and Wild Asia) to validate circular biomass ecosystems."
  }
];

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeReactorStage, setActiveReactorStage] = useState(0);
  const [selectedFormRole, setSelectedFormRole] = useState("Mill Operator");
  const [calculatorRole, setCalculatorRole] = useState("Mill Operator");
  const [millEFB, setMillEFB] = useState(25000);
  const [disposalCost, setDisposalCost] = useState(50);
  const [farmArea, setFarmArea] = useState(50);
  const [fertilizerSpend, setFertilizerSpend] = useState(3000);
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
  const [activeImpactStep, setActiveImpactStep] = useState(0);

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
      const scrollableHeight = sectionHeight - Math.min(window.innerHeight, 720);
      
      // Scroll to exactly the point where the chosen card finishes entering
      const targetProgress = index === 1 ? 0.0 : 0.02 + ((index - 1) * (0.85 / 5));
      const targetScroll = sectionTop + (targetProgress * scrollableHeight);
      
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleCalculatorCTA = (role) => {
    const mappedRole = role === "Farm Cooperative" ? "Farmer / Cooperative" : role;
    setSelectedFormRole(mappedRole);
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
      a: "WAQID is currently in the prototype stage. We have tested our manual V1 and V2 reactors and are seeking catalytic funding and strategic partners to build our semi-automated V3 Pilot Reactor to validate operations at the palm mill level and run field trials for biochar application directly with local smallholders."
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
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer focus:outline-none bg-transparent border-transparent p-0"
            aria-label="Scroll to top of WAQID"
          >
            <img src="/images/waqid-logo-transparent.png" alt="WAQID Logo" className="h-8 md:h-10 object-contain drop-shadow-md" />
          </motion.button>
          <div className="hidden md:flex items-center gap-8">
            {[
              { id: 'crisis', name: 'Crisis' },
              { id: 'solution', name: 'Solution' },
              { id: 'calculator', name: 'Calculator' },
              { id: 'impact', name: 'Impact' },
              { id: 'prototype-to-pilot', name: 'Prototype to Pilot' },
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
          <img 
            src="/images/waqid_circular_restoration_hero.png" 
            alt="WAQID Operations" 
            className="w-full h-full object-cover object-center" 
            fetchpriority="high"
            loading="eager"
          />
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
            <span className="text-gradient-light">Cooling the Planet.</span>
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

      {/* TRUST RAIL */}
      <div className="bg-[#FAF9F6] border-b border-[#2E7D32]/10 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]/60 whitespace-nowrap">
            Supported by &amp; Collaborating with:
          </span>
          <div className="w-full overflow-hidden relative">
            {/* Fade masks */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              animate={{ x: [0, "-50%"] }}
              transition={{
                ease: "linear",
                duration: 20,
                repeat: Infinity
              }}
              className="flex items-center gap-12 w-max"
            >
              {/* Set 1 */}
              {partnerLogos.map((logo, idx) => (
                <img 
                  key={`trust-set1-${idx}`} 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-7 md:h-8 object-contain mix-blend-multiply opacity-55 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
              ))}
              {/* Set 2 */}
              {partnerLogos.map((logo, idx) => (
                <img 
                  key={`trust-set2-${idx}`} 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-7 md:h-8 object-contain mix-blend-multiply opacity-55 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

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
            <div className="md:col-span-7 flex flex-col gap-4">
              <p className="text-base md:text-xl text-[#0C1D13]/80 font-serif leading-relaxed italic border-l-4 border-[#2E7D32] pl-6 py-2">
                "WAQID began from a simple contradiction: some communities lack affordable clean energy, while others burn valuable biomass as waste. We close this logic gap by turning waste into soil restoration, cleaner fuel, and local climate resilience."
              </p>
              <p className="text-xs md:text-sm text-[#0C1D13]/70 font-sans leading-relaxed pl-7">
                Palm oil mills generate millions of tonnes of wet Empty Fruit Bunches (EFBs) annually, facing heavy waste disposal fees, logistics bottlenecks, and environment penalties for open decomposition. Simultaneously, smallholder farmers face declining soil fertility and high chemical fertilizer prices. WAQID offers mills a circular, decentralized technology that bypasses landfill disposal, while equipping farms with nutrient-dense biochar pellets to restore agricultural soil, reduce chemical input costs, and improve crop resilience.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. THE CRISIS WE CAN NO LONGER IGNORE */}
      {prefersReducedMotion || isMobile ? (
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
                  Palm Waste Is Not the Problem. The Broken Loop Is.
                </h2>
                <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans mt-4 leading-relaxed">
                  Every year, palm residues are treated as waste while farmers pay more to restore tired soils. What should become local soil and energy value is left to burn, rot, or create pressure across the system.
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
              <motion.div 
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985 }}
                style={{ 
                  position: 'sticky', 
                  left: '1.5rem',
                  zIndex: 11
                }}
                className="snap-center shrink-0 w-[85vw] sm:w-[420px] h-[450px] sm:h-[480px] bg-[#FAF9F6] p-6 md:p-8 rounded-3xl border border-[#2E7D32]/10 shadow-xl flex flex-col justify-between text-left cursor-pointer group"
              >
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Key Metrics</span>
                  <h3 className="text-2xl md:text-3xl font-display font-black text-[#0C1D13] mt-2 mb-2 leading-tight">The Magnitude of the Problem</h3>
                  <p className="text-xs text-[#0C1D13]/70 font-sans leading-relaxed mb-4">
                    Malaysia’s palm biomass challenge is not only a waste issue. It is linked to emissions, soil degradation, and lost rural value.
                  </p>
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
                    <p className="text-xs text-[#0C1D13]/70 font-sans">Empty Fruit Bunches left unmanaged, burned, or underutilized each year.</p>
                  </div>
                  <div>
                    <h4 className="text-3xl md:text-4xl font-serif font-bold text-[#2E7D32] mb-1">
                      <Counter value="30" prefix="Around " suffix="x" /> <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-1.5">warming impact</span>
                    </h4>
                    <p className="text-xs text-[#0C1D13]/70 font-sans">Methane can have around 27 to 30 times the warming impact of CO₂ over 100 years.</p>
                  </div>
                </div>
              </motion.div>

              {crisisCards.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                  whileTap={{ scale: 0.985 }}
                  style={{ 
                    position: 'sticky', 
                    left: `calc(1.5rem + ${(idx + 1) * 16}px)`,
                    zIndex: 12 + idx
                  }}
                  className="snap-center shrink-0 w-[85vw] sm:w-[380px] h-[450px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl relative group border border-[#2E7D32]/10 cursor-pointer"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D13]/95 via-[#0C1D13]/55 to-transparent transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-left z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-sans font-bold text-[#4CAF50]">[ {item.index} ]</span>
                      <h4 className="font-display font-bold text-xl md:text-2xl text-[#FAF9F6]">{item.title}</h4>
                    </div>
                    <p className="text-xs md:text-sm text-[#FAF9F6]/85 font-sans leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      ) : (
        <section 
          ref={crisisSectionRef} 
          id="crisis" 
          className="relative h-[240vh] bg-[#FAF9F6] border-b border-[#2E7D32]/10 text-left"
        >
          <div className="sticky top-0 h-[100vh] max-h-[720px] w-full overflow-hidden flex items-center bg-[#FAF9F6]">
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
                    Palm Waste Is Not the Problem. The Broken Loop Is.
                  </h2>
                  <p className="text-sm text-[#0C1D13]/70 font-sans leading-relaxed mt-1.5">
                    Every year, palm residues are treated as waste while farmers pay more to restore tired soils. What should become local soil and energy value is left to burn, rot, or create pressure across the system.
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
                      Scroll through the broken loop
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
                <div className="w-full bg-gradient-to-br from-[#FAF9F6] to-[#FAF9F6]/80 p-6 rounded-3xl border border-[#2E7D32]/10 shadow-[0_8px_30px_rgba(12,29,19,0.04)] hover:border-[#2E7D32]/25 hover:shadow-[0_12px_40px_rgba(12,29,19,0.06)] transition-all duration-300 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Key Metrics</span>
                    <h3 className="text-base lg:text-lg font-display font-black text-[#0C1D13] mt-1 mb-1.5 leading-tight">The Magnitude of the Problem</h3>
                    <p className="text-[10px] text-[#0C1D13]/70 font-sans leading-relaxed mb-3">
                      Malaysia’s palm biomass challenge is not only a waste issue. It is linked to emissions, soil degradation, and lost rural value.
                    </p>
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
                      <p className="text-[10px] text-[#0C1D13]/70 font-sans">Empty Fruit Bunches left unmanaged, burned, or underutilized each year.</p>
                    </div>
                    <div>
                      <h4 className="text-xl lg:text-2xl font-serif font-bold text-[#2E7D32] mb-0.5">
                        <Counter value="30" prefix="Around " suffix="x" /> <span className="text-[9px] font-sans font-normal text-[#0C1D13]/50 ml-1">warming impact</span>
                      </h4>
                      <p className="text-[10px] text-[#0C1D13]/70 font-sans">Methane can have around 27 to 30 times the warming impact of CO₂ over 100 years.</p>
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
                <div className="relative w-[85vw] sm:w-[380px] h-[360px] sm:h-[420px] max-w-[340px] sm:max-w-none overflow-visible">
                  
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
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D13]/95 via-[#0C1D13]/55 to-transparent transition-opacity duration-300" />

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

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex lg:grid overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory hide-scrollbar gap-6 pb-6 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0"
          >
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="glass-card snap-center shrink-0 w-[85vw] sm:w-[280px] lg:w-auto p-8 rounded-3xl flex flex-col group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <RotateCw className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Waste Recovery</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Converts unmanaged palm biomass into useful outputs instead of burning or decomposition.
              </p>
            </motion.div>
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="glass-card snap-center shrink-0 w-[85vw] sm:w-[280px] lg:w-auto p-8 rounded-3xl flex flex-col group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Clean Heat</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Produces thermal energy that can support mill or local operations.
              </p>
            </motion.div>
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="glass-card snap-center shrink-0 w-[85vw] sm:w-[280px] lg:w-auto p-8 rounded-3xl flex flex-col group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Sprout className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Soil Restoration</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Creates biochar-based soil products designed to improve soil health and reduce input dependency.
              </p>
            </motion.div>
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="glass-card snap-center shrink-0 w-[85vw] sm:w-[280px] lg:w-auto p-8 rounded-3xl flex flex-col group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Hexagon className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Sustainable Briquettes</h4>
              <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                Produces smokeless solid fuels as a direct, forest-friendly alternative to wood charcoal.
              </p>
            </motion.div>
          </motion.div>
          
          <div className="flex lg:hidden items-center justify-center gap-1.5 mt-4">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#2E7D32]/60 animate-pulse flex items-center gap-1">
              <span>Swipe to explore</span>
              <span>→</span>
            </span>
          </div>

          {/* Reactor Explainer */}
          <div className="mt-20 border-t border-[#2E7D32]/10 pt-16">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Engineering Excellence</span>
              <h3 className="text-2xl md:text-3xl font-display font-black text-[#0C1D13] mt-2 mb-4">Inside the V3 Pyrolysis Unit</h3>
              <p className="text-sm text-[#0C1D13]/70 font-sans leading-relaxed">
                Our Top-Lit Updraft (TLUD) reactor utilizes controlled thermochemical conversion to recycle carbon and energy out of raw residues, requiring zero external fuel inputs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Selector List */}
              <div className="lg:col-span-5 flex flex-row overflow-x-auto snap-x hide-scrollbar lg:flex-col gap-3 justify-start lg:justify-center -mx-6 px-6 lg:mx-0 lg:px-0 pb-4 lg:pb-0">
                {reactorStages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isActive = activeReactorStage === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveReactorStage(idx)}
                      onMouseEnter={() => setActiveReactorStage(idx)}
                      className={`relative flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer snap-center shrink-0 w-[65vw] sm:w-[220px] lg:w-auto ${
                        isActive 
                          ? 'bg-[#FAF9F6] border border-[#2E7D32]/10 shadow-[0_8px_30px_rgba(12,29,19,0.04)]' 
                          : 'hover:bg-[#F0EFEA]/60 border border-transparent'
                      }`}
                    >
                      {/* Active highlight background border indicator */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeReactorIndicator"
                          className="absolute bg-[#2E7D32] bottom-0 left-0 right-0 h-[3px] lg:h-auto lg:inset-y-0 lg:left-0 lg:w-1 rounded-b-2xl lg:rounded-l-2xl lg:rounded-br-none" 
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isActive ? 'bg-[#152E1E] text-[#4CAF50]' : 'bg-[#0C1D13]/5 text-[#0C1D13]/60'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div>
                        <span className="text-[10px] font-sans font-bold text-[#2E7D32]/60 uppercase tracking-widest block">
                          Stage {stage.num}
                        </span>
                        <h4 className="font-display font-bold text-base text-[#0C1D13] mt-0.5 leading-tight">
                          {stage.title}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Detail Card */}
              <div className="lg:col-span-7">
                <motion.div 
                  key={activeReactorStage}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full bg-[#0C1D13] text-[#FAF9F6] rounded-3xl p-8 border border-[#2E7D32]/25 shadow-xl relative overflow-hidden flex flex-col justify-between text-left"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4CAF50]/10 rounded-full blur-[60px] pointer-events-none" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 rounded-full bg-[#152E1E] border border-[#2E7D32]/30 text-[10px] font-sans font-black text-[#4CAF50] uppercase tracking-widest">
                        {reactorStages[activeReactorStage].subtitle}
                      </span>
                      <span className="text-4xl font-serif font-bold text-[#4CAF50]/20">
                        {reactorStages[activeReactorStage].num}
                      </span>
                    </div>

                    <h4 className="font-display font-black text-2xl mb-4 leading-tight">
                      {reactorStages[activeReactorStage].title}
                    </h4>
                    
                    <p className="text-sm text-[#FAF9F6]/85 font-sans leading-relaxed mb-6">
                      {reactorStages[activeReactorStage].desc}
                    </p>

                    <div className="border-l-2 border-[#4CAF50]/30 pl-4 py-1.5 mb-8">
                      <p className="text-xs text-[#FAF9F6]/70 font-sans italic leading-relaxed">
                        {reactorStages[activeReactorStage].detail}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#FAF9F6]/10 pt-6">
                    <div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-1">Target Output Spec</span>
                      <span className="text-sm font-display font-bold text-[#FAF9F6]">{reactorStages[activeReactorStage].metric}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-1">Temperature Profile</span>
                      <span className="text-sm font-display font-bold text-[#FAF9F6]">{reactorStages[activeReactorStage].temp}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4.5. WASTE-TO-VALUE CALCULATOR */}
      <motion.section 
        variants={sectionReveal} 
        initial="initial" 
        whileInView="whileInView" 
        viewport={{ once: true, margin: "-50px" }} 
        id="calculator" 
        className="bg-[#FAF9F6] py-20 md:py-28 border-b border-[#2E7D32]/10 text-left relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2E7D32]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Interactive Estimator
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              Waste-to-Value Calculator
            </h2>
            <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans mt-4 leading-relaxed">
              Select your stakeholder role below and toggle active operational parameters to see estimated carbon, resource, and value returns.
            </p>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6" />
          </div>

          <div className="max-w-5xl mx-auto bg-[#F0EFEA] rounded-[2.5rem] border border-[#2E7D32]/15 shadow-xl overflow-hidden p-8 md:p-12">
            
            {/* Stakeholder Switcher */}
            <div className="flex justify-center gap-3 mb-12 flex-wrap">
              <button
                type="button"
                onClick={() => setCalculatorRole("Mill Operator")}
                className={`px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  calculatorRole === "Mill Operator"
                    ? 'bg-[#152E1E] text-[#FAF9F6] shadow-lg scale-105'
                    : 'bg-[#FAF9F6] text-[#0C1D13] hover:bg-[#FAF9F6]/80 border border-[#2E7D32]/10'
                }`}
              >
                I am a Palm Oil Mill Operator
              </button>
              <button
                type="button"
                onClick={() => setCalculatorRole("Farmer")}
                className={`px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  calculatorRole === "Farmer"
                    ? 'bg-[#152E1E] text-[#FAF9F6] shadow-lg scale-105'
                    : 'bg-[#FAF9F6] text-[#0C1D13] hover:bg-[#FAF9F6]/80 border border-[#2E7D32]/10'
                }`}
              >
                I am a Farmer / Landowner
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              
              {/* Left Column: Sliders */}
              <div className="lg:col-span-6 flex flex-col justify-center gap-8 text-left">
                {calculatorRole === "Mill Operator" ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
                          Annual EFB Biomass Generated
                        </label>
                        <span className="text-xl font-serif font-black text-[#2E7D32]">
                          {millEFB.toLocaleString()} <span className="text-xs font-sans font-normal text-[#0C1D13]/50">tonnes</span>
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1000" 
                        max="100000" 
                        step="1000"
                        value={millEFB}
                        onChange={(e) => setMillEFB(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#FAF9F6] rounded-lg appearance-none cursor-pointer accent-[#2E7D32] focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-[#0C1D13]/40 font-sans font-bold">
                        <span>1,000 t</span>
                        <span>50,000 t</span>
                        <span>100,000 t</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
                          Current Biomass Disposal Cost
                        </label>
                        <span className="text-xl font-serif font-black text-[#2E7D32]">
                          RM {disposalCost} <span className="text-xs font-sans font-normal text-[#0C1D13]/50">/ tonne</span>
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="150" 
                        step="5"
                        value={disposalCost}
                        onChange={(e) => setDisposalCost(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#FAF9F6] rounded-lg appearance-none cursor-pointer accent-[#2E7D32] focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-[#0C1D13]/40 font-sans font-bold">
                        <span>RM 10</span>
                        <span>RM 80</span>
                        <span>RM 150</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
                          Farm Crop Land Area
                        </label>
                        <span className="text-xl font-serif font-black text-[#2E7D32]">
                          {farmArea} <span className="text-xs font-sans font-normal text-[#0C1D13]/50">hectares</span>
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="500" 
                        step="1"
                        value={farmArea}
                        onChange={(e) => setFarmArea(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#FAF9F6] rounded-lg appearance-none cursor-pointer accent-[#2E7D32] focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-[#0C1D13]/40 font-sans font-bold">
                        <span>1 ha</span>
                        <span>250 ha</span>
                        <span>500 ha</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
                          Chemical Fertilizer Spending
                        </label>
                        <span className="text-xl font-serif font-black text-[#2E7D32]">
                          RM {fertilizerSpend.toLocaleString()} <span className="text-xs font-sans font-normal text-[#0C1D13]/50">/ ha / yr</span>
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="500" 
                        max="10000" 
                        step="250"
                        value={fertilizerSpend}
                        onChange={(e) => setFertilizerSpend(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#FAF9F6] rounded-lg appearance-none cursor-pointer accent-[#2E7D32] focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-[#0C1D13]/40 font-sans font-bold">
                        <span>RM 500</span>
                        <span>RM 5,250</span>
                        <span>RM 10,000</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Dynamic Outputs */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-6">
                <div className="grid grid-cols-2 gap-4">
                  {calculatorRole === "Mill Operator" ? (
                    <>
                      <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 text-left">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/50 block mb-1">
                          Estimated Biochar Yield
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-[#2E7D32] leading-none mb-1">
                          {(millEFB * 0.25).toLocaleString()} <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-0.5">t/yr</span>
                        </h4>
                        <p className="text-[10px] text-[#0C1D13]/60 font-sans leading-tight">Converted organic carbon pellets.</p>
                      </div>

                      <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 text-left">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/50 block mb-1">
                          Disposal Cost Savings
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-[#2E7D32] leading-none mb-1">
                          RM {(millEFB * disposalCost).toLocaleString()}
                        </h4>
                        <p className="text-[10px] text-[#0C1D13]/60 font-sans leading-tight">Bypassing heavy tipping/logistics fees.</p>
                      </div>

                      <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 text-left">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/50 block mb-1">
                          Carbon Offset Potential
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-[#2E7D32] leading-none mb-1">
                          {(millEFB * 0.55).toLocaleString()} <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-0.5">tCO2e</span>
                        </h4>
                        <p className="text-[10px] text-[#0C1D13]/60 font-sans leading-tight">Methane decay & carbon lock avoidance.</p>
                      </div>

                      <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 text-left">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/50 block mb-1">
                          Clean Thermal Energy
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-[#2E7D32] leading-none mb-1">
                          {(millEFB * 1.5).toLocaleString()} <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-0.5">MWh</span>
                        </h4>
                        <p className="text-[10px] text-[#0C1D13]/60 font-sans leading-tight">Heat available for mill pre-heaters.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 text-left">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/50 block mb-1">
                          Biochar Dressing Needed
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-[#2E7D32] leading-none mb-1">
                          {(farmArea * 2.5).toLocaleString()} <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-0.5">tonnes</span>
                        </h4>
                        <p className="text-[10px] text-[#0C1D13]/60 font-sans leading-tight">Recommended 2.5t/ha soil amendment.</p>
                      </div>

                      <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 text-left">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/50 block mb-1">
                          Water Retention Boost
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-[#2E7D32] leading-none mb-1">
                          {(farmArea * 75000).toLocaleString()} <span className="text-xs font-sans font-normal text-[#0C1D13]/50 ml-0.5">Litres</span>
                        </h4>
                        <p className="text-[10px] text-[#0C1D13]/60 font-sans leading-tight">Additional soil moisture absorption capacity.</p>
                      </div>

                      <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 text-left">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/50 block mb-1">
                          Fertilizer Cost Offset
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-[#2E7D32] leading-none mb-1">
                          RM {(farmArea * fertilizerSpend * 0.30).toLocaleString()}
                        </h4>
                        <p className="text-[10px] text-[#0C1D13]/60 font-sans leading-tight">Up to 30% reduction in chemical inputs.</p>
                      </div>

                      <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#2E7D32]/10 text-left">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/50 block mb-1">
                          Estimated Crop Yield
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-[#2E7D32] leading-none mb-1">
                          +15% - 25%
                        </h4>
                        <p className="text-[10px] text-[#0C1D13]/60 font-sans leading-tight">Agronomic harvest improvement range.</p>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCalculatorCTA(calculatorRole === "Mill Operator" ? "Mill Operator" : "Farm Cooperative")}
                  className="btn-hover-shadow w-full bg-[#152E1E] hover:bg-[#2E7D32] hover:text-[#FAF9F6] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#2E7D32]/25 group"
                >
                  Schedule validation run <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </motion.section>

      {/* 5. CIRCULAR CARBON LOOP DIAGRAM */}
      <motion.section 
        variants={sectionReveal} 
        initial="initial" 
        whileInView="whileInView" 
        viewport={{ once: true, margin: "-50px" }} 
        className="bg-[#FAF9F6] py-12 border-b border-[#2E7D32]/10 text-center"
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-col justify-center items-center">
          <img 
            src="/images/waqid-circular-carbon-loop.png" 
            alt="The WAQID Circular Carbon Loop Flowchart" 
            className="w-full h-auto object-contain select-none"
          />
        </div>
      </motion.section>

      {/* 6. ENVIRONMENTAL IMPACT PATHWAY */}

      <motion.section 
        variants={sectionReveal} 
        initial="initial" 
        whileInView="whileInView" 
        viewport={{ once: true, margin: "-50px" }} 
        id="impact" 
        className="bg-[#0C1D13] py-20 md:py-28 relative overflow-hidden border-b border-[#2E7D32]/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,transparent_40%,#152E1E_100%)] pointer-events-none opacity-50" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-hero-pattern pointer-events-none" />

        {/* Floating Sparks/Embers overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="ember animate-ember-1 left-[15%]" style={{ animationDelay: '1s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-2 left-[35%]" style={{ animationDelay: '3s', width: '2px', height: '2px' }} />
          <div className="ember animate-ember-3 left-[50%]" style={{ animationDelay: '5s', width: '4px', height: '4px' }} />
          <div className="ember animate-ember-1 left-[65%]" style={{ animationDelay: '2s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-2 left-[85%]" style={{ animationDelay: '6s', width: '2px', height: '2px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-3">
              Measurable Outcomes
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] leading-tight">
              Environmental Impact Pathway
            </h2>
            <p className="text-xs md:text-sm text-[#FAF9F6]/70 font-sans mt-4 max-w-lg mx-auto leading-relaxed">
              Explore the five critical stages where WAQID redirects carbon flows to restore soil health, clean the air, and prevent deforestation.
            </p>
            <div className="w-12 h-[1px] bg-[#4CAF50] mx-auto mt-6" />
          </div>

          {/* Interactive Stepper Grid on Desktop */}
          <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch mb-20 max-w-6xl mx-auto">
            
            {/* Step Selection Column (Span 5) */}
            <div className="col-span-5 flex flex-col gap-4 justify-center">
              {impactSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isActive = activeImpactStep === idx;
                return (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveImpactStep(idx)}
                    onClick={() => setActiveImpactStep(idx)}
                    className="relative flex items-center gap-4 p-5 rounded-2xl border border-transparent text-left group focus:outline-none cursor-pointer overflow-hidden bg-transparent"
                  >
                    {isActive ? (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute inset-0 bg-[#152E1E] border border-[#4CAF50] rounded-2xl shadow-[0_0_20px_rgba(76,175,80,0.15)] z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#152E1E]/30 border border-[#2E7D32]/10 rounded-2xl hover:border-[#2E7D32]/35 hover:bg-[#152E1E]/50 transition-all duration-300 z-0" />
                    )}

                    {/* Badge */}
                    <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#4CAF50] text-[#0C1D13] scale-105' 
                        : 'bg-[#0C1D13] text-[#4CAF50]/65 group-hover:text-[#4CAF50] group-hover:scale-102'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="relative z-10 flex-grow">
                      <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4CAF50]/55 mb-0.5">
                        STAGE {step.num}
                      </div>
                      <h4 className={`font-display font-bold text-base transition-colors duration-300 ${
                        isActive ? 'text-[#FAF9F6]' : 'text-[#FAF9F6]/70 group-hover:text-[#FAF9F6]'
                      }`}>
                        {step.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Display Detail Panel Column (Span 7) */}
            <div className="col-span-7 flex">
              <motion.div 
                key={activeImpactStep}
                variants={staggerDetailContainer}
                initial="hidden"
                animate="visible"
                className="w-full bg-[#152E1E]/45 border border-[#2E7D32]/25 p-8 md:p-10 rounded-[2rem] flex flex-col justify-between relative overflow-hidden shadow-2xl"
              >
                {/* Large Background Step Number */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
                  }}
                  className="text-[10rem] font-display font-black text-[#4CAF50]/5 absolute -top-8 -right-6 pointer-events-none select-none"
                >
                  {impactSteps[activeImpactStep].num}
                </motion.div>

                <div className="relative z-10 text-left">
                  <motion.span 
                    variants={staggerDetailItem}
                    className="inline-block px-3 py-1 rounded-full bg-[#4CAF50]/15 border border-[#4CAF50]/20 text-[9px] font-sans font-black text-[#4CAF50] uppercase tracking-widest"
                  >
                    {impactSteps[activeImpactStep].tag}
                  </motion.span>
                  
                  <motion.h3 
                    variants={staggerDetailItem}
                    className="font-display font-black text-2xl md:text-3xl text-[#FAF9F6] mt-6 mb-4"
                  >
                    {impactSteps[activeImpactStep].title}
                  </motion.h3>
                  
                  <motion.p 
                    variants={staggerDetailItem}
                    className="text-sm text-[#FAF9F6]/80 font-sans leading-relaxed mb-6"
                  >
                    {impactSteps[activeImpactStep].desc}
                  </motion.p>
                </div>

                <motion.div 
                  variants={staggerDetailItem}
                  className="relative z-10 border border-[#2E7D32]/35 bg-[#0C1D13]/60 rounded-2xl p-5 md:p-6 text-left"
                >
                  <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4CAF50] mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Environmental Indicator
                  </div>
                  <h4 className="font-display font-bold text-base text-[#FAF9F6] mb-1.5">
                    {impactSteps[activeImpactStep].metric}
                  </h4>
                  <p className="text-xs text-[#FAF9F6]/65 font-sans leading-relaxed">
                    {impactSteps[activeImpactStep].detail}
                  </p>
                </motion.div>
              </motion.div>
            </div>

          </div>

          {/* Accordion List on Mobile & Tablet */}
          <div className="lg:hidden flex flex-col gap-4 max-w-2xl mx-auto mb-16">
            {impactSteps.map((step, idx) => {
              const IconComponent = step.icon;
              const isActive = activeImpactStep === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 border-l-4 ${
                    isActive ? 'border-[#4CAF50] bg-[#152E1E]' : 'border-[#2E7D32]/15 bg-[#152E1E]/15 border-l-transparent'
                  }`}
                >
                  <button 
                    onClick={() => setActiveImpactStep(isActive ? -1 : idx)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-xs ${
                        isActive ? 'bg-[#4CAF50] text-[#0C1D13]' : 'bg-[#0C1D13] text-[#4CAF50]/70'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#4CAF50]/55">
                          STAGE {step.num}
                        </div>
                        <span className="font-display font-bold text-[#FAF9F6] text-sm sm:text-base">{step.title}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-[#4CAF50] transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                      isActive ? 'max-h-[350px] pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="border-t border-[#2E7D32]/20 pt-4 flex flex-col gap-4 text-left">
                      <p className="text-xs text-[#FAF9F6]/80 font-sans leading-relaxed">
                        {step.desc}
                      </p>
                      
                      <div className="border border-[#2E7D32]/30 bg-[#0C1D13]/40 rounded-xl p-4">
                        <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#4CAF50] mb-1">
                          {step.metric}
                        </div>
                        <p className="text-[11px] text-[#FAF9F6]/65 font-sans leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Re-open max-w-7xl container for stats */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* PILOT TARGET STATS */}
          <div className="text-center mb-8 mt-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] text-[10px] font-sans font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              V3 Demonstration Targets & Milestones
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 relative overflow-hidden cursor-pointer group"
            >
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20">
                <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Target</span>
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Residue Diversion</span>
              <h3 className="text-4xl font-serif font-bold text-[#0C1D13] mt-4 mb-1"><Counter value="15000" /> <span className="text-xl font-sans font-normal text-[#0C1D13]/50">kg</span></h3>
              <p className="font-bold text-[#0C1D13] mb-4 text-sm">Palm Waste to Divert</p>
              <p className="text-xs text-[#0C1D13]/60 font-sans leading-relaxed">Our first V3 pilot aims to divert 15,000 kg of palm waste from burning or decomposition.</p>
            </motion.div>
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 relative overflow-hidden cursor-pointer group"
            >
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20">
                <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Target</span>
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#2E7D32]">Soil Hydrology</span>
              <h3 className="text-4xl font-serif font-bold text-[#0C1D13] mt-4 mb-1">~ <Counter value="18" suffix=" %" /> <span className="text-xl font-sans font-normal text-[#0C1D13]/50">gain</span></h3>
              <p className="font-bold text-[#0C1D13] mb-4 text-sm">Water Retention Goal</p>
              <p className="text-xs text-[#0C1D13]/60 font-sans leading-relaxed">We aim to improve soil water retention by approximately 18% based on established agronomic data and our early lab results.</p>
            </motion.div>
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#2E7D32]/10 relative overflow-hidden cursor-pointer group"
            >
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

      {/* UN SDGs GLOBAL GOALS MARQUEE */}
      <motion.section 
        variants={sectionReveal} 
        initial="initial" 
        whileInView="whileInView" 
        viewport={{ once: true, margin: "-50px" }} 
        className="bg-[#0C1D13] py-20 text-left relative overflow-hidden border-b border-[#2E7D32]/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,transparent_60%,#152E1E_100%)] pointer-events-none opacity-40" />
        
        {/* Floating Sparks/Embers overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="ember animate-ember-2 left-[10%]" style={{ animationDelay: '1s', width: '2px', height: '2px' }} />
          <div className="ember animate-ember-1 left-[35%]" style={{ animationDelay: '0s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-3 left-[65%]" style={{ animationDelay: '4s', width: '4px', height: '4px' }} />
          <div className="ember animate-ember-2 left-[85%]" style={{ animationDelay: '2s', width: '2px', height: '2px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-12 text-center">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50]">
              Global Sustainability Metrics
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] mt-3">
              UN Sustainable Development Goals
            </h2>
            <p className="text-xs md:text-sm text-[#FAF9F6]/80 font-sans mt-4 max-w-2xl mx-auto leading-relaxed">
              WAQID aligns its decentralized circular biomass systems directly with the United Nations 2030 Agenda for Sustainable Development.
            </p>
          </div>
        </div>

        {/* Infinite Moving Marquee */}
        <div className="relative w-full overflow-hidden py-4 mask-marquee z-20">
          <div className="flex w-max gap-6 animate-marquee-loop">
            {/* Set 1 */}
            {sdgGoals.map((sdg, idx) => (
              <div 
                key={`sdg-set1-${idx}`} 
                className="w-[300px] md:w-[340px] bg-[#0D1F14]/80 backdrop-blur-md p-6 rounded-[2rem] border border-[#2E7D32]/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col justify-between shrink-0 hover:border-[#4CAF50]/50 hover:bg-[#152E1E] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex gap-5 items-center mb-5">
                  <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:scale-105 group-hover:shadow-[#4CAF50]/20 transition-all duration-300">
                    <img 
                      src={sdg.image} 
                      alt={sdg.title} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-1">
                      {sdg.label}
                    </span>
                    <h4 className="font-display font-bold text-base text-[#FAF9F6] leading-snug">
                      {sdg.title}
                    </h4>
                  </div>
                </div>
                <p className="text-[13px] text-[#FAF9F6]/80 font-sans leading-relaxed mt-auto">
                  {sdg.description}
                </p>
              </div>
            ))}

            {/* Set 2 (Duplicate for loop) */}
            {sdgGoals.map((sdg, idx) => (
              <div 
                key={`sdg-set2-${idx}`} 
                className="w-[300px] md:w-[340px] bg-[#0D1F14]/80 backdrop-blur-md p-6 rounded-[2rem] border border-[#2E7D32]/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col justify-between shrink-0 hover:border-[#4CAF50]/50 hover:bg-[#152E1E] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex gap-5 items-center mb-5">
                  <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:scale-105 group-hover:shadow-[#4CAF50]/20 transition-all duration-300">
                    <img 
                      src={sdg.image} 
                      alt={sdg.title} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-1">
                      {sdg.label}
                    </span>
                    <h4 className="font-display font-bold text-base text-[#FAF9F6] leading-snug">
                      {sdg.title}
                    </h4>
                  </div>
                </div>
                <p className="text-[13px] text-[#FAF9F6]/80 font-sans leading-relaxed mt-auto">
                  {sdg.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 7. PROTOTYPE TO PILOT */}
      <motion.section 
        variants={sectionReveal} 
        initial="initial" 
        whileInView="whileInView" 
        viewport={{ once: true, margin: "-50px" }} 
        id="prototype-to-pilot" 
        className="bg-[#FAF9F6] py-20 md:py-28 border-b border-[#2E7D32]/10 text-left"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
              Milestone Pathway
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#0C1D13] mt-3">
              Prototype to Pilot
            </h2>
            <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans mt-4 leading-relaxed max-w-2xl mx-auto">
              WAQID is bridging the gap between low-cost prototypes and mill-scale systems. We are validating our technical systems, user adoption, and future business model through active field testing.
            </p>
            <div className="w-12 h-[1px] bg-[#2E7D32] mx-auto mt-6" />
          </div>

          {/* Sub-Section A: Built in the Dirt (Traction Gallery) */}
          <div className="mb-20">
            <div className="mb-8 text-center md:text-left">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                Traction & Hardware
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-black text-[#0C1D13] mt-2">
                Built in the Dirt
              </h3>
              <p className="text-xs md:text-sm text-[#0C1D13]/70 font-sans mt-2">
                Real testing, real materials. From manual oil drums to pilot reactor engineering.
              </p>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory hide-scrollbar gap-6 pb-6 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 max-w-6xl mx-auto"
            >
              <motion.div 
                variants={fadeUpVariant} 
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985 }}
                className="snap-center shrink-0 w-[85vw] sm:w-[350px] md:w-auto rounded-3xl overflow-hidden border border-[#2E7D32]/20 shadow-lg relative group aspect-[4/3] cursor-pointer"
              >
                <img src="/images/v1-pyrolysis-unit.jpg" alt="V1 Pyrolysis Unit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0C1D13] to-transparent p-6 pt-20 text-left">
                  <h4 className="text-[#FAF9F6] font-display font-bold text-xl">V1 Pyrolysis Unit</h4>
                  <p className="text-[#FAF9F6]/80 text-sm font-sans mt-1">Manual oil drum TLUD reactor tested in Perak.</p>
                </div>
              </motion.div>
              <motion.div 
                variants={fadeUpVariant} 
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985 }}
                className="snap-center shrink-0 w-[85vw] sm:w-[350px] md:w-auto rounded-3xl overflow-hidden border border-[#2E7D32]/20 shadow-lg relative group aspect-[4/3] cursor-pointer"
              >
                <img src="/images/v3-reactor-real.jpg" alt="V3 Pyrolysis Reactor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0C1D13] to-transparent p-6 pt-20 text-left">
                  <h4 className="text-[#FAF9F6] font-display font-bold text-xl">Mobile Biochar Pyrolysis</h4>
                  <p className="text-[#FAF9F6]/80 text-sm font-sans mt-1">Semi-automated V3 Pilot Unit.</p>
                </div>
              </motion.div>
              <motion.div 
                variants={fadeUpVariant} 
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985 }}
                className="snap-center shrink-0 w-[85vw] sm:w-[350px] md:w-auto rounded-3xl overflow-hidden border border-[#2E7D32]/20 shadow-lg relative group aspect-[4/3] cursor-pointer"
              >
                <img src="/images/organic-biochar.png" alt="Granular Pellets" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0C1D13] to-transparent p-6 pt-20 text-left">
                  <h4 className="text-[#FAF9F6] font-display font-bold text-xl">Granular Pellets</h4>
                  <p className="text-[#FAF9F6]/80 text-sm font-sans mt-1">3–6mm dust-free biochar-compost blend.</p>
                </div>
              </motion.div>
            </motion.div>
            
            <div className="flex md:hidden items-center justify-center gap-1.5 mt-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#2E7D32]/60 animate-pulse flex items-center gap-1">
                <span>Swipe to explore</span>
                <span>→</span>
              </span>
            </div>
          </div>

          {/* Sub-Section B: Core Hypotheses & Field Validation Status */}
          <div className="mb-20">
            <div className="mb-8 text-center md:text-left">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                Scientific Method
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-black text-[#0C1D13] mt-2">
                Core Hypotheses & Field Validation Status
              </h3>
              <p className="text-xs md:text-sm text-[#0C1D13]/70 font-sans mt-2">
                Systematically addressing critical assumptions before building high-capacity infrastructure.
              </p>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex lg:grid overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory hide-scrollbar gap-6 pb-6 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0"
            >
              {hypotheses.map((item, idx) => {
                const isDark = item.statusType === "validated";
                
                return (
                  <motion.div 
                    key={idx}
                    variants={fadeUpVariant} 
                    whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                    whileTap={{ scale: 0.985 }}
                    className={`snap-center shrink-0 w-[85vw] sm:w-[300px] lg:w-auto p-6 rounded-3xl flex flex-col justify-between min-h-[360px] relative overflow-hidden cursor-pointer group transition-all duration-300 ${
                      isDark 
                        ? "bg-[#152E1E] border-[#4CAF50]/30 shadow-lg text-[#FAF9F6]" 
                        : "glass-card text-[#0C1D13]"
                    }`}
                    style={{ borderTopWidth: "4px", borderTopColor: item.color }}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                          isDark 
                            ? "bg-[#4CAF50]/20 border-[#4CAF50]/30 text-[#4CAF50]" 
                            : "bg-[#152E1E] border-transparent text-[#4CAF50]"
                        }`}>
                          {idx === 0 && <Zap className="w-5 h-5" />}
                          {idx === 1 && <Users className="w-5 h-5" />}
                          {idx === 2 && <Flame className="w-5 h-5" />}
                          {idx === 3 && <CheckCircle2 className="w-5 h-5" />}
                        </div>

                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider border ${
                          isDark
                            ? "bg-[#4CAF50]/20 border-[#4CAF50]/30 text-[#4CAF50]"
                            : "bg-[#2E7D32]/10 border-[#2E7D32]/20 text-[#2E7D32]"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#4CAF50] animate-pulse" : "bg-[#2E7D32]"}`} />
                          {item.status}
                        </span>
                      </div>

                      <span className={`text-[10px] font-sans font-black uppercase tracking-widest block mb-2 ${
                        isDark ? "text-[#4CAF50]" : "text-[#2E7D32]"
                      }`}>
                        {item.type}
                      </span>

                      <h4 className={`font-display font-bold text-base leading-snug mb-4 ${
                        isDark ? "text-[#FAF9F6]" : "text-[#0C1D13]"
                      }`}>
                        {item.question}
                      </h4>

                      <div className={`w-full h-[1px] my-4 ${isDark ? "bg-[#4CAF50]/15" : "bg-[#2E7D32]/10"}`} />

                      <div className="space-y-3">
                        <div>
                          <span className={`text-[9px] font-sans font-bold uppercase tracking-wider block ${
                            isDark ? "text-[#4CAF50]/75" : "text-[#2E7D32]/75"
                          }`}>
                            Validation Method
                          </span>
                          <p className={`text-xs font-sans mt-0.5 leading-relaxed ${
                            isDark ? "text-[#FAF9F6]/80" : "text-[#0C1D13]/85"
                          }`}>
                            {item.method}
                          </p>
                        </div>

                        <div>
                          <span className={`text-[9px] font-sans font-bold uppercase tracking-wider block ${
                            isDark ? "text-[#4CAF50]/75" : "text-[#2E7D32]/75"
                          }`}>
                            Success Metric
                          </span>
                          <p className={`text-xs font-sans mt-0.5 leading-relaxed font-semibold ${
                            isDark ? "text-[#FAF9F6]/90" : "text-[#0C1D13]/90"
                          }`}>
                            {item.metric}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            
            <div className="flex lg:hidden items-center justify-center gap-1.5 mt-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#2E7D32]/60 animate-pulse flex items-center gap-1">
                <span>Swipe to explore</span>
                <span>→</span>
              </span>
            </div>
          </div>

          {/* Sub-Section C: Commercial Viability Targets */}
          <div>
            <div className="mb-8 text-center md:text-left">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#2E7D32]">
                Future Economics
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-black text-[#0C1D13] mt-2">
                Commercial Viability Targets
              </h3>
              <p className="text-xs md:text-sm text-[#0C1D13]/70 font-sans mt-2">
                Four key economic models that WAQID will test and validate during our pilot operations.
              </p>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex lg:grid overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory hide-scrollbar gap-6 pb-6 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0 max-w-6xl mx-auto"
            >
              {/* Card 1 */}
              <motion.div 
                variants={driftVariant} 
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985 }}
                className="glass-card snap-center shrink-0 w-[85vw] sm:w-[280px] lg:w-auto p-8 rounded-3xl flex flex-col justify-between min-h-[260px] group cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Service Model</h4>
                  <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                    Viability target: co-locating units at palm oil mills to process biomass waste under long-term service agreements.
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                variants={popVariant} 
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985 }}
                className="glass-card snap-center shrink-0 w-[85vw] sm:w-[280px] lg:w-auto p-8 rounded-3xl flex flex-col justify-between min-h-[260px] group cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Biochar Pellets</h4>
                  <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                    Viability target: formulating high-efficiency biochar-compost blends for direct commercial sale to estates and smallholder cooperatives.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                variants={blurFadeVariant} 
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985 }}
                className="glass-card snap-center shrink-0 w-[85vw] sm:w-[280px] lg:w-auto p-8 rounded-3xl flex flex-col justify-between min-h-[260px] group cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#152E1E] flex items-center justify-center text-[#4CAF50] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Hexagon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#0C1D13] mb-3">Sustainable Briquettes</h4>
                  <p className="text-xs md:text-sm text-[#0C1D13]/75 font-sans leading-relaxed">
                    Viability target: displacement testing of wood charcoal with local grill vendors, scaling to industrial biomass briquette distribution.
                  </p>
                </div>
              </motion.div>

              {/* Card 4 - Highlighted Dark Green Card */}
              <motion.div 
                variants={driftVariant} 
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985 }}
                className="snap-center shrink-0 w-[85vw] sm:w-[280px] lg:w-auto bg-[#152E1E]/80 backdrop-blur-md p-8 rounded-3xl border border-[#4CAF50]/30 shadow-xl flex flex-col justify-between min-h-[260px] relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck className="w-24 h-24 text-[#4CAF50]" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50] mb-6 border border-[#4CAF50]/30 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-3">Future Carbon</h4>
                  <p className="text-xs md:text-sm text-[#FAF9F6]/85 font-sans leading-relaxed">
                    Viability target: validating carbon sequestration durability through life-cycle assessments (LCA) to qualify for future carbon removal credits.
                  </p>
                </div>
              </motion.div>
            </motion.div>
            
            <div className="flex lg:hidden items-center justify-center gap-1.5 mt-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#2E7D32]/60 animate-pulse flex items-center gap-1">
                <span>Swipe to explore</span>
                <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 9. WHAT SUPPORT UNLOCKS */}
      <motion.section variants={sectionReveal} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-50px" }} id="ask" className="bg-[#0C1D13] py-16 md:py-24 text-left relative overflow-hidden border-b border-[#2E7D32]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(46,125,50,0.12)_0%,transparent_60%)] pointer-events-none" />
        
        {/* Floating Sparks/Embers overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="ember animate-ember-2 left-[20%]" style={{ animationDelay: '2s', width: '2px', height: '2px' }} />
          <div className="ember animate-ember-1 left-[40%]" style={{ animationDelay: '0s', width: '3px', height: '3px' }} />
          <div className="ember animate-ember-3 left-[60%]" style={{ animationDelay: '4s', width: '4px', height: '4px' }} />
          <div className="ember animate-ember-1 left-[80%]" style={{ animationDelay: '1s', width: '3px', height: '3px' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Progress Statement & CTA */}
            <div className="w-full lg:w-[38%] shrink-0 lg:sticky lg:top-24">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-4">
                Catalytic Support & Validation
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#FAF9F6] leading-[1.15] mb-6">
                What Support Unlocks
              </h2>
              <div className="border-l-2 border-[#4CAF50] pl-5 py-2 mb-8">
                <p className="text-sm md:text-base text-[#FAF9F6]/85 font-sans leading-relaxed text-balance">
                  WAQID has already begun early ground validation through biochar and compost application work with field partners. The next stage is to strengthen the pilot system, expand testing, and generate clearer data for farmers, funders, and future deployment partners.
                </p>
              </div>

              <div className="flex flex-col gap-6 items-start">
                <button
                  onClick={() => handleTrackSelect("Strategic Partner")}
                  className="btn-hover-shadow inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs border border-[#2E7D32]/20 shadow-lg group"
                >
                  Partner With Us <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Right Column: Step timeline */}
            <div className="w-full lg:w-[62%] flex-grow relative">
              {/* Timeline Line */}
              <div className="absolute left-[20px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#2E7D32] via-[#2E7D32]/30 to-[#2E7D32]/5 pointer-events-none" />
              
              <motion.div 
                variants={staggerContainer} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }}
                className="space-y-10"
              >
                {[
                  {
                    num: "01",
                    title: "Build the V3 Pilot Unit",
                    desc: "Fabricate and test the next low-cost TLUD pyrolysis prototype.",
                    status: "Next milestone",
                    icon: Factory
                  },
                  {
                    num: "02",
                    title: "Expand Biochar Field Validation",
                    desc: "Run lab testing and small field trials to measure soil and water-retention impact.",
                    status: "In progress",
                    icon: Sprout
                  },
                  {
                    num: "03",
                    title: "Test Farmer Adoption",
                    desc: "Validate whether pelletized biochar is practical and easy for smallholder farmers to apply.",
                    status: "Field validation",
                    icon: Users
                  },
                  {
                    num: "04",
                    title: "Develop Circular Fuel Products",
                    desc: "Test cleaner briquettes with local heat users and small businesses.",
                    status: "To be tested",
                    icon: Flame
                  },
                  {
                    num: "05",
                    title: "Document Impact Data",
                    desc: "Produce field evidence, pilot reports, and validation results for future partners.",
                    status: "Reporting layer",
                    icon: Activity
                  }
                ].map((step, idx) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div 
                      key={idx}
                      variants={fadeUpVariant}
                      className="relative flex flex-col gap-2 group text-left pl-12 md:pl-16"
                    >
                      {/* Timeline Dot with Icon */}
                      <div className="absolute left-0 top-0.5 w-10 h-10 rounded-full border border-[#2E7D32]/35 bg-[#0C1D13] flex items-center justify-center text-[#4CAF50] z-20 group-hover:border-[#4CAF50] transition-colors shadow-xl group-hover:bg-[#152E1E] duration-300">
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Step Number & Status Label */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-sans font-black text-[#4CAF50] tracking-wider">
                          STEP {step.num}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]/60" />
                        <span className="px-2.5 py-0.5 rounded-full bg-[#152E1E] border border-[#2E7D32]/25 text-[9px] font-sans font-black text-[#4CAF50] uppercase tracking-widest">
                          {step.status}
                        </span>
                      </div>

                      {/* Step Title & Details */}
                      <div>
                        <h4 className="font-display font-black text-lg md:text-xl text-[#FAF9F6] mb-2 group-hover:text-[#4CAF50] transition-colors duration-300">
                          {step.title}
                        </h4>
                        <p className="text-xs md:text-sm text-[#FAF9F6]/75 font-sans leading-relaxed max-w-2xl text-balance">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
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

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex lg:grid overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory hide-scrollbar gap-6 pb-6 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0"
          >
            {/* Osama M. Abuagla - Founder */}
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="glass-card-dark snap-center shrink-0 w-[85vw] sm:w-[300px] lg:w-auto p-8 rounded-3xl text-center group flex flex-col items-center relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#2E7D32]/15 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10 group-hover:scale-105 transition-transform duration-500">
                <img src="/images/founder.jpg" alt="Osama M. Abuagla" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Osama M. Abuagla</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Founder & CEO</p>
              <p className="text-sm text-[#FAF9F6]/75 leading-relaxed px-2 relative z-10">Driving the vision and technical execution of Waqid's decentralized pyrolysis infrastructure.</p>
            </motion.div>

            {/* Tim Asquith - Strategic Advisor */}
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="glass-card-dark snap-center shrink-0 w-[85vw] sm:w-[300px] lg:w-auto p-8 rounded-3xl text-center group flex flex-col items-center relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#2E7D32]/15 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10 group-hover:scale-105 transition-transform duration-500">
                <img src="/images/tim-asquith.png" alt="Tim Asquith" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Tim Asquith</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Strategic Advisor</p>
              <p className="text-sm text-[#FAF9F6]/75 leading-relaxed px-2 relative z-10">Providing critical guidance on field validation, commercial scaling, and global agricultural economics.</p>
            </motion.div>

            {/* Joyce Zhang - Venture Coach */}
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="glass-card-dark snap-center shrink-0 w-[85vw] sm:w-[300px] lg:w-auto p-8 rounded-3xl text-center group flex flex-col items-center relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#2E7D32]/15 to-transparent pointer-events-none rounded-bl-full" />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#4CAF50] mb-6 relative z-10 group-hover:scale-105 transition-transform duration-500">
                <img src="/images/joyce.jpg" alt="Joyce Zhang" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Joyce Zhang</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Venture Coach</p>
              <p className="text-sm text-[#FAF9F6]/75 leading-relaxed px-2 relative z-10">Guiding WAQID's fundraising strategy and venture scaling architecture for global deployment.</p>
            </motion.div>

            {/* Join the Movement - Call to Action */}
            <motion.div 
              variants={fadeUpVariant} 
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} 
              className="snap-center shrink-0 w-[85vw] sm:w-[300px] lg:w-auto bg-[#152E1E]/80 backdrop-blur-md p-8 rounded-3xl border border-[#4CAF50]/30 border-dashed text-center flex flex-col items-center justify-center cursor-pointer hover:bg-[#1E2229]/80 transition-all duration-300 relative overflow-hidden group shadow-xl"
            >
              <div className="w-24 h-24 rounded-full border-2 border-[#4CAF50]/50 border-dashed mb-6 flex items-center justify-center bg-[#0C1D13] group-hover:scale-105 transition-transform duration-500">
                <span className="text-[#4CAF50] font-display text-3xl font-bold group-hover:scale-110 transition-transform">+</span>
              </div>
              <h4 className="font-display font-bold text-xl text-[#FAF9F6] mb-1 relative z-10">Join The Movement</h4>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50] mb-4 relative z-10">Partners & Team</p>
              <p className="text-sm text-[#FAF9F6]/70 leading-relaxed px-2 relative z-10">
                We are actively looking for passionate operators, strategic partners, and early believers to help us complete this mission in any way possible.
              </p>
            </motion.div>
          </motion.div>

          <div className="flex lg:hidden items-center justify-center gap-1.5 mt-6">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4CAF50]/60 animate-pulse flex items-center gap-1">
              <span>Swipe to explore</span>
              <span>→</span>
            </span>
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
            <p className="text-sm text-[#0C1D13]/70 font-sans mb-6 relative z-10">Waqid is seeking early-stage partners, agronomic advisors, and catalytic capital to move from prototype to pilot deployment and maintain our vital field research. Join us in building the infrastructure for a regenerative future.</p>
            
            {/* Role Buttons */}
            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
              {[
                { key: "Mill Operator", label: "Palm Mill Operator" },
                { key: "Farmer / Cooperative", label: "Farmer / Cooperatives" },
                { key: "Investor / Partner", label: "Investor / Partner" }
              ].map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setSelectedFormRole(role.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                    selectedFormRole === role.key 
                      ? 'bg-[#2E7D32] text-[#FAF9F6] border-[#2E7D32] shadow-md scale-102' 
                      : 'bg-[#FAF9F6] text-[#0C1D13] hover:bg-[#FAF9F6]/80 border-[#2E7D32]/10'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-5 relative z-10">
              <input type="hidden" name="access_key" value="091c7841-f761-469b-980b-8d0afcceea0b" />
              <input type="hidden" name="subject" value={`New WAQID Inquiry - ${selectedFormRole}`} />
              <input type="hidden" name="from_name" value="WAQID Website" />
              <input type="hidden" name="inquiry_role" value={selectedFormRole} />
              
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
                  value={
                    selectedFormRole === "Mill Operator" 
                      ? "Mill Operator" 
                      : selectedFormRole === "Farmer / Cooperative" 
                        ? "Farm Cooperative" 
                        : "Strategic Partner"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "Mill Operator") setSelectedFormRole("Mill Operator");
                    else if (val === "Farm Cooperative") setSelectedFormRole("Farmer / Cooperative");
                    else setSelectedFormRole("Investor / Partner");
                  }}
                  className="w-full bg-[#FAF9F6] border border-[#2E7D32]/20 text-[#0C1D13] px-4 py-3.5 rounded-xl text-sm font-sans focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors appearance-none cursor-pointer"
                >
                  <option value="Investor / Pitch Deck Request">Investor / Pitch Deck Request</option>
                  <option value="Strategic Partner">Strategic Partner</option>
                  <option value="Mill Operator">Mill Operator</option>
                  <option value="Farm Cooperative">Farm Cooperative</option>
                  <option value="Other">Other</option>
                </select>
                <textarea 
                  name="message" 
                  placeholder={
                    selectedFormRole === "Mill Operator"
                      ? "Tell us about your mill's annual EFB tonnage, current disposal challenges, and feedstock potential..."
                      : selectedFormRole === "Farmer / Cooperative"
                        ? "Tell us about your crops, acreage, average soil restoration goals, and fertilizer expenses..."
                        : "Tell us about your partnership ideas, pitch deck requests, or how you would like to collaborate..."
                  }
                  rows="3"
                  className="w-full bg-[#FAF9F6] border border-[#2E7D32]/20 text-[#0C1D13] px-4 py-3.5 rounded-xl text-sm font-sans placeholder:text-[#0C1D13]/40 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors resize-none"
                ></textarea>
              </div>

              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <button 
                type="submit" 
                className="btn-hover-shadow w-full bg-[#152E1E] hover:bg-[#2E7D32] hover:text-[#FAF9F6] text-[#FAF9F6] font-sans font-bold uppercase tracking-wider text-xs py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer border border-[#2E7D32]/25 group"
              >
                Submit Inquiry <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-[#0C1D13] text-[#FAF9F6] pt-20 pb-12 border-t border-[#2E7D32]/25 relative overflow-hidden">
        {/* Soft background green glow */}
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#2E7D32]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#4CAF50]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Logo and Description (5 columns) */}
            <div className="lg:col-span-5 flex flex-col items-start gap-5">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-left cursor-pointer focus:outline-none hover:opacity-85 transition-opacity"
              >
                <img 
                  src="/images/waqid-logo-transparent.png" 
                  alt="WAQID Logo" 
                  className="h-10 w-auto object-contain drop-shadow-lg"
                />
              </button>
              <p className="text-[#FAF9F6]/65 text-xs max-w-sm font-sans leading-relaxed">
                WAQID is building circular pyrolysis and clean energy systems that turn unmanaged palm waste into permanent soil restoration and rural climate resilience.
              </p>
              
              <div className="flex flex-col gap-2.5 text-xs font-sans text-[#FAF9F6]/55 w-full">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
                  <span className="font-bold text-[#4CAF50] tracking-wide uppercase text-[10px]">Circular Solutions for Soil and Energy</span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-2 bg-[#152E1E]/50 px-3 py-1.5 rounded-lg border border-[#2E7D32]/20">
                    <MapPin className="w-3.5 h-3.5 text-[#4CAF50]" /> Malaysia
                  </span>
                  <a 
                    href="mailto:Abuaglho@gmail.com" 
                    className="flex items-center gap-2 bg-[#152E1E]/50 px-3 py-1.5 rounded-lg border border-[#2E7D32]/20 hover:border-[#4CAF50] hover:text-[#FAF9F6] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#4CAF50]" /> Abuaglho@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Quick links (3 columns) */}
            <div className="lg:col-span-3 flex flex-col items-start gap-5">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#4CAF50] border-b border-[#2E7D32]/20 pb-2 w-full text-left">
                Ecosystem Links
              </h4>
              <div className="flex flex-col gap-3 text-xs font-sans text-[#FAF9F6]/70 w-full text-left">
                {[
                  { id: 'crisis', label: 'Crisis Context' },
                  { id: 'solution', label: 'Our Solution' },
                  { id: 'calculator', label: 'Interactive Calculator' },
                  { id: 'impact', label: 'Measurable Impact' },
                  { id: 'prototype-to-pilot', label: 'Prototype to Pilot' },
                  { id: 'team', label: 'Team & Advisors' }
                ].map((link) => (
                  <button 
                    key={link.id}
                    onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })} 
                    className="text-left hover:text-[#4CAF50] hover:translate-x-1 transition-all duration-300 cursor-pointer focus:outline-none flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Operational Credentials (4 columns) */}
            <div className="lg:col-span-4 flex flex-col items-start gap-5">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#4CAF50] border-b border-[#2E7D32]/20 pb-2 w-full text-left">
                Cooperative Framework
              </h4>
              <div className="border border-[#2E7D32]/35 rounded-2xl p-6 bg-[#152E1E]/40 w-full relative overflow-hidden shadow-inner group hover:border-[#4CAF50]/40 transition-all duration-300">
                <span className="absolute top-4 right-4 text-[9px] font-sans font-black uppercase tracking-widest text-[#4CAF50] bg-[#4CAF50]/15 border border-[#4CAF50]/20 px-2.5 py-1.5 rounded-full">
                  Active Partner
                </span>
                
                <h5 className="font-display font-bold text-sm text-[#FAF9F6] mb-2 group-hover:text-[#4CAF50] transition-colors duration-300">
                  Wild Asia Program
                </h5>
                <p className="text-xs text-[#FAF9F6]/65 font-sans leading-relaxed text-balance">
                  Cooperative agreement confirmed for decentralized pyrolysis reactor diagnostics, operational scaling, and agronomic field validation.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="mt-16 pt-8 border-t border-[#2E7D32]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-xs text-[#FAF9F6]/45 font-sans text-center md:text-left">
              &copy; 2026 WAQID Solutions. All rights reserved.
            </p>
            <p className="text-[10px] text-[#FAF9F6]/35 max-w-xl font-sans text-center md:text-right leading-relaxed text-balance">
              All statistics cited are sourced directly from peer-reviewed scientific databases, Malaysian Palm Oil Board reports, and Wild Asia farm registries (2024–2026).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
