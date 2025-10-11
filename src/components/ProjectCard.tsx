interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  size: "small" | "medium" | "large";
  index: number;
  onClick: () => void;
  borderRadius: string; // 1. Tambahkan prop baru di sini
}

const ProjectCard = ({ title, category, image, size, index, onClick, borderRadius }: ProjectCardProps) => { // 2. Terima prop di sini
  // Ukuran dasar (tanpa prefix sm:/md:) telah diperkecil untuk mobile
  const sizeClasses = {
    small: "w-[200px] sm:w-[280px] md:w-[320px] h-[240px] sm:h-[320px] md:h-[360px]",
    medium: "w-[250px] sm:w-[360px] md:w-[420px] h-[290px] sm:h-[400px] md:h-[460px]",
    large: "w-[300px] sm:w-[440px] md:w-[520px] h-[340px] sm:h-[480px] md:h-[560px]",
  };

  return (
    <div 
      // 3. Hapus 'rounded-2xl' dan ganti dengan prop
      className={`group relative flex-shrink-0 overflow-hidden ${borderRadius} bg-card border transition-transform duration-300 hover:scale-[1.02] cursor-pointer ${sizeClasses[size]}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 tracking-wider uppercase">
          {category}
        </p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default ProjectCard;