import { useEffect, useRef, useCallback } from "react";
import ProjectCard from "./ProjectCard";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const AUTO_SCROLL_SPEED = 0.4; 
const FRICTION = 0.95; 
const TOUCH_SENSITIVITY = 1.5;

interface ProjectsSectionProps {
  isDetailOpen: boolean;
  setSelectedProject: (id: number | null) => void; // Menerima fungsi setter
}

const ProjectsSection = ({ isDetailOpen, setSelectedProject }: ProjectsSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollPosition = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const manualScrollSpeed = useRef(0);

  const isDragging = useRef(false);
  const lastX = useRef(0);

  // Data proyek direferensikan di sini (tanpa detail deskripsi yang tidak perlu)
  const originalProjects = [
    { id: 1, title: "Brand Identity", category: "Branding", image: project1, size: "large", offsetY: -120, marginLeft: 0, borderRadius: "rounded-2xl" },
    { id: 2, title: "Web Experience", category: "UI/UX", image: project2, size: "medium", offsetY: 80, marginLeft: 30, borderRadius: "rounded-xl" },
    { id: 3, title: "Mobile App", category: "Product", image: project3, size: "small", offsetY: -50, marginLeft: 20, borderRadius: "rounded-3xl" },
    { id: 4, title: "Visual System", category: "Design System", image: project4, size: "large", offsetY: 120, marginLeft: 40, borderRadius: "rounded-lg" },
    { id: 5, title: "E-commerce", category: "Web Design", image: project1, size: "medium", offsetY: -100, marginLeft: 25, borderRadius: "rounded-3xl" },
    { id: 6, title: "Art Direction", category: "Creative", image: project2, size: "small", offsetY: 100, marginLeft: 35, borderRadius: "rounded-xl" },
    { id: 7, title: "Dashboard UI", category: "Interface", image: project3, size: "large", offsetY: -70, marginLeft: 15, borderRadius: "rounded-2xl" },
    { id: 8, title: "Motion Design", category: "Animation", image: project4, size: "medium", offsetY: 150, marginLeft: 45, borderRadius: "rounded-lg" },
  ];

  const projects = [...originalProjects, ...originalProjects];

  const animateScroll = useCallback(() => {
    if (!containerRef.current) return;

    let currentSpeed = manualScrollSpeed.current;
    if (!isDetailOpen && !isDragging.current) {
      currentSpeed += AUTO_SCROLL_SPEED;
    }
    
    scrollPosition.current += currentSpeed;
    manualScrollSpeed.current *= FRICTION;
    if (Math.abs(manualScrollSpeed.current) < 0.01) {
      manualScrollSpeed.current = 0;
    }

    const scrollWidth = containerRef.current.scrollWidth;
    const clientWidth = containerRef.current.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    if (scrollPosition.current >= maxScroll / 2) {
      scrollPosition.current -= maxScroll / 2;
    } else if (scrollPosition.current < 0) {
      scrollPosition.current += maxScroll / 2;
    }
    
    containerRef.current.scrollLeft = scrollPosition.current;
    animationFrameId.current = requestAnimationFrame(animateScroll);
  }, [isDetailOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      manualScrollSpeed.current += event.deltaY * 0.5;
    };

    const handleTouchStart = (event: TouchEvent) => {
      isDragging.current = true;
      lastX.current = event.touches[0].clientX;
      manualScrollSpeed.current = 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDragging.current) return;
      event.preventDefault(); 
      const currentX = event.touches[0].clientX;
      const deltaX = lastX.current - currentX;
      manualScrollSpeed.current += deltaX * TOUCH_SENSITIVITY;
      lastX.current = currentX;
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    
    animationFrameId.current = requestAnimationFrame(animateScroll);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animateScroll]);

  return (
    <div 
      ref={containerRef}
      className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div className="h-full w-max flex py-48 px-12">
        <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              style={{
                transform: `translateY(${project.offsetY}px)`,
                marginLeft: index === 0 ? '0' : `${project.marginLeft}px`,
              }}
              className="flex-shrink-0"
            >
              <ProjectCard
                title={project.title}
                category={project.category}
                image={project.image}
                size={project.size as "small" | "medium" | "large"}
                index={index}
                onClick={() => setSelectedProject(project.id)} // Menggunakan fungsi dari props
                borderRadius={project.borderRadius}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;