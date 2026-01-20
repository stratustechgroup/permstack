import { Logo } from '../components/Logo';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-surface-400 text-sm mb-8">Last Updated: {lastUpdated}</p>

          <div className="space-y-8 text-surface-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using PermStack ("the Service"), a Minecraft server permissions configuration generator,
                you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not
                access or use the Service.
              </p>
              <p className="mt-3">
                These Terms constitute a legally binding agreement between you ("User," "you," or "your") and PermStack
                ("we," "us," or "our"). We reserve the right to modify these Terms at any time. Your continued use of the
                Service following any modifications constitutes acceptance of those modifications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                PermStack is a web-based tool that generates permission configuration files for Minecraft server permission
                management plugins, including but not limited to LuckPerms, PermissionsEx, and GroupManager. The Service provides:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Automated generation of permission node configurations based on user selections</li>
                <li>Template-based rank hierarchy creation</li>
                <li>Plugin permission database lookups</li>
                <li>AI-assisted permission recommendations (when enabled by the user)</li>
                <li>Export functionality for various configuration formats (YAML, JSON, HOCON)</li>
              </ul>
              <p className="mt-3">
                The Service operates entirely within your web browser. Configuration files are generated client-side and
                are not stored on our servers unless explicitly submitted through feedback mechanisms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <p>By using the Service, you agree to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Use the Service only for lawful purposes related to Minecraft server administration</li>
                <li>Review all generated configurations before deploying them to production servers</li>
                <li>Take full responsibility for any configurations you implement on your servers</li>
                <li>Not attempt to reverse-engineer, decompile, or exploit the Service</li>
                <li>Not use automated systems (bots, scrapers) to access the Service without authorization</li>
                <li>Not transmit malicious code, viruses, or harmful data through the Service</li>
                <li>Not use the Service to generate configurations for servers engaged in illegal activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. AI Features and Third-Party Services</h2>
              <p>
                The Service may integrate with third-party AI services (such as OpenAI) to provide enhanced functionality,
                including intelligent permission recommendations and rank analysis. By enabling AI features:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>You acknowledge that data you input may be processed by third-party AI providers</li>
                <li>You are responsible for providing your own API keys if required</li>
                <li>You agree to comply with the terms of service of any third-party AI providers</li>
                <li>You understand that AI recommendations are suggestions only and should be reviewed before implementation</li>
                <li>We do not guarantee the accuracy, security implications, or suitability of AI-generated recommendations</li>
              </ul>
              <p className="mt-3">
                API keys you provide are stored locally in your browser and are never transmitted to our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <p>
                The Service, including its design, code, graphics, logos, and documentation, is owned by PermStack and
                protected by intellectual property laws. You may not:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Copy, modify, or distribute the Service's source code without authorization</li>
                <li>Use our trademarks, logos, or branding without written permission</li>
                <li>Create derivative works based on the Service</li>
                <li>Remove or alter any proprietary notices or labels</li>
              </ul>
              <p className="mt-3">
                Configuration files generated by the Service are yours to use freely for your Minecraft servers. We claim
                no ownership over configurations you create using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Disclaimer of Warranties</h2>
              <p className="uppercase font-semibold text-surface-400">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE</li>
                <li>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE</li>
                <li>WARRANTIES REGARDING THE ACCURACY OR RELIABILITY OF GENERATED CONFIGURATIONS</li>
                <li>WARRANTIES THAT CONFIGURATIONS WILL BE COMPATIBLE WITH YOUR SPECIFIC SERVER SETUP</li>
              </ul>
              <p className="mt-3">
                You acknowledge that Minecraft servers have varying configurations, plugins, and requirements. Generated
                configurations may require manual adjustment for your specific environment. Always test configurations in
                a non-production environment before deployment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PERMSTACK AND ITS OPERATORS, AFFILIATES, AND
                CONTRIBUTORS SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, goodwill, or other intangible losses</li>
                <li>Server downtime, data corruption, or security breaches resulting from implemented configurations</li>
                <li>Unauthorized access to your Minecraft server resulting from permission misconfigurations</li>
                <li>Player data loss or server damage of any kind</li>
                <li>Any damages arising from reliance on AI-generated recommendations</li>
              </ul>
              <p className="mt-3">
                This limitation applies regardless of the legal theory upon which the claim is based, whether we have been
                advised of the possibility of such damages, and whether the damages were foreseeable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless PermStack and its operators, affiliates, and contributors
                from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys'
                fees) arising out of or relating to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Your use of the Service</li>
                <li>Configurations you generate and implement</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of third parties</li>
                <li>Any disputes between you and your server's players or staff</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Service Modifications and Termination</h2>
              <p>We reserve the right to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Modify, suspend, or discontinue the Service at any time without notice</li>
                <li>Update permission databases, templates, and features</li>
                <li>Restrict access to the Service for any reason</li>
                <li>Remove or modify content or functionality</li>
              </ul>
              <p className="mt-3">
                We are not liable for any modification, suspension, or discontinuance of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Third-Party Links and Content</h2>
              <p>
                The Service may contain links to third-party websites, including plugin documentation, Minecraft community
                resources, and external tools. We are not responsible for the content, privacy practices, or terms of
                service of third-party websites. Your interactions with third-party services are governed by their
                respective terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
                PermStack operates, without regard to conflict of law principles.
              </p>
              <p className="mt-3">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding
                arbitration in accordance with applicable arbitration rules. You waive any right to participate in
                class action lawsuits or class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited
                or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force
                and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">13. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and Acceptable Use Policy, constitute the entire agreement
                between you and PermStack regarding your use of the Service and supersede all prior agreements and
                understandings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">14. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us through our feedback system within the
                application or via the contact methods provided on our website.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-surface-800">
              <p className="text-surface-500 text-sm">
                By using PermStack, you acknowledge that you have read, understood, and agree to be bound by these
                Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
