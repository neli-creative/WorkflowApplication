import { FC } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Button } from "@heroui/button";
import { HelpCircle } from "lucide-react";

interface InstructionsProps {
  advices: Advice[];
}

interface Advice {
  text: string;
  icon: string;
}

export const Advices: FC<InstructionsProps> = ({ advices }) => {
  return (
    <div className="absolute bottom-4 left-4 z-50">
      <Popover placement="top-start" showArrow={true}>
        <PopoverTrigger>
          <Button
            isIconOnly
            aria-label="Afficher les instructions"
            className="bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-lg transition-all duration-200"
            variant="shadow"
          >
            <HelpCircle size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <div className="px-4 py-3 bg-white rounded-lg shadow-lg max-w-xs">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Instructions
            </h4>
            <div className="space-y-2">
              {advices.map((advice: Advice, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <span className="flex-shrink-0">{advice.icon}</span>
                  <span className="leading-relaxed">{advice.text}</span>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
