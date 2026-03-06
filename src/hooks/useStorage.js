import { useState, useCallback } from 'react';
import { habitsStorage, userStorage, logsStorage } from '../utils/storage';

export const useHabits = () => {
  const [habits, setHabits] = useState(() => habitsStorage.get());

  const addHabit = useCallback((habit) => {
    const updated = habitsStorage.add(habit);
    setHabits(updated);
    return habit;
  }, []);

  const updateHabit = useCallback((id, updates) => {
    const updated = habitsStorage.update(id, updates);
    setHabits(updated);
  }, []);

  const deleteHabit = useCallback((id) => {
    const updated = habitsStorage.remove(id);
    setHabits(updated);
  }, []);

  const toggleHabitActive = useCallback((id) => {
    const habit = habits.find(h => h.id === id);
    updateHabit(id, { isActive: !habit.isActive });
  }, [habits, updateHabit]);

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitActive
  };
};

export const useUser = () => {
  const [user, setUser] = useState(() => userStorage.get());

  const updateUser = useCallback((updates) => {
    userStorage.update(updates);
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    user,
    updateUser
  };
};

export const useLogs = () => {
  const [logs, setLogs] = useState(() => logsStorage.get());

  const toggleHabit = useCallback((date, habitId) => {
    const updated = logsStorage.toggleHabit(date, habitId);
    setLogs(logsStorage.get());
    return updated;
  }, []);

  const updateLog = useCallback((date, updates) => {
    logsStorage.updateDate(date, updates);
    setLogs(logsStorage.get());
  }, []);

  const getLog = useCallback((date) => {
    return logsStorage.getByDate(date);
  }, []);

  return {
    logs,
    toggleHabit,
    updateLog,
    getLog
  };
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};
