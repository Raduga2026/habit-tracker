import React, { createContext, useContext, useState } from 'react';
import { userStorage } from '../utils/storage';

export const themes = {
  female: {
    appBg: 'bg-gradient-to-b from-pink-100 via-rose-50 to-sky-100',
    headerBg: 'bg-gradient-to-r from-rose-400 to-orange-300',
    headerText: 'text-white',
    habitGroupBg: 'bg-gradient-to-br from-rose-200 to-rose-300',
    habitGroupTitleColor: 'text-rose-800',
    habitItemBg: 'bg-rose-50 hover:bg-white',
    habitItemActiveBg: 'bg-white/70',
    habitTextColor: 'text-rose-900',
    habitDescColor: 'text-rose-700 opacity-70',
    checkDone: 'bg-gradient-to-br from-rose-400 to-orange-300 text-white',
    checkEmpty: 'border-2 border-rose-300',
    progressCardBg: 'bg-white',
    progressTextAccent: 'text-rose-600',
    progressBgAccent: 'bg-rose-50',
    progressBarClass: 'bg-gradient-to-r from-rose-400 via-peach-400 to-mint-400',
    navBg: 'bg-white border-t border-rose-100',
    navBtnActive: 'bg-gradient-to-r from-orange-300 to-rose-400 text-white shadow-md',
    navBtnInactive: 'bg-peach-100 text-peach-700',
    sectionHeaderBg: 'bg-gradient-to-r from-rose-50 to-peach-50 border-b border-rose-100',
    sectionHeaderText: 'text-gray-800',
    streakCardBg: 'bg-gradient-to-br from-rose-400 to-peach-400',
    statBarClass: 'bg-gradient-to-r from-mint-400 to-cyan-400',
    statPercentText: 'text-rose-600',
    statsActiveBtnBg: 'bg-mint-500 text-white',
    statsInactiveBtnBg: 'bg-white text-gray-700',
    heatmapRing: 'hover:ring-rose-400',
    cardBg: 'bg-white',
    cardText: 'text-gray-700',
    inputClass: 'border-2 border-rose-200 bg-amber-50 focus:ring-rose-300',
    btnPrimary: 'bg-gradient-to-br from-rose-400 to-peach-400 text-white hover:from-rose-500 hover:to-peach-500',
    btnSecondary: 'bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50',
    accentBorderColor: 'border-rose-100',
    dividerClass: 'bg-gradient-to-r from-transparent via-rose-200 to-transparent',
    aboutCardBg: 'bg-gradient-to-br from-rose-50 to-peach-50 border-2 border-rose-100',
    timeInputBorder: 'border-2 border-rose-200',
    badgeUnlocked: 'bg-gradient-to-br from-rose-50 to-peach-50 border-2 border-rose-300',
    badgeLocked: 'bg-gray-100 border-2 border-gray-200 opacity-50',
    xpBarClass: 'bg-gradient-to-r from-rose-400 to-peach-400',
    xpCardBg: 'bg-gradient-to-br from-rose-50 to-peach-50 border border-rose-100',
    levelTextColor: 'text-rose-600',
    kpiCardBg: 'bg-white border border-rose-100',
  },
  male: {
    appBg: 'bg-gradient-to-b from-[#0d2235] to-[#173848]',
    headerBg: 'bg-gradient-to-b from-[#152a45] to-[#0d2235]',
    headerText: 'text-white',
    habitGroupBg: 'bg-gradient-to-br from-[#5352a8] to-[#4878d8]',
    habitGroupTitleColor: 'text-white',
    habitItemBg: 'bg-white/10 hover:bg-white/20',
    habitItemActiveBg: 'bg-white/20',
    habitTextColor: 'text-white',
    habitDescColor: 'text-white/60',
    checkDone: 'bg-gradient-to-br from-cyan-400 to-cyan-500 text-white',
    checkEmpty: 'border-2 border-white/50',
    progressCardBg: 'bg-[#1e3a5c]',
    progressTextAccent: 'text-cyan-400',
    progressBgAccent: 'bg-[#0d2235]',
    progressBarClass: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400',
    navBg: 'bg-[#0d2235] border-t border-[#1a3a5c]',
    navBtnActive: 'bg-cyan-400 text-white shadow-lg shadow-cyan-500/30',
    navBtnInactive: 'bg-[#1a3055] text-cyan-200',
    sectionHeaderBg: 'bg-[#1e3a5c] border-b border-[#2a4a6c]',
    sectionHeaderText: 'text-white',
    streakCardBg: 'bg-gradient-to-br from-[#5352a8] to-[#4878d8]',
    statBarClass: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    statPercentText: 'text-cyan-400',
    statsActiveBtnBg: 'bg-cyan-500 text-white',
    statsInactiveBtnBg: 'bg-[#1e3a5c] text-gray-300',
    heatmapRing: 'hover:ring-cyan-400',
    cardBg: 'bg-[#1e3a5c]',
    cardText: 'text-gray-200',
    inputClass: 'border-2 border-[#2a4a6c] bg-[#0d2235] text-white focus:ring-cyan-300',
    btnPrimary: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500',
    btnSecondary: 'bg-[#1e3a5c] border-2 border-cyan-700 text-cyan-300 hover:bg-[#264a6c]',
    accentBorderColor: 'border-[#1a3a5c]',
    dividerClass: 'bg-gradient-to-r from-transparent via-[#2a4a6c] to-transparent',
    aboutCardBg: 'bg-[#1e3a5c] border-2 border-[#2a4a6c]',
    timeInputBorder: 'border-2 border-[#2a4a6c]',
    badgeUnlocked: 'bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-600',
    badgeLocked: 'bg-[#1a2a3a] border-2 border-[#2a3a4a] opacity-50',
    xpBarClass: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    xpCardBg: 'bg-[#1e3a5c] border border-[#2a4a6c]',
    levelTextColor: 'text-cyan-400',
    kpiCardBg: 'bg-[#1e3a5c] border border-[#2a4a6c]',
  }
};

const ThemeContext = createContext({
  theme: themes.female,
  gender: 'female',
  changeGender: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [gender, setGender] = useState(() => userStorage.get().gender || 'female');

  const changeGender = (newGender) => {
    userStorage.update({ gender: newGender });
    setGender(newGender);
  };

  const theme = themes[gender] || themes.female;

  return (
    <ThemeContext.Provider value={{ theme, gender, changeGender }}>
      {children}
    </ThemeContext.Provider>
  );
}
