import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import WhatWeDo from "@/pages/what-we-do";
import Photos from "@/pages/photos";
import BookClub from "@/pages/book-club";
import Volunteer from "@/pages/volunteer";
import Donate from "@/pages/donate";
import Contact from "@/pages/contact";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/what-we-do" component={WhatWeDo} />
      <Route path="/photos" component={Photos} />
      <Route path="/book-club" component={BookClub} />
      <Route path="/volunteer" component={Volunteer} />
      <Route path="/donate" component={Donate} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
