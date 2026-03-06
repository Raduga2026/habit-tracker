import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { logsStorage, habitsStorage } from './storage';

// Format date in Russian locale
export const formatDate = (date) => {
  return format(new Date(date), 'd MMMM yyyy', { locale: ru });
};

export const formatDayName = (date) => {
  return format(new Date(date), 'EEEE', { locale: ru });
};

export const formatShortDay = (date) => {
  return format(new Date(date), 'EEE', { locale: ru });
};

export const getTodayString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Get calendar month data for heatmap
export const getMonthHeatmapData = (date = new Date()) => {
  const month = startOfMonth(date);
  const endMonth = endOfMonth(month);
  const daysInMonth = eachDayOfInterval({ start: month, end: endMonth });
  const logs = logsStorage.get();

  return daysInMonth.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const log = logs[dateStr];
    const habits = habitsStorage.get().filter(h => h.isActive);
    
    if (!log) {
      return { date: dateStr, completed: 0, total: habits.length, percentage: 0 };
    }

    const completedCount = Object.values(log.habits || {}).filter(Boolean).length;
    const percentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

    return {
      date: dateStr,
      completed: completedCount,
      total: habits.length,
      percentage
    };
  });
};

// Calculate current streak
export const getStreak = (endDate = getTodayString()) => {
  const logs = logsStorage.get();
  const habits = habitsStorage.get().filter(h => h.isActive);
  let streak = 0;
  let currentDate = new Date(endDate);

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const log = logs[dateStr];

    if (!log || !log.habits) {
      break;
    }

    const completedCount = Object.values(log.habits).filter(Boolean).length;
    const isCompletedDay = completedCount === habits.length;

    if (!isCompletedDay) {
      break;
    }

    streak++;
    currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  }

  return streak;
};

// Get weekly stats for a habit
export const getHabitStats = (habitId, days = 7) => {
  const logs = logsStorage.get();
  const endDate = new Date();
  const dates = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    dates.unshift(format(date, 'yyyy-MM-dd'));
  }

  const stats = dates.map(dateStr => ({
    date: dateStr,
    completed: logs[dateStr]?.habits?.[habitId] || false
  }));

  const completedDays = stats.filter(s => s.completed).length;
  const percentage = Math.round((completedDays / days) * 100);

  return {
    stats,
    completedDays,
    totalDays: days,
    percentage
  };
};

// Get daily progress
export const getDailyProgress = (date = getTodayString()) => {
  const log = logsStorage.getByDate(date);
  const activeHabits = habitsStorage.get().filter(h => h.isActive);

  const completedCount = Object.values(log.habits || {})
    .filter(Boolean)
    .length;

  const percentage = activeHabits.length > 0 
    ? Math.round((completedCount / activeHabits.length) * 100) 
    : 0;

  return {
    completed: completedCount,
    total: activeHabits.length,
    percentage
  };
};

// Get habits grouped by time of day
export const getHabitsByTimeOfDay = () => {
  const habits = habitsStorage.get().filter(h => h.isActive);

  return {
    morning: habits.filter(h => h.timeOfDay === 'morning'),
    daytime: habits.filter(h => h.timeOfDay === 'daytime'),
    evening: habits.filter(h => h.timeOfDay === 'evening')
  };
};

// Generate unique ID
export const generateId = () => {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};
