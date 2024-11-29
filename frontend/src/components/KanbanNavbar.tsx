import { RiKanbanView2 } from "react-icons/ri";
import { MdOutlineTableRows } from "react-icons/md";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const KanbanNavbar = () => {
  return (
    <div className="flex bg-amber-300 rounded p-2 gap-5 text-black font-bold">
      <span>Kanban Menu:</span>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-2 text-2xl">
          <NavigationMenuItem>
            <Link to="/kanban">
              <RiKanbanView2 className="bg-amber-300 font-bold text-black hover:text-white" />
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/kanban/backlog">
              <MdOutlineTableRows className="bg-amber-300 font-bold text-black hover:text-white" />
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default KanbanNavbar;
