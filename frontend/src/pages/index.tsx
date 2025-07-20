import Run from "@/components/workflow/run/Run";
import { Sidebar } from "@/ui/Sidebar/Sidebar";

// TODO: get user
export default function IndexPage() {
  return (
    <div className="flex h-screen flex-row">
      <Sidebar />
      <Run />
    </div>
  );
}
