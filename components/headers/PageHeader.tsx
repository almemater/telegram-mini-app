import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="relative z-20 -mt-14 justify-center items-center flex flex-col mb-4 mx-2 p-4 glassmorphic rounded-lg text-center">
      <h1 className="text-4xl font-bold capitalize !z-40">{title}</h1>
      {description ? <p className="text-lg text-gray-400">{description}</p> : ""}
    </div>
  );
};

export default PageHeader;