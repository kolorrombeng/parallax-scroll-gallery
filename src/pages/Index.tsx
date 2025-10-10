import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";

const Index = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {/* Container utama yang mengisi seluruh layar */}
      <div className="h-screen w-screen bg-background">
        <Header />
        
        {/* Area konten utama yang diberi padding atas & bawah seukuran header & footer */}
        <main className="h-full w-full pt-16 pb-16">
          <ProjectsSection />
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-t border-border">
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
