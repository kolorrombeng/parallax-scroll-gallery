import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ProjectDetailProps {
  title: string;
  category: string;
  image: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetail = ({ title, category, image, description, isOpen, onClose }: ProjectDetailProps) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Detail Panel - Diubah menjadi modal pop-up */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
        >
          {/* Tombol Tutup */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 bg-background/50 hover:bg-background/80 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="overflow-y-auto">
            {/* Gambar Proyek */}
            <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            </div>

            {/* Konten Proyek */}
            <div className="p-6 sm:p-8 lg:p-12">
              <p className="text-sm font-medium text-muted-foreground mb-3 tracking-wider uppercase">
                {category}
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
                {title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                {description}
              </p>

              {/* Detail Tambahan */}
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
      </div>
    </>
  );
};

export default ProjectDetail;