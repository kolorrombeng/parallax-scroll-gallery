interface AboutMeProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutMe = ({ isOpen, onClose }: AboutMeProps) => {
  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* --- TAMBAHKAN NAMA "TASAYAF DESIGNER" DI SINI --- */}
      <div className="fixed top-0 left-0 z-10 p-6 container mx-auto">
         <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Tasyaf Designer
         </h1>
      </div>

      {/* Tombol Close Vertikal */}
      <button
        onClick={onClose}
        className="glitch-button-vertical fixed top-6 right-6 z-10 flex items-center justify-center bg-foreground text-background text-base font-bold uppercase tracking-widest cursor-pointer"
        data-text="Close"
      >
        <span className="glitch-text">Close</span>
      </button>

      {/* Kontainer untuk semua panel */}
      <div className="relative h-full w-full p-4 md:p-8 lg:p-16 pointer-events-none">
        
        {/* Panel Utama: ABOUT ME */}
        <div className="pointer-events-auto absolute top-[15%] left-[5%] w-[90%] md:w-[45%] h-auto rounded-xl border-2 border-foreground bg-background p-8 shadow-2xl">
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-6">
            About Me
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              This is a demo portfolio by Tasyaf, created to showcase skills in graphic design and modern web development. The main goal is to build an engaging and visually appealing user experience.
            </p>
            <p>
              The projects displayed are a mix of conceptual work and client commissions, reflecting a deep passion for clean aesthetics and intuitive design solutions that resonate with users.
            </p>
          </div>
        </div>

        {/* Panel Kanan Atas: CREDITS */}
        <div className="pointer-events-auto absolute top-[25%] right-[5%] w-auto max-w-[300px] rounded-xl border-2 border-foreground bg-background p-6 shadow-2xl hidden md:block">
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
            Credits
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex justify-between gap-4">
              <span>Inspiration</span>
              <a href="https://p5aholic.me/" target="_blank" className="hover:text-foreground font-semibold">@p5aholic</a>
            </p>
            <p className="flex justify-between gap-4">
              <span>UI Framework</span>
              <a href="https://ui.shadcn.com/" target="_blank" className="hover:text-foreground font-semibold">shadcn/ui</a>
            </p>
          </div>
        </div>
        
        {/* Panel Kiri Bawah: TECH STACK */}
        <div className="pointer-events-auto absolute bottom-[15%] left-[10%] w-auto rounded-xl border-2 border-foreground bg-background p-6 shadow-2xl">
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
            Tech Stack
          </h3>
          <div className="flex gap-12 text-sm text-muted-foreground">
            <ul className="list-none space-y-1">
              <li>React</li>
              <li>TypeScript</li>
              <li>Vite</li>
            </ul>
            <ul className="list-none space-y-1">
              <li>Tailwind CSS</li>
              <li>Framer Motion</li>
              <li>p5.js</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AboutMe;