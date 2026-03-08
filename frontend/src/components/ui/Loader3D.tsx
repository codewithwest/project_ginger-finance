'use client';

import React from 'react';

export default function Loader3D() {
  return (
    <div className="loader-container">
      <div className="cube-wrapper">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
      <p className="loader-text">Loading Financial Intelligence...</p>

      <style jsx>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .cube-wrapper {
          width: 60px;
          height: 60px;
          perspective: 1000px;
        }

        .cube {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: rotateCube 3s infinite linear;
        }

        .face {
          position: absolute;
          width: 60px;
          height: 60px;
          background: rgba(79, 163, 224, 0.1);
          border: 2px solid var(--color-accent-primary);
          box-shadow: 0 0 15px var(--color-accent-glow);
        }

        .front  { transform: translateZ(30px); }
        .back   { transform: rotateY(180deg) translateZ(30px); }
        .right  { transform: rotateY(90deg) translateZ(30px); }
        .left   { transform: rotateY(-90deg) translateZ(30px); }
        .top    { transform: rotateX(90deg) translateZ(30px); }
        .bottom { transform: rotateX(-90deg) translateZ(30px); }

        @keyframes rotateCube {
          from { transform: rotateX(0) rotateY(0) rotateZ(0); }
          to { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        .loader-text {
          font-weight: 600;
          color: var(--color-text-secondary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.8rem;
          animation: pulseText 1.5s infinite ease-in-out;
        }

        @keyframes pulseText {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
