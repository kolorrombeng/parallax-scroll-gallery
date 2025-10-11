import { Moon, Sun, Mail, Instagram, SquarePen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState, forwardRef } from "react";

interface HeaderProps {
  onTitleClick: () => void;
}

// Gunakan forwardRef untuk meneruskan ref ke elemen <header>
const Header = forwardRef<HTMLElement, HeaderProps>(({ onTitleClick }, ref) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    // Hapus "border-b" dari className
    <header ref={ref} className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <button onClick={onTitleClick} className="text-left">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
                Tasyaf Designer
              </h1>
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="mailto:hello@designer.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">hello@designer.com</span>
            </a>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Behance">
                <SquarePen className="h-4 w-4" />
              </a>
              <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="WhatsApp">
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;