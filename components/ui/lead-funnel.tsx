"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ChevronLeft, Check, Calendar, Building2, User, Mail, Phone, FileText, Sparkles, ArrowRight, Rocket } from "lucide-react";

// Service options with sub-services
const services = {
  "Digital Marketing": ["SEO", "Social Media Management", "PPC Advertising", "Content Marketing", "Email Marketing"],
  "IT Solutions": ["Web Development", "Mobile App Development", "Cloud Solutions", "Cybersecurity", "IT Consulting"],
  "Branding": ["Logo Design", "Brand Identity", "Brand Strategy", "Visual Design", "Brand Guidelines"],
  "AI Automation": ["Chatbots", "Workflow Automation", "Data Analytics", "AI Integration", "Machine Learning"]
};

const deliveryOptions = [
  { label: "1 Week", value: "1-week" },
  { label: "2 Weeks", value: "2-weeks" },
  { label: "1 Month", value: "1-month" },
  { label: "2 Months", value: "2-months" },
  { label: "3+ Months", value: "3-months+" },
  { label: "Custom Date", value: "custom" }
];

interface LeadData {
  service: string;
  subService: string;
  companyName: string;
  deliveryDate: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

export function LeadFunnel() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    service: "",
    subService: "",
    companyName: "",
    deliveryDate: "",
    fullName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [customDate, setCustomDate] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalSteps = 7;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, isOpen]);

  const updateLeadData = (field: keyof LeadData, value: string) => {
    setLeadData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleServiceSelect = (service: string) => {
    updateLeadData("service", service);
    updateLeadData("subService", "");
  };

  const handleSubServiceSelect = (subService: string) => {
    updateLeadData("subService", subService);
  };

  const handleDeliverySelect = (option: string) => {
    if (option === "custom") {
      updateLeadData("deliveryDate", customDate);
    } else {
      const label = deliveryOptions.find(o => o.value === option)?.label || option;
      updateLeadData("deliveryDate", label);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      });
      
      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFunnel = () => {
    setStep(0);
    setIsSubmitted(false);
    setLeadData({
      service: "",
      subService: "",
      companyName: "",
      deliveryDate: "",
      fullName: "",
      email: "",
      phone: "",
      notes: ""
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return leadData.service !== "";
      case 1: return leadData.subService !== "";
      case 2: return leadData.companyName.trim() !== "";
      case 3: return leadData.deliveryDate !== "";
      case 4: return leadData.fullName !== "" && leadData.email !== "" && leadData.phone !== "";
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#103D2E] to-[#0a2a1f] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Hi there! Let&apos;s grow your business</h3>
                <p className="text-sm text-gray-500">Tell us about your project and we&apos;ll create a personalized quote for you.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">What type of service do you need?</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(services).map((service) => (
                <button
                  key={service}
                  onClick={() => { handleServiceSelect(service); nextStep(); }}
                  className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    leadData.service === service
                      ? "border-[#103D2E] bg-[#C6A969] text-white"
                      : "border-gray-200 hover:border-[#103D2E]/50 hover:bg-[#103D2E]/5"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={prevStep} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-sm text-gray-500">Back</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Great choice! What&apos;s your focus area?</p>
            <p className="text-xs text-gray-400">Selected: <span className="text-[#103D2E] font-medium">{leadData.service}</span></p>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {services[leadData.service as keyof typeof services]?.map((subService) => (
                <button
                  key={subService}
                  onClick={() => { handleSubServiceSelect(subService); nextStep(); }}
                  className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left ${
                    leadData.subService === subService
                      ? "border-[#103D2E] bg-[#103D2E] text-white"
                      : "border-gray-200 hover:border-[#103D2E]/50 hover:bg-[#103D2E]/5"
                  }`}
                >
                  {subService}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={prevStep} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-sm text-gray-500">Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#103D2E]" />
              <p className="text-sm text-gray-600 font-medium">What&apos;s your company name?</p>
            </div>
            <input
              type="text"
              value={leadData.companyName}
              onChange={(e) => updateLeadData("companyName", e.target.value)}
              placeholder="Your company or brand name"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#C6A969] focus:outline-none transition-colors"
            />
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full py-3 bg-[#103D2E] text-[#103D2E] rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#B89652] transition-colors flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={prevStep} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-sm text-gray-500">Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#103D2E]" />
              <p className="text-sm text-gray-600 font-medium">Step 4: Expected Delivery Date</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {deliveryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDeliverySelect(option.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    leadData.deliveryDate === (option.value === "custom" ? customDate : option.label)
                      ? "border-[#103D2E] bg-[#103D2E] text-white"
                      : "border-gray-200 hover:border-[#103D2E]/50 hover:bg-[#103D2E]/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {leadData.deliveryDate === "custom" || (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="w-full py-3 bg-[#103D2E] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a2a1f] transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={prevStep} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-sm text-gray-500">Back</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#103D2E]" />
              <p className="text-sm text-gray-600 font-medium">Step 5: Contact Information</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={leadData.fullName}
                    onChange={(e) => updateLeadData("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:border-[#103D2E] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={leadData.email}
                    onChange={(e) => updateLeadData("email", e.target.value)}
                    placeholder="john@company.com"
                    className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:border-[#103D2E] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={leadData.phone}
                    onChange={(e) => updateLeadData("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:border-[#103D2E] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full py-3 bg-[#103D2E] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a2a1f] transition-colors flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={prevStep} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-sm text-gray-500">Back</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#103D2E]" />
              <p className="text-sm text-gray-600 font-medium">Step 6: Additional Notes</p>
            </div>
            <p className="text-xs text-gray-500">Share your expectations, goals, or how you feel about the project.</p>
            <textarea
              value={leadData.notes}
              onChange={(e) => updateLeadData("notes", e.target.value)}
              placeholder="Tell us about your project goals, expectations, or any specific requirements..."
              rows={4}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#103D2E] focus:outline-none transition-colors resize-none"
            />
            <button
              onClick={nextStep}
              className="w-full py-3 bg-[#103D2E] text-white rounded-xl font-medium hover:bg-[#0a2a1f] transition-colors flex items-center justify-center gap-2"
            >
              Review Summary <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 6:
        if (isSubmitted) {
          return (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re all set!</h3>
              <p className="text-sm text-gray-600 mb-4">Our team will review your requirements and send a customized quote within 24 hours.</p>
              <button
                onClick={resetFunnel}
                className="text-[#103D2E] font-medium hover:underline text-sm"
              >
                Start New Inquiry
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={prevStep} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-sm text-gray-500">Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#103D2E]" />
              <p className="text-sm text-gray-600 font-medium">Step 7: Confirm Your Details</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="font-medium text-gray-900">{leadData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sub-Service:</span>
                <span className="font-medium text-gray-900">{leadData.subService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Company:</span>
                <span className="font-medium text-gray-900">{leadData.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery:</span>
                <span className="font-medium text-gray-900">{leadData.deliveryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-900">{leadData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">{leadData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">{leadData.phone}</span>
              </div>
              {leadData.notes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 block mb-1">Notes:</span>
                  <span className="font-medium text-gray-900">{leadData.notes}</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500">By submitting, you agree to our privacy policy and consent to be contacted regarding your inquiry.</p>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#C6A969] to-[#B89652] text-white rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>Submit Request <Send className="w-4 h-4" /></>
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#103D2E] to-[#0a2a1f] shadow-lg hover:shadow-xl flex items-center justify-center group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        ) : (
          <>
            <Rocket className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-auto px-1 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[8px] font-bold text-[#8B6B2E] animate-pulse whitespace-nowrap">
              Price
            </span>
          </>
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 md:bottom-40 left-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[70vh] max-h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#103D2E] to-[#0a2a1f] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Get Your Free Quote</h3>
                  <p className="text-xs text-white/70">We&apos;ll tailor a solution for you</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            {!isSubmitted && (
              <div className="h-1 bg-gray-100">
                <motion.div
                  className="h-full bg-[#103D2E]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>
            )}

            {/* Step Indicator */}
            {!isSubmitted && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Step {step + 1} of {totalSteps}
                </span>
                <span className="text-xs text-[#103D2E] font-medium">
                  {Math.round(((step + 1) / totalSteps) * 100)}% Complete
                </span>
              </div>
            )}

            {/* Content */}
            <div className="p-4 flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-[#103D2E] scrollbar-track-transparent">
              {renderStep()}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
