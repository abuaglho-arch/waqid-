import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Flame, Leaf, Mail, Send, 
  Users, Factory, Sparkles, ChevronDown, ArrowLeft 
} from "lucide-react";
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    role: "Mill Operator (Pilot Interest)",
    message: ""
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://formspree.io/f/xyzkypqz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          organisation: formData.org,
          partnership_track: formData.role,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setFormData({ name: "", email: "", org: "", role: "", message: "" });
      } else {
        setSubmitError("Failed to submit form. Please try again or email directly.");
      }
    } catch {
      setSubmitError("Network error. Please try again or email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0C1D13] antialiased font-sans flex flex-col pt-6 pb-20 px-6">
      
      {/* Top Navigation / Back Button */}
      <div className="max-w-6xl mx-auto w-full mb-12 flex justify-start">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-bold uppercase tracking-widest text-[#0C1D13]/60 hover:text-[#2E7D32] hover:bg-[#2E7D32]/5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-6xl mx-auto w-full flex-grow flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Proposal Copy (5 columns) */}
          <div className="lg:col-span-5 bg-[#0C1D13] text-[#FAF9F6] p-8 md:p-12 rounded-[2rem] shadow-xl flex flex-col justify-between min-h-[500px]">
            <div className="relative z-10">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4CAF50]">
                Scale The Impact
              </span>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#FAF9F6] mt-4 mb-8 leading-tight">
                Partner With Us to Scale the Impact.
              </h1>
              <p className="text-sm text-[#FAF9F6]/75 font-sans leading-relaxed mb-12">
                Waqid is seeking early-stage partners, agronomic advisors, and catalytic capital to move from prototype to pilot deployment and maintain our vital field research. Join us in building the infrastructure for a regenerative future.
              </p>

              <div className="flex flex-col gap-6 font-sans text-sm text-[#FAF9F6]/80 mt-6 border-t border-[#FAF9F6]/10 pt-8">
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                  <span>Perak & Kedah, Malaysia</span>
                </div>
                <div className="flex items-center gap-4">
                  <Flame className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                  <span>Pioneering Circular Biochar Systems</span>
                </div>
                <div className="flex items-center gap-4">
                  <Leaf className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                  <span>Building a Regenerative Future</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                  <a href="mailto:Abuaglho@gmail.com" className="hover:text-[#4CAF50] transition-colors">
                    Abuaglho@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-[#FAF9F6]/10 pt-6 mt-12 text-[11px] font-sans text-[#FAF9F6]/40 leading-relaxed">
              * Detailed field trial data and early validation reports are available upon request for prospective partners and investors.
            </div>
          </div>

          {/* Right: Contact Form (7 columns) */}
          <div className="lg:col-span-7 bg-[#F0EFEA] p-8 md:p-12 rounded-[2rem] border border-[#2E7D32]/5 shadow-sm">
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mb-6 border border-[#2E7D32]/20">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-3xl text-[#0C1D13] mb-4">
                  Inquiry Received
                </h3>
                <p className="text-base text-[#0C1D13]/75 font-sans max-w-sm mb-2 leading-relaxed">
                  Thank you for reaching out! We have successfully received your inquiry and will be in touch with you shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-10 px-8 py-3 rounded-full border border-[#2E7D32]/20 hover:border-[#2E7D32] text-[#2E7D32] text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <div>
                {/* Role Selector Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  {[
                    { key: "Mill Operator (Pilot Interest)", label: "Palm Mill Operator" },
                    { key: "Farmer / Cooperative (Trial Interest)", label: "Farmer / Cooperatives" },
                    { key: "Investor / Funder", label: "Investor / Partner" }
                  ].map((role) => (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.key })}
                      className={`px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                        formData.role === role.key 
                          ? 'bg-[#2E7D32] text-[#FAF9F6] border-[#2E7D32] shadow-md scale-102' 
                          : 'bg-[#FAF9F6] text-[#0C1D13] hover:bg-[#FAF9F6]/80 border-[#2E7D32]/10'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-sans">
                    {submitError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
                      Full Name *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C1D13]/30" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C1D13]/30" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
                      Organisation (Optional)
                    </label>
                    <div className="relative">
                      <Factory className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C1D13]/30" />
                      <input
                        type="text"
                        value={formData.org}
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
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

                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#0C1D13]/70">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={
                      formData.role === "Mill Operator (Pilot Interest)"
                        ? "Tell us about your mill's annual EFB tonnage, current disposal challenges, and feedstock potential..."
                        : formData.role === "Farmer / Cooperative (Trial Interest)"
                          ? "Tell us about your crops, acreage, average soil restoration goals, and fertilizer expenses..."
                          : "Tell us about your partnership ideas, pitch deck requests, or how you would like to collaborate..."
                    }
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="px-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] focus:outline-none focus:border-[#2E7D32] text-sm font-sans resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-hover-shadow w-full mt-4 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group border border-[#2E7D32]/20"
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
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
