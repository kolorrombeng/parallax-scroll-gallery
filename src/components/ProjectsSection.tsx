import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const scrollPosition = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const manualScrollSpeed = useRef(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const originalProjects = useMemo(
    () => [
      { id: 1, title: "Brand Identity", category: "Branding", image: project1, description: "Complete brand identity system.", borderRadius: "rounded-2xl" },
      { id: 2, title: "Web Experience", category: "UI/UX", image: project2, description: "Modern and interactive web design.", borderRadius: "rounded-xl" },
      { id: 3, title: "Mobile App", category: "Product", image: project3, description: "Native app with seamless UX.", borderRadius: "rounded-3xl" },
      { id: 4, title: "Design System", category: "System", image: project4, description: "Comprehensive design language.", borderRadius: "rounded-lg" },
      { id: 5, title: "E-commerce", category: "Web", image: project1, description: "Modern shop platform.", borderRadius: "rounded-xl" },
      { id: 6, title: "Art Direction", category: "Creative", image: project2, description: "Digital and print campaign.", borderRadius: "rounded-3xl" },
      { id: 7, title: "Corporate Website", category: "Development", image: project3, description: "Responsive company website.", borderRadius: "rounded-xl" },
      { id: 8, title: "Portfolio", category: "Personal", image: project4, description: "Clean modern portfolio UI.", borderRadius: "rounded-2xl" },
      { id: 9, title: "Dashboard", category: "UI Design", image: project1, description: "Admin dashboard UX focus.", borderRadius: "rounded-2xl" },
      { id: 10, title: "Marketing Site", category: "Landing", image: project2, description: "High-conversion landing page.", borderRadius: "rounded-xl" },
      { id: 11, title: "Blog Platform", category: "Content", image: project3, description: "Minimalist blogging platform.", borderRadius: "rounded-3xl" },
      { id: 12, title: "Photo Gallery", category: "Creative", image: project4, description: "Interactive image gallery.", borderRadius: "rounded-lg" },
      { id: 13, title: "Learning App", category: "Education", image: project1, description: "Mobile learning experience.", borderRadius: "rounded-xl" },
      { id: 14, title: "Game UI", category: "Entertainment", image: project2, description: "Interface for casual game.", borderRadius: "rounded-3xl" },
      { id: 15, title: "NFT Platform", category: "Blockchain", image: project3, description: "NFT trading experience.", borderRadius: "rounded-xl" },
      { id: 16, title: "Charity Site", category: "Social", image: project4, description: "Donation-focused platform.", borderRadius: "rounded-2xl" },
    ],
    []
  );

  const [projects, setProjects] = useState(() =>
    isMobile ? originalProjects : [...originalProjects, ...originalProjects]
  );

  const [scrollProgress, setScrollProgress] = useState(0);

  // === MOBILE: local scroll progress (tidak pakai window scroll) ===
  const handleMobileScroll = useCallback(() => {
    const container = scrollableRef.current;
    if (!container) return;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const progress = container.scrollTop / maxScroll;
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const container = scrollableRef.current;
      if (!container) return;
      container.addEventListener("scroll", handleMobileScroll);
      handleMobileScroll();
      return () => container.removeEventListener("scroll", handleMobileScroll);
    }
  }, [isMobile, handleMobileScroll]);

  // === DESKTOP: auto horizontal scroll ===
  const animateScroll = useCallback(() => {
    if (!containerRef.current || isMobile) return;

    if (!isDragging.current) {
      const currentScrollSpeed = selectedProject === null ? AUTO_SCROLL_SPEED : 0;
      scrollPosition.current += manualScrollSpeed.current + currentScrollSpeed;
      manualScrollSpeed.current *= FRICTION;

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
  }, [selectedProject, isMobile]);

  useEffect(() => {
    if (isMobile) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      manualScrollSpeed.current += e.deltaY * 0.5;
    };

    const handleDragStart = (x: number) => {
      isDragging.current = true;
      startX.current = x - container.offsetLeft;
      scrollLeftStart.current = container.scrollLeft;
      manualScrollSpeed.current = 0;
      container.style.cursor = "grabbing";
    };

    const handleDragMove = (x: number) => {
      if (!isDragging.current) return;
      const move = (x - startX.current) * DRAG_MULTIPLIER;
      const newScrollLeft = scrollLeftStart.current - move;
      const velocity = newScrollLeft - scrollPosition.current;
      manualScrollSpeed.current = velocity;
      scrollPosition.current = newScrollLeft;
      container.scrollLeft = newScrollLeft;
    };

    const handleDragEnd = () => {
      isDragging.current = false;
      container.style.cursor = "grab";
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", (e) => handleDragStart(e.pageX));
    window.addEventListener("mousemove", (e) => handleDragMove(e.pageX));
    window.addEventListener("mouseup", handleDragEnd);
    container.addEventListener("touchstart", (e) => handleDragStart(e.touches[0].pageX), { passive: true });
    window.addEventListener("touchmove", (e) => handleDragMove(e.touches[0].pageX), { passive: false });
    window.addEventListener("touchend", handleDragEnd);

    animationFrameId.current = requestAnimationFrame(animateScroll);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", (e) => handleDragMove(e.pageX));
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", (e) => handleDragMove(e.touches[0].pageX));
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isMobile, animateScroll]);

  const selectedProjectData =
    selectedProject !== null ? originalProjects.find((p) => p.id === selectedProject) : null;

  return (
    <>
      {isMobile ? (
        // === MOBILE VERSION (tidak bergeser layar, tetap di dalam container) ===
        <div
          ref={scrollableRef}
          className="relative w-full h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="h-screen w-full flex justify-center items-center snap-start"
            >
              <ProjectCard
                {...project}
                size="large"
                index={index}
                onClick={() => setSelectedProject(project.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        // === DESKTOP HORIZONTAL ===
        <div
          ref={containerRef}
          className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div className="h-full w-max flex py-48 px-12">
            <div className="flex gap-6 md:gap-10 lg:gap-12">
              {projects.map((project, index) => (
                <div key={`${project.id}-${index}`} className="flex-shrink-0">
                  <ProjectCard
                    {...project}
                    index={index}
                    onClick={() => setSelectedProject(project.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedProjectData && (
        <ProjectDetail
          {...selectedProjectData}
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default ProjectsSection;