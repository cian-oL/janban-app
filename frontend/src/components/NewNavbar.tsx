import { Link } from "react-router-dom";

import { RiKanbanView2 } from "react-icons/ri";
import { MdOutlineTableRows } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NewNavbar = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 bg-amber-300 rounded p-2 text-black font-bold hover:bg-white">
        <span>Go to...</span>
        <FaChevronDown className="mt-1 pt-0.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-8 bg-amber-300">
        <DropdownMenuItem className="hover:bg-amber-400">
          <Link to="/kanban">
            <RiKanbanView2 className="bg-amber-300 font-bold text-black hover:text-white" />
            <span>Kanban</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/kanban/backlog">
            <MdOutlineTableRows className="bg-amber-400 font-bold text-black hover:bg-white" />
            <span>Backlog</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewNavbar;
