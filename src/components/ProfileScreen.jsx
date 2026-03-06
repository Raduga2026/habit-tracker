import React from 'react';
import { useUser } from '../hooks/useStorage';
import { exportData } from '../utils/storage';
import { formatDate } from '../utils/dateHelpers';

export default function ProfileScreen() {
  const { user, updateUser } = useUser();

  const handleExport = () => {
    const data = exportData();
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(data)
    );
    element.setAttribute(
      'download',
      `habit-tracker-${new Date().toISOString().split('T')[0]}.json`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClearData = () => {
    if (window.confirm('Ты уверена? Это удалит все данные!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-peach-50 to-mint-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-400 to-mint-400 text-white p-6 sm:p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Профиль</h1>
          <p className="text-sm opacity-90 mt-2">
            Твоя личная информация и настройки
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Как тебя зовут?
            </label>
            <input
              type="text"
              value={user.name}
              onChange={e => updateUser({ name: e.target.value })}
              placeholder="Введи своё имя"
              className="w-full"
            />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Дата начала пути
            </label>
            <input
              type="date"
              value={user.startDate}
              onChange={e => updateUser({ startDate: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              {formatDate(user.startDate)}
            </p>
          </div>
        </div>

        {/* Affirmation Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg">✨ Твоя аффирмация</h2>
          <textarea
            value={user.affirmation}
            onChange={e => updateUser({ affirmation: e.target.value })}
            placeholder="Напиши аффирмацию, которая вдохновляет тебя..."
            rows={3}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            💖 Начинай день с этого утверждения о себе и своей любви к себе
          </p>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5">
          <h2 className="font-semibold text-gray-800 text-lg">🔔 Напоминания</h2>
          <div className="space-y-4">
            {[
              { key: 'morning', label: '☀️ Утро', default: '07:00' },
              { key: 'daytime', label: '🌤️ День', default: '12:00' },
              { key: 'evening', label: '🌙 Вечер', default: '21:00' }
            ].map(({ key, label, default: defaultTime }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="time"
                  value={user.notifications?.[key] || defaultTime}
                  onChange={e =>
                    updateUser({
                      notifications: {
                        ...user.notifications,
                        [key]: e.target.value
                      }
                    })
                  }
                  className="px-3 py-1 rounded-lg border-2 border-rose-200 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="btn-primary w-full py-3 font-semibold flex items-center justify-center gap-2 rounded-2xl"
          >
            💾 Экспортировать данные
          </button>

          <button
            onClick={handleClearData}
            className="bg-white border-2 border-red-200 text-red-600 w-full py-3 font-semibold rounded-2xl hover:bg-red-50 transition-colors"
          >
            🗑️ Стереть все данные
          </button>
        </div>

        {/* About */}
        <div className="bg-gradient-to-br from-rose-50 to-peach-50 rounded-3xl p-6 text-center text-sm text-gray-600 border-2 border-rose-100">
          <p className="text-lg font-bold">💖 Мой Путь</p>
          <p className="mt-2 text-xs">
            Приложение для отслеживания привычек с любовью к себе
          </p>
          <p className="mt-2 text-xs text-gray-500">v0.1.0</p>
        </div>
      </div>
    </div>
  );
}
