import { useState, type FormEvent } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AiPromptInputProps {
  placeholder?: string;
  submitLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (prompt: string) => void | Promise<void>;
  className?: string;
}

/**
 * Prompt input for AI-driven surfaces (Ask AI, generate summary, etc.).
 * Purely presentational — wire it to your chosen AI gateway upstream.
 */
export function AiPromptInput({
  placeholder = "Ask AI anything about your work…",
  submitLabel = "Ask",
  loading,
  disabled,
  onSubmit,
  className,
}: AiPromptInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    await onSubmit(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "surface flex flex-col gap-2 p-3 focus-within:ring-1 focus-within:ring-primary/40",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>AI assistant</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || loading}
        rows={2}
        className="min-h-16 resize-none border-none px-0 shadow-none focus-visible:ring-0"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={disabled || loading || !value.trim()}>
          {loading ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-1.5 h-4 w-4" />
          )}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
