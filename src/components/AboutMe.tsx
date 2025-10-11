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
      
      <div className="relative h-full w-full pointer-events-none p-4 md:p-8">
        {/* Main Content Box - Top Left */}
        <div className="absolute top-[15%] left-4 md:left-8 w-[calc(100%-2rem)] md:w-[55%] max-w-3xl rounded-lg border-2 border-foreground bg-background p-6 md:p-10 pointer-events-auto">
          <h2 className="mb-6 text-3xl md:text-5xl font-bold uppercase tracking-widest">
            100 Days of Poetry
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed">
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
          <p className="mt-6 text-xs md:text-sm text-right text-muted-foreground italic">
            Written by Keita Yamada
          </p>
        </div>

        {/* Credit Box - Top Right */}
        <div className="absolute top-[15%] right-4 md:right-8 w-auto min-w-[200px] rounded-lg border-2 border-foreground bg-background p-6 pointer-events-auto">
          <h3 className="mb-4 text-4xl md:text-5xl font-bold uppercase tracking-wider">
            Credit
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">100 Poetries</span>
              <span className="font-medium">@re_natty</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Web Site</span>
              <span className="font-medium">@P5_keita</span>
            </div>
          </div>
        </div>

        {/* Fonts Box - Bottom Left */}
        <div className="absolute bottom-8 left-4 md:left-8 w-auto min-w-[280px] rounded-lg border-2 border-foreground bg-background p-6 pointer-events-auto">
          <h3 className="mb-4 text-4xl md:text-5xl font-bold uppercase tracking-wider">
            Fonts
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-12">
              <span className="text-muted-foreground">Le Murmure</span>
              <span className="font-medium underline">Jérémy Landes, Velvetyne</span>
            </div>
            <div className="flex justify-between gap-12">
              <span className="text-muted-foreground">Neogrotesk</span>
              <span className="font-medium underline">Los Andes, MyFonts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;