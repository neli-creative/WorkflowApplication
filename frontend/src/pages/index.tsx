import Run from "@/components/workflow/run/Run";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default function IndexPage() {
  return (
    <div className="flex h-screen flex-row">
      <Sidebar />
      <Run />
    </div>
  );
}
