"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      // Si ya estamos en home, hacer scroll al inicio para resetear la vista
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Forzar recarga para resetear el estado del componente
      window.location.href = "/";
    } else {
      router.push("/");
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/reviews", label: "Reviews" },
    { href: "/boat-rules", label: "Boat Rules" },
    { href: "/terms-and-policies", label: "Terms and Policies" },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{ backgroundColor: "rgba(102, 109, 147, 0.3)" }}
    >
      <div className="max-w-7xl mx-auto px-6" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3"
            style={{ transform: "translateX(-1.5cm)" }}
          >
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src="/logo.png" 
                alt="Caliente Tours Miami Logo" 
                className="h-16 w-auto object-contain"
              />
            </Link>
            <span className="text-white font-bold italic" style={{ fontSize: "0.875rem" }}>
              WE HAVE THE LARGEST FLEET IN MIAMI YACHT RENTAL & BOAT RENTAL
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-white border-b-2 border-[#930775]"
                      : "text-gray-300 hover:text-white hover:border-b-2 hover:border-white/50"
                  }`}
                  style={{
                    fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

