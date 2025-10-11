import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import Particles2D from "@/components/Particles2D";
import AboutMe from "@/components/AboutMe";

const Index = () => {
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);

  // Ref untuk menyimpan posisi sentuhan awal di mobile
  const touchStartY = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fungsi untuk meneruskan event scroll (wheel) di DESKTOP
    const forwardWheelScroll = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({
        top: e.deltaY,
        left: 0,
        behavior: 'auto',
      });
    };

    // --- LOGIKA BARU UNTUK MOBILE ---
    // Fungsi untuk memulai deteksi sentuhan
    const handleTouchStart = (e: TouchEvent) => {
      // Simpan posisi Y awal dari sentuhan pertama
      touchStartY.current = e.touches[0].clientY;
    };

    // Fungsi untuk menangani pergerakan sentuhan
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Mencegah scroll default pada elemen itu sendiri
      const touchCurrentY = e.touches[0].clientY;
      // Hitung perbedaan dari posisi awal
      const deltaY = touchStartY.current - touchCurrentY;
      
      // Lakukan scroll pada window utama
      window.scrollBy(0, deltaY);

      // Kita tidak memperbarui touchStartY.current di sini agar scroll terasa natural
      // seolah-olah "menyeret" halaman dari posisi sentuhan awal.
    };
    
    const headerEl = headerRef.current;
    const footerEl = footerRef.current;

    if (headerEl) {
      headerEl.addEventListener('wheel', forwardWheelScroll, { passive: false });
      headerEl.addEventListener('touchstart', handleTouchStart, { passive: false });
      headerEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    if (footerEl) {
      footerEl.addEventListener('wheel', forwardWheelScroll, { passive: false });
      footerEl.addEventListener('touchstart', handleTouchStart, { passive: false });
      footerEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    // Cleanup function untuk menghapus semua listener
    return () => {
      if (headerEl) {
        headerEl.removeEventListener('wheel', forwardWheelScroll);
        headerEl.removeEventListener('touchstart', handleTouchStart);
        headerEl.removeEventListener('touchmove', handleTouchMove);
      }
      if (footerEl) {
        footerEl.removeEventListener('wheel', forwardWheelScroll);
        footerEl.removeEventListener('touchstart', handleTouchStart);
        footerEl.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="bg-transparent">
        <Particles2D />
        <Header ref={headerRef} onTitleClick={() => setIsAboutMeOpen(true)} />
        <AboutMe isOpen={isAboutMeOpen} onClose={() => setIsAboutMeOpen(false)} />
        
        <main className="min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <ProjectsSection />

          {/* Hapus "border-t" dari className */}
          <footer ref={footerRef} className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-transparent transition-colors duration-300 ease-in-out">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-muted-foreground">
                  © {currentYear} Demo Website Tasyaf
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;