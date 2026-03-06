import React, { useEffect } from 'react';

export default function Confetti() {
  useEffect(() => {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#ec4899', '#f8b4d8', '#5eedb4', '#fdb4da', '#e8a48e', '#7ef1c3'];
    const confettiPieces = 50;

    for (let i = 0; i < confettiPieces; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (Math.random() * 12 + 4) + 'px';
      piece.style.height = piece.style.width;
      piece.style.borderRadius = '50%';
      piece.style.position = 'fixed';
      piece.style.pointerEvents = 'none';
      piece.style.zIndex = '9999';
      piece.style.bottom = '-10px';
      piece.style.boxShadow = '0 0 10px rgba(' + Math.random()*255 + ',' + Math.random()*255 + ',' + Math.random()*255 + ',0.5)';

      container.appendChild(piece);

      setTimeout(() => piece.remove(), 2000);
    }
  }, []);

  return <div id="confetti-container" className="fixed inset-0 pointer-events-none" />;
}
