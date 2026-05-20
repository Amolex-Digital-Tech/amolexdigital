import { Metadata } from "next";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-20 space-y-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              At Amolex Digital Tech, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or engage with our digital platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Fill out a contact form or inquiry form</li>
              <li>Subscribe to our newsletter</li>
              <li>Request a quote for services</li>
              <li>Apply for a career position</li>
              <li>Interact with our website</li>
            </ul>
            <p className="mt-4">
              The personal information we collect may include your name, email address, phone number, company name, and any other information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Respond to your inquiries and requests</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites, services, or applications that are not operated by us. We are not responsible for the privacy practices of these third parties, and we encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;last modified&quot; date at the bottom. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> www.amolexdigitaltech@outlook.com<br />
              <strong>Phone:</strong> +251-974-238-620<br />
              <strong>Address:</strong> Amhara Bank Head Quarter Building (ORDA Building), 15th Floor, Legehar, Addis Ababa, Ethiopia
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-12">
            Last modified: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
