import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import Particles2D from "@/components/Particles2D";

const Index = () => {
  useEffect(() => {
    // Set initial scroll position
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-transparent">
        <Particles2D />
        <Header />
        
        <main className="pt-16">
          <ProjectsSection />

          {/* Footer */}
          <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-t border-border">
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