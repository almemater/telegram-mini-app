import React, { useState } from 'react';

interface EarnPageHeaderProps {
  onToggle: (section: 'tasks' | 'rewards') => void;
}

const EarnPageHeader: React.FC<EarnPageHeaderProps> = ({ onToggle }) => {
  const [activeSection, setActiveSection] = useState<'tasks' | 'rewards'>('tasks');

  const handleToggle = (section: 'tasks' | 'rewards') => {
    setActiveSection(section);
    onToggle(section);
  };

  return (
    <div className="relative z-20 -mt-14 font-secondary text-3xl tracking-wider justify-evenly items-center flex mb-4 mx-4 p-2 glassmorphic rounded-lg text-center">
      <button
          onClick={() => handleToggle('tasks')}
          className={`px-4 py-2 rounded w-full ${activeSection === 'tasks' ? 'bg-white text-tertiary' : ''}`}
        >
          TASKS
        </button>
        <button
          onClick={() => handleToggle('rewards')}
          className={`px-4 py-2 rounded w-full ${activeSection === 'rewards' ? 'bg-white text-tertiary' : ''}`}
        >
          REWARDS
        </button>
    </div>
  );
};

export default EarnPageHeader;