import { Link } from "react-router-dom";

import boatImage from "@/assets/404_boat.svg";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-xl bg-indigo-100 p-8 shadow-xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="mb-2 text-6xl font-bold text-orange-400">
            404 - Not Found
          </h1>
        </div>
        <div className="my-8 overflow-hidden rounded-lg">
          <div className="my-8 flex items-center justify-center overflow-hidden rounded-lg">
            <img src={boatImage} width={400} alt="Sailboat" />
          </div>
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

export default NotFoundPage;
