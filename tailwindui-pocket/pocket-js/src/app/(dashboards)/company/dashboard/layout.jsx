import { Searchbar } from "@/components/Searchbar";
import { SidebarCompany } from "@/components/dashboardcompany/SidebarCompany";

function Layout({ children }) {
  return (
    <>
    <div>
      <Searchbar />
      <SidebarCompany />
      <main className="py-10 lg:pl-72">
        {children}
      </main>
    </div>
    </>
  );
}

export default Layout;
