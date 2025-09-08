import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

interface BackendStatusProps {
  onStatusChange: (isOnline: boolean) => void;
  onBackendInfoChange?: (info: { knowledgeItems: number }) => void;
}

export const BackendStatus: React.FC<BackendStatusProps> = ({ onStatusChange, onBackendInfoChange }) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [backendInfo, setBackendInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkBackendStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    onStatusChange(isOnline === true);
  }, [isOnline, onStatusChange]);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        const data = await response.json();
        setBackendInfo(data);
        setIsOnline(true);
        
        // Pass backend info to parent
        if (onBackendInfoChange && data.knowledge_items_count) {
          onBackendInfoChange({ knowledgeItems: data.knowledge_items_count });
        }
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        Checking backend...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {isOnline ? (
        <>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <span>AI Backend Online</span>
          </div>
          {backendInfo && (
            <span className="text-gray-500 dark:text-gray-400">
              ({backendInfo.services?.knowledge_items_count || 0} knowledge items)
            </span>
          )}
        </>
      ) : (
        <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
          <AlertCircle className="w-4 h-4" />
          <WifiOff className="w-4 h-4" />
          <span>Using Mock Responses</span>
        </div>
      )}
    </div>
  );
};
