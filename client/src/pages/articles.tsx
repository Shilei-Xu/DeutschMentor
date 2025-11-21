import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertArticleSchema } from "@shared/schema";
import { z } from "zod";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const form = useForm<z.infer<typeof insertArticleSchema>>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof insertArticleSchema>) => {
    try {
      await apiRequest("POST", "/api/articles", data);
      await queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Article created",
        description: "Your article has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/articles/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/dictionary"] });
      toast({
        title: "Article deleted",
        description: "The article and its dictionary words have been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article.",
        variant: "destructive",
      });
    }
  };

  const filteredArticles = articles?.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">German Articles</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-article">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-description">
                <DialogHeader>
                  <DialogTitle>Add New Article</DialogTitle>
                  <DialogDescription id="dialog-description">
                    Add a German article to start building your vocabulary
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Article title"
                              data-testid="input-article-title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste your German article here..."
                              className="min-h-96 font-serif text-lg leading-relaxed"
                              data-testid="input-article-content"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" data-testid="button-save-article">
                        Save Article
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-articles"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="hover-elevate">
                <CardHeader className="space-y-3">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover-elevate group" data-testid={`card-article-${article.id}`}>
                <CardHeader>
                  <h3 className="text-xl font-semibold line-clamp-2" data-testid={`text-article-title-${article.id}`}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {article.content.split(/\s+/).length} words
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 font-serif leading-relaxed">
                    {article.content}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2 justify-between">
                  <Link href={`/articles/${article.id}`}>
                    <Button variant="outline" data-testid={`button-read-${article.id}`}>
                      Read Article
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(article.id)}
                    data-testid={`button-delete-${article.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="h-24 w-24 text-muted-foreground/40 mb-6" />
            <h2 className="text-2xl font-semibold mb-2">No articles yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery ? "No articles match your search." : "Add your first German article to start learning and building your vocabulary."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-first-article">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Article
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
