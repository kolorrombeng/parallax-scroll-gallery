import { useEffect, useRef, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import Particles2D from "@/components/Particles2D";
import AboutMe from "@/components/AboutMe";
import ThemeRipple from "@/components/ThemeRipple";

interface Ripple {
  x: number;
  y: number;
  maxRadius: number;
  startTime: number;
  color: string;
  bgColor: string;
}

const IndexContent = () => {
  const { theme, setTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [ripple, setRipple] = useState<Ripple | null>(null);

  const touchStartY = useRef(0);

  const handleThemeChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const x = event.clientX;
    const y = event.clientY;

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    setRipple({
      x,
      y,
      maxRadius,
      startTime: Date.now(),
      color: newTheme === 'dark' ? '#000000' : '#ffffff', // Warna tema baru
      bgColor: theme === 'dark' ? '#000000' : '#ffffff', // Warna tema lama
    });
  };
  
  const onRippleAnimationComplete = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // Gunakan timeout untuk memastikan perubahan tema diterapkan sebelum menghapus kanvas
    setTimeout(() => {
        setRipple(null);
    }, 50);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const forwardWheelScroll = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({
        top: e.deltaY,
        left: 0,
        behavior: 'auto',
      });
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
    <div className="bg-transparent">
      <Particles2D />
      <Header
        ref={headerRef}
        onTitleClick={() => setIsAboutMeOpen(true)}
        onThemeToggle={handleThemeChange}
      />
      <AboutMe isOpen={isAboutMeOpen} onClose={() => setIsAboutMeOpen(false)} />
      <ThemeRipple ripple={ripple} onAnimationComplete={onRippleAnimationComplete} />
      
      <main className="min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <ProjectsSection />
        <footer ref={footerRef} className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md">
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
  );
};

const Index = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <IndexContent />
  </ThemeProvider>
);

export default Index;