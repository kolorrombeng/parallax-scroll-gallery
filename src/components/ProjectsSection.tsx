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
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const scrollPosition = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const manualScrollSpeed = useRef(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const originalProjects = useMemo(
    () => [
      { id: 1, title: "Brand Identity", category: "Branding", image: project1, description: "Complete brand identity system including logo, colors, and guidelines.", borderRadius: "rounded-2xl" },
      { id: 2, title: "Web Experience", category: "UI/UX", image: project2, description: "Modern web experience focused on user engagement and intuitive navigation.", borderRadius: "rounded-xl" },
      { id: 3, title: "Mobile App", category: "Product", image: project3, description: "Native mobile application with seamless user experience.", borderRadius: "rounded-3xl" },
      { id: 4, title: "Visual System", category: "Design System", image: project4, description: "Comprehensive design system for consistent user interfaces.", borderRadius: "rounded-lg" },
      { id: 5, title: "E-commerce", category: "Web Design", image: project1, description: "Full-featured e-commerce platform with modern checkout flow.", borderRadius: "rounded-3xl" },
      { id: 6, title: "Art Direction", category: "Creative", image: project2, description: "Creative direction for digital and print campaigns.", borderRadius: "rounded-xl" },
    ],
    []
  );

  const [projects, setProjects] = useState(() =>
    isMobile ? originalProjects : [...originalProjects, ...originalProjects]
  );

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (isMobile) {
      setProjects(originalProjects);
    } else {
      setProjects([...originalProjects, ...originalProjects]);
    }
  }, [isMobile, originalProjects]);

  const handleMobileScroll = () => {
    const container = mobileContainerRef.current;
    if (!container) return;

    const scrollTop = window.scrollY;
    const containerTop = container.offsetTop;
    const containerHeight = container.offsetHeight;
    const windowHeight = window.innerHeight;

    const start = containerTop;
    const end = containerTop + containerHeight - windowHeight;

    if (scrollTop >= start && scrollTop <= end) {
      const progress = (scrollTop - start) / (end - start);
      setScrollProgress(progress);
    } else if (scrollTop < start) {
      setScrollProgress(0);
    } else {
      setScrollProgress(1);
    }
  };

  useEffect(() => {
    if (isMobile) {
      window.addEventListener("scroll", handleMobileScroll);
      handleMobileScroll();
    }
    return () => {
      if (isMobile) window.removeEventListener("scroll", handleMobileScroll);
    };
  }, [isMobile]);

  const animateScroll = useCallback(() => {
    if (!containerRef.current || isMobile) return;

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
  }, [selectedProject, isMobile]);

  useEffect(() => {
    if (isMobile) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

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
      container.style.cursor = "grabbing";
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
      container.style.cursor = "grab";
    };

    const handleMouseDown = (e: MouseEvent) => handleDragStart(e.pageX);
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.pageX);
    const handleTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].pageX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleDragMove(e.touches[0].pageX);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleDragEnd);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);
    window.addEventListener("touchcancel", handleDragEnd);

    animationFrameId.current = requestAnimationFrame(animateScroll);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
      window.removeEventListener("touchcancel", handleDragEnd);
    };
  }, [isMobile, animateScroll]);

  const selectedProjectData =
    selectedProject !== null
      ? originalProjects.find((p) => p.id === selectedProject)
      : null;

  return (
    <>
      {isMobile ? (
        // === MOBILE STACKED SCROLL REVEAL DENGAN PARALLAX ===
        <div
          ref={mobileContainerRef}
          className="relative w-full"
          style={{ height: `${projects.length * 100}vh` }}
        >
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            {projects.map((project, index) => {
              const progressPerCard = 1 / projects.length;
              const start = index * progressPerCard;
              const end = start + progressPerCard;

              let localProgress = 0;
              if (scrollProgress >= start && scrollProgress < end) {
                localProgress = (scrollProgress - start) / progressPerCard;
              } else if (scrollProgress >= end) {
                localProgress = 1;
              }

              // Parallax background (bergerak lambat)
              const parallaxTranslate = localProgress * -30; // lebih kecil untuk efek depth
              const translateY = localProgress * -100;
              const scale = 1 - localProgress * 0.1;
              const opacity = Math.max(0, 1 - localProgress * 1.2);

              return (
                <div
                  key={`${project.id}-${index}`}
                  className="absolute w-full h-full flex justify-center items-center"
                  style={{
                    zIndex: projects.length - index,
                  }}
                >
                  {/* Background Parallax */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${project.image})`,
                      transform: `translateY(${parallaxTranslate}px) scale(1.2)`,
                      opacity: 0.2,
                      filter: "blur(10px)",
                      transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    }}
                  />

                  {/* Foreground Card */}
                  <div
                    style={{
                      transform: `translateY(${translateY}%) scale(${scale})`,
                      opacity,
                      transition: "transform 0.5s ease, opacity 0.5s ease",
                    }}
                  >
                    <ProjectCard
                      {...project}
                      size="large"
                      index={index}
                      onClick={() => setSelectedProject(project.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // === DESKTOP AUTO-SCROLL HORIZONTAL ===
        <div
          ref={containerRef}
          className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div className="h-full w-max flex py-48 px-12">
            <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
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