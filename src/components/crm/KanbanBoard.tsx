
"use client";

import type { LeadWithId, Stage } from '@/types/crm';
import { STAGES_CONFIG } from '@/config/crm-stages';
import { LeadCard } from './LeadCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface KanbanBoardProps {
  leads: LeadWithId[];
  onViewLeadDetails: (lead: LeadWithId) => void;
}

export function KanbanBoard({ leads, onViewLeadDetails }: KanbanBoardProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md ">
      <div className="flex w-max space-x-4 p-4">
        {STAGES_CONFIG.map((stage: Stage) => (
          <div key={stage.id} className="flex-shrink-0 w-[300px]">
            <div className={`p-2 rounded-t-lg text-white font-semibold text-sm ${stage.colorClass}`}>
              {stage.title.toUpperCase()} ({leads.filter(l => l.stageId === stage.id).length})
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-t-0 rounded-b-lg p-2 h-[calc(100vh-220px)] overflow-y-auto">
              {leads
                .filter(lead => lead.stageId === stage.id)
                .sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()) // Sort by lastContact descending
                .map(lead => (
                  <LeadCard key={lead.id} lead={lead} onViewDetails={onViewLeadDetails} />
                ))}
              {leads.filter(lead => lead.stageId === stage.id).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum lead neste estágio.</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
