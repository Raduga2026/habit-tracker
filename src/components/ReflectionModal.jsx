import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ReflectionModal({ questions, onSave, onCancel }) {
  const { theme } = useTheme();
  const [answers, setAnswers] = useState(questions.map(() => ''));

  const handleSave = () => {
    onSave(answers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className={`w-full max-w-md ${theme.habitGroupBg} rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto`}>
        {questions.map((q, i) => (
          <div key={i}>
            <label className={`text-sm font-medium ${theme.cardText} block mb-1`}>{q}</label>
            <textarea
              className={`w-full rounded-2xl p-3 text-sm resize-none ${theme.inputClass} ${theme.cardText} focus:outline-none focus:ring-2`}
              rows={2}
              value={answers[i]}
              onChange={e => {
                const next = [...answers];
                next[i] = e.target.value;
                setAnswers(next);
              }}
            />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium ${theme.navBtnInactive}`}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold text-white ${theme.headerBg}`}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
