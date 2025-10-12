import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

const AUTO_SCROLL_SPEED = 0.4;
const FRICTION = 0.95;
const DRAG_MULTIPLIER = 2;

const ProjectsSection = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const scrollPosition = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const manualScrollSpeed = useRef(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  
  const originalProjects = useMemo(() => [
    { id: 1, title: "Brand Identity", category: "Branding", image: project1, size: "large", offsetY: -120, marginLeft: 0, description: "Complete brand identity system including logo, colors, and guidelines.", borderRadius: "rounded-2xl" },
    { id: 2, title: "Web Experience", category: "UI/UX", image: project2, size: "medium", offsetY: 80, marginLeft: 30, description: "Modern web experience focused on user engagement and intuitive navigation.", borderRadius: "rounded-xl" },
    { id: 3, title: "Mobile App", category: "Product", image: project3, size: "small", offsetY: -50, marginLeft: 20, description: "Native mobile application with seamless user experience.", borderRadius: "rounded-3xl" },
    { id: 4, title: "Visual System", category: "Design System", image: project4, size: "large", offsetY: 120, marginLeft: 40, description: "Comprehensive design system for consistent user interfaces.", borderRadius: "rounded-lg" },
    { id: 5, title: "E-commerce", category: "Web Design", image: project1, size: "medium", offsetY: -100, marginLeft: 25, description: "Full-featured e-commerce platform with modern checkout flow.", borderRadius: "rounded-3xl" },
    { id: 6, title: "Art Direction", category: "Creative", image: project2, size: "small", offsetY: 100, marginLeft: 35, description: "Creative direction for digital and print campaigns.", borderRadius: "rounded-xl" },
    { id: 7, title: "Dashboard UI", category: "Interface", image: project3, size: "large", offsetY: -70, marginLeft: 15, description: "Analytics dashboard with real-time data visualization.", borderRadius: "rounded-2xl" },
    { id: 8, title: "Motion Design", category: "Animation", image: project4, size: "medium", offsetY: 150, marginLeft: 45, description: "Engaging motion graphics and animated experiences.", borderRadius: "rounded-lg" },
    { id: 9, title: "Logo Design", category: "Branding", image: project1, size: "small", offsetY: -140, marginLeft: 20, description: "Unique logo design reflecting brand personality.", borderRadius: "rounded-3xl" },
    { id: 10, title: "Portfolio Site", category: "Web", image: project2, size: "large", offsetY: 40, marginLeft: 30, description: "Personal portfolio showcasing creative work.", borderRadius: "rounded-xl" },
    { id: 11, title: "Social Campaign", category: "Marketing", image: project3, size: "medium", offsetY: -80, marginLeft: 40, description: "Multi-platform social media marketing campaign.", borderRadius: "rounded-2xl" },
    { id: 12, title: "Package Design", category: "Print", image: project4, size: "small", offsetY: 180, marginLeft: 25, description: "Product packaging design with eco-friendly materials.", borderRadius: "rounded-lg" },
    { id: 13, title: "App Interface", category: "Mobile", image: project1, size: "large", offsetY: -90, marginLeft: 35, description: "Mobile app interface with focus on usability.", borderRadius: "rounded-3xl" },
    { id: 14, title: "Editorial Design", category: "Print", image: project2, size: "medium", offsetY: 140, marginLeft: 20, description: "Magazine and editorial layout design.", borderRadius: "rounded-xl" },
    { id: 15, title: "3D Renders", category: "3D", image: project3, size: "small", offsetY: -20, marginLeft: 45, description: "Photorealistic 3D rendering and visualization.", borderRadius: "rounded-2xl" },
    { id: 16, title: "Illustration Set", category: "Illustration", image: project4, size: "large", offsetY: 70, marginLeft: 15, description: "Custom illustration set for digital products.", borderRadius: "rounded-lg" },
  ], []);

  const [projects, setProjects] = useState(() =>
    isMobile
      ? originalProjects
      : [...originalProjects, ...originalProjects]
  );
  
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        setScroll(window.scrollY);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setProjects([...originalProjects, ...originalProjects]);
    } else {
      setProjects(originalProjects);
    }
  }, [isMobile, originalProjects]);

  const animateScroll = useCallback(() => {
    if (!containerRef.current) return;
    if (!isDragging.current) {
      const currentScrollSpeed = selectedProject === null ? AUTO_SCROLL_SPEED : 0;
      scrollPosition.current += manualScrollSpeed.current + currentScrollSpeed;
      manualScrollSpeed.current *= FRICTION;
      if (Math.abs(manualScrollSpeed.current) < 0.01) {
        manualScrollSpeed.current = 0;
      }
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      const halfScrollWidth = maxScroll / 2;
      if (scrollPosition.current >= halfScrollWidth) {
        scrollPosition.current -= halfScrollWidth;
      } else if (scrollPosition.current < 0) {
        scrollPosition.current += halfScrollWidth;
      }
      containerRef.current.scrollLeft = scrollPosition.current;
    }
    animationFrameId.current = requestAnimationFrame(animateScroll);
  }, [selectedProject]);

  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      manualScrollSpeed.current += event.deltaY * 0.5;
    };
    const handleDragStart = (pageX: number) => {
      isDragging.current = true;
      startX.current = pageX - container.offsetLeft;
      scrollLeftStart.current = container.scrollLeft;
      manualScrollSpeed.current = 0;
      container.style.cursor = 'grabbing';
    };
    const handleDragMove = (pageX: number) => {
      if (!isDragging.current) return;
      const x = pageX - container.offsetLeft;
      const walk = (x - startX.current) * DRAG_MULTIPLIER;
      const newScrollLeft = scrollLeftStart.current - walk;
      const velocity = newScrollLeft - scrollPosition.current;
      manualScrollSpeed.current = velocity;
      scrollPosition.current = newScrollLeft;
      container.scrollLeft = newScrollLeft;
    };
    const handleDragEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      container.style.cursor = 'grab';
    };
    const handleMouseDown = (e: MouseEvent) => handleDragStart(e.pageX);
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.pageX);
    const handleTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].pageX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleDragMove(e.touches[0].pageX);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleDragEnd);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);
    window.addEventListener('touchcancel', handleDragEnd);

    animationFrameId.current = requestAnimationFrame(animateScroll);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleDragEnd);
        container.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleDragMove);
        window.addEventListener('touchend', handleDragEnd);
        window.addEventListener('touchcancel', handleDragEnd);
      }
    };
  }, [isMobile, animateScroll]);

  const selectedProjectData = selectedProject !== null
    ? originalProjects.find(p => p.id === selectedProject)
    : null;

  return (
    <>
      {isMobile ? (
        <div className="w-full h-[300vh] relative">
          <div className="sticky top-1/4 -translate-y-1/4 h-screen w-full">
            {projects.map((project, i) => {
              const-scale = 1 - (projects.length - 1 - i) * 0.05;
              const-translateY = (projects.length - 1 - i) * -1.5;
              const progress = Math.max(0, Math.min(1, (scroll - (i * (window.innerHeight * 0.5))) / (window.innerHeight * 0.5)));

              return (
                <div
                  key={`${project.id}-${i}`}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  style={{
                    transform: `scale(${1 - (progress * 0.1)}) translateY(${progress * -5}rem)`,
                    opacity: 1 - (progress * 0.5),
                    zIndex: projects.length - i
                  }}
                >
                  <ProjectCard
                    {...project}
                    size="small"
                    index={i}
                    onClick={() => setSelectedProject(project.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
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
                    onClick={() => setSelectedProject(project.id)}
                    borderRadius={project.borderRadius}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedProjectData && (
        <ProjectDetail
          title={selectedProjectData.title}
          category={selectedProjectData.category}
          image={selectedProjectData.image}
          description={selectedProjectData.description}
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default ProjectsSection;