import { Link } from "react-router-dom";
import { RiKanbanView2 } from "react-icons/ri";
import { MdOutlineTableRows } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

const MainNavigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Vertical sidebar for md and larger screens */}
      <div className="hidden md:block">
        <div
          className={`${
            isCollapsed ? "w-16" : "w-content"
          } bg-amber-300 transition-all duration-300`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-amber-300 border rounded-full p-1 hover:bg-amber-400"
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>

          <div className="p-4 space-y-4">
            <div className="font-bold text-black text-lg">
              {!isCollapsed && <h2>Navigation</h2>}
            </div>

            <nav className="space-y-2">
              <Link
                to="/kanban"
                className="flex items-center gap-2 text-black hover:bg-amber-400 rounded transition-colors"
              >
                <RiKanbanView2 className="text-2xl" />
                {!isCollapsed && <span className="text-lg">Kanban</span>}
              </Link>

              <Link
                to="/kanban/backlog"
                className="flex items-center gap-2 text-black hover:bg-amber-400 rounded transition-colors"
              >
                <MdOutlineTableRows className="text-2xl" />
                {!isCollapsed && <span className="text-lg">Backlog</span>}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Horizontal bar for small screens */}
      <div className="md:hidden w-full">
        <div className="bg-amber-300 h-auto">
          <nav className="flex items-center justify-evenly p-2">
            <Link
              to="/kanban"
              className="p-2 text-black hover:bg-amber-400 rounded transition-colors"
            >
              <RiKanbanView2 className="text-xl" />
            </Link>

            <Link
              to="/kanban/backlog"
              className="p-2 text-black hover:bg-amber-400 rounded transition-colors"
            >
              <MdOutlineTableRows className="text-xl" />
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MainNavigation;
