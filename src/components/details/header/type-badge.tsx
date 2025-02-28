import React from "react";
import { typeToColor } from "@/app/constants/colors";

interface TypeBadgesProps {
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

const TypeBadges: React.FC<TypeBadgesProps> = ({ types }) => {
  return (
    <div className="flex gap-3 my-4">
      {types.map((typeInfo) => (
        <span
          key={typeInfo.type.name}
          className={`px-4 py-2 rounded-full text-white text-sm font-semibold capitalize ${
            typeToColor[typeInfo.type.name]?.bg || "bg-gray-600"
          }`}
        >
          {typeInfo.type.name}
        </span>
      ))}
    </div>
  );
};

export default TypeBadges;