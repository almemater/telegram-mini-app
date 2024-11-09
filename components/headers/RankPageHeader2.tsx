import React, { useState } from 'react';

interface RankPageHeader2Props {
  onToggle: (section: 'overall' | 'daily') => void;
}

const RankPageHeader2: React.FC<RankPageHeader2Props> = ({ onToggle }) => {
  const [activeSection, setActiveSection] = useState<'overall' | 'daily'>('overall');

  const handleToggle = (section: 'overall' | 'daily') => {
    setActiveSection(section);
    onToggle(section);
  };

  return (
    <div className="relative z-20 -mt-14 font-secondary text-3xl tracking-wider justify-evenly items-center flex mb-4 mx-4 p-2 glassmorphic rounded-lg text-center">
      <button
          onClick={() => handleToggle('overall')}
          className={`px-4 py-2 rounded w-full ${activeSection === 'overall' ? 'bg-white text-tertiary' : ''}`}
        >
          OVERALL
        </button>
        <button
          onClick={() => handleToggle('daily')}
          className={`px-4 py-2 rounded w-full ${activeSection === 'daily' ? 'bg-white text-tertiary' : ''}`}
        >
          DAILY
        </button>
    </div>
  );
};

export default RankPageHeader2;