import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Articles from "@/pages/articles";
import ReadingView from "@/pages/reading-view";
import Dictionary from "@/pages/dictionary";
import { Button } from "@/components/ui/button";
import { BookOpen, BookMarked } from "lucide-react";

function Navigation() {
  const [location] = useLocation();

  // Don't show navigation on reading view
  if (location.startsWith("/articles/")) {
    return null;
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Deutsch Lernen</span>
            </div>
          </Link>
          <div className="flex gap-2">
            <Link href="/">
              <Button
                variant={location === "/" ? "default" : "ghost"}
                data-testid="link-articles"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Articles
              </Button>
            </Link>
            <Link href="/dictionary">
              <Button
                variant={location === "/dictionary" ? "default" : "ghost"}
                data-testid="link-dictionary"
              >
                <BookMarked className="h-4 w-4 mr-2" />
                Dictionary
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Articles} />
      <Route path="/articles/:id" component={ReadingView} />
      <Route path="/dictionary" component={Dictionary} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Navigation />
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
