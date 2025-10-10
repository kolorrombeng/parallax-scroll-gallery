import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";

const Index = () => {
  useEffect(() => {
    // Set initial scroll position
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <ProjectsSection />

          {/* Footer */}
          <footer className="border-t border-border py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  © 2024 Digital Designer. All rights reserved.
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
