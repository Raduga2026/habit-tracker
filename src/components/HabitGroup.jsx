import React from 'react';

export default function HabitGroup({ title, habits, today: _today, todayLog, onToggle }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-rose-50 to-peach-50 px-6 py-4 border-b-2 border-rose-100">
        <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
      </div>
      <div className="space-y-3 p-4">
        {habits.map(habit => {
          const isCompleted = todayLog.habits?.[habit.id] || false;
          return (
            <button
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={`habit-item w-full text-left ${
                isCompleted ? 'completed' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-6 h-6 bg-gradient-to-br from-mint-400 to-cyan-400 rounded-full flex items-center justify-center text-white check-mark">
                    ✓
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-rose-300 rounded-full hover:border-rose-400 transition-colors"></div>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium text-gray-800 transition-all ${
                  isCompleted ? 'line-through opacity-60' : ''
                }`}>
                  {habit.emoji} {habit.title}
                </div>
                {habit.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {habit.description}
                  </div>
                )}
              </div>
              {isCompleted && (
                <div className="text-lg animate-bounce">✨</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
