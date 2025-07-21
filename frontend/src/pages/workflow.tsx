import { Workflow } from "@/components/workflow/create/Workflow";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default function WorkflowPage() {
  return (
    <div className="flex h-screen flex-row">
      <Sidebar />
      <Workflow />
    </div>
  );
}
