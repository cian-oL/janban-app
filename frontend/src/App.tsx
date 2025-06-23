import AppRouter from "./router";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
};

export default App;
