import Link from "next/link";
import { Instagram, Send, Facebook, Linkedin, Music2, Phone, Mail, MapPin } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/lib/site";

const footerLinks = {
  Company: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/careers", label: "Careers" }
  ],
  Platform: [
    { href: "/portfolio", label: "Portfolio" },
    { href: "/dashboard/sign-in", label: "Client Portal" }
  ],
  Solutions: [
    { href: "/services", label: "Web Development" },
    { href: "/services", label: "Mobile Apps" },
    { href: "/services", label: "UI/UX Design" },
    { href: "/services", label: "Digital Marketing" },
    { href: "/services", label: "E-Commerce" }
  ]
};

const socialLinks = [
  { href: "https://www.instagram.com/p/DVYtTOCDAux/", icon: Instagram, label: "Instagram" },
  { href: "https://t.me/ghion_marketing", icon: Send, label: "Telegram" },
  { href: "https://web.facebook.com/profile.php?id=61564791870925", icon: Facebook, label: "Facebook" },
  { href: "https://www.tiktok.com/@ghion_marketing", icon: Music2, label: "TikTok" },
  { href: "https://www.linkedin.com/company/107979125/admin/dashboard/", icon: Linkedin, label: "LinkedIn" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E8DCCB] bg-[#FDF6EC] py-16">
      <div className="container grid gap-10 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-sm text-sm leading-7 text-[#1F4D3A]">{siteConfig.description}</p>
          <div className="flex gap-4 pt-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E7D7] text-[#8B6B4A] transition-all hover:bg-[#E8DCCB]"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        {Object.entries(footerLinks).map(([title, items]) => (
          <div key={title}>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-[#1F4D3A]">{title}</h3>
            <div className="mt-4 grid gap-3 text-sm text-[#2F5D50]">
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-[#16382B]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        {/* Contact Information Section */}
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">Contact Info</h3>
          <div className="mt-4 grid gap-4 text-sm text-[#2F5D50]">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
              <p>Amhara Bank Head Quarter Building (ORDA Building), 15th Floor, Legehar, Addis Ababa, Ethiopia</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0 text-secondary" />
              <div>
                <p>+251-974-238-620</p>
                <p>+251-907-192-311</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0 text-secondary" />
              <p>www.amolexdigitaltech@outlook.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="container mt-10 border-t border-[#E8DCCB] pt-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-[#2F5D50] md:flex-row">
          <p>© 2026 Amolex Digital Tech. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms-of-service" className="transition hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
