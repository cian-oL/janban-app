import { Link } from "react-router-dom";

import janbanImage from "../assets/janban-main.png";
import { Button } from "./ui/button";

const HomePageTile = () => {
  return (
    <div className="w-full p-10 mx-auto my-5 rounded-lg flex flex-col gap-5 items-center justify-evenly bg-indigo-100 md:max-w-[80%] lg:flex-row">
      <img src={janbanImage} className="py-5 lg:w-[60%]" />
      <section className="w-fit">
        <div className="mb-10">
          <h1 className="text-3xl font-bold underline">Janban</h1>
          <h2 className="mt-2 text-xl font-bold italic">
            Welcome to the Jira Analogue Platform
          </h2>
          <p className="mt-2 text-lg">Get Started on your Tasks!</p>
          <Link to="/kanban">
            <Button className="my-2 w-full rounded-lg bg-amber-300 text-black font-bold hover:bg-amber-400">
              Go to Kanban
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePageTile;
