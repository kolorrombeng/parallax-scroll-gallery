import { useEffect, useRef, useState, useCallback } from "react";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

// --- KONFIGURASI ---
const AUTO_SCROLL_SPEED = 0.4; 
const FRICTION = 0.95; 

// Tambahkan tipe untuk prop baru
interface ProjectsSectionProps {
  isDetailOpen: boolean;
}

const ProjectsSection = ({ isDetailOpen }: ProjectsSectionProps) => { // Terima prop di sini
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  const scrollPosition = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const manualScrollSpeed = useRef(0);

  const originalProjects = [
    { id: 1, title: "Brand Identity", category: "Branding", image: project1, size: "large", offsetY: -120, marginLeft: 0, description: "Complete brand identity system including logo, colors, and guidelines.", borderRadius: "rounded-2xl" },
    { id: 2, title: "Web Experience", category: "UI/UX", image: project2, size: "medium", offsetY: 80, marginLeft: 30, description: "Modern web experience focused on user engagement and intuitive navigation.", borderRadius: "rounded-xl" },
    { id: 3, title: "Mobile App", category: "Product", image: project3, size: "small", offsetY: -50, marginLeft: 20, description: "Native mobile application with seamless user experience.", borderRadius: "rounded-3xl" },
    { id: 4, title: "Visual System", category: "Design System", image: project4, size: "large", offsetY: 120, marginLeft: 40, description: "Comprehensive design system for consistent user interfaces.", borderRadius: "rounded-lg" },
    { id: 5, title: "E-commerce", category: "Web Design", image: project1, size: "medium", offsetY: -100, marginLeft: 25, description: "Full-featured e-commerce platform with modern checkout flow.", borderRadius: "rounded-3xl" },
    { id: 6, title: "Art Direction", category: "Creative", image: project2, size: "small", offsetY: 100, marginLeft: 35, description: "Creative direction for digital and print campaigns.", borderRadius: "rounded-xl" },
    { id: 7, title: "Dashboard UI", category: "Interface", image: project3, size: "large", offsetY: -70, marginLeft: 15, description: "Analytics dashboard with real-time data visualization.", borderRadius: "rounded-2xl" },
    { id: 8, title: "Motion Design", category: "Animation", image: project4, size: "medium", offsetY: 150, marginLeft: 45, description: "Engaging motion graphics and animated experiences.", borderRadius: "rounded-lg" },
  ];

  const projects = [...originalProjects, ...originalProjects];

  const animateScroll = useCallback(() => {
    if (!containerRef.current) return;

    // Hanya tambahkan kecepatan auto-scroll jika detail tidak terbuka
    let currentSpeed = manualScrollSpeed.current;
    if (!isDetailOpen) {
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

    // Terus panggil frame berikutnya
    animationFrameId.current = requestAnimationFrame(animateScroll);
  }, [isDetailOpen]); // Tambahkan isDetailOpen sebagai dependency

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      manualScrollSpeed.current += event.deltaY * 0.5;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    
    // Mulai animasi
    animationFrameId.current = requestAnimationFrame(animateScroll);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animateScroll]);

  // Logika untuk menampilkan detail proyek tetap sama
  const selectedProjectData = selectedProject !== null 
    ? originalProjects.find(p => p.id === selectedProject) 
    : null;

  return (
    <>
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