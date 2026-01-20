import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  Header,
  Footer,
  Hero,
  ServerTypeSelector,
  PluginSelector,
  RankBuilder,
  OutputPanel,
  initializeAIConfig,
} from './components';
import { Button } from './components/ui';
import { rankTemplates, popularPlugins } from './data';
import type { ServerType, Rank } from './data';
import './index.css';

type Step = 'hero' | 'server' | 'plugins' | 'ranks' | 'output';

function App() {
  const [step, setStep] = useState<Step>('hero');
  const [serverType, setServerType] = useState<ServerType | null>(null);
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>(
    popularPlugins.map((p) => p.id)
  );
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [ranks, setRanks] = useState<Rank[]>(rankTemplates[0].ranks);

  const builderRef = useRef<HTMLDivElement>(null);

  // Initialize AI config from localStorage on app load
  useEffect(() => {
    initializeAIConfig();
  }, []);

  const handleStart = () => {
    setStep('server');
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = rankTemplates.find((t) => t.id === templateId);
    if (template) {
      setRanks(template.ranks);
    }
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'server', label: 'Server Type' },
    { id: 'plugins', label: 'Plugins' },
    { id: 'ranks', label: 'Ranks' },
    { id: 'output', label: 'Output' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const canProceed = () => {
    switch (step) {
      case 'server':
        return serverType !== null;
      case 'plugins':
        return selectedPlugins.length > 0;
      case 'ranks':
        return ranks.length > 0;
      default:
        return true;
    }
  };

  const goNext = () => {
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      setStep(nextStep.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) {
      setStep(prevStep.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {step === 'hero' && <Hero onStart={handleStart} />}

        {step !== 'hero' && (
          <div ref={builderRef} className="relative">
            {/* Floating Navigation Sidebar */}
            <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
              <div className="bg-surface-900/95 backdrop-blur-sm border border-surface-800 rounded-xl p-3 shadow-xl space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={goPrev}
                  disabled={currentStepIndex === 0}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                <div className="flex flex-col items-center gap-2 py-2 border-y border-surface-800">
                  {steps.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => i < currentStepIndex && setStep(s.id)}
                      disabled={i > currentStepIndex}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        i < currentStepIndex
                          ? 'bg-primary-500 text-white cursor-pointer hover:bg-primary-400'
                          : i === currentStepIndex
                          ? 'bg-gradient-primary text-white'
                          : 'bg-surface-800 text-surface-500 cursor-not-allowed'
                      }`}
                      title={s.label}
                    >
                      {i < currentStepIndex ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        i + 1
                      )}
                    </button>
                  ))}
                </div>

                {currentStepIndex < steps.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={goNext}
                    disabled={!canProceed()}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setStep('hero');
                      setServerType(null);
                      setSelectedPlugins(popularPlugins.map((p) => p.id));
                      setSelectedTemplate('standard');
                      setRanks(rankTemplates[0].ranks);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full"
                  >
                    Start Over
                  </Button>
                )}
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12">
              {/* Progress indicator */}
              <div className="mb-12">
                <div className="flex items-center justify-between">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                      <button
                        onClick={() => i < currentStepIndex && setStep(s.id)}
                        disabled={i > currentStepIndex}
                        className={`flex items-center gap-2 ${
                          i <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            i < currentStepIndex
                              ? 'bg-primary-500 text-white'
                              : i === currentStepIndex
                              ? 'bg-gradient-primary text-white'
                              : 'bg-surface-800 text-surface-500'
                          }`}
                        >
                          {i < currentStepIndex ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span
                          className={`hidden sm:block text-sm font-medium ${
                            i <= currentStepIndex ? 'text-white' : 'text-surface-500'
                          }`}
                        >
                          {s.label}
                        </span>
                      </button>
                      {i < steps.length - 1 && (
                        <div
                          className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 ${
                            i < currentStepIndex ? 'bg-primary-500' : 'bg-surface-800'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step content */}
              <div className="mb-12">
                {step === 'server' && (
                  <ServerTypeSelector value={serverType} onChange={setServerType} />
                )}
                {step === 'plugins' && (
                  <PluginSelector value={selectedPlugins} onChange={setSelectedPlugins} />
                )}
                {step === 'ranks' && (
                  <RankBuilder
                    selectedTemplate={selectedTemplate}
                    ranks={ranks}
                    onTemplateChange={handleTemplateChange}
                    onRanksChange={setRanks}
                  />
                )}
                {step === 'output' && serverType && (
                  <OutputPanel
                    serverType={serverType}
                    selectedPlugins={selectedPlugins}
                    ranks={ranks}
                  />
                )}
              </div>

              {/* Bottom Navigation (mobile/tablet fallback) */}
              <div className="flex items-center justify-between border-t border-surface-800 pt-6 lg:hidden">
                <Button
                  variant="secondary"
                  onClick={goPrev}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                {currentStepIndex < steps.length - 1 ? (
                  <Button
                    onClick={goNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setStep('hero');
                      setServerType(null);
                      setSelectedPlugins(popularPlugins.map((p) => p.id));
                      setSelectedTemplate('standard');
                      setRanks(rankTemplates[0].ranks);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Start Over
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
