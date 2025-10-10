import { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

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

  // Projects with varied vertical positions for dynamic staggered layout
  const projects = [
    { id: 1, title: "Brand Identity", category: "Branding", image: project1, size: "large", offsetY: -150, marginLeft: 0, description: "Complete brand identity system including logo, colors, and guidelines." },
    { id: 2, title: "Web Experience", category: "UI/UX", image: project2, size: "medium", offsetY: 100, marginLeft: 30, description: "Modern web experience focused on user engagement and intuitive navigation." },
    { id: 3, title: "Mobile App", category: "Product", image: project3, size: "small", offsetY: -80, marginLeft: 20, description: "Native mobile application with seamless user experience." },
    { id: 4, title: "Visual System", category: "Design System", image: project4, size: "large", offsetY: 150, marginLeft: 40, description: "Comprehensive design system for consistent user interfaces." },
    { id: 5, title: "E-commerce", category: "Web Design", image: project1, size: "medium", offsetY: -120, marginLeft: 25, description: "Full-featured e-commerce platform with modern checkout flow." },
    { id: 6, title: "Art Direction", category: "Creative", image: project2, size: "small", offsetY: 80, marginLeft: 35, description: "Creative direction for digital and print campaigns." },
    { id: 7, title: "Dashboard UI", category: "Interface", image: project3, size: "large", offsetY: -50, marginLeft: 15, description: "Analytics dashboard with real-time data visualization." },
    { id: 8, title: "Motion Design", category: "Animation", image: project4, size: "medium", offsetY: 130, marginLeft: 45, description: "Engaging motion graphics and animated experiences." },
    { id: 9, title: "Logo Design", category: "Branding", image: project1, size: "small", offsetY: -160, marginLeft: 20, description: "Unique logo design reflecting brand personality." },
    { id: 10, title: "Portfolio Site", category: "Web", image: project2, size: "large", offsetY: 60, marginLeft: 30, description: "Personal portfolio showcasing creative work." },
    { id: 11, title: "Social Campaign", category: "Marketing", image: project3, size: "medium", offsetY: -90, marginLeft: 40, description: "Multi-platform social media marketing campaign." },
    { id: 12, title: "Package Design", category: "Print", image: project4, size: "small", offsetY: 120, marginLeft: 25, description: "Product packaging design with eco-friendly materials." },
    { id: 13, title: "App Interface", category: "Mobile", image: project1, size: "large", offsetY: -70, marginLeft: 35, description: "Mobile app interface with focus on usability." },
    { id: 14, title: "Editorial Design", category: "Print", image: project2, size: "medium", offsetY: 140, marginLeft: 20, description: "Magazine and editorial layout design." },
    { id: 15, title: "3D Renders", category: "3D", image: project3, size: "small", offsetY: -130, marginLeft: 45, description: "Photorealistic 3D rendering and visualization." },
    { id: 16, title: "Illustration Set", category: "Illustration", image: project4, size: "large", offsetY: 90, marginLeft: 15, description: "Custom illustration set for digital products." },
  ];

  const selectedProjectData = selectedProject !== null 
    ? projects.find(p => p.id === selectedProject) 
    : null;

  return (
    <>
      <section className="min-h-[300vh] relative">
        <div 
          ref={containerRef}
          className="sticky top-16 overflow-x-hidden overflow-y-hidden"
          style={{ height: 'calc(100vh - 8rem)' }}
        >
          <div className="relative h-full flex items-center">
            <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-12">
              {projects.map((project, index) => (
                <div
                  key={project.id}
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
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
