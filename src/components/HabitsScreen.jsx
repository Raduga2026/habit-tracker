import React, { useState } from 'react';
import { useHabits } from '../hooks/useStorage';
import { useTheme } from '../context/ThemeContext';
import { generateId } from '../utils/dateHelpers';

const DEFAULT_REMINDER = { enabled: false, time: '09:00', days: [1, 2, 3, 4, 5, 6, 0] };
const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DAY_INDICES = [1, 2, 3, 4, 5, 6, 0]; // Mon–Sun mapped to JS getDay()

export default function HabitsScreen() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitActive } = useHabits();
  const { theme } = useTheme();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('⭐');
  const [newHabitTime, setNewHabitTime] = useState('morning');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [reminderOpenId, setReminderOpenId] = useState(null);

  const timeOfDayLabels = {
    morning: '☀️ Утро',
    daytime: '🌤️ День',
    evening: '🌙 Вечер'
  };

  const habitsByTime = {
    morning: habits.filter(h => h.timeOfDay === 'morning'),
    daytime: habits.filter(h => h.timeOfDay === 'daytime'),
    evening: habits.filter(h => h.timeOfDay === 'evening')
  };

  const handleAddHabit = () => {
    if (!newHabitTitle.trim()) return;
    addHabit({
      id: generateId(),
      title: newHabitTitle.trim(),
      emoji: newHabitEmoji,
      timeOfDay: newHabitTime,
      isDefault: false,
      isActive: true,
      description: '',
      reminder: { ...DEFAULT_REMINDER }
    });
    setNewHabitTitle('');
    setNewHabitEmoji('⭐');
    setNewHabitTime('morning');
    setIsAddingNew(false);
  };

  const handleStartEdit = (habit) => {
    setEditingId(habit.id);
    setEditTitle(habit.title);
  };

  const handleSaveEdit = (habit) => {
    if (editTitle.trim()) updateHabit(habit.id, { title: editTitle.trim() });
    setEditingId(null);
  };

  const getReminder = (habit) => habit.reminder || { ...DEFAULT_REMINDER };

  const updateReminder = (habitId, field, value) => {
    const habit = habits.find(h => h.id === habitId);
    const reminder = getReminder(habit);
    updateHabit(habitId, { reminder: { ...reminder, [field]: value } });
  };

  const toggleReminderDay = (habitId, dayIdx) => {
    const habit = habits.find(h => h.id === habitId);
    const reminder = getReminder(habit);
    const days = reminder.days.includes(dayIdx)
      ? reminder.days.filter(d => d !== dayIdx)
      : [...reminder.days, dayIdx];
    updateHabit(habitId, { reminder: { ...reminder, days } });
  };

  const HabitGroupSection = ({ timeOfDay, habitsList }) => (
    <div className={`${theme.cardBg} rounded-2xl shadow-sm overflow-hidden`}>
      <div className={`${theme.sectionHeaderBg} px-6 py-3`}>
        <h3 className={`font-semibold ${theme.sectionHeaderText}`}>
          {timeOfDayLabels[timeOfDay]}
        </h3>
      </div>
      <div className="p-4 space-y-2">
        {habitsList.length === 0 ? (
          <p className={`text-sm ${theme.cardText} opacity-50 text-center py-3`}>
            Нет привычек
          </p>
        ) : (
          habitsList.map(habit => {
            const reminder = getReminder(habit);
            const isReminderOpen = reminderOpenId === habit.id;

            return (
              <div key={habit.id}>
                {/* Habit row */}
                <div className={`flex items-center gap-3 p-3 ${theme.progressBgAccent} rounded-lg hover:opacity-80 transition`}>
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleHabitActive(habit.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-md transition ${
                      habit.isActive ? theme.statsActiveBtnBg : 'bg-gray-400'
                    }`}
                  >
                    {habit.isActive && (
                      <span className="text-white text-sm flex items-center justify-center h-full">✓</span>
                    )}
                  </button>

                  <span className="text-xl">{habit.emoji}</span>

                  {editingId === habit.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(habit)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveEdit(habit);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className={`flex-1 px-2 py-1 rounded-lg border ${theme.inputClass}`}
                    />
                  ) : (
                    <span
                      onClick={() => handleStartEdit(habit)}
                      className={`flex-1 cursor-pointer ${theme.cardText} ${
                        !habit.isActive ? 'opacity-50 line-through' : ''
                      }`}
                    >
                      {habit.title}
                    </span>
                  )}

                  {/* Reminder bell */}
                  <button
                    onClick={() => setReminderOpenId(isReminderOpen ? null : habit.id)}
                    className={`text-lg transition-opacity ${reminder.enabled ? 'opacity-100' : 'opacity-40'}`}
                    title="Напоминание"
                  >
                    🔔
                  </button>

                  {!habit.isDefault && (
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-400 hover:text-red-600 text-sm transition-colors"
                      title="Удалить"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Reminder panel */}
                {isReminderOpen && (
                  <div className={`mt-1 mb-2 mx-1 ${theme.cardBg} border ${theme.accentBorderColor} rounded-xl p-4 space-y-3`}>
                    {/* Enable toggle */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${theme.cardText}`}>Напоминание</span>
                      <button
                        onClick={() => updateReminder(habit.id, 'enabled', !reminder.enabled)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          reminder.enabled ? theme.statsActiveBtnBg : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          reminder.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* Time picker */}
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${theme.cardText} opacity-70`}>Время</span>
                      <input
                        type="time"
                        value={reminder.time}
                        onChange={e => updateReminder(habit.id, 'time', e.target.value)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm ${theme.inputClass} focus:outline-none`}
                      />
                    </div>

                    {/* Day checkboxes */}
                    <div>
                      <span className={`text-sm ${theme.cardText} opacity-70 block mb-2`}>Дни</span>
                      <div className="flex gap-1 flex-wrap">
                        {DAY_LABELS.map((label, i) => {
                          const dayIdx = DAY_INDICES[i];
                          const active = reminder.days.includes(dayIdx);
                          return (
                            <button
                              key={dayIdx}
                              onClick={() => toggleReminderDay(habit.id, dayIdx)}
                              className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                                active ? theme.statsActiveBtnBg : theme.statsInactiveBtnBg
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.appBg} pb-24`}>
      {/* Header */}
      <div className={`${theme.headerBg} text-white p-6 rounded-b-3xl shadow-lg`}>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold">Мои привычки</h1>
          <p className="text-sm opacity-80 mt-2">Управляй своими привычками</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Add New Habit */}
        {!isAddingNew ? (
          <button
            onClick={() => setIsAddingNew(true)}
            className={`${theme.btnPrimary} w-full py-3 font-semibold flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-95`}
          >
            ➕ Добавить привычку
          </button>
        ) : (
          <div className={`${theme.cardBg} rounded-2xl p-4 shadow-sm space-y-3`}>
            <input
              type="text"
              placeholder="Название привычки"
              value={newHabitTitle}
              onChange={e => setNewHabitTitle(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 ${theme.inputClass} focus:outline-none focus:ring-2`}
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={newHabitEmoji}
                onChange={e => setNewHabitEmoji(e.target.value.slice(0, 2))}
                placeholder="Emoji"
                className={`w-full text-center text-2xl rounded-2xl px-4 py-3 ${theme.inputClass} focus:outline-none focus:ring-2`}
                maxLength="2"
              />
              <select
                value={newHabitTime}
                onChange={e => setNewHabitTime(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 ${theme.inputClass} focus:outline-none focus:ring-2`}
              >
                <option value="morning">Утро</option>
                <option value="daytime">День</option>
                <option value="evening">Вечер</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddHabit}
                className={`${theme.btnPrimary} flex-1 py-2 rounded-lg transition-all active:scale-95`}
              >
                Создать
              </button>
              <button
                onClick={() => { setIsAddingNew(false); setNewHabitTitle(''); }}
                className={`${theme.btnSecondary} flex-1 py-2 rounded-lg transition-all active:scale-95`}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Habits by Time */}
        {Object.entries(habitsByTime).map(([timeOfDay, habitsList]) => (
          <HabitGroupSection
            key={timeOfDay}
            timeOfDay={timeOfDay}
            habitsList={habitsList}
          />
        ))}
      </div>
    </div>
  );
}
