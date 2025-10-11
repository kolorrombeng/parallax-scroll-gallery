import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useIsMobile } from "@/hooks/use-mobile"; // <-- Impor hook useIsMobile

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile(); // <-- Gunakan hook untuk mendeteksi mode mobile

  useEffect(() => {
    // --- FUNGSI LAMA UNTUK BLOKIR AKSI ---
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) || (e.metaKey && e.altKey && (e.key === "i" || e.key === "j")) || (e.ctrlKey && e.key === "U")) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // --- LOGIKA BARU UNTUK FULL SCREEN DI MOBILE ---
    const requestFullScreen = () => {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
          console.error(`Gagal masuk mode full screen: ${err.message} (${err.name})`);
        });
      }
    };

    const handleFirstInteraction = () => {
      if (isMobile) {
        requestFullScreen();
      }
      // Hapus listener setelah interaksi pertama agar tidak berjalan lagi
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    // Tambahkan listener untuk interaksi pertama
    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    // Cleanup listeners saat komponen dibongkar
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [isMobile]); // <-- Tambahkan isMobile sebagai dependency

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