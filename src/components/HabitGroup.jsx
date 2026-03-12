import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function HabitGroup({ title, habits, today: _today, todayLog, onToggle }) {
  const { theme } = useTheme();

  return (
    <div className={`${theme.habitGroupBg} rounded-3xl shadow-lg overflow-hidden`}>
      <div className={`px-6 py-4`}>
        <h3 className={`font-semibold text-lg ${theme.habitGroupTitleColor}`}>{title}</h3>
      </div>
      <div className="space-y-2 px-4 pb-4">
        {habits.map(habit => {
          const isCompleted = todayLog.habits?.[habit.id] || false;
          return (
            <button
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
                isCompleted ? theme.habitItemActiveBg : theme.habitItemBg
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className={`w-6 h-6 ${theme.checkDone} rounded-full flex items-center justify-center check-mark text-sm`}>
                    ✓
                  </div>
                ) : (
                  <div className={`w-6 h-6 ${theme.checkEmpty} rounded-full`}></div>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${theme.habitTextColor} transition-all ${
                  isCompleted ? 'line-through opacity-60' : ''
                }`}>
                  {habit.emoji} {habit.title}
                </div>
                {habit.description && (
                  <div className={`text-xs mt-0.5 ${theme.habitDescColor}`}>
                    {habit.description}
                  </div>
                )}
              </div>
              {isCompleted && (
                <div className="text-base animate-bounce">✨</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
