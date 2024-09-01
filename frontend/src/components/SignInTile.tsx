import { Link } from "react-router-dom";

import janbanImage from "../assets/janban-main.png";
import { Button } from "./ui/button";

const SignInTile = () => {
  return (
    <div className="w-full p-10 mx-auto my-5 rounded-lg flex flex-col gap-5 items-center justify-evenly border border-amber-300 bg-indigo-100 md:max-w-[80%] lg:flex-row">
      <img src={janbanImage} className="py-5 lg:w-[60%]" />
      <section className="w-fit">
        <div className="mb-10">
          <h1 className="text-3xl font-bold underline">Janban</h1>
          <h2 className="mt-2 text-xl font-bold italic">
            A Simple Jira Platform for Scrum & Kanban
          </h2>
          <p className="mt-2 text-lg">Welcome! Please sign in or register:</p>
          <div className="mt-10 flex flex-col">
            <Link to="/sign-in">
              <Button className="my-2 w-full rounded-lg bg-amber-300 text-black font-bold hover:bg-amber-400">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="my-2 w-full rounded-lg bg-amber-300 text-black font-bold hover:bg-amber-400">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignInTile;
