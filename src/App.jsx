import React, { useState, useEffect } from 'react';
import { onboardingStorage } from './utils/storage';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import OnboardingScreen from './components/OnboardingScreen';
import TodayScreen from './components/TodayScreen';
import ProgressScreen from './components/ProgressScreen';
import HabitsScreen from './components/HabitsScreen';
import ProfileScreen from './components/ProfileScreen';
import AchievementsScreen from './components/AchievementsScreen';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('today');
  const { theme } = useTheme();

  const tabs = [
    { id: 'today', label: 'Сегодня', emoji: '☀️' },
    { id: 'progress', label: 'Прогресс', emoji: '📊' },
    { id: 'achievements', label: 'Награды', emoji: '🏆' },
    { id: 'habits', label: 'Привычки', emoji: '⚙️' },
    { id: 'profile', label: 'Профиль', emoji: '👤' }
  ];

  return (
    <div className={`min-h-screen ${theme.appBg}`}>
      {currentTab === 'today' && <TodayScreen />}
      {currentTab === 'progress' && <ProgressScreen />}
      {currentTab === 'achievements' && <AchievementsScreen />}
      {currentTab === 'habits' && <HabitsScreen />}
      {currentTab === 'profile' && <ProfileScreen />}

      <nav className={`fixed bottom-0 left-0 right-0 ${theme.navBg} shadow-lg`}>
        <div className="max-w-md mx-auto flex justify-around h-20 items-center px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className="flex-1 flex items-center justify-center"
            >
              <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-full transition-all duration-200 ${
                currentTab === tab.id ? theme.navBtnActive : theme.navBtnInactive
              }`}>
                <span className="text-xl">{tab.emoji}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(() => onboardingStorage.isCompleted());

  // Инициализация Telegram Mini App (работает только внутри Telegram)
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.disableVerticalSwipes?.();
    }
  }, []);

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
