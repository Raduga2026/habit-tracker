import React, { useState } from 'react';
import { getMonthHeatmapData, getStreak, getHabitStats } from '../utils/dateHelpers';
import { useHabits } from '../hooks/useStorage';
import { logsStorage } from '../utils/storage';

export default function ProgressScreen() {
  const { habits } = useHabits();
  const [selectedStatsPeriod, setSelectedStatsPeriod] = useState(7);

  const heatmapData = getMonthHeatmapData();
  const streak = getStreak();
  const activeHabits = habits.filter(h => h.isActive);

  // Group heatmap by weeks
  const weeksData = [];
  let currentWeek = [];
  heatmapData.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeksData.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeksData.push(currentWeek);
  }

  const getHeatmapColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-200';
    if (percentage < 25) return 'bg-rose-200';
    if (percentage < 50) return 'bg-rose-500';
    if (percentage < 75) return 'bg-mint-400';
    return 'bg-mint-600';
  };

  const [selectedDay, setSelectedDay] = useState(null);

  const openDayDetails = (day) => {
    setSelectedDay(day);
  };

  const closeDayDetails = () => {
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-peach-50 to-mint-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-mint-400 to-cyan-400 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold">Твой Прогресс</h1>
          <p className="text-sm opacity-90 mt-2">
            Отслеживай свой путь к целям
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-rose-400 to-peach-400 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">🔥</div>
            <div className="text-gray-100 text-sm mb-1">Текущая серия</div>
            <div className="text-4xl font-bold">{streak}</div>
            <div className="text-sm mt-2 opacity-90">дней подряд!</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Активность по дням</h2>
          <div className="space-y-2">
            {weeksData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex gap-1 justify-between">
                {week.map(day => (
                  <div
                    key={day.date}
                    onClick={() => openDayDetails(day)}
                    className={`w-8 h-8 rounded-md ${getHeatmapColor(
                      day.percentage
                    )} cursor-pointer hover:ring-2 hover:ring-rose-400 transition-all`}
                    title={`${day.date}: ${day.completed}/${day.total} привычек`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Зеленый = 100%, Желтый/Розовый = менее 100%
          </div>
        </div>

        {/* Day detail modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="font-semibold text-gray-800 mb-2">{selectedDay.date}</h3>
              <p className="text-sm mb-1">
                {selectedDay.completed}/{selectedDay.total} привычек
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {selectedDay.percentage}% выполнено
              </p>
              {/* show mood if set */}
              {logsStorage.getByDate(selectedDay.date).mood && (
                <p className="text-sm mb-2">
                  Настроение: {logsStorage.getByDate(selectedDay.date).mood}
                </p>
              )}
              {/* show reflections if any */}
              {logsStorage.getByDate(selectedDay.date).morningReflection && (
                <div className="text-xs text-gray-700 mb-2">
                  <strong>Утро:</strong> {JSON.stringify(logsStorage.getByDate(selectedDay.date).morningReflection)}
                </div>
              )}
              {logsStorage.getByDate(selectedDay.date).eveningReflection && (
                <div className="text-xs text-gray-700 mb-2">
                  <strong>Вечер:</strong> {JSON.stringify(logsStorage.getByDate(selectedDay.date).eveningReflection)}
                </div>
              )}
              <button
                onClick={closeDayDetails}
                className="btn-secondary mt-4 w-full py-2"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {/* Habits Stats */}
        <div className="bg-white rounded-2xl shadow-sm overflowَhidden">
          <div className="bg-gradient-to-r from-mint-50 to-cyan-50 px-6 py-3 border-b border-mint-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Статистика привычек</h2>
            <div className="flex gap-2">
              {[7, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedStatsPeriod(days)}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    selectedStatsPeriod === days
                      ? 'bg-mint-500 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {days}д
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-3">
            {activeHabits.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Нет активных привычек
              </p>
            ) : (
              activeHabits.map(habit => {
                const stats = getHabitStats(habit.id, selectedStatsPeriod);
                return (
                  <div key={habit.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">
                        {habit.emoji} {habit.title}
                      </span>
                      <span className="text-sm font-bold text-rose-600">
                        {stats.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-mint-400 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${stats.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
