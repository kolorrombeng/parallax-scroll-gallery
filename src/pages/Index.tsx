import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import Particles2D from "@/components/Particles2D";
import AboutMe from "@/components/AboutMe";

const Index = () => {
  const currentYear = new Date().getFullYear();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="bg-transparent">
        <Particles2D />
        <Header />
        
        {/* --- PERUBAHAN DI SINI: Hapus 'justify-center' --- */}
        <main className="min-h-screen flex items-center overflow-hidden pt-16">
          <ProjectsSection />
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 z-40 h-12 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-muted-foreground">
                  © {currentYear} Demo Website Tasyaf
                </p>
              </div>
            </div>
        </footer>

        {!isAboutOpen && (
          <button
            onClick={() => setIsAboutOpen(true)}
            className="glitch-button-vertical fixed top-6 right-6 z-50 flex items-center justify-center bg-foreground text-background text-base font-bold uppercase tracking-widest cursor-pointer"
            data-text="About"
          >
            <span className="glitch-text">About</span>
          </button>
        )}
        
        <AboutMe isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      </div>
    </ThemeProvider>
  );
};

export default Index;