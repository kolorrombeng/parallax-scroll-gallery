import { useEffect, useRef } from "react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import Particles2D from "@/components/Particles2D";
import AboutMe from "@/components/AboutMe"; // <-- Impor komponen baru

const Index = () => {
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fungsi untuk meneruskan event scroll (wheel)
    const forwardScroll = (e: WheelEvent) => {
      // Mencegah aksi default agar elemen itu sendiri tidak di-scroll
      e.preventDefault();
      // Melakukan scroll pada window utama sesuai dengan delta dari event
      window.scrollBy({
        top: e.deltaY,
        left: 0,
        behavior: 'auto' // 'auto' agar terasa instan
      });
    };

    const headerEl = headerRef.current;
    const footerEl = footerRef.current;

    // Tambahkan event listener ke header dan footer
    if (headerEl) headerEl.addEventListener('wheel', forwardScroll, { passive: false });
    if (footerEl) footerEl.addEventListener('wheel', forwardScroll, { passive: false });

    // Cleanup function untuk menghapus listener saat komponen tidak lagi digunakan
    return () => {
      if (headerEl) headerEl.removeEventListener('wheel', forwardScroll);
      if (footerEl) footerEl.removeEventListener('wheel', forwardScroll);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-transparent">
        <Particles2D />
        {/* Teruskan ref ke komponen Header */}
        <Header ref={headerRef} />
        
        {/* Kembalikan padding-top untuk memberi ruang bagi header fixed */}
        <main className="pt-16">
          <ProjectsSection />

          {/* Kembalikan footer menjadi fixed dan teruskan ref */}
          <footer ref={footerRef} className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-muted-foreground">
                  © {currentYear} Demo Website Tasyaf
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;