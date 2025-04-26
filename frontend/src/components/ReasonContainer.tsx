import React from 'react';

type ReasonContainerProps = {
  title: string;
  reason: string;
};

function ReasonContainer({ title, reason }: ReasonContainerProps) {
  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-gray-400 text-base">{reason}</p>
    </div>
  );
}

export default ReasonContainer;
