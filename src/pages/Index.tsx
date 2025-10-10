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
          {/* Hero Section with parallax */}
          <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 sm:mb-6 animate-fade-in">
                Digital Designer
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Crafting meaningful digital experiences through minimalist design and innovative thinking
              </p>
            </div>
            
            {/* Decorative elements with parallax */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-muted/10 rounded-full blur-3xl parallax-slow" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl parallax-medium" />
            </div>
          </section>

          {/* Projects Section */}
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
