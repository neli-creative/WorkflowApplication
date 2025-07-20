import { FC } from "react";
import { Send } from "lucide-react";
import { Form } from "@heroui/form";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import { FORM_PROMPT } from "./runForm.constants";

interface RunFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

export const RunForm: FC<RunFormProps> = ({
  handleSubmit,
  query,
  setQuery,
  isLoading,
}) => {
  return (
    <Form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 focus-within:border-gray-300/70 focus-within:shadow-md transition-all duration-200 w-full">
        <div className="text-gray-400">
          <span className="text-lg">{FORM_PROMPT.icon}</span>
        </div>
        <Textarea
          maxRows={10}
          minRows={1}
          name="input"
          placeholder={FORM_PROMPT.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          className="p-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed min-w-10 h-10"
          isDisabled={!query.trim()}
          type="submit"
        >
          {isLoading ? (
            <Spinner className="p-2" color="default" size="sm" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </Button>
      </div>
    </Form>
  );
};
