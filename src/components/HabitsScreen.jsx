import React, { useState } from 'react';
import { useHabits } from '../hooks/useStorage';
import { generateId } from '../utils/dateHelpers';

export default function HabitsScreen() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitActive } = useHabits();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('⭐');
  const [newHabitTime, setNewHabitTime] = useState('morning');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

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

    const newHabit = {
      id: generateId(),
      title: newHabitTitle.trim(),
      emoji: newHabitEmoji,
      timeOfDay: newHabitTime,
      isDefault: false,
      isActive: true,
      description: ''
    };

    addHabit(newHabit);
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
    if (editTitle.trim()) {
      updateHabit(habit.id, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const HabitGroupSection = ({ timeOfDay, habitsList }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-rose-50 to-peach-50 px-6 py-3 border-b border-rose-100">
        <h3 className="font-semibold text-gray-800">
          {timeOfDayLabels[timeOfDay]}
        </h3>
      </div>
      <div className="p-4 space-y-2">
        {habitsList.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-3">
            Нет привычек
          </p>
        ) : (
          habitsList.map(habit => (
            <div
              key={habit.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <button
                onClick={() => toggleHabitActive(habit.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-md transition ${
                  habit.isActive
                    ? 'bg-mint-500'
                    : 'bg-gray-300'
                }`}
              >
                {habit.isActive && (
                  <span className="text-white text-sm flex items-center justify-center h-full">
                    ✓
                  </span>
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
                  className="flex-1 px-2 border border-rose-300 rounded"
                />
              ) : (
                <span
                  onClick={() => handleStartEdit(habit)}
                  className={`flex-1 cursor-pointer ${
                    !habit.isActive ? 'opacity-50 line-through' : ''
                  }`}
                >
                  {habit.title}
                </span>
              )}

              {!habit.isDefault && (
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Удалить"
                >
                  ✕
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-peach-50 to-mint-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-peach-400 to-rose-400 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold">Мои привычки</h1>
          <p className="text-sm opacity-90 mt-2">
            Управляй своими привычками
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Add New Habit */}
        {!isAddingNew ? (
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn-primary w-full py-3 font-semibold flex items-center justify-center gap-2"
          >
            ➕ Добавить привычку
          </button>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <input
              type="text"
              placeholder="Название привычки"
              value={newHabitTitle}
              onChange={e => setNewHabitTitle(e.target.value)}
              className="w-full"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={newHabitEmoji}
                onChange={e => setNewHabitEmoji(e.target.value.slice(0, 2))}
                placeholder="Emoji"
                className="w-full text-center text-2xl"
                maxLength="2"
              />
              <select
                value={newHabitTime}
                onChange={e => setNewHabitTime(e.target.value)}
                className="w-full"
              >
                <option value="morning">Утро</option>
                <option value="daytime">День</option>
                <option value="evening">Вечер</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddHabit}
                className="btn-primary flex-1 py-2 rounded-lg"
              >
                Создать
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewHabitTitle('');
                }}
                className="btn-secondary flex-1 py-2 rounded-lg"
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
