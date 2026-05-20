import { Metadata } from "next";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  path: "/terms-of-service"
});

export default function TermsOfServicePage() {
  return (
    <div className="container py-20 space-y-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Welcome to Amolex Digital Tech. These Terms of Service (&quot;Terms&quot;) govern your use of our website located at <a href="https://amolex.tech" className="text-[#B29267] hover:underline">https://amolex.tech</a> (the &quot;Service&quot;) operated by Amolex Digital Tech.
            </p>
            <p className="mt-4">
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            <p>
              Amolex Digital Tech provides digital technology services including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Website Development</li>
              <li>Mobile Application Development</li>
              <li>E-Commerce Solutions</li>
              <li>Branding Services</li>
              <li>Mechanical Design</li>
              <li>Digital Marketing</li>
              <li>AI Solutions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Amolex Digital Tech and its licensors. The Service is protected by copyright, trademark, and other laws of both Ethiopia and foreign countries.
            </p>
            <p className="mt-4">
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Amolex Digital Tech.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <p>
              When you create an account with us, you must provide us with accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p className="mt-4">
              You are responsible for safeguarding the password that you use to access the Service. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p>
              In no event shall Amolex Digital Tech, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Ethiopia, without regard to its conflict of law provisions.
            </p>
            <p className="mt-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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
