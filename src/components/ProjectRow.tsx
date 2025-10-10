import { useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}

interface ProjectRowProps {
  projects: Project[];
  direction?: "left" | "right";
  speed?: number;
}

const ProjectRow = ({ projects, direction = "left", speed = 40 }: ProjectRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const animationName = direction === "left" ? "scroll-left" : "scroll-right";
    row.style.animation = `${animationName} ${speed}s linear infinite`;

    // Pause animation on hover
    const handleMouseEnter = () => {
      row.style.animationPlayState = "paused";
    };
    const handleMouseLeave = () => {
      row.style.animationPlayState = "running";
    };

    row.addEventListener("mouseenter", handleMouseEnter);
    row.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      row.removeEventListener("mouseenter", handleMouseEnter);
      row.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed]);

  // Duplicate projects for seamless infinite loop
  const duplicatedProjects = [...projects, ...projects];

  return (
    <div className="relative overflow-hidden py-4 sm:py-6">
      <div
        ref={rowRef}
        className="flex gap-4 sm:gap-6 md:gap-8"
        style={{ width: "max-content" }}
      >
        {duplicatedProjects.map((project, index) => (
          <ProjectCard
            key={`${project.id}-${index}`}
            title={project.title}
            category={project.category}
            image={project.image}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectRow;
