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
  const [isAboutMeOpen, setAboutMeOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-transparent">
        <Particles2D />
        <Header ref={headerRef} onBrandClick={() => setAboutMeOpen(true)} />
        
        <main className="pt-16">
          <ProjectsSection />

          <footer ref={footerRef} className="fixed bottom-0 left-0 right-0 z-40 h-16 pointer-events-none">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex justify-center items-center h-full pointer-events-auto">
                <p className="text-sm text-muted-foreground">
                  © {currentYear} Demo Website Tasyaf
                </p>
              </div>
            </div>
          </footer>
        </main>
        
        <AboutMe isOpen={isAboutMeOpen} onClose={() => setAboutMeOpen(false)} />
      </div>
    </ThemeProvider>
  );
};

export default Index;