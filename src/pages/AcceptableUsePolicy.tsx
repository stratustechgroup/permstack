import { Logo } from '../components/Logo';
import { ArrowLeft } from 'lucide-react';

interface AcceptableUsePolicyProps {
  onBack: () => void;
}

export function AcceptableUsePolicy({ onBack }: AcceptableUsePolicyProps) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Acceptable Use Policy</h1>
          <p className="text-surface-400 text-sm mb-8">Last Updated: {lastUpdated}</p>

          <div className="space-y-8 text-surface-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Purpose</h2>
              <p>
                This Acceptable Use Policy ("AUP") governs your use of PermStack ("the Service"), a Minecraft server
                permissions configuration generator. This AUP is designed to protect our Service, our users, and the
                broader Minecraft community from harmful, illegal, or disruptive activities.
              </p>
              <p className="mt-3">
                By using the Service, you agree to comply with this AUP. Violation of this policy may result in
                restriction or termination of your access to the Service and may be reported to appropriate authorities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Permitted Uses</h2>
              <p>You may use the Service to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Generate permission configurations for Minecraft servers you own or have authorization to administer</li>
                <li>Create and customize rank hierarchies for legitimate Minecraft server communities</li>
                <li>Export configurations in supported formats for personal or commercial Minecraft servers</li>
                <li>Use AI-assisted features to improve your permission configurations</li>
                <li>Submit feedback and plugin requests to help improve the Service</li>
                <li>Learn about Minecraft permission systems and best practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Prohibited Uses</h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">3.1 Illegal Activities</h3>
              <p>You may not use the Service for or in connection with:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Any activity that violates local, state, national, or international laws</li>
                <li>Servers that host, distribute, or facilitate illegal content</li>
                <li>Money laundering, fraud, or other financial crimes</li>
                <li>Servers engaged in illegal gambling operations</li>
                <li>Circumvention of export controls or sanctions</li>
                <li>Any activity that violates Minecraft's End User License Agreement (EULA) or Terms of Service</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">3.2 Harmful Content and Activities</h3>
              <p>You may not use the Service for servers or activities that:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Promote, glorify, or incite violence against individuals or groups</li>
                <li>Contain or distribute child sexual abuse material (CSAM)</li>
                <li>Engage in harassment, bullying, or targeted attacks against individuals</li>
                <li>Promote terrorism, extremism, or hate speech</li>
                <li>Distribute malware, viruses, or other malicious software</li>
                <li>Facilitate doxxing, stalking, or invasion of privacy</li>
                <li>Engage in predatory behavior toward minors</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">3.3 Fraud and Deception</h3>
              <p>You may not:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Create configurations designed to deceive or scam players</li>
                <li>Impersonate other servers, organizations, or individuals</li>
                <li>Use the Service to generate fake or misleading permission configurations</li>
                <li>Create server configurations that falsely advertise features or permissions to attract players</li>
                <li>Engage in phishing or social engineering attacks</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">3.4 Intellectual Property Violations</h3>
              <p>You may not use the Service to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Infringe on copyrights, trademarks, or other intellectual property rights</li>
                <li>Create configurations for servers that distribute pirated content</li>
                <li>Violate the licensing terms of Minecraft, plugins, or related software</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">3.5 Service Abuse</h3>
              <p>You may not:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Attempt to gain unauthorized access to the Service or its infrastructure</li>
                <li>Use automated tools, bots, or scripts to access the Service without authorization</li>
                <li>Attempt to reverse-engineer, decompile, or extract source code from the Service</li>
                <li>Interfere with or disrupt the Service's operation or infrastructure</li>
                <li>Probe, scan, or test the vulnerability of the Service without authorization</li>
                <li>Circumvent any security measures or access controls</li>
                <li>Overload the Service with excessive requests or denial-of-service attacks</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">3.6 Feedback and Communication Abuse</h3>
              <p>When using our feedback systems, you may not:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Submit spam, advertising, or promotional content</li>
                <li>Send threatening, abusive, or harassing messages</li>
                <li>Provide false contact information</li>
                <li>Submit content that violates any other section of this AUP</li>
                <li>Flood our feedback systems with excessive or repetitive submissions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Security Responsibilities</h2>
              <p>When using generated configurations, you are responsible for:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Review Before Deployment:</strong> Carefully reviewing all generated configurations before
                  implementing them on production servers
                </li>
                <li>
                  <strong>Testing:</strong> Testing configurations in a safe, non-production environment first
                </li>
                <li>
                  <strong>Security Assessment:</strong> Ensuring that permission configurations don't create security
                  vulnerabilities (e.g., granting excessive permissions to untrusted users)
                </li>
                <li>
                  <strong>Protecting Credentials:</strong> Keeping any API keys or credentials secure and not sharing
                  them with unauthorized parties
                </li>
                <li>
                  <strong>Backups:</strong> Maintaining backups of your server before implementing configuration changes
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Minecraft EULA Compliance</h2>
              <p>
                You acknowledge that Minecraft servers are subject to Mojang's End User License Agreement (EULA).
                When using the Service, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Comply with Minecraft's commercial use guidelines</li>
                <li>Not use generated configurations to create pay-to-win advantages that violate the EULA</li>
                <li>Understand that PermStack provides tools for configuration—compliance with the EULA is your responsibility</li>
                <li>Review Mojang's current guidelines regarding monetization and gameplay advantages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Third-Party AI Services</h2>
              <p>If you enable AI features that use third-party services (such as OpenAI), you must:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Comply with the acceptable use policies of those third-party services</li>
                <li>Not use AI features to generate content that violates this AUP</li>
                <li>Not attempt to manipulate AI systems to produce harmful outputs</li>
                <li>Understand that AI recommendations are suggestions and require human review</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Reporting Violations</h2>
              <p>
                If you become aware of any use of the Service that violates this AUP, please report it through our
                feedback system. Reports should include:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>A description of the violation</li>
                <li>Any relevant evidence or documentation</li>
                <li>Contact information for follow-up (optional)</li>
              </ul>
              <p className="mt-3">
                We take all reports seriously and will investigate violations promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Consequences of Violations</h2>
              <p>Violations of this AUP may result in:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Warning notifications about policy violations</li>
                <li>Temporary or permanent restriction of access to the Service</li>
                <li>Removal of submitted feedback or content</li>
                <li>Reporting to appropriate law enforcement authorities for illegal activities</li>
                <li>Legal action to enforce our rights and protect our users</li>
              </ul>
              <p className="mt-3">
                We reserve the right to take any action we deem appropriate in response to violations, at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. No Monitoring Obligation</h2>
              <p>
                While we reserve the right to monitor use of the Service, we are not obligated to do so. We are not
                responsible for any content generated using the Service or for monitoring compliance with this AUP.
                The responsibility for complying with this AUP lies with each user.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Acceptable Use Policy from time to time. Significant changes will be communicated
                through the Service or by updating the "Last Updated" date. Your continued use of the Service after
                changes constitutes acceptance of the modified AUP.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Relationship with Other Policies</h2>
              <p>
                This AUP is incorporated into and forms part of our Terms of Service. In the event of any conflict
                between this AUP and the Terms of Service, the Terms of Service shall prevail unless this AUP
                expressly states otherwise.
              </p>
              <p className="mt-3">
                You should also review our Privacy Policy to understand how we collect and use information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Contact Information</h2>
              <p>
                If you have questions about this Acceptable Use Policy or need to report a violation, please contact
                us through the feedback system within the application.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-surface-800">
              <p className="text-surface-500 text-sm">
                By using PermStack, you acknowledge that you have read, understood, and agree to comply with this
                Acceptable Use Policy. Use of the Service in violation of this AUP may result in immediate termination
                of access and potential legal action.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
