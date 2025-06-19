
// /src/components/StateInfoCard.tsx
"use client";

import type { StateInfo } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StateInfoCardProps {
  state: StateInfo | null;
}

export function StateInfoCard({ state }: StateInfoCardProps) {
  if (!state) {
    return (
      <Card className="w-full max-w-md shadow-lg bg-card/70 backdrop-blur-lg border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary">Selecione um Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Clique em um estado no mapa para ver os detalhes e simular sua economia.</p>
        </CardContent>
      </Card>
    );
  }

  const IconComponent = state.icon;

  return (
    <Card className="w-full max-w-md shadow-lg animate-in fade-in-50 bg-card/70 backdrop-blur-lg border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            {IconComponent && <IconComponent className="mr-3 h-7 w-7 text-primary" />}
            {state.name} ({state.abbreviation})
          </CardTitle>
          {state.available ? (
            <Badge variant="default" className="bg-green-500 text-white">Disponível</Badge>
          ) : (
            <Badge variant="destructive">Indisponível</Badge>
          )}
        </div>
        <CardDescription>Capital: {state.capital}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong className="text-foreground/80">População:</strong> {state.population}</p>
        <p><strong className="text-foreground/80">Área:</strong> {state.area}</p>
        <p><strong className="text-foreground/80">Curiosidade:</strong> {state.funFact}</p>
      </CardContent>
    </Card>
  );
}

