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
      <div
        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative h-full w-full pointer-events-none">
        {/* Main Content Card - Left Side, starts from top */}
        <div className="absolute top-0 left-0 bottom-0 w-[60%] rounded-none border-2 border-l-0 border-t-0 border-b-0 border-foreground bg-background p-8 md:p-12 pointer-events-auto overflow-y-auto">
          <h2 className="mb-8 text-4xl md:text-6xl font-bold uppercase tracking-widest">
            100 Days of Poetry
          </h2>
          <div className="space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              <span className="font-bold">100 DAYS OF POETRY</span> is an artwork, which consists of a graphic design <span className="font-bold underline">Notty</span> created per day for 100 days.
            </p>
            <p>
              These 100 days were also the days when he faced his own complexes and frustrations. He thought he could get closer to his ideal self by doing this project.
            </p>
            <p>
              He did not create each work as a separate piece of art, but instead expressed his feelings and thoughts as 100 graphics as if he were writing a poetry.
            </p>
          </div>
          <p className="mt-8 text-sm text-right text-muted-foreground italic">
            Written by Keita Yamada
          </p>
        </div>

        {/* Credit Card - Top Right */}
        <div className="absolute top-0 right-0 w-[40%] rounded-none border-2 border-r-0 border-t-0 border-foreground bg-background p-8 pointer-events-auto">
          <h3 className="mb-6 text-5xl md:text-6xl font-bold uppercase tracking-wider">
            Credit
          </h3>
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">100 Poetries</span>
              <span className="font-medium">@re_natty</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Web Site</span>
              <span className="font-medium">@P5_keita</span>
            </div>
          </div>
        </div>

        {/* Fonts Card - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[40%] rounded-none border-2 border-r-0 border-b-0 border-foreground bg-background p-8 pointer-events-auto">
          <h3 className="mb-6 text-5xl md:text-6xl font-bold uppercase tracking-wider">
            Fonts
          </h3>
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground whitespace-nowrap">Le Murmure</span>
              <span className="font-medium text-right underline">Jérémy Landes, Velvetyne</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground whitespace-nowrap">Neogrotesk</span>
              <span className="font-medium text-right underline">Los Andes, MyFonts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;