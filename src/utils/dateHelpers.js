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

// Calculate best ever streak (consecutive perfect days)
export const getBestStreak = () => {
  const logs = logsStorage.get();
  const habits = habitsStorage.get().filter(h => h.isActive);
  const activeCount = habits.length;
  if (activeCount === 0) return 0;

  const sortedDates = Object.keys(logs).sort();
  let bestStreak = 0;
  let currentStreak = 0;
  let prevDate = null;

  sortedDates.forEach(dateStr => {
    const log = logs[dateStr];
    const completed = Object.values(log.habits || {}).filter(Boolean).length;
    const isPerfect = completed >= activeCount;

    if (isPerfect) {
      if (prevDate) {
        const diff = (new Date(dateStr) - new Date(prevDate)) / (1000 * 60 * 60 * 24);
        currentStreak = diff === 1 ? currentStreak + 1 : 1;
      } else {
        currentStreak = 1;
      }
      bestStreak = Math.max(bestStreak, currentStreak);
      prevDate = dateStr;
    } else {
      currentStreak = 0;
      prevDate = null;
    }
  });

  return bestStreak;
};

// Calculate total XP from logs
export const calculateXP = () => {
  const logs = logsStorage.get();
  const habits = habitsStorage.get().filter(h => h.isActive);
  const activeCount = habits.length;

  let totalXP = 0;
  const sortedDates = Object.keys(logs).sort();
  let streakRunning = false;

  sortedDates.forEach((dateStr, idx) => {
    const log = logs[dateStr];
    const completed = Object.values(log.habits || {}).filter(Boolean).length;

    totalXP += completed * 10;

    const isPerfect = activeCount > 0 && completed >= activeCount;
    if (isPerfect) {
      totalXP += 50;
      totalXP += 5;
      if (idx > 0) {
        const prevDate = sortedDates[idx - 1];
        const diff = (new Date(dateStr) - new Date(prevDate)) / (1000 * 60 * 60 * 24);
        streakRunning = diff === 1;
      }
    } else {
      streakRunning = false;
    }
  });

  return totalXP;
};

// Get weekly completion data for line chart (last N weeks)
export const getWeeklyCompletionData = (weeksCount = 8) => {
  const logs = logsStorage.get();
  const habits = habitsStorage.get().filter(h => h.isActive);
  const activeCount = habits.length;
  const today = new Date();
  const result = [];

  for (let w = weeksCount - 1; w >= 0; w--) {
    const weekDates = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - w * 7 - d);
      weekDates.push(format(date, 'yyyy-MM-dd'));
    }

    const percentages = weekDates
      .map(dateStr => {
        const log = logs[dateStr];
        if (!log || activeCount === 0) return null;
        const completed = Object.values(log.habits || {}).filter(Boolean).length;
        return Math.round((completed / activeCount) * 100);
      })
      .filter(p => p !== null);

    const avg = percentages.length > 0
      ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
      : 0;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - w * 7 - 6);
    const label = format(startDate, 'd MMM', { locale: ru });

    result.push({ week: label, percentage: avg });
  }

  return result;
};

// Get most productive day of week for bar chart
export const getMostProductiveDayData = () => {
  const logs = logsStorage.get();
  const habits = habitsStorage.get().filter(h => h.isActive);
  const activeCount = habits.length;

  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const dayData = Array(7).fill(null).map(() => ({ total: 0, count: 0 }));

  Object.entries(logs).forEach(([dateStr, log]) => {
    const dayOfWeek = new Date(dateStr).getDay();
    const completed = Object.values(log.habits || {}).filter(Boolean).length;
    const percentage = activeCount > 0 ? Math.round((completed / activeCount) * 100) : 0;
    dayData[dayOfWeek].total += percentage;
    dayData[dayOfWeek].count++;
  });

  // Return Mon–Sun order
  return [1, 2, 3, 4, 5, 6, 0].map(dayIdx => ({
    day: dayNames[dayIdx],
    percentage: dayData[dayIdx].count > 0
      ? Math.round(dayData[dayIdx].total / dayData[dayIdx].count)
      : 0
  }));
};

// Count total days with any activity
export const getTotalActiveDays = () => {
  const logs = logsStorage.get();
  return Object.values(logs).filter(log =>
    Object.values(log.habits || {}).some(Boolean)
  ).length;
};

// Get last 7 days average completion %
export const getWeeklyAverage = () => {
  const logs = logsStorage.get();
  const habits = habitsStorage.get().filter(h => h.isActive);
  const activeCount = habits.length;
  if (activeCount === 0) return 0;

  let total = 0;
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = logs[dateStr];
    const completed = log ? Object.values(log.habits || {}).filter(Boolean).length : 0;
    total += Math.round((completed / activeCount) * 100);
  }
  return Math.round(total / 7);
};

// Get best habit (highest completion % in last 30 days)
export const getBestHabit = () => {
  const habits = habitsStorage.get().filter(h => h.isActive);
  if (habits.length === 0) return null;

  let best = null;
  let bestPct = -1;

  habits.forEach(habit => {
    const logs = logsStorage.get();
    let completed = 0;
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      if (logs[dateStr]?.habits?.[habit.id]) completed++;
    }
    const pct = Math.round((completed / 30) * 100);
    if (pct > bestPct) {
      bestPct = pct;
      best = { habit, percentage: pct };
    }
  });

  return best;
};
