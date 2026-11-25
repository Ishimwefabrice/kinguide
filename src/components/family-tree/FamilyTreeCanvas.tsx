import { useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkspace } from "@/store/workspace";
import { conditionLabel } from "@/data/conditions";

function layoutY(role: string): number {
  if (role.includes("grand")) return 0;
  if (role === "mother" || role === "father" || role.includes("aunt") || role.includes("uncle"))
    return 160;
  if (role === "self" || role === "sister" || role === "brother" || role === "spouse") return 320;
  if (role === "daughter" || role === "son") return 480;
  return 320;
}

export function FamilyTreeCanvas() {
  const { persons, relationships, history } = useWorkspace();

  const { nodes, edges } = useMemo(() => {
    const byRole = new Map<string, number>();
    const nodes: Node[] = persons.map((p) => {
      const count = byRole.get(p.relationHint) ?? 0;
      byRole.set(p.relationHint, count + 1);
      const conditions = history
        .filter((h) => h.personId === p.id)
        .map((h) => conditionLabel(h.conditionId))
        .slice(0, 2);
      return {
        id: p.id,
        position: { x: 80 + count * 220, y: layoutY(p.relationHint) },
        data: {
          label: (
            <div className="min-w-[140px] text-left">
              <div className="font-semibold text-navy-900">
                {p.firstName} {p.lastName}
              </div>
              <div className="text-xs text-slate-500">{p.relationHint.replaceAll("_", " ")}</div>
              {p.approximateAge != null ? (
                <div className="text-xs text-slate-500">Age ~{p.approximateAge}</div>
              ) : null}
              {conditions.length ? (
                <div className="mt-1 text-[11px] text-teal-700">{conditions.join(" · ")}</div>
              ) : null}
            </div>
          ),
        },
        style: {
          border: "1px solid #cbd5e1",
          borderRadius: 4,
          padding: 10,
          background: "#fff",
          fontSize: 12,
        },
      };
    });

    const edges: Edge[] = relationships.map((r) => ({
      id: r.id,
      source: r.fromPersonId,
      target: r.toPersonId,
      label: r.type === "parent_of" ? "parent" : "spouse",
      type: "smoothstep",
      animated: r.type === "spouse_of",
    }));

    return { nodes, edges };
  }, [persons, relationships, history]);

  if (persons.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center border border-dashed border-slate-300 bg-white text-slate-500">
        Add family members to see the tree.
      </div>
    );
  }

  return (
    <div className="h-[520px] border border-slate-200 bg-white">
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background gap={18} size={1} />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}
