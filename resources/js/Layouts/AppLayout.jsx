import NavBar from "@/Components/NavBar";
import Footer from "@/Components/Footer";

const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar></NavBar>
            <div className="mt-6 w-full">{children}</div>
            <Footer></Footer>
        </div>
    );
};

export default AppLayout;
