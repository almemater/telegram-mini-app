import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const RankPageHeader2: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = pathname.includes('daily') ? 'daily' : 'overall';

  const handleNavigation = (section: 'overall' | 'daily') => {
    router.push(`/rank/${section === 'overall' ? '' : section}`);
  };

  return (
    <div className="relative z-20 -mt-14 font-secondary text-3xl tracking-wider justify-evenly items-center flex mb-4 mx-4 p-2 glassmorphic rounded-lg text-center">
      <button
        onClick={() => handleNavigation('overall')}
        className={`px-4 py-2 rounded w-full ${activeSection === 'overall' ? 'bg-white text-tertiary' : ''}`}
      >
        OVERALL
      </button>
      <button
        onClick={() => handleNavigation('daily')}
        className={`px-4 py-2 rounded w-full ${activeSection === 'daily' ? 'bg-white text-tertiary' : ''}`}
      >
        DAILY
      </button>
    </div>
  );
};

export default RankPageHeader2;