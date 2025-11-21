import { useQuery } from "@tanstack/react-query";
import { Article, DictionaryWord } from "@shared/schema";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookMarked, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { DictionarySidebar } from "@/components/dictionary-sidebar";
import { WordTooltip } from "@/components/word-tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ReadingView() {
  const [, params] = useRoute("/articles/:id");
  const articleId = params?.id;
  const [selectedText, setSelectedText] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobileDictionaryOpen, setIsMobileDictionaryOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ["/api/articles", articleId],
    enabled: !!articleId,
  });

  const { data: dictionaryWords } = useQuery<DictionaryWord[]>({
    queryKey: ["/api/dictionary"],
  });

  const articleWords = dictionaryWords?.filter(w => w.articleId === articleId) || [];

  useEffect(() => {
    const handleMouseUp = () => {
      // Small delay to ensure selection is complete
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection) return;
        
        const text = selection.toString().trim();

        if (text && text.length > 0 && selection.anchorNode && contentRef.current?.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setSelectedText(text);
          setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
          setShowTooltip(true);
        }
      }, 10);
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showTooltip && !target.closest('[data-tooltip-root]')) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  const handleWordSaved = () => {
    setShowTooltip(false);
    window.getSelection()?.removeAllRanges();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Article not found</h2>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-8">
            {/* Header */}
            <div className="mb-8">
              <Link href="/">
                <Button variant="ghost" className="mb-4" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Articles
                </Button>
              </Link>
              <h1 className="text-4xl font-bold mb-4 leading-tight" data-testid="text-article-title">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{article.content.split(/\s+/).length} words</span>
                <span>•</span>
                <span>{Math.ceil(article.content.split(/\s+/).length / 200)} min read</span>
              </div>
            </div>

            {/* Article Content */}
            <div
              ref={contentRef}
              className="prose prose-lg max-w-none font-serif leading-relaxed select-text"
              data-testid="text-article-content"
            >
              {article.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? (
                  <p key={idx} className="mb-6 text-foreground">
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>

            {/* Mobile Dictionary Button */}
            <div className="lg:hidden fixed bottom-6 right-6">
              <Sheet open={isMobileDictionaryOpen} onOpenChange={setIsMobileDictionaryOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" data-testid="button-open-dictionary">
                    <BookMarked className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md p-0">
                  <DictionarySidebar articleId={articleId!} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Desktop Dictionary Sidebar */}
        <div className="hidden lg:block w-96 border-l border-border sticky top-0 h-screen overflow-hidden">
          <DictionarySidebar articleId={articleId!} />
        </div>
      </div>

      {/* Word Selection Tooltip */}
      {showTooltip && (
        <WordTooltip
          word={selectedText}
          position={tooltipPosition}
          articleId={articleId!}
          onClose={() => setShowTooltip(false)}
          onSave={handleWordSaved}
        />
      )}
    </div>
  );
}
