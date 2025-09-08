import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Brain, Database, Wifi } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  backendStatus: {
    isOnline: boolean;
    knowledgeItems: number;
  };
}

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'pending' | 'loading' | 'complete' | 'error';
  delay: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete, backendStatus }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<LoadingStep[]>([
    {
      id: 'backend',
      label: 'Connecting to AI Backend',
      icon: <Wifi className="w-5 h-5" />,
      status: 'pending',
      delay: 500
    },
    {
      id: 'knowledge',
      label: 'Loading Knowledge Base',
      icon: <Database className="w-5 h-5" />,
      status: 'pending',
      delay: 1000
    },
    {
      id: 'ai',
      label: 'Initializing AI System',
      icon: <Brain className="w-5 h-5" />,
      status: 'pending',
      delay: 800
    }
  ]);

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // Update current step to loading
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'loading' } : step
        ));

        // Wait for delay
        await new Promise(resolve => setTimeout(resolve, steps[i].delay));

        // Determine step completion status
        let status: 'complete' | 'error' = 'complete';
        
        if (steps[i].id === 'backend' && !backendStatus.isOnline) {
          status = 'error';
        }
        
        if (steps[i].id === 'knowledge' && backendStatus.knowledgeItems === 0) {
          status = 'error';
        }

        // Update step to complete/error
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status } : step
        ));
      }

      // Wait a bit before completing
      await new Promise(resolve => setTimeout(resolve, 800));
      onLoadingComplete();
    };

    processSteps();
  }, [backendStatus, onLoadingComplete]);

  const getStatusIcon = (step: LoadingStep) => {
    switch (step.status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusText = (step: LoadingStep) => {
    if (step.id === 'backend' && step.status === 'complete') {
      return `${step.label} ✓`;
    }
    if (step.id === 'knowledge' && step.status === 'complete') {
      return `${step.label} (${backendStatus.knowledgeItems} items) ✓`;
    }
    if (step.status === 'error') {
      return `${step.label} - Using fallback mode`;
    }
    return step.label;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            AskRick
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your AI Buddy is getting ready...
          </p>
        </div>

        {/* Loading Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-blue-50 dark:bg-gray-700' 
                  : 'bg-gray-50 dark:bg-gray-600'
              }`}
            >
              <div className="flex-shrink-0">
                {getStatusIcon(step)}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.status === 'error' 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {getStatusText(step)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </p>
        </div>
      </div>
    </div>
  );
};
