import { useState } from 'react';
import { Send, Package, ExternalLink, Link2, MessageSquare } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui';

interface RequestPluginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Configure your submission endpoint here
// Discord webhook URL should be set via VITE_DISCORD_PLUGIN_REQUEST_WEBHOOK environment variable
const REQUEST_CONFIG: {
  method: 'mailto' | 'formspree' | 'discord';
  email: string;
  formspreeId: string;
  discordWebhook: string;
} = {
  method: 'discord', // Using Discord webhook
  email: 'plugins@permstack.com', // Fallback for mailto
  formspreeId: import.meta.env.VITE_FORMSPREE_ID || '',
  discordWebhook: import.meta.env.VITE_DISCORD_PLUGIN_REQUEST_WEBHOOK || '',
};

export function RequestPluginModal({ isOpen, onClose }: RequestPluginModalProps) {
  const [pluginName, setPluginName] = useState('');
  const [pluginUrl, setPluginUrl] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!pluginName.trim()) return;

    setIsSubmitting(true);

    const contactInfo = [
      email.trim() ? `Email: ${email.trim()}` : null,
      discordUsername.trim() ? `Discord: ${discordUsername.trim()}` : null,
    ].filter(Boolean).join('\n') || 'Not provided';

    const requestData = {
      pluginName: pluginName.trim(),
      pluginUrl: pluginUrl.trim() || 'Not provided',
      description: description.trim() || 'Not provided',
      email: email.trim() || 'Not provided',
      discord: discordUsername.trim() || 'Not provided',
      timestamp: new Date().toISOString(),
    };

    try {
      if (REQUEST_CONFIG.method === 'discord' && REQUEST_CONFIG.discordWebhook) {
        const embed = {
          title: `📦 Plugin Request: ${pluginName}`,
          color: 0x6366f1,
          fields: [
            { name: 'Plugin URL', value: pluginUrl || 'Not provided', inline: false },
            { name: 'Description', value: description || 'Not provided', inline: false },
            { name: 'Contact Info', value: contactInfo, inline: false },
          ],
          footer: { text: 'PermStack Plugin Request' },
          timestamp: requestData.timestamp,
        };
        await fetch(REQUEST_CONFIG.discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [embed] }),
        });
        setSubmitted(true);
      } else if (REQUEST_CONFIG.method === 'formspree' && REQUEST_CONFIG.formspreeId) {
        const response = await fetch(`https://formspree.io/f/${REQUEST_CONFIG.formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        if (response.ok) {
          setSubmitted(true);
        }
      } else {
        // mailto: fallback
        const subject = encodeURIComponent(`Plugin Request: ${pluginName}`);
        const body = encodeURIComponent(
          `Plugin Name: ${pluginName}\n` +
          `Plugin URL: ${pluginUrl || 'Not provided'}\n` +
          `Description: ${description || 'Not provided'}\n` +
          `Email: ${email || 'Not provided'}\n` +
          `Discord: ${discordUsername || 'Not provided'}\n` +
          `Submitted: ${requestData.timestamp}`
        );
        window.open(`mailto:${REQUEST_CONFIG.email}?subject=${subject}&body=${body}`, '_blank');
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Plugin request submission error:', error);
      // Fallback to mailto
      const subject = encodeURIComponent(`Plugin Request: ${pluginName}`);
      const body = encodeURIComponent(`Plugin: ${pluginName}\nURL: ${pluginUrl}\nEmail: ${email}\nDiscord: ${discordUsername}`);
      window.open(`mailto:${REQUEST_CONFIG.email}?subject=${subject}&body=${body}`, '_blank');
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPluginName('');
    setPluginUrl('');
    setDescription('');
    setEmail('');
    setDiscordUsername('');
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Request Sent!" size="md">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Plugin Request Submitted!</h3>
          <p className="text-surface-400 mb-6">
            We'll review your request and try to add <span className="text-white font-medium">{pluginName}</span> to our database soon.
          </p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Request a Plugin" size="lg">
      <div className="space-y-5">
        <p className="text-surface-400">
          Can't find a plugin you use? Let us know and we'll try to add it to our database!
        </p>

        {/* Plugin Name */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Plugin Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={pluginName}
            onChange={(e) => setPluginName(e.target.value)}
            className="input w-full"
            placeholder="e.g. SuperVanish, DeluxeMenus, PlaceholderAPI"
            autoFocus
          />
        </div>

        {/* Plugin URL */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Link2 className="w-4 h-4" />
              Plugin Link <span className="text-surface-500">(Spigot, Bukkit, GitHub, etc.)</span>
            </span>
          </label>
          <input
            type="url"
            value={pluginUrl}
            onChange={(e) => setPluginUrl(e.target.value)}
            className="input w-full"
            placeholder="https://www.spigotmc.org/resources/..."
          />
          <p className="text-xs text-surface-500 mt-1">
            A link helps us find the plugin's documentation and permissions.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            What does this plugin do? <span className="text-surface-500">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full h-20 resize-none"
            placeholder="Brief description of the plugin's purpose..."
          />
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Contact Info <span className="text-surface-500">(optional, to notify when added)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-surface-500 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs text-surface-500 mb-1">Discord Username</label>
              <input
                type="text"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                className="input w-full"
                placeholder="username or user#1234"
              />
            </div>
          </div>
          <p className="text-xs text-surface-500 mt-1.5">
            We'll let you know when your plugin is added!
          </p>
        </div>

        {/* Note about Discord webhook */}
        {REQUEST_CONFIG.method === 'discord' && REQUEST_CONFIG.discordWebhook && (
          <div className="flex items-start gap-2 p-3 bg-primary-500/10 rounded-lg border border-primary-500/30">
            <MessageSquare className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary-300">
              Your request will be sent directly to our Discord server. We review all plugin requests!
            </p>
          </div>
        )}

        {/* Note about mailto fallback */}
        {(REQUEST_CONFIG.method === 'mailto' || !REQUEST_CONFIG.discordWebhook) && (
          <div className="flex items-start gap-2 p-3 bg-surface-800/50 rounded-lg border border-surface-700">
            <ExternalLink className="w-4 h-4 text-surface-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-surface-500">
              This will open your email client. We review all plugin requests!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-800">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!pluginName.trim() || isSubmitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Sending...' : 'Submit Request'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Button component for inline usage
interface RequestPluginButtonProps {
  onClick: () => void;
  className?: string;
}

export function RequestPluginButton({ onClick, className = '' }: RequestPluginButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-primary-400 transition-colors ${className}`}
    >
      <Package className="w-4 h-4" />
      Don't see a plugin?
    </button>
  );
}
