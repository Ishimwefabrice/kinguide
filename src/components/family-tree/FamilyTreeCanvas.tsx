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
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useWorkspace } from "@/store/workspace";
import { conditionLabel } from "@/data/conditions";
import { PersonNode, type PersonNodeData } from "./PersonNode";

const nodeTypes = { person: PersonNode };

function generationOf(role: string): PersonNodeData["generation"] {
  if (role.includes("grand")) return "ancestors";
  if (role === "mother" || role === "father" || role.includes("aunt") || role.includes("uncle"))
    return "parents";
  if (role === "self" || role === "sister" || role === "brother" || role === "spouse") return "self";
  if (role === "daughter" || role === "son") return "children";
  return "other";
}

function layoutY(role: string): number {
  const gen = generationOf(role);
  if (gen === "ancestors") return 0;
  if (gen === "parents") return 180;
  if (gen === "self") return 360;
  if (gen === "children") return 540;
  return 360;
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
      const data: PersonNodeData = {
        name: `${p.firstName} ${p.lastName}`.trim(),
        relation: p.relationHint.replaceAll("_", " "),
        age: p.approximateAge,
        conditions,
        generation: generationOf(p.relationHint),
      };
      return {
        id: p.id,
        type: "person",
        position: { x: 60 + count * 230, y: layoutY(p.relationHint) },
        data,
      };
    });

    const edges: Edge[] = relationships.map((r) => ({
      id: r.id,
      source: r.fromPersonId,
      target: r.toPersonId,
      label: r.type === "parent_of" ? "parent" : "spouse",
      type: "smoothstep",
      animated: r.type === "spouse_of",
      style: {
        stroke: r.type === "spouse_of" ? "#F2C94C" : "#0B6B53",
        strokeWidth: 1.6,
      },
      labelStyle: { fill: "#718096", fontSize: 10, fontWeight: 600 },
    }));

    return { nodes, edges };
  }, [persons, relationships, history]);

  if (persons.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Your tree is empty"
        description="Add family members to see generations laid out visually."
      />
    );
  }

  return (
    <div className="surface h-[560px] overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-kg-border px-4 py-3 text-xs text-kg-muted">
        <span className="font-semibold text-kg-ink">Generations</span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-kg-navy" /> Ancestors
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-kg-green" /> Parents / aunts · uncles
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-kg-gold" /> You / siblings
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#3d7ea6]" /> Children
        </span>
      </div>
      <div className="h-[calc(560px-49px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.4}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} color="#E2EAE7" />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor="#0B6B53"
            maskColor="rgba(246,249,248,0.75)"
            style={{ borderRadius: 12, border: "1px solid #E2EAE7" }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
