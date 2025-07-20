import { Workflow } from "@/components/workflow/create/Workflow";
import { Sidebar } from "@/components/Sidebar/Sidebar";

// TODO: menu responsive
export default function WorkflowPage() {
  return (
    <div className="flex h-screen flex-row">
      <Sidebar />
      <Workflow />
    </div>
  );
}
