import { Link } from "react-router-dom";

import constructionCrane from "@/assets/construction-crane.svg";
import { Button } from "@/components/ui/button";

const UnderConstructionPage = () => {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-xl bg-indigo-100 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-4 text-center text-4xl font-bold text-orange-400">
          Under Construction
        </h1>
        <div className="my-8 flex items-center justify-center overflow-hidden rounded-lg">
          <img src={constructionCrane} width={500} alt="Construction Crane" />
        </div>

        <div className="text-center">
          <Link to="/">
            <Button className="bg-amber-300 font-bold text-black hover:bg-white">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
