import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import Particles2D from "@/components/Particles2D";
import AboutMe from "@/components/AboutMe";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const mainContentRef = useRef<HTMLElement>(null); // Ref untuk area <main>
  const currentYear = new Date().getFullYear();
  const touchStartY = useRef(0);
  const isMobile = useIsMobile();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const forwardScroll = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0, behavior: 'auto' });
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // --- PERUBAHAN UTAMA DI SINI ---
      // Cek apakah target event BUKAN bagian dari ProjectsSection
      const projectSection = mainContentRef.current?.querySelector('.w-full.overflow-hidden');
      if (projectSection && !projectSection.contains(e.target as Node)) {
        e.preventDefault(); // Hanya cegah scroll default jika di luar galeri
        const touchCurrentY = e.touches[0].clientY;
        const deltaY = touchStartY.current - touchCurrentY;
        window.scrollBy(0, deltaY);
      }
    };
    
    const headerEl = headerRef.current;
    const footerEl = footerRef.current;

    if (isMobile) {
      if (headerEl) {
        headerEl.addEventListener('touchstart', handleTouchStart, { passive: true });
        headerEl.addEventListener('touchmove', handleTouchMove, { passive: false });
      }
      if (footerEl) {
        footerEl.addEventListener('touchstart', handleTouchStart, { passive: true });
        footerEl.addEventListener('touchmove', handleTouchMove, { passive: false });
      }
    } else {
      // Hanya tambahkan wheel listener di desktop
      if (headerEl) headerEl.addEventListener('wheel', forwardScroll, { passive: false });
      if (footerEl) footerEl.addEventListener('wheel', forwardScroll, { passive: false });
    }

    return () => {
      if (headerEl) {
        headerEl.removeEventListener('wheel', forwardScroll);
        headerEl.removeEventListener('touchstart', handleTouchStart);
        headerEl.removeEventListener('touchmove', handleTouchMove);
      }
      if (footerEl) {
        footerEl.removeEventListener('wheel', forwardScroll);
        footerEl.removeEventListener('touchstart', handleTouchStart);
        footerEl.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isMobile]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="bg-transparent">
        <Particles2D />
        <Header ref={headerRef} onNameClick={() => setIsAboutOpen(prev => !prev)} />
        
        <main ref={mainContentRef} className="min-h-screen flex items-center justify-center overflow-hidden pt-16">
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
        
        <AboutMe isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      </div>
    </ThemeProvider>
  );
};

export default Index;