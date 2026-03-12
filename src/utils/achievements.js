import { logsStorage, habitsStorage } from './storage';
import { getBestStreak } from './dateHelpers';

export const BADGE_DEFINITIONS = [
  {
    id: 'first_day',
    title: 'Первый день',
    description: 'Отметил(а) хотя бы одну привычку',
    emoji: '🌱',
    check: (logs) =>
      Object.values(logs).some(log =>
        Object.values(log.habits || {}).some(Boolean)
      )
  },
  {
    id: 'perfect_day',
    title: 'Идеальный день',
    description: 'Все привычки выполнены за один день',
    emoji: '⭐',
    check: (logs, habits) => {
      const activeCount = habits.filter(h => h.isActive).length;
      if (activeCount === 0) return false;
      return Object.values(logs).some(log => {
        const completed = Object.values(log.habits || {}).filter(Boolean).length;
        return completed >= activeCount;
      });
    }
  },
  {
    id: 'week_streak',
    title: 'Неделя',
    description: '7 дней подряд без пропусков',
    emoji: '🔥',
    check: () => getBestStreak() >= 7
  },
  {
    id: 'month_streak',
    title: 'Месяц',
    description: '30 дней подряд без пропусков',
    emoji: '🏆',
    check: () => getBestStreak() >= 30
  },
  {
    id: 'hundred_days',
    title: 'Сотня',
    description: '100 дней в трекере',
    emoji: '💯',
    check: (logs) => {
      const daysWithActivity = Object.values(logs).filter(log =>
        Object.values(log.habits || {}).some(Boolean)
      ).length;
      return daysWithActivity >= 100;
    }
  }
];

export const LEVELS = [
  { name: 'Новичок', minXP: 0, maxXP: 499, emoji: '🌱' },
  { name: 'Практик', minXP: 500, maxXP: 1999, emoji: '⚡' },
  { name: 'Мастер', minXP: 2000, maxXP: 4999, emoji: '🔥' },
  { name: 'Легенда', minXP: 5000, maxXP: Infinity, emoji: '👑' }
];

export const getLevelInfo = (xp) => {
  const level = LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP) || LEVELS[LEVELS.length - 1];
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];

  if (!nextLevel) {
    return { level, xpInLevel: xp - level.minXP, xpForNext: null, progress: 100 };
  }

  const xpInLevel = xp - level.minXP;
  const xpForNext = nextLevel.minXP - level.minXP;
  const progress = Math.min(100, Math.round((xpInLevel / xpForNext) * 100));

  return { level, xpInLevel, xpForNext, progress };
};

export const checkAndUnlockAchievements = (unlockedIds) => {
  const logs = logsStorage.get();
  const habits = habitsStorage.get();
  const newlyUnlocked = [];

  BADGE_DEFINITIONS.forEach(badge => {
    if (!unlockedIds.includes(badge.id) && badge.check(logs, habits)) {
      newlyUnlocked.push(badge.id);
    }
  });

  return newlyUnlocked;
};
