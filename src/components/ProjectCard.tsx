interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  index: number;
}

const ProjectCard = ({ title, category, image, index }: ProjectCardProps) => {
  return (
    <div 
      className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] overflow-hidden rounded-lg bg-card transition-transform duration-300 hover:scale-[1.02]"
      style={{ animationDelay: `${index * 0.1}s` }}
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
