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
  const touchStartY = useRef(0);

  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const forwardWheelScroll = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0, behavior: 'auto' });
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchCurrentY;
      window.scrollBy(0, deltaY);
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
        {/* --- PERUBAHAN DI SINI: Teruskan fungsi toggle --- */}
        <Header ref={headerRef} onNameClick={() => setIsAboutOpen(prev => !prev)} />
        
        <main className="min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <ProjectsSection />
        </main>
        
        <footer ref={footerRef} className="fixed bottom-0 left-0 right-0 z-40 h-12 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-muted-foreground">
                  © {currentYear} Demo Website Tasyaf
                </p>
              </div>
            </div>
        </footer>

        {/* --- TOMBOL ABOUT YANG MENGAMBANG DIHAPUS DARI SINI --- */}
        
        <AboutMe isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      </div>
    </ThemeProvider>
  );
};

export default Index;