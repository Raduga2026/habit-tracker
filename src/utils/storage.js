// Default habits data
export const DEFAULT_HABITS = [
  // Morning block
  {
    id: 'h1',
    title: 'Правильно проснуться',
    emoji: '☀️',
    timeOfDay: 'morning',
    isDefault: true,
    isActive: true,
    description: 'Пробуждение с благодарностью и намерением'
  },
  {
    id: 'h2',
    title: 'Выпить стакан воды',
    emoji: '💧',
    timeOfDay: 'morning',
    isDefault: true,
    isActive: true,
    description: 'Увлажнение организма с первых минут дня'
  },
  {
    id: 'h3',
    title: 'Утренняя гимнастика-разминка',
    emoji: '🤸',
    timeOfDay: 'morning',
    isDefault: true,
    isActive: true,
    description: 'Зарядка и разминка для бодрого начала дня'
  },
  {
    id: 'h4',
    title: 'Утренняя рефлексия',
    emoji: '💬',
    timeOfDay: 'morning',
    isDefault: true,
    isActive: true,
    description: 'Что полезного я сделаю сегодня для себя? Что полезного для других?'
  },
  // Daytime block
  {
    id: 'h5',
    title: 'Прогулка ≥ 1 часа',
    emoji: '🚶',
    timeOfDay: 'daytime',
    isDefault: true,
    isActive: true,
    description: 'Движение, свежий воздух и здоровье'
  },
  {
    id: 'h6',
    title: 'Выпить 1,5–2 л воды',
    emoji: '💧',
    timeOfDay: 'daytime',
    isDefault: true,
    isActive: true,
    description: 'Постоянное увлажнение организма '
  },
  // Evening block
  {
    id: 'h7',
    title: 'Вечерняя рефлексия',
    emoji: '📓',
    timeOfDay: 'evening',
    isDefault: true,
    isActive: true,
    description: 'За что сегодня благодарна себе? Что сделала хорошо?'
  },
  {
    id: 'h8',
    title: 'Отметить настроение',
    emoji: '😊',
    timeOfDay: 'evening',
    isDefault: true,
    isActive: true,
    description: 'Выбери своё настроение из списка'
  },

  {
    id: 'h9',
    title: 'Полноценный сон (8 часов)',
    emoji: '🌙',
    timeOfDay: 'evening',
    isDefault: true,
    isActive: true,
    description: 'Восстановление для свежего завтрашнего дня'
  }
];

const STORAGE_KEYS = {
  USER: 'habit_tracker_user_v1',
  HABITS: 'habit_tracker_habits_v1',
  LOGS: 'habit_tracker_logs_v1',
  ONBOARDED: 'habit_tracker_onboarded_v1',
  ACHIEVEMENTS: 'habit_tracker_achievements_v1'
};

const DEFAULT_ACHIEVEMENTS = {
  unlockedIds: [],
  lastStreakSeen: 0
};

// Initialize default user
export const DEFAULT_USER = {
  name: '',
  gender: 'female',
  startDate: new Date().toISOString().split('T')[0],
  affirmation: 'Я люблю и берегу себя',
  theme: 'light',
  notifications: {
    morning: '07:00',
    daytime: '12:00',
    evening: '21:00'
  }
};

// User storage functions
export const userStorage = {
  get: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : DEFAULT_USER;
  },
  set: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  update: (updates) => {
    const user = userStorage.get();
    userStorage.set({ ...user, ...updates });
  }
};

// Habits storage functions
export const habitsStorage = {
  get: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    return stored ? JSON.parse(stored) : DEFAULT_HABITS;
  },
  set: (habits) => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },
  add: (habit) => {
    const habits = habitsStorage.get();
    habits.push(habit);
    habitsStorage.set(habits);
    return habits;
  },
  update: (id, updates) => {
    const habits = habitsStorage.get();
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      habitsStorage.set(habits);
    }
    return habits;
  },
  remove: (id) => {
    const habits = habitsStorage.get().filter(h => h.id !== id);
    habitsStorage.set(habits);
    return habits;
  }
};

// Logs storage functions
export const logsStorage = {
  get: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
    return stored ? JSON.parse(stored) : {};
  },
  getByDate: (date) => {
    const logs = logsStorage.get();
    return logs[date] || { habits: {}, mood: null, morningReflection: null, eveningReflection: null };
  },
  set: (logs) => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },
  updateDate: (date, updates) => {
    const logs = logsStorage.get();
    logs[date] = { ...logsStorage.getByDate(date), ...updates };
    logsStorage.set(logs);
    return logs[date];
  },
  toggleHabit: (date, habitId) => {
    const log = logsStorage.getByDate(date);
    log.habits = log.habits || {};
    log.habits[habitId] = !log.habits[habitId];
    logsStorage.updateDate(date, log);
    return log;
  }
};

// Achievements storage
export const achievementsStorage = {
  get: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return stored ? JSON.parse(stored) : { ...DEFAULT_ACHIEVEMENTS };
  },
  set: (data) => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data));
  },
  unlockMany: (badgeIds) => {
    const data = achievementsStorage.get();
    badgeIds.forEach(id => {
      if (!data.unlockedIds.includes(id)) data.unlockedIds.push(id);
    });
    achievementsStorage.set(data);
  },
  updateLastStreak: (streak) => {
    const data = achievementsStorage.get();
    data.lastStreakSeen = streak;
    achievementsStorage.set(data);
  }
};

// Onboarding flag
export const onboardingStorage = {
  isCompleted: () => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
  },
  complete: () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  }
};

// Export data as JSON
export const exportData = () => {
  const data = {
    user: userStorage.get(),
    habits: habitsStorage.get(),
    logs: logsStorage.get(),
    achievements: achievementsStorage.get(),
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

// Import data from JSON
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.user) userStorage.set(data.user);
    if (data.habits) habitsStorage.set(data.habits);
    if (data.logs) logsStorage.set(data.logs);
    if (data.achievements) achievementsStorage.set(data.achievements);
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
};
