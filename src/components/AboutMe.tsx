import { X } from 'lucide-react';

interface AboutMeProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutMe = ({ isOpen, onClose }: AboutMeProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Tombol Close Vertikal dengan Glitch */}
      <button
        onClick={onClose}
        className="about-me-close-button" // <-- Gunakan class CSS baru
      >
        <span className="close-text">Close</span>
      </button>

      {/* Konten Panel */}
      <div className="relative h-full w-full">
        {/* Panel Utama: About Me */}
        <div className="absolute top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-foreground bg-background p-8 md:p-12">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-widest md:text-3xl">
            About Me
          </h2>
          <p className="mb-4 text-muted-foreground">
            This is a demo portfolio created by Tasyaf, showcasing skills in graphic design and web development. The goal is to create an engaging and visually appealing user experience.
          </p>
          <p className="text-muted-foreground">
            The projects displayed are a collection of conceptual and client work, reflecting a passion for clean aesthetics and intuitive design solutions.
          </p>
        </div>

        {/* Panel Bawah: Tech Stack */}
        <div className="absolute bottom-10 left-10 w-auto rounded-lg border-2 border-foreground bg-background p-6">
          <h3 className="mb-3 text-lg font-bold uppercase tracking-wider">
            Tech Stack
          </h3>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <div>
              <p>React</p>
              <p>TypeScript</p>
            </div>
            <div>
              <p>Vite</p>
              <p>Tailwind CSS</p>
            </div>
          </div>
        </div>
        
        {/* Panel Kanan: Credits */}
        <div className="absolute bottom-10 right-10 hidden w-auto rounded-lg border-2 border-foreground bg-background p-6 md:block">
          <h3 className="mb-3 text-lg font-bold uppercase tracking-wider">
            Credits
          </h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="w-20 inline-block">Inspiration:</span> <a href="https://p5aholic.me/" target="_blank" className="hover:text-foreground">p5aholic.me</a></p>
            <p><span className="w-20 inline-block">UI:</span> <a href="https://ui.shadcn.com/" target="_blank" className="hover:text-foreground">shadcn/ui</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;