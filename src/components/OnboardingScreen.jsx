import React, { useState } from 'react';
import { userStorage, onboardingStorage } from '../utils/storage';

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const steps = [
    {
      title: '✨ Добро пожаловать в "Мой Путь"',
      description: 'Приложение для отслеживания личных привычек',
      content: (
        <div className="space-y-6 text-center slide-up">
          <p className="text-7xl animate-bounce">💖</p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Начни путь к личностному росту с любовью к себе, а не контролем
          </p>
        </div>
      )
    },
    {
      title: '🌸 Философия приложения',
      description: 'На чем мы основываемся',
      content: (
        <div className="space-y-4 slide-up">
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl p-5 border-2 border-rose-200 hover:shadow-lg transition-shadow">
            <p className="font-semibold text-rose-900 text-lg">💕 Самолюбовь</p>
            <p className="text-sm text-rose-800 mt-2">
              Ты начинаешь день, чтобы заботиться о себе
            </p>
          </div>
          <div className="bg-gradient-to-br from-peach-50 to-peach-100 rounded-3xl p-5 border-2 border-peach-200 hover:shadow-lg transition-shadow">
            <p className="font-semibold text-peach-900 text-lg">🌺 Забота</p>
            <p className="text-sm text-peach-800 mt-2">
              Каждая привычка — это акт любви к себе
            </p>
          </div>
          <div className="bg-gradient-to-br from-mint-50 to-cyan-100 rounded-3xl p-5 border-2 border-mint-200 hover:shadow-lg transition-shadow">
            <p className="font-semibold text-mint-900 text-lg">🧘 Осознанность</p>
            <p className="text-sm text-mint-800 mt-2">
              Отслеживай прогресс, но не осуждай себя
            </p>
          </div>
        </div>
      )
    },
    {
      title: '👋 Как тебя зовут?',
      description: 'Давай познакомимся',
      content: (
        <div className="space-y-4 slide-up">
          <input
            type="text"
            placeholder="Напиши свое имя"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full text-center text-lg"
            autoFocus
          />
          <p className="text-sm text-gray-500 text-center">
            Мы будем приветствовать тебя по имени каждый день 💫
          </p>
        </div>
      )
    },
    {
      title: '🚀 Готова начать?',
      description: 'Последний шаг',
      content: (
        <div className="space-y-6 text-center slide-up">
          <p className="text-gray-600 text-lg">
            Тебя ждут привычки, разделенные на три блока:
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200">
              <p className="text-3xl">☀️ Утро</p>
            </div>
            <div className="p-4 bg-peach-50 rounded-2xl border-2 border-peach-200">
              <p className="text-3xl">🌤️ День</p>
            </div>
            <div className="p-4 bg-mint-50 rounded-2xl border-2 border-mint-200">
              <p className="text-3xl">🌙 Вечер</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            💫 Помни: важен прогресс, а не совершенство!
          </p>
        </div>
      )
    }
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Save user and complete onboarding
      userStorage.update({ name: name || 'Путница' });
      onboardingStorage.complete();
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  const isLastStep = step === steps.length - 1;
  const canContinue = step < 2 || (step === 2 && name.trim()) || step === 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-peach-50 to-mint-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2 justify-center">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  idx <= step ? 'bg-gradient-to-r from-rose-400 to-peach-400' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {current.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2">{current.description}</p>
          </div>

          <div className="py-6 min-h-40">
            {current.content}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-6">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="btn-secondary flex-1 py-3 rounded-2xl font-semibold"
              >
                ← Назад
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canContinue}
              className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
                canContinue
                  ? 'btn-primary'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLastStep ? (
                <>
                  ✨ Начать <span className="ml-1">→</span>
                </>
              ) : (
                <>
                  Далее <span className="ml-1">→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip */}
        {step < steps.length - 1 && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                userStorage.update({ name: 'Путница' });
                onboardingStorage.complete();
                onComplete?.();
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Пропустить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
