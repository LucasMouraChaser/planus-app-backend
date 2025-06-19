
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  clienteNome: z.string().min(1, "Nome do cliente é obrigatório."),
  clienteCnpjCpf: z.string().optional(),
  codigoClienteInstalacao: z.string().optional().describe("Unidade Consumidora (UC)"),
  item1Quantidade: z.string().optional().describe("Consumo Médio Mensal (KWh)"), // Matches 'Consumo em kWh'
  ligacao: z.enum(['MONOFASICO', 'BIFASICO', 'TRIFASICO', '']).optional().describe("Tipo de Fornecimento"),
  classificacao: z.string().optional().describe("Classe de Consumo"),
  clienteCidadeUF: z.string().optional().describe("Cidade (e UF)"),
  item3Valor: z.string().optional().describe("Contrib. Iluminação Pública (R$)"), // Matches 'Contrib de Ilum Pub'
});

type ProposalFormData = z.infer<typeof formSchema>;

export default function ProposalGeneratorPage() {
  const router = useRouter();
  const form = useForm<ProposalFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteNome: "",
      clienteCnpjCpf: "",
      codigoClienteInstalacao: "",
      item1Quantidade: "",
      ligacao: "",
      classificacao: "",
      clienteCidadeUF: "",
      item3Valor: "",
    },
  });

  function onSubmit(values: ProposalFormData) {
    const queryParams = new URLSearchParams();
    (Object.keys(values) as Array<keyof ProposalFormData>).forEach((key) => {
      if (values[key]) {
        queryParams.set(key, String(values[key]));
      }
    });
    router.push(`/?${queryParams.toString()}`);
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-background p-4 md:p-8 font-body">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline text-primary font-bold tracking-tight">
            Gerador de Proposta
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Preencha os dados abaixo para personalizar a simulação da fatura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="clienteNome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente / Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clienteCnpjCpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123.456.789-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codigoClienteInstalacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade Consumidora (UC)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 6555432" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item1Quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consumo Médio Mensal (KWh)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ex: 1500" {...field} />
                    </FormControl>
                    <FormDescription>Este valor preencherá o campo "Consumo em kWh" na fatura.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ligacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Fornecimento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MONOFASICO">Monofásico</SelectItem>
                        <SelectItem value="BIFASICO">Bifásico</SelectItem>
                        <SelectItem value="TRIFASICO">Trifásico</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classificacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe de Consumo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: RESIDENCIAL-CONVENCIONAL BAIXA TENSAO B1" {...field} />
                    </FormControl>
                    <FormDescription>Ex: RESIDENCIAL, COMERCIAL, INDUSTRIAL, RURAL, etc.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clienteCidadeUF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade / UF</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cuiabá/MT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item3Valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribuição de Iluminação Pública (R$)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ex: 25,50" {...field} />
                    </FormControl>
                    <FormDescription>Valor manual da CIP/COSIP.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Gerar Simulação na Fatura
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
