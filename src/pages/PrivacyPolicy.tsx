import { Logo } from '../components/Logo';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const lastUpdated = 'January 20, 2026';

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="border-b border-surface-800/50 bg-surface-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert prose-surface max-w-none">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-surface-400 text-sm mb-8">Last Updated: {lastUpdated}</p>

          <div className="space-y-8 text-surface-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                PermStack ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you use our Minecraft server
                permissions configuration generator service ("the Service").
              </p>
              <p className="mt-3">
                Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you
                have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms
                of this Privacy Policy, please do not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">2.1 Information You Provide Directly</h3>
              <p>When you use our feedback or plugin request features, you may voluntarily provide:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Contact Information:</strong> Email address, Discord username</li>
                <li><strong>Feedback Content:</strong> Messages, suggestions, bug reports, and feature requests</li>
                <li><strong>Plugin Requests:</strong> Plugin names, URLs, and descriptions you submit</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">2.2 Information Stored Locally</h3>
              <p>The following information is stored in your browser's local storage and never transmitted to our servers:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Configuration Preferences:</strong> Your selected plugins, rank configurations, and export settings</li>
                <li><strong>API Keys:</strong> Third-party API keys (e.g., OpenAI) you provide for AI features</li>
                <li><strong>Custom Plugins:</strong> Plugin permission data you add manually or through documentation parsing</li>
                <li><strong>Application Settings:</strong> Theme preferences, AI configuration settings</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">2.3 Automatically Collected Information</h3>
              <p>We may automatically collect certain information when you access the Service:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns (via analytics)</li>
                <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
                <li><strong>Network Information:</strong> IP address, approximate geographic location</li>
                <li><strong>Referral Data:</strong> How you arrived at our Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Provide, maintain, and improve the Service</li>
                <li>Respond to your feedback, inquiries, and support requests</li>
                <li>Process plugin requests and expand our permissions database</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect, prevent, and address technical issues or abuse</li>
                <li>Communicate important updates about the Service</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">4.1 Third-Party Service Providers</h3>
              <p>We may share information with third-party service providers who assist us in operating the Service:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Discord:</strong> Feedback and plugin requests submitted through our Discord webhook integration</li>
                <li><strong>Analytics Providers:</strong> Aggregated, anonymized usage data</li>
                <li><strong>Hosting Providers:</strong> Technical infrastructure services</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">4.2 AI Service Providers</h3>
              <p>
                If you enable AI features and provide your own API key, data you input may be processed by third-party
                AI providers (such as OpenAI). This includes:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Rank names and descriptions for intelligent recommendations</li>
                <li>Plugin names for permission lookups</li>
              </ul>
              <p className="mt-3">
                We do not control and are not responsible for the privacy practices of third-party AI providers.
                Please review their privacy policies before enabling AI features.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">4.3 Legal Requirements</h3>
              <p>We may disclose your information if required by law or in response to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Valid legal processes (subpoenas, court orders)</li>
                <li>Government requests in accordance with applicable law</li>
                <li>Protection of our rights, privacy, safety, or property</li>
                <li>Investigation of potential violations of our Terms of Service</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">4.4 What We Do NOT Share</h3>
              <p>We do not:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Sell your personal information to third parties</li>
                <li>Share your API keys or credentials with anyone</li>
                <li>Access or store your generated permission configurations on our servers</li>
                <li>Share your information with advertisers or marketing companies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Data Storage and Security</h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">5.1 Local Storage</h3>
              <p>
                The majority of your data (configurations, API keys, preferences) is stored locally in your browser
                using Web Storage APIs. This data:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Never leaves your device unless you explicitly submit it</li>
                <li>Can be cleared by clearing your browser's local storage</li>
                <li>Is not accessible to other websites or applications</li>
                <li>Persists until you clear it or uninstall the browser</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">5.2 Security Measures</h3>
              <p>We implement reasonable security measures including:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>HTTPS encryption for all data transmission</li>
                <li>Client-side processing of sensitive configurations</li>
                <li>No server-side storage of user configurations or API keys</li>
                <li>Regular security assessments of our codebase</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot
                guarantee absolute security of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">6.1 Access and Control</h3>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Access:</strong> View the data stored in your browser's local storage</li>
                <li><strong>Delete:</strong> Clear your local storage to remove all stored data</li>
                <li><strong>Export:</strong> Export your configurations at any time</li>
                <li><strong>Opt-out:</strong> Disable AI features to prevent third-party data processing</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">6.2 Communication Preferences</h3>
              <p>
                Contact information you provide through feedback forms is used only for responding to your inquiries.
                We do not maintain marketing email lists or send promotional communications.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">6.3 Do Not Track</h3>
              <p>
                We respect Do Not Track (DNT) browser settings. When DNT is enabled, we limit analytics collection
                to essential functionality metrics only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Children's Privacy</h2>
              <p>
                The Service is not directed to children under the age of 13. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us so we can take appropriate action.
              </p>
              <p className="mt-3">
                Users between 13 and 18 should review these terms with a parent or guardian before using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. International Data Transfers</h2>
              <p>
                The Service may be accessed from various countries. If you access the Service from outside the
                country where our servers are located, your information may be transferred across international
                borders. By using the Service, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Third-Party Links</h2>
              <p>
                The Service may contain links to third-party websites, including Minecraft community resources,
                plugin documentation, and external tools. This Privacy Policy does not apply to those websites.
                We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued
                use of the Service after any modifications indicates your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Data Retention</h2>
              <p>
                We retain information submitted through feedback forms only as long as necessary to respond to your
                inquiry and improve our Service. Local storage data persists until you clear it from your browser.
              </p>
              <p className="mt-3">
                Discord messages containing feedback and plugin requests are retained in accordance with Discord's
                data retention policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. California Privacy Rights</h2>
              <p>
                California residents may have additional rights under the California Consumer Privacy Act (CCPA),
                including the right to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Know what personal information we collect and how it's used</li>
                <li>Request deletion of personal information</li>
                <li>Opt-out of the sale of personal information (we do not sell personal information)</li>
                <li>Non-discrimination for exercising privacy rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">13. European Privacy Rights (GDPR)</h2>
              <p>
                If you are located in the European Economic Area (EEA), you have certain rights under the General
                Data Protection Regulation (GDPR), including:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Right of access to your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restriction of processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">14. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us through
                our feedback system within the application.
              </p>
              <p className="mt-3">
                For data access, deletion, or other privacy-related requests, please include sufficient information
                for us to verify your identity and process your request.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-surface-800">
              <p className="text-surface-500 text-sm">
                By using PermStack, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
