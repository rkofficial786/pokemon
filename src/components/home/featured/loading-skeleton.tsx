import React from 'react';

interface LoadingSkeletonProps {
  height?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ height = "h-64" }) => {
  return (
    <div className="max-w-4xl mx-auto relative">
      <div className={`rounded-2xl overflow-hidden bg-gray-800 animate-pulse ${height}`}></div>
    </div>
  );
};

export default LoadingSkeleton;