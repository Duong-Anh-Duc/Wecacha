"use client";

import {useState} from "react";
import {ChevronRight} from "lucide-react";
import {cn} from "@/lib/utils";

type LeafNode = {key: string; label: string; color: string; clicks: number; submits: number};
type FamilyNode = LeafNode & {leaves: LeafNode[]};
type GroupNode = LeafNode & {families: FamilyNode[]};

function CountCells({submits}: {submits: number}) {
  return (
    <td className="px-5 py-2.5 text-right tabular-nums">
      {submits > 0 ? (
        <span className="font-bold text-[#17351f]">{submits}</span>
      ) : (
        <span className="text-stone-300">0</span>
      )}
    </td>
  );
}

export function FlavorStatsTree({groups, isVi}: {groups: GroupNode[]; isVi: boolean}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [openFamilies, setOpenFamilies] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) =>
    setOpenGroups((cur) => ({...cur, [key]: !cur[key]}));
  const toggleFamily = (key: string) =>
    setOpenFamilies((cur) => ({...cur, [key]: !cur[key]}));

  return (
    <div className="overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-forest-950/10 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
            <th className="px-5 py-3 font-bold">{isVi ? "Hương vị" : "Flavor"}</th>
            <th className="px-5 py-3 font-bold text-right">{isVi ? "Lượt chọn" : "Selections"}</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const groupOpen = openGroups[group.key];
            return (
              <FragmentRows key={group.key}>
                <tr
                  className="cursor-pointer border-t-2 border-forest-950/10 bg-stone-50/40 transition hover:bg-stone-100/60"
                  onClick={() => toggleGroup(group.key)}
                >
                  <td className="px-5 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <ChevronRight
                        className={cn("h-4 w-4 shrink-0 text-stone-400 transition-transform", groupOpen && "rotate-90")}
                      />
                      <span className="inline-block h-3 w-3 rounded-full" style={{backgroundColor: group.color}} />
                      <span className="font-black text-forest-950">{group.label}</span>
                      <span className="text-xs font-semibold text-stone-400">({group.families.length})</span>
                    </span>
                  </td>
                  <CountCells submits={group.submits} />
                </tr>

                {groupOpen &&
                  group.families.map((family) => {
                    const familyOpen = openFamilies[family.key];
                    const hasLeaves = family.leaves.length > 0;
                    return (
                      <FragmentRows key={family.key}>
                        <tr
                          className={cn(
                            "border-t border-forest-950/5 transition",
                            hasLeaves ? "cursor-pointer hover:bg-stone-50" : ""
                          )}
                          onClick={() => hasLeaves && toggleFamily(family.key)}
                        >
                          <td className="px-5 py-2.5">
                            <span className="inline-flex items-center gap-2" style={{paddingLeft: 22}}>
                              {hasLeaves ? (
                                <ChevronRight
                                  className={cn("h-3.5 w-3.5 shrink-0 text-stone-400 transition-transform", familyOpen && "rotate-90")}
                                />
                              ) : (
                                <span className="inline-block w-3.5" />
                              )}
                              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{backgroundColor: family.color}} />
                              <span className="font-bold text-forest-950/85">{family.label}</span>
                              {hasLeaves && (
                                <span className="text-xs font-semibold text-stone-400">({family.leaves.length})</span>
                              )}
                            </span>
                          </td>
                          <CountCells submits={family.submits} />
                        </tr>

                        {familyOpen &&
                          family.leaves.map((leaf) => (
                            <tr key={leaf.key} className="border-t border-forest-950/5 bg-stone-50/20">
                              <td className="px-5 py-2">
                                <span className="inline-flex items-center gap-2" style={{paddingLeft: 66}}>
                                  <span className="inline-block h-2 w-2 rounded-full" style={{backgroundColor: leaf.color}} />
                                  <span className="font-medium text-forest-950/65">{leaf.label}</span>
                                </span>
                              </td>
                              <CountCells submits={leaf.submits} />
                            </tr>
                          ))}
                      </FragmentRows>
                    );
                  })}
              </FragmentRows>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Lightweight fragment that can take a key (React.Fragment with key).
function FragmentRows({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}
