import { Link } from "react-router-dom";

import janbanImage from "@/assets/janban-main.png";
import { Button } from "@/components/ui/button";

const HomePageTile = () => {
  return (
    <div className="mx-auto my-5 flex w-full flex-col items-center justify-evenly gap-5 rounded-lg bg-indigo-100 p-10 md:max-w-[80%] lg:flex-row">
      <img src={janbanImage} className="py-5 lg:w-[60%]" />
      <section className="w-fit">
        <div className="mb-10">
          <h1 className="text-3xl font-bold underline">Janban</h1>
          <h2 className="mt-2 text-xl font-bold italic">
            Welcome to the Jira Analogue Platform
          </h2>
          <p className="mt-2 text-lg">Get Started on your Tasks!</p>
          <Link to="/kanban">
            <Button
              data-testid="go-to-kanban-btn"
              className="my-2 w-full rounded-lg bg-amber-300 font-bold text-black hover:bg-amber-400"
            >
              Go to Kanban
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePageTile;
