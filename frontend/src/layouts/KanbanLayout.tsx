import Footer from "../components/Footer";
import Header from "../components/Header";

type Props = {
  children: React.ReactNode;
};

const KanbanLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="mx-0 py-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default KanbanLayout;
