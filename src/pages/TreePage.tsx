import { FamilyTreeCanvas } from "@/components/family-tree/FamilyTreeCanvas";
import { Link } from "react-router-dom";

export function TreePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl text-navy-950">Family tree</h1>
        <p className="mt-1 text-slate-600">
          Interactive view of saved people and relationships. Zoom and pan. Edit people in{" "}
          <Link className="text-teal-700 underline" to="/members">
            Family Members
          </Link>
          .
        </p>
      </div>
      <FamilyTreeCanvas />
    </div>
  );
}
