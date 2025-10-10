import { useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / maxScroll;
        
        // Calculate horizontal scroll based on vertical scroll
        const maxHorizontalScroll = containerRef.current.scrollWidth - window.innerWidth;
        const targetScrollLeft = scrollProgress * maxHorizontalScroll;
        
        containerRef.current.scrollLeft = targetScrollLeft;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate projects with random sizes and positions
  const projects = [
    { id: 1, title: "Brand Identity", category: "Branding", image: project1, size: "large", marginTop: 0 },
    { id: 2, title: "Web Experience", category: "UI/UX", image: project2, size: "medium", marginTop: 80 },
    { id: 3, title: "Mobile App", category: "Product", image: project3, size: "small", marginTop: 40 },
    { id: 4, title: "Visual System", category: "Design System", image: project4, size: "large", marginTop: 120 },
    { id: 5, title: "E-commerce", category: "Web Design", image: project1, size: "medium", marginTop: 20 },
    { id: 6, title: "Art Direction", category: "Creative", image: project2, size: "small", marginTop: 100 },
    { id: 7, title: "Dashboard UI", category: "Interface", image: project3, size: "large", marginTop: 60 },
    { id: 8, title: "Motion Design", category: "Animation", image: project4, size: "medium", marginTop: 0 },
    { id: 9, title: "Logo Design", category: "Branding", image: project1, size: "small", marginTop: 140 },
    { id: 10, title: "Portfolio Site", category: "Web", image: project2, size: "large", marginTop: 30 },
    { id: 11, title: "Social Campaign", category: "Marketing", image: project3, size: "medium", marginTop: 90 },
    { id: 12, title: "Package Design", category: "Print", image: project4, size: "small", marginTop: 50 },
    { id: 13, title: "App Interface", category: "Mobile", image: project1, size: "large", marginTop: 110 },
    { id: 14, title: "Editorial Design", category: "Print", image: project2, size: "medium", marginTop: 70 },
    { id: 15, title: "3D Renders", category: "3D", image: project3, size: "small", marginTop: 20 },
    { id: 16, title: "Illustration Set", category: "Illustration", image: project4, size: "large", marginTop: 130 },
  ];

  return (
    <section className="min-h-[300vh] relative">
      <div 
        ref={containerRef}
        className="sticky top-16 h-screen overflow-x-hidden overflow-y-hidden"
      >
        <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 p-4 sm:p-6 md:p-8 lg:p-12 h-full items-end pb-20">
          {projects.map((project, index) => (
            <div
              key={project.id}
              style={{
                marginTop: `${project.marginTop}px`,
                marginLeft: index === 0 ? '0' : `${Math.random() * 40 + 10}px`,
              }}
              className="flex-shrink-0"
            >
              <ProjectCard
                title={project.title}
                category={project.category}
                image={project.image}
                size={project.size as "small" | "medium" | "large"}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
