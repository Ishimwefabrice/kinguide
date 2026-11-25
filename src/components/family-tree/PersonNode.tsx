import { Handle, Position, type NodeProps } from "@xyflow/react";

export type PersonNodeData = {
  name: string;
  relation: string;
  age: number | null;
  conditions: string[];
  generation: "ancestors" | "parents" | "self" | "children" | "other";
};

const GEN_ACCENT: Record<PersonNodeData["generation"], string> = {
  ancestors: "border-l-kg-navy",
  parents: "border-l-kg-green",
  self: "border-l-kg-gold",
  children: "border-l-[#3d7ea6]",
  other: "border-l-kg-muted",
};

export function PersonNode({ data }: NodeProps) {
  const d = data as PersonNodeData;
  return (
    <div
      className={`min-w-[168px] rounded-2xl border border-kg-border bg-white px-3.5 py-3 shadow-[var(--shadow-soft)] border-l-4 ${GEN_ACCENT[d.generation]}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-kg-green !h-2 !w-2 !border-0" />
      <div className="font-display text-sm font-semibold text-kg-ink">{d.name}</div>
      <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-kg-muted">
        {d.relation}
      </div>
      {d.age != null ? <div className="mt-1 text-xs text-kg-muted">Age ~{d.age}</div> : null}
      {d.conditions.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {d.conditions.map((c) => (
            <span
              key={c}
              className="rounded-full bg-kg-mint px-2 py-0.5 text-[10px] font-semibold text-kg-forest"
            >
              {c}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-2 text-[10px] text-kg-muted">No conditions recorded</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-kg-navy !h-2 !w-2 !border-0" />
    </div>
  );
}
