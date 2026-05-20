"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, FormEvent } from "react";
import { Mail, MapPin, Phone, Instagram, Send, Facebook, Linkedin, Music2 } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const serviceDescriptions: Record<string, string> = {
  "mobile-app-development": "Mobile App Development",
  "website-development": "Website Development",
  "ecommerce-platforms": "E-Commerce Solutions",
  "branding": "Branding Services",
  "mechanical-design": "Mechanical Design Services",
  "digital-marketing": "Digital Marketing Services",
};

function ContactForm() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams?.get("service");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [subService, setSubService] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (serviceParam && serviceDescriptions[serviceParam]) {
      setService(serviceDescriptions[serviceParam]);
      setNotes(`Hi, I'm interested in ${serviceDescriptions[serviceParam]}. Please contact me with more information.`);
    }
  }, [serviceParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!name || !email || !company || !service || !subService || !deliveryDate || !phone) {
      setStatus('error');
      setStatusMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setStatusMessage('');

    const leadData = {
      service,
      subService,
      companyName: company,
      deliveryDate,
      fullName: name,
      email,
      phone,
      notes
    };

    try {
      const response = await fetch('/api/lead-funnel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setStatusMessage('Thank you! Your inquiry has been submitted successfully. Our team will contact you shortly.');
        // Reset form
        setName('');
        setEmail('');
        setCompany('');
        setService('');
        setSubService('');
        setDeliveryDate('');
        setPhone('');
        setNotes('');
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to submit lead');
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage('An error occurred while submitting the lead');
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input 
          placeholder="Name" 
          value={name} 
          onChange={(e)=>setName(e.target.value)} 
          required 
        />
        <Input 
          placeholder="Email" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
          type="email" 
          required 
        />
      </div>
      <Input 
        placeholder="Company" 
        value={company} 
        onChange={(e)=>setCompany(e.target.value)} 
        required 
      />
      <Input 
        placeholder="Project Type (Service)" 
        value={service} 
        onChange={(e)=>setService(e.target.value)} 
        required 
      />
      <Input 
        placeholder="Sub-Service" 
        value={subService} 
        onChange={(e)=>setSubService(e.target.value)} 
        required 
      />
      <Input 
        placeholder="Expected Delivery Date" 
        value={deliveryDate} 
        onChange={(e)=>setDeliveryDate(e.target.value)} 
        type="date" 
        required 
      />
      <Input 
        placeholder="Phone" 
        value={phone} 
        onChange={(e)=>setPhone(e.target.value)} 
        required 
      />
      <Textarea 
        placeholder="Describe your platform, goals, and timeline (or any additional notes)." 
        value={notes} 
        onChange={(e)=>setNotes(e.target.value)} 
      />
      {status !== 'idle' && (
        <div className={`p-4 rounded-lg ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {statusMessage}
        </div>
      )}
      <Button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full"
      >
        {status === 'submitting' ? 'Submitting...' : 'Send inquiry'}
      </Button>
    </form>
  );
}

function ContactWithParams() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6 bg-[#FFFDF9] border-[#E8DCC8] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <ContactForm />
      </Card>
      <Card className="p-6 bg-[#FFFDF9] border-[#E8DCC8] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
       <div className="grid gap-6 text-sm text-[#103D2E]">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-4 w-4 text-secondary" />
            <div>
              <p className="font-medium text-[#103D2E]">Email</p>
              <p>www.amolexdigitaltech@outlook.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-4 w-4 text-secondary" />
            <div>
              <p className="font-medium text-[#103D2E]">Phone</p>
              <p>+251-974-238-620</p>
              <p>+251-907-192-311</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-4 w-4 text-secondary" />
            <div>
              <p className="font-medium text-[#103D2E]">Location</p>
              <a 
                href="https://www.google.com/maps/place/2Q63%2BMC8,+Addis+Ababa+1000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#B29267] hover:underline hover:text-[#8f7352]"
              >
                Amhara Bank Head Quarter Building (ORDA Building), 15th Floor, Legehar
              </a>
              <p className="text-[#103D2E]/80">Addis Ababa, Ethiopia</p>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-3 pt-2">
            <p className="text-sm font-medium text-[#103D2E]">Follow us:</p>
            <div className="flex gap-2">
              <a href="https://www.instagram.com/p/DVYtTOCDAux/" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B29267]/10 text-[#B29267] transition-all hover:bg-[#B29267] hover:text-white" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://t.me/ghion_marketing" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B29267]/10 text-[#B29267] transition-all hover:bg-[#B29267] hover:text-white" aria-label="Telegram">
                <Send className="h-4 w-4" />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61564791870925" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B29267]/10 text-[#B29267] transition-all hover:bg-[#B29267] hover:text-white" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@ghion_marketing" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B29267]/10 text-[#B29267] transition-all hover:bg-[#B29267] hover:text-white" aria-label="TikTok">
                <Music2 className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/107979125/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B29267]/10 text-[#B29267] transition-all hover:bg-[#B29267] hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="container pt-40 pb-40 space-y-12">

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#103D2E]">
            Contact
          </p>

          <h1 className="text-4xl font-bold text-[#103D2E]">
            Start a project conversation.
          </h1>

          <p className="max-w-2xl text-[#103D2E]/80">
            Tell us what you are building, where you need leverage, and how quickly you need to move.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ContactWithParams />
        </Suspense>

      </div>
    </div>
  );
}
