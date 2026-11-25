import { Link } from "react-router-dom";
import { FamilyTreeCanvas } from "@/components/family-tree/FamilyTreeCanvas";
import { PageHeader } from "@/components/ui/PageHeader";

export function TreePage() {
  return (
    <div className="page-enter space-y-4">
      <PageHeader
        title="Family tree"
        subtitle="Interactive view of saved people and relationships. Zoom, pan, and follow generations by colour."
        actions={
          <Link className="btn-secondary" to="/members">
            Edit members
          </Link>
        }
      />
      <FamilyTreeCanvas />
    </div>
  );
}
