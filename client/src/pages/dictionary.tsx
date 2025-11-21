import { useQuery } from "@tanstack/react-query";
import { DictionaryWord, Article } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookMarked, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: words, isLoading } = useQuery<DictionaryWord[]>({
    queryKey: ["/api/dictionary"],
  });

  const { data: articles } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const filteredWords = words?.filter((word) =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getArticleTitle = (articleId: string) => {
    return articles?.find(a => a.id === articleId)?.title || "Unknown Article";
  };

  const handleDelete = async (id: string) => {
    const wordToDelete = words?.find(w => w.id === id);
    try {
      await apiRequest("DELETE", `/api/dictionary/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["/api/dictionary"] });
      if (wordToDelete) {
        await queryClient.invalidateQueries({ queryKey: ["/api/articles", wordToDelete.articleId] });
      }
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center gap-3">
            <BookMarked className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">My Dictionary</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search your dictionary..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-all-words"
            />
          </div>

          {!isLoading && words && words.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{words.length} words saved</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredWords.length > 0 ? (
          <div className="space-y-4">
            {filteredWords.map((word) => (
              <Card key={word.id} className="hover-elevate group" data-testid={`card-dictionary-word-${word.id}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-semibold mb-2 break-words" data-testid={`text-dictionary-word-${word.id}`}>
                        {word.word}
                      </h3>
                      <p className="text-base text-muted-foreground break-words" data-testid={`text-dictionary-translation-${word.id}`}>
                        {word.translation}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => handleDelete(word.id)}
                      data-testid={`button-delete-dictionary-word-${word.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {word.context && (
                    <p className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-muted pl-4 mb-3">
                      "{word.context}"
                    </p>
                  )}
                  <Link href={`/articles/${word.articleId}`}>
                    <Button variant="outline" size="sm" data-testid={`button-view-article-${word.id}`}>
                      From: {getArticleTitle(word.articleId)}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookMarked className="h-24 w-24 text-muted-foreground/40 mb-6" />
            <h2 className="text-2xl font-semibold mb-2">
              {searchQuery ? "No words found" : "Your dictionary is empty"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery
                ? "No words match your search. Try a different term."
                : "Start reading articles and highlight words to build your German vocabulary."}
            </p>
            {!searchQuery && (
              <Link href="/">
                <Button data-testid="button-browse-articles">
                  Browse Articles
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
