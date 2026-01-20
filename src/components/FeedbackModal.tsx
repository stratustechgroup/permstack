import { useState } from 'react';
import { Send, MessageSquare, ThumbsUp, ThumbsDown, Lightbulb, ExternalLink } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'positive' | 'negative' | 'suggestion';

// Configure your feedback endpoint here
// Options: 'mailto', 'formspree', 'discord'
const FEEDBACK_CONFIG: {
  method: 'mailto' | 'formspree' | 'discord';
  email: string;
  formspreeId: string;
  discordWebhook: string;
} = {
  method: 'discord', // Using Discord webhook
  email: 'feedback@permstack.com', // Fallback for mailto
  formspreeId: '', // Your Formspree form ID (e.g., 'xrgvqpzl')
  discordWebhook: '', // Add your Discord webhook URL here
};

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { id: 'positive' as const, label: 'What I like', icon: ThumbsUp, color: 'text-green-400 bg-green-500/10 border-green-500/30 hover:border-green-500' },
    { id: 'negative' as const, label: 'What could improve', icon: ThumbsDown, color: 'text-red-400 bg-red-500/10 border-red-500/30 hover:border-red-500' },
    { id: 'suggestion' as const, label: 'Feature request', icon: Lightbulb, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500' },
  ];

  const handleSubmit = async () => {
    if (!feedbackType || !message.trim()) return;

    setIsSubmitting(true);

    const contactInfo = [
      email.trim() ? `Email: ${email.trim()}` : null,
      discordUsername.trim() ? `Discord: ${discordUsername.trim()}` : null,
    ].filter(Boolean).join('\n') || 'Not provided';

    const feedbackData = {
      type: feedbackType,
      message: message.trim(),
      email: email.trim() || 'Not provided',
      discord: discordUsername.trim() || 'Not provided',
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    try {
      if (FEEDBACK_CONFIG.method === 'discord' && FEEDBACK_CONFIG.discordWebhook) {
        // Discord webhook approach
        const embed = {
          title: `${feedbackType === 'positive' ? '👍' : feedbackType === 'negative' ? '👎' : '💡'} Feedback: ${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}`,
          description: message,
          color: feedbackType === 'positive' ? 0x22c55e : feedbackType === 'negative' ? 0xef4444 : 0xeab308,
          fields: [
            { name: 'Contact Info', value: contactInfo, inline: false },
          ],
          footer: { text: 'PermStack Feedback' },
          timestamp: feedbackData.timestamp,
        };
        await fetch(FEEDBACK_CONFIG.discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [embed] }),
        });
        setSubmitted(true);
      } else if (FEEDBACK_CONFIG.method === 'formspree' && FEEDBACK_CONFIG.formspreeId) {
        // Formspree approach
        const response = await fetch(`https://formspree.io/f/${FEEDBACK_CONFIG.formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackData),
        });
        if (response.ok) {
          setSubmitted(true);
        }
      } else {
        // mailto: fallback - opens email client
        const subject = encodeURIComponent(`PermStack Feedback: ${feedbackType}`);
        const body = encodeURIComponent(
          `Feedback Type: ${feedbackType}\n` +
          `Message: ${message}\n` +
          `Email: ${email || 'Not provided'}\n` +
          `Discord: ${discordUsername || 'Not provided'}\n` +
          `Submitted: ${feedbackData.timestamp}`
        );
        window.open(`mailto:${FEEDBACK_CONFIG.email}?subject=${subject}&body=${body}`, '_blank');
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      // Fallback to mailto
      const subject = encodeURIComponent(`PermStack Feedback: ${feedbackType}`);
      const body = encodeURIComponent(`Message: ${message}\nEmail: ${email}\nDiscord: ${discordUsername}`);
      window.open(`mailto:${FEEDBACK_CONFIG.email}?subject=${subject}&body=${body}`, '_blank');
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFeedbackType(null);
    setMessage('');
    setEmail('');
    setDiscordUsername('');
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Thank You!" size="md">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Feedback Received!</h3>
          <p className="text-surface-400 mb-6">
            We appreciate you taking the time to help us improve PermStack.
          </p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Send Feedback" size="lg">
      <div className="space-y-5">
        <p className="text-surface-400">
          Help us improve PermStack! Let us know what you think.
        </p>

        {/* Feedback Type Selection */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">
            What kind of feedback?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {feedbackTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setFeedbackType(type.id)}
                  className={`p-4 rounded-lg border transition-all text-center ${
                    feedbackType === type.id
                      ? type.color.replace('hover:', '')
                      : 'bg-surface-800 border-surface-700 hover:border-surface-600'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${feedbackType === type.id ? type.color.split(' ')[0] : 'text-surface-400'}`} />
                  <span className={`text-sm font-medium ${feedbackType === type.id ? 'text-white' : 'text-surface-300'}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Your feedback <span className="text-red-400">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input w-full h-32 resize-none"
            placeholder={
              feedbackType === 'positive'
                ? "What's working well for you? What do you love about PermStack?"
                : feedbackType === 'negative'
                ? "What frustrates you? What could we do better?"
                : feedbackType === 'suggestion'
                ? "What feature would make PermStack better for you?"
                : "Select a feedback type above, then share your thoughts..."
            }
            disabled={!feedbackType}
          />
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Contact Info <span className="text-surface-500">(optional, for follow-up)</span>
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
            Provide at least one if you'd like us to follow up with you.
          </p>
        </div>

        {/* Note about Discord webhook */}
        {FEEDBACK_CONFIG.method === 'discord' && FEEDBACK_CONFIG.discordWebhook && (
          <div className="flex items-start gap-2 p-3 bg-primary-500/10 rounded-lg border border-primary-500/30">
            <MessageSquare className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary-300">
              Your feedback will be sent directly to our Discord server. We review every submission!
            </p>
          </div>
        )}

        {/* Note about mailto fallback */}
        {(FEEDBACK_CONFIG.method === 'mailto' || !FEEDBACK_CONFIG.discordWebhook) && (
          <div className="flex items-start gap-2 p-3 bg-surface-800/50 rounded-lg border border-surface-700">
            <ExternalLink className="w-4 h-4 text-surface-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-surface-500">
              This will open your email client to send feedback. We read every message!
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
            disabled={!feedbackType || !message.trim() || isSubmitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Simple button to open feedback modal
interface FeedbackButtonProps {
  onClick: () => void;
  className?: string;
}

export function FeedbackButton({ onClick, className = '' }: FeedbackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-primary-400 transition-colors ${className}`}
    >
      <MessageSquare className="w-4 h-4" />
      Feedback
    </button>
  );
}
