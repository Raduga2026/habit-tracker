import React from 'react';
import { useUser } from '../hooks/useStorage';
import { useTheme } from '../context/ThemeContext';
import { exportData } from '../utils/storage';
import { formatDate } from '../utils/dateHelpers';

export default function ProfileScreen() {
  const { user, updateUser } = useUser();
  const { theme, gender, changeGender } = useTheme();

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
    if (window.confirm('Ты уверен(а)? Это удалит все данные!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen ${theme.appBg} pb-24`}>
      {/* Header */}
      <div className={`${theme.headerBg} text-white p-6 sm:p-8 rounded-b-3xl shadow-lg`}>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Профиль</h1>
          <p className="text-sm opacity-80 mt-2">
            Личная информация и настройки
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <div className={`${theme.cardBg} rounded-3xl p-6 shadow-sm space-y-5`}>
          <div>
            <label className={`block text-sm font-semibold ${theme.cardText} mb-2`}>
              Как тебя зовут?
            </label>
            <input
              type="text"
              value={user.name}
              onChange={e => updateUser({ name: e.target.value })}
              placeholder="Введи своё имя"
              className={`w-full rounded-2xl px-4 py-3 ${theme.inputClass} focus:outline-none focus:ring-2`}
            />
          </div>

          <div className={`h-px ${theme.dividerClass}`}></div>

          <div>
            <label className={`block text-sm font-semibold ${theme.cardText} mb-2`}>
              Дата начала пути
            </label>
            <input
              type="date"
              value={user.startDate}
              onChange={e => updateUser({ startDate: e.target.value })}
              className={`w-full rounded-2xl px-4 py-3 ${theme.inputClass} focus:outline-none focus:ring-2`}
            />
            <p className={`text-xs ${theme.cardText} opacity-60 mt-2`}>
              {formatDate(user.startDate)}
            </p>
          </div>
        </div>

        {/* Theme Selection Card */}
        <div className={`${theme.cardBg} rounded-3xl p-6 shadow-sm space-y-4`}>
          <h2 className={`font-semibold ${theme.cardText} text-lg`}>🎨 Оформление</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => changeGender('female')}
              className={`rounded-2xl p-4 border-4 transition-all text-center ${
                gender === 'female'
                  ? 'border-rose-400 scale-105 shadow-md'
                  : 'border-transparent opacity-70'
              } bg-gradient-to-br from-rose-200 to-orange-200`}
            >
              <div className="text-3xl mb-1">🌸</div>
              <div className="font-semibold text-rose-800 text-sm">Розовая</div>
            </button>
            <button
              onClick={() => changeGender('male')}
              className={`rounded-2xl p-4 border-4 transition-all text-center ${
                gender === 'male'
                  ? 'border-cyan-400 scale-105 shadow-md'
                  : 'border-transparent opacity-70'
              } bg-gradient-to-br from-blue-700 to-indigo-800`}
            >
              <div className="text-3xl mb-1">🌊</div>
              <div className="font-semibold text-white text-sm">Синяя</div>
            </button>
          </div>
        </div>

        {/* Affirmation Card */}
        <div className={`${theme.cardBg} rounded-3xl p-6 shadow-sm space-y-4`}>
          <h2 className={`font-semibold ${theme.cardText} text-lg`}>✨ Твоя аффирмация</h2>
          <textarea
            value={user.affirmation}
            onChange={e => updateUser({ affirmation: e.target.value })}
            placeholder="Напиши аффирмацию, которая вдохновляет тебя..."
            rows={3}
            className={`w-full rounded-2xl px-4 py-3 resize-none ${theme.inputClass} focus:outline-none focus:ring-2`}
          />
          <p className={`text-xs ${theme.cardText} opacity-60`}>
            💖 Начинай день с этого утверждения о себе
          </p>
        </div>

        {/* Notifications Settings */}
        <div className={`${theme.cardBg} rounded-3xl p-6 shadow-sm space-y-5`}>
          <h2 className={`font-semibold ${theme.cardText} text-lg`}>🔔 Напоминания</h2>
          <div className="space-y-4">
            {[
              { key: 'morning', label: '☀️ Утро', default: '07:00' },
              { key: 'daytime', label: '🌤️ День', default: '12:00' },
              { key: 'evening', label: '🌙 Вечер', default: '21:00' }
            ].map(({ key, label, default: defaultTime }) => (
              <div key={key} className={`flex items-center justify-between p-3 ${theme.progressBgAccent} rounded-2xl`}>
                <label className={`text-sm font-medium ${theme.cardText}`}>{label}</label>
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
                  className={`px-3 py-1 rounded-lg ${theme.timeInputBorder} text-sm ${theme.inputClass}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className={`${theme.btnPrimary} w-full py-3 font-semibold flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-95`}
          >
            💾 Экспортировать данные
          </button>

          <button
            onClick={handleClearData}
            className="bg-transparent border-2 border-red-400 text-red-500 w-full py-3 font-semibold rounded-2xl hover:bg-red-500 hover:text-white transition-all"
          >
            🗑️ Стереть все данные
          </button>
        </div>

        {/* About */}
        <div className={`${theme.aboutCardBg} rounded-3xl p-6 text-center text-sm`}>
          <p className={`text-lg font-bold ${theme.cardText}`}>💖 Мой Путь</p>
          <p className={`mt-2 text-xs ${theme.cardText} opacity-70`}>
            Приложение для отслеживания привычек с любовью к себе
          </p>
          <p className={`mt-2 text-xs ${theme.cardText} opacity-50`}>v0.1.0</p>
        </div>
      </div>
    </div>
  );
}
