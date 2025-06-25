import { useTheme } from "@/contexts/ThemeProvider";
import { Link } from "react-router-dom";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`border-t-2 border-amber-300 py-5 ${
        theme === "light" ? "bg-indigo-600" : "bg-indigo-900"
      }`}
    >
      <footer className="container flex items-center justify-between">
        <Link
          to="/under-construction"
          className="text-lg font-bold text-amber-300 hover:text-white"
        >
          olearylab.com
        </Link>
        <span className="flex gap-4 text-lg font-bold text-amber-300">
          <Link to="/under-construction" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/under-construction" className="hover:text-white">
            Terms of Service
          </Link>
        </span>
      </footer>
    </div>
  );
};

export default Footer;
