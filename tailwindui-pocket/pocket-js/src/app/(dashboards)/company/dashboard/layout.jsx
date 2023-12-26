import { SidebarCompany } from "@/components/dashboardcompany/SidebarCompany";

function Layout({ children }) {
  return (
    <div>
      <SidebarCompany />
      <main className="py-10 lg:pl-72">
        {children}
      </main>
    </div>
  );
}

export default Layout;
