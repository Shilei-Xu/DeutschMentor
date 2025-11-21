import { useQuery } from "@tanstack/react-query";
import { DictionaryWord } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Trash2, BookMarked } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DictionarySidebarProps {
  articleId: string;
}

export function DictionarySidebar({ articleId }: DictionarySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: allWords } = useQuery<DictionaryWord[]>({
    queryKey: ["/api/dictionary"],
  });

  const articleWords = allWords?.filter(w => w.articleId === articleId) || [];

  const filteredWords = articleWords.filter((word) =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/dictionary/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["/api/dictionary"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/articles", articleId] });
      toast({
        title: "Word removed",
        description: "The word has been removed from your dictionary.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete word.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <BookMarked className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Dictionary</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search words..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-dictionary"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => (
              <Card key={word.id} className="hover-elevate group" data-testid={`card-word-${word.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1 break-words" data-testid={`text-word-${word.id}`}>
                        {word.word}
                      </h3>
                      <p className="text-sm text-muted-foreground break-words" data-testid={`text-translation-${word.id}`}>
                        {word.translation}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => handleDelete(word.id)}
                      data-testid={`button-delete-word-${word.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {word.context && (
                    <p className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-muted pl-3">
                      "{word.context}"
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookMarked className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No words saved yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {searchQuery ? "No words match your search." : "Highlight words in the article to add them to your dictionary."}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
