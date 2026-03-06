import React, { useState } from 'react';
import { onboardingStorage } from './utils/storage';
import OnboardingScreen from './components/OnboardingScreen';
import TodayScreen from './components/TodayScreen';
import ProgressScreen from './components/ProgressScreen';
import HabitsScreen from './components/HabitsScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('today');
  const [isOnboarded, setIsOnboarded] = useState(() => onboardingStorage.isCompleted());

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
  };

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-peach-50 to-mint-50">
      {/* Main Content */}
      {currentTab === 'today' && <TodayScreen />}
      {currentTab === 'progress' && <ProgressScreen />}
      {currentTab === 'habits' && <HabitsScreen />}
      {currentTab === 'profile' && <ProfileScreen />}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around h-20">
          {[
            { id: 'today', label: 'Сегодня', emoji: '☀️' },
            { id: 'progress', label: 'Прогресс', emoji: '📊' },
            { id: 'habits', label: 'Привычки', emoji: '⚙️' },
            { id: 'profile', label: 'Профиль', emoji: '👤' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
                currentTab === tab.id
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-xl">{tab.emoji}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
