import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface ProjectDetailProps {
  title: string;
  category: string;
  image: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetail = ({ title, category, image, description, isOpen, onClose }: ProjectDetailProps) => {
  const isMobile = useIsMobile();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300); // Duration of zoom-out animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isAnimating) return null;

  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          className={`relative w-[90vw] max-w-md h-auto max-h-[80vh] bg-card rounded-2xl shadow-2xl overflow-hidden animate-zoom-in`}
        >
          <div className="relative h-full overflow-y-auto">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-card/50 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="relative h-48 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            </div>

            <div className="p-6">
              <p className="text-xs font-medium text-muted-foreground mb-2 tracking-wider uppercase">
                {category}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[600px] lg:w-[700px] bg-card border-l border-border z-50 transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full overflow-y-auto">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>
          <div className="p-6 sm:p-8 lg:p-12">
            <p className="text-sm font-medium text-muted-foreground mb-3 tracking-wider uppercase">
              {category}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              {description}
            </p>
            <div className="space-y-6 border-t border-border pt-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Role</h3>
                <p className="text-foreground">Lead Designer</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Year</h3>
                <p className="text-foreground">2024</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Client</h3>
                <p className="text-foreground">Confidential</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;