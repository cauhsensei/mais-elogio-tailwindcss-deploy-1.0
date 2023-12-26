import { SideBarUser } from "@/components/dashboarduser/SideBarUser";

function Layout({ children }) {
  return (
    <div>
      <SideBarUser />
      <main className="py-10 lg:pl-72">
        {children}
      </main>
    </div>
  );
}

export default Layout;
