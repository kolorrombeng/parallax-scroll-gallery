import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";

const Index = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="h-screen w-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 overflow-hidden relative">
          <ProjectsSection />
        </main>

        <footer className="h-16 border-t border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex justify-between items-center h-full">
              <p className="text-sm text-muted-foreground">
                © 2024 Digital Designer
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
      </div>
    </ThemeProvider>
  );
};

export default Index;
