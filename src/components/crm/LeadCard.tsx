
"use client";

import type { LeadWithId } from '@/types/crm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Zap, User, CalendarDays, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface LeadCardProps {
  lead: LeadWithId;
  onViewDetails: (lead: LeadWithId) => void;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function LeadCard({ lead, onViewDetails }: LeadCardProps) {
  return (
    <Card className="mb-4 bg-card/70 backdrop-blur-lg border shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-primary truncate" title={lead.name}>
            {lead.name}
          </CardTitle>
          {/* Placeholder for a stage badge or similar */}
        </div>
        {lead.company && <CardDescription className="text-xs text-muted-foreground truncate">{lead.company}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <DollarSign className="w-4 h-4 mr-2 text-amber-500" />
          <span>Valor: {formatCurrency(lead.value)}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Zap className="w-4 h-4 mr-2 text-sky-500" />
          <span>Consumo: {lead.kwh} kWh</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <User className="w-4 h-4 mr-2 text-green-500" />
          <span className="truncate">Vendedor: {lead.sellerName}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-2 text-purple-500" />
          <span>Último Contato: {format(parseISO(lead.lastContact), "dd/MM/yy HH:mm", { locale: ptBR })}</span>
        </div>
        {lead.leadSource && (
          <div className="pt-1">
            <Badge variant="secondary" className="text-xs">{lead.leadSource}</Badge>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={() => onViewDetails(lead)}>
          <ExternalLink className="w-3 h-3 mr-2" />
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
