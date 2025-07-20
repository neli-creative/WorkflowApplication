import { Card, CardBody } from "@heroui/card";
import { FC } from "react";

interface CustomCardProps {
  content: {
    title: string;
    description: string;
    icon: React.ReactNode;
  };
  index: number;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const CustomCard: FC<CustomCardProps> = ({
  index,
  content,
  setQuery,
}) => {
  return (
    <Card
      key={index}
      isPressable
      className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all duration-200 text-left group"
      onClick={() => setQuery(content.description)}
    >
      <CardBody className="p-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="text-gray-600 group-hover:text-gray-900 transition-colors">
            {content.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">
              {content.title}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
