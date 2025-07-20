import { FC } from "react";
import { X, Copy } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import { parseResult, renderBody } from "./runResult.core";

interface RunResultProps {
  result: string;
  onClear: () => void;
}

export const RunResult: FC<RunResultProps> = ({ result, onClear }) => {
  const { subject, body } = parseResult(result);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      throw new Error("Failed to copy to clipboard");
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center gap-2">
            <Button
              className="text-gray-900 hover:bg-gray-100 transition-colors"
              size="sm"
              startContent={<Copy className="w-4 h-4" />}
              variant="light"
              onPress={handleCopy}
            >
              Copier
            </Button>
            <Button
              isIconOnly
              className="text-gray-900 hover:bg-gray-100"
              size="sm"
              variant="light"
              onPress={onClear}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div className=" p-6 ">
          {subject && (
            <>
              <div className="mb-4">
                <p className="font-semibold text-gray-900 text-lg">{subject}</p>
              </div>
              <Divider className="my-4" />
            </>
          )}

          <div className="space-y-4">
            {body.length > 0 ? (
              renderBody(body)
            ) : (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {result}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
