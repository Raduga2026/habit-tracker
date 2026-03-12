import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAchievements } from '../hooks/useStorage';
import { BADGE_DEFINITIONS, LEVELS, getLevelInfo } from '../utils/achievements';
import { calculateXP } from '../utils/dateHelpers';

export default function AchievementsScreen() {
  const { theme } = useTheme();
  const { achievements } = useAchievements();
  const xp = calculateXP();
  const { level, xpInLevel, xpForNext, progress } = getLevelInfo(xp);
  const unlockedIds = achievements.unlockedIds || [];

  const levelIndex = LEVELS.indexOf(level);
  const nextLevel = LEVELS[levelIndex + 1];

  return (
    <div className={`min-h-screen ${theme.appBg} pb-24`}>
      {/* Header */}
      <div className={`${theme.headerBg} text-white p-6 rounded-b-3xl shadow-lg`}>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold">Достижения</h1>
          <p className="text-sm opacity-80 mt-2">Твой путь и награды</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Level & XP Card */}
        <div className={`${theme.xpCardBg} rounded-2xl p-6 shadow-sm`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{level.emoji}</div>
            <div>
              <div className={`text-xl font-bold ${theme.levelTextColor}`}>{level.name}</div>
              <div className={`text-sm ${theme.cardText} opacity-70`}>
                {xp} XP
                {nextLevel && (
                  <span> · до «{nextLevel.name}»: {xpForNext - xpInLevel} XP</span>
                )}
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          {nextLevel ? (
            <>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${theme.xpBarClass} transition-all duration-700`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={`flex justify-between text-xs ${theme.cardText} opacity-60 mt-2`}>
                <span>{level.name} ({level.minXP} XP)</span>
                <span>{nextLevel.name} ({nextLevel.minXP} XP)</span>
              </div>
            </>
          ) : (
            <div className={`text-sm ${theme.levelTextColor} font-semibold text-center mt-2`}>
              👑 Максимальный уровень достигнут!
            </div>
          )}

          {/* Level progression */}
          <div className="flex justify-between mt-5">
            {LEVELS.map((lvl, idx) => (
              <div key={lvl.name} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                  idx <= levelIndex
                    ? 'border-transparent bg-white/20'
                    : 'border-gray-300 opacity-30'
                }`}>
                  {lvl.emoji}
                </div>
                <span className={`text-xs ${theme.cardText} opacity-60`}>{lvl.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* XP breakdown hint */}
        <div className={`${theme.cardBg} rounded-2xl p-4 shadow-sm`}>
          <h3 className={`font-semibold ${theme.cardText} mb-3`}>Как получить XP</h3>
          <div className="space-y-2">
            {[
              { label: 'За каждую выполненную привычку', value: '+10 XP' },
              { label: 'За идеальный день (все привычки)', value: '+50 XP' },
              { label: 'За каждый день серии', value: '+5 XP' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className={`text-sm ${theme.cardText} opacity-80`}>{item.label}</span>
                <span className={`text-sm font-bold ${theme.levelTextColor}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className={`${theme.cardBg} rounded-2xl p-5 shadow-sm`}>
          <h3 className={`font-semibold ${theme.cardText} mb-4`}>
            Бейджи · {unlockedIds.length}/{BADGE_DEFINITIONS.length}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {BADGE_DEFINITIONS.map(badge => {
              const unlocked = unlockedIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-3 text-center transition-all ${
                    unlocked ? theme.badgeUnlocked : theme.badgeLocked
                  }`}
                >
                  <div className={`text-3xl mb-1 ${unlocked ? '' : 'grayscale'}`}>
                    {badge.emoji}
                  </div>
                  <div className={`text-xs font-semibold ${theme.cardText} leading-tight`}>
                    {badge.title}
                  </div>
                  <div className={`text-xs ${theme.cardText} opacity-60 mt-1 leading-tight`}>
                    {badge.description}
                  </div>
                  {unlocked && (
                    <div className={`text-xs font-bold ${theme.levelTextColor} mt-1`}>
                      ✓ Получен
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
