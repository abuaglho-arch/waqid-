import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, Factory, Sparkles, ChevronDown, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    role: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormSubmitted(true);
      setFormData({ name: '', email: '', org: '', role: '', message: '' });
    } catch (err) {
      setSubmitError("Failed to submit inquiry. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0C1D13] font-sans">
      {/* Navbar / Header */}
      <nav className="w-full fixed top-0 z-50 py-4 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-[#2E7D32]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-5 h-5 text-[#2E7D32] group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans font-bold text-sm tracking-widest uppercase">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Waqid Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-2xl tracking-tighter text-[#0C1D13]">Waqid.</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4CAF50] block mb-3">
            Investment & Partnerships
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black text-[#0C1D13] mb-6">
            Partner With Us to Scale the Impact.
          </h1>
          <p className="text-sm md:text-base text-[#0C1D13]/70 font-sans leading-relaxed max-w-2xl mx-auto text-balance">
            Waqid is seeking early-stage partners, agronomic advisors, and catalytic capital to move from prototype to pilot deployment. Join us in building the infrastructure for a regenerative future.
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-8 md:p-12 rounded-3xl border border-[#2E7D32]/10 shadow-2xl">
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
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
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] focus:outline-none focus:border-[#2E7D32] text-sm font-sans transition-colors"
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
                  rows={6}
                  placeholder="Tell us how you'd like to support, advise, or partner with us on our pilot journey..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="px-4 py-3.5 rounded-xl bg-[#FAF9F6] border border-[#2E7D32]/15 text-[#0C1D13] placeholder-[#0C1D13]/30 focus:outline-none focus:border-[#2E7D32] text-sm font-sans resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-hover-shadow w-full mt-4 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#4CAF50] hover:text-[#0C1D13] text-[#FAF9F6] font-sans font-bold uppercase tracking-widest text-xs transition-colors duration-300 border border-[#2E7D32]/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
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
      </main>
    </div>
  );
};

export default Contact;
