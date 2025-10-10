import { useEffect, useRef, useState, useCallback } from "react";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  // Refs untuk mengelola state animasi dan interaksi
  const scrollPosition = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const isHovering = useRef(false);
  const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const originalProjects = [
    { id: 1, title: "Brand Identity", category: "Branding", image: project1, size: "large", offsetY: -150, marginLeft: 0, description: "Complete brand identity system including logo, colors, and guidelines.", borderRadius: "rounded-2xl" },
    { id: 2, title: "Web Experience", category: "UI/UX", image: project2, size: "medium", offsetY: 80, marginLeft: 30, description: "Modern web experience focused on user engagement and intuitive navigation.", borderRadius: "rounded-xl" },
    { id: 3, title: "Mobile App", category: "Product", image: project3, size: "small", offsetY: -50, marginLeft: 20, description: "Native mobile application with seamless user experience.", borderRadius: "rounded-3xl" },
    { id: 4, title: "Visual System", category: "Design System", image: project4, size: "large", offsetY: 120, marginLeft: 40, description: "Comprehensive design system for consistent user interfaces.", borderRadius: "rounded-lg" },
    { id: 5, title: "E-commerce", category: "Web Design", image: project1, size: "medium", offsetY: -120, marginLeft: 25, description: "Full-featured e-commerce platform with modern checkout flow.", borderRadius: "rounded-3xl" },
    { id: 6, title: "Art Direction", category: "Creative", image: project2, size: "small", offsetY: 100, marginLeft: 35, description: "Creative direction for digital and print campaigns.", borderRadius: "rounded-xl" },
    { id: 7, title: "Dashboard UI", category: "Interface", image: project3, size: "large", offsetY: -80, marginLeft: 15, description: "Analytics dashboard with real-time data visualization.", borderRadius: "rounded-2xl" },
    { id: 8, title: "Motion Design", category: "Animation", image: project4, size: "medium", offsetY: 150, marginLeft: 45, description: "Engaging motion graphics and animated experiences.", borderRadius: "rounded-lg" },
    { id: 9, title: "Logo Design", category: "Branding", image: project1, size: "small", offsetY: -160, marginLeft: 20, description: "Unique logo design reflecting brand personality.", borderRadius: "rounded-3xl" },
    { id: 10, title: "Portfolio Site", category: "Web", image: project2, size: "large", offsetY: 50, marginLeft: 30, description: "Personal portfolio showcasing creative work.", borderRadius: "rounded-xl" },
    { id: 11, title: "Social Campaign", category: "Marketing", image: project3, size: "medium", offsetY: -90, marginLeft: 40, description: "Multi-platform social media marketing campaign.", borderRadius: "rounded-2xl" },
    { id: 12, title: "Package Design", category: "Print", image: project4, size: "small", offsetY: 180, marginLeft: 25, description: "Product packaging design with eco-friendly materials.", borderRadius: "rounded-lg" },
    { id: 13, title: "App Interface", category: "Mobile", image: project1, size: "large", offsetY: -110, marginLeft: 35, description: "Mobile app interface with focus on usability.", borderRadius: "rounded-3xl" },
    { id: 14, title: "Editorial Design", category: "Print", image: project2, size: "medium", offsetY: 160, marginLeft: 20, description: "Magazine and editorial layout design.", borderRadius: "rounded-xl" },
    { id: 15, title: "3D Renders", category: "3D", image: project3, size: "small", offsetY: -30, marginLeft: 45, description: "Photorealistic 3D rendering and visualization.", borderRadius: "rounded-2xl" },
    { id: 16, title: "Illustration Set", category: "Illustration", image: project4, size: "large", offsetY: 90, marginLeft: 15, description: "Custom illustration set for digital products.", borderRadius: "rounded-lg" },
  ];

  const projects = [...originalProjects, ...originalProjects];

  const startAutoScroll = useCallback(() => {
    if (isHovering.current || !containerRef.current) return;
    
    const animate = () => {
      if (!containerRef.current || isHovering.current) return; // Tambahan pengecekan di dalam loop
      
      scrollPosition.current += 0.5;

      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      
      if (scrollPosition.current >= maxScroll / 2) {
        scrollPosition.current -= maxScroll / 2;
      }

      containerRef.current.scrollLeft = scrollPosition.current;
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  const stopAutoScroll = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const handleWheel = useCallback((event: WheelEvent) => {
    if (containerRef.current) {
      event.preventDefault();
      stopAutoScroll();
      if (manualScrollTimeout.current) {
        clearTimeout(manualScrollTimeout.current);
      }

      scrollPosition.current += event.deltaY;

      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollPosition.current >= maxScroll / 2) {
        scrollPosition.current -= maxScroll / 2;
      } else if (scrollPosition.current < 0) {
        scrollPosition.current += maxScroll / 2;
      }
      
      containerRef.current.scrollLeft = scrollPosition.current;

      manualScrollTimeout.current = setTimeout(startAutoScroll, 2000);
    }
  }, [startAutoScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      isHovering.current = true;
      stopAutoScroll();
    };
    const handleMouseLeave = () => {
      isHovering.current = false;
      startAutoScroll();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    startAutoScroll();

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      stopAutoScroll();
      if (manualScrollTimeout.current) {
        clearTimeout(manualScrollTimeout.current);
      }
    };
  }, [handleWheel, startAutoScroll]);

  const selectedProjectData = selectedProject !== null 
    ? originalProjects.find(p => p.id === selectedProject) 
    : null;

  return (
    <>
      <div 
        ref={containerRef}
        className="h-full w-full overflow-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div className="h-full w-max flex items-center px-12">
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
