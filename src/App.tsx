import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Fungsi untuk memblokir klik kanan
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Fungsi untuk memblokir shortcut keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Ctrl+Shift+I (Windows/Linux) atau Cmd+Opt+I (Mac)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
      }
      if (e.metaKey && e.altKey && e.key === "i") {
        e.preventDefault();
      }
      // Ctrl+Shift+J (Windows/Linux) atau Cmd+Opt+J (Mac)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
      }
      if (e.metaKey && e.altKey && e.key === "j") {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "U") {
        e.preventDefault();
      }
    };

    // Menambahkan event listeners saat komponen dimuat
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Menghapus event listeners saat komponen dibongkar (cleanup)
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
