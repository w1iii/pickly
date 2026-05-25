import MainHeader from "@/components/main-header";
import "./layout.css";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      <MainHeader />
      <main className="main-content">{children}</main>
    </div>
  );
}
