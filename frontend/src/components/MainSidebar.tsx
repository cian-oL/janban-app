import { Link } from "react-router-dom";
import { RiKanbanView2 } from "react-icons/ri";
import { MdOutlineTableRows } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

const MainSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={` ${
        isCollapsed ? "w-16" : "w-64"
      } bg-amber-300 transition-all duration-300`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-indigo-300 rounded-full p-1 hover:bg-amber-400"
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div className="p-4 space-y-4">
        <div className="font-bold text-black">
          {!isCollapsed && <h2>Navigation</h2>}
        </div>

        <nav className="space-y-2">
          <Link
            to="/kanban"
            className="flex items-center gap-2 p-2 text-black hover:bg-amber-400 rounded transition-colors"
          >
            <RiKanbanView2 className="text-xl" />
            {!isCollapsed && <span>Kanban</span>}
          </Link>

          <Link
            to="/kanban/backlog"
            className="flex items-center gap-2 p-2 text-black hover:bg-amber-400 rounded transition-colors"
          >
            <MdOutlineTableRows className="text-xl" />
            {!isCollapsed && <span>Backlog</span>}
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MainSidebar;
