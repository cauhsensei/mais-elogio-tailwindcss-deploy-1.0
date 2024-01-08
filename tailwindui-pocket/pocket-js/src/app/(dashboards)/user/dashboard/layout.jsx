import { Searchbar } from "@/components/Searchbar";
import { SideBarUser } from "@/components/dashboarduser/SideBarUser";

function Layout({ children }) {
  return (
    <div>
      <Searchbar />
      <SideBarUser />
      <main className="py-10 lg:pl-72">
        {children}
      </main>
    </div>
  );
}

export default Layout;
