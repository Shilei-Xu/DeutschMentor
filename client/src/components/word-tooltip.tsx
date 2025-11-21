import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WordTooltipProps {
  word: string;
  position: { x: number; y: number };
  articleId: string;
  onClose: () => void;
  onSave: () => void;
}

export function WordTooltip({ word, position, articleId, onClose, onSave }: WordTooltipProps) {
  const [translation, setTranslation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!translation.trim()) {
      toast({
        title: "Translation required",
        description: "Please enter a translation for this word.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Get the selected text's context (the sentence it appears in)
      const selection = window.getSelection();
      let context = word;
      
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const parentElement = range.commonAncestorContainer.parentElement;
        if (parentElement) {
          const paragraph = parentElement.closest('p');
          if (paragraph) {
            context = paragraph.textContent || word;
          }
        }
      }

      await apiRequest("POST", "/api/dictionary", {
        word: word.trim(),
        translation: translation.trim(),
        context: context.substring(0, 200), // Limit context length
        articleId,
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/dictionary"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/articles", articleId] });
      
      toast({
        title: "Word saved",
        description: `"${word}" has been added to your dictionary.`,
      });
      
      setTranslation("");
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save word. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      data-tooltip-root
      data-testid="tooltip-word-selection"
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <Card className="w-80 shadow-lg border-2" data-testid="card-word-tooltip">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg break-words" data-testid="text-selected-word">
                {word}
              </h4>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 -mt-1 -mr-1"
              onClick={onClose}
              data-testid="button-close-tooltip"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="translation" className="text-sm">Translation</Label>
              <Input
                id="translation"
                placeholder="Enter English translation..."
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  } else if (e.key === "Escape") {
                    onClose();
                  }
                }}
                autoFocus
                data-testid="input-translation"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex-1"
                data-testid="button-cancel-tooltip"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !translation.trim()}
                className="flex-1"
                data-testid="button-save-word"
              >
                {isSaving ? "Saving..." : "Save to Dictionary"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
