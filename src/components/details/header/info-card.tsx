import React from "react";

interface InfoCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg">
      <div className="flex items-center gap-2 text-white/70 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
};

export default InfoCard;