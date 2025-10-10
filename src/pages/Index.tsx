import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import ThreeParticles from "@/components/ThreeParticles";
import Particles2D from "@/components/Particles2D";

const Index = () => {
  useEffect(() => {
    // Set initial scroll position
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-transparent">
        <Par />
        <Header />
        
        <main className="pt-16">
          <ProjectsSection />

          {/* Footer */}
          <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex justify-between items-center h-full">
                <p className="text-sm text-muted-foreground">
                  © 2025 Demo Website Tasyaf
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <a href="mailto:hello@designer.com" className="hover:text-foreground transition-colors">
                    Email
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    GitHub
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
