import { useEffect, useState } from "react";
import ProjectRow from "./ProjectRow";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const ProjectsSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate project data with different arrangements per row
  const projectRows = [
    {
      id: 1,
      direction: "left" as const,
      speed: 45,
      projects: [
        { id: 1, title: "Brand Identity", category: "Branding", image: project1 },
        { id: 2, title: "Web Experience", category: "UI/UX", image: project2 },
        { id: 3, title: "Mobile App", category: "Product", image: project3 },
        { id: 4, title: "Visual System", category: "Design System", image: project4 },
        { id: 5, title: "E-commerce", category: "Web Design", image: project1 },
      ],
    },
    {
      id: 2,
      direction: "right" as const,
      speed: 50,
      projects: [
        { id: 6, title: "Art Direction", category: "Creative", image: project2 },
        { id: 7, title: "Dashboard UI", category: "Interface", image: project3 },
        { id: 8, title: "Motion Design", category: "Animation", image: project4 },
        { id: 9, title: "Logo Design", category: "Branding", image: project1 },
        { id: 10, title: "Portfolio Site", category: "Web", image: project2 },
      ],
    },
    {
      id: 3,
      direction: "left" as const,
      speed: 55,
      projects: [
        { id: 11, title: "Social Campaign", category: "Marketing", image: project3 },
        { id: 12, title: "Package Design", category: "Print", image: project4 },
        { id: 13, title: "App Interface", category: "Mobile", image: project1 },
        { id: 14, title: "Editorial Design", category: "Print", image: project2 },
        { id: 15, title: "3D Renders", category: "3D", image: project3 },
      ],
    },
    {
      id: 4,
      direction: "right" as const,
      speed: 48,
      projects: [
        { id: 16, title: "Illustration Set", category: "Illustration", image: project4 },
        { id: 17, title: "SaaS Platform", category: "Product", image: project1 },
        { id: 18, title: "Landing Page", category: "Web", image: project2 },
        { id: 19, title: "Typography", category: "Type Design", image: project3 },
        { id: 20, title: "Brand Guide", category: "Branding", image: project4 },
      ],
    },
  ];

  return (
    <section className="min-h-screen py-20 sm:py-32">
      <div className="mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6 lg:px-8">
        <h2 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
          Selected Works
        </h2>
      </div>

      <div className="space-y-8 sm:space-y-12 md:space-y-16">
        {projectRows.map((row, index) => (
          <div
            key={row.id}
            style={{
              transform: `translateY(${scrollY * (0.05 + index * 0.02)}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <ProjectRow
              projects={row.projects}
              direction={row.direction}
              speed={row.speed}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
