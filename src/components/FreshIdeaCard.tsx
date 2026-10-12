import React, { useState } from 'react';
import { INNOVATION_IDEAS } from '../data/standardsData.ts';

interface FreshIdeaCardProps {
  onReadMore?: (ideaId: number) => void;
  isIdnMode?: boolean;
}

export const FreshIdeaCard: React.FC<FreshIdeaCardProps> = ({
  onReadMore,
  isIdnMode = false,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentIdea = INNOVATION_IDEAS[activeIdx];

  const handleDotClick = (idx: number) => {
    setActiveIdx(idx);
  };

  return (
    <div className="skeuo-curved-shadow-sm w-full select-none">
      <div className="skeuo-panel-gloss rounded-lg p-5 sm:p-6 flex flex-col justify-between border border-[#b8bfc8] min-h-[360px]">
        {/* Top: Light bulb artwork */}
        <div className="w-full flex items-center justify-center py-2 relative">
          <div className="relative w-48 h-28 sm:w-56 sm:h-32 flex items-center justify-center overflow-hidden rounded-md">
            <img
              src="/src/assets/images/silver_lightbulb_1790215594620.jpg"
              alt="Light bulb innovation"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain mix-blend-multiply filter contrast-105"
            />
          </div>
        </div>

        {/* Middle: Title & Description */}
        <div className="text-center px-2 mt-2">
          <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#49515d]">
            {isIdnMode ? currentIdea.title : 'Fresh Idea'}
          </h3>
          <p className="mt-2 text-xs sm:text-[13px] text-[#717b88] leading-relaxed max-w-xl mx-auto line-clamp-3">
            {isIdnMode
              ? currentIdea.description
              : 'Lorem ipsum dolor sit amet, commodo et, tristique urna lorem sed pellentesque ac sollicitudin. Pede morbi leo curabitur laoreet ridiculus. Ante lacus.'}
          </p>

          {isIdnMode && (
            <div className="mt-1 text-[11px] font-semibold text-[#3b434e]">
              {currentIdea.category} · {currentIdea.impactMetrics}
            </div>
          )}
        </div>

        {/* Bottom Bar: Slider Pagination Dots + Read More Button */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#d8dce2]">
          {/* 4 Pagination Slider Dots */}
          <div className="flex items-center gap-2 pl-2">
            {[0, 1, 2, 3].map((idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`skeuo-dot-recessed cursor-pointer ${
                    isActive ? 'active' : 'hover:brightness-95'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Read more... Glossy Button */}
          <button
            onClick={() => onReadMore?.(currentIdea.id)}
            className="skeuo-btn-convex px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#454d58]"
          >
            {isIdnMode ? 'Baca Selengkapnya..' : 'Read more..'}
          </button>
        </div>
      </div>
    </div>
  );
};
