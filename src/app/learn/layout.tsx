import { AppSidebar } from "@/components/layout/AppSidebar";

export default function LearnLayout({ children }: LayoutProps<"/learn">) {
  return (
    <div className="flex flex-col lg:flex-row">
      <AppSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
