
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  clienteNome: z.string().min(1, "Nome do cliente é obrigatório."),
  clienteCnpjCpf: z.string().optional(),
  codigoClienteInstalacao: z.string().optional().describe("Unidade Consumidora (UC)"),
  item1Quantidade: z.string().min(1, "Consumo KWh é obrigatório.").refine(val => !isNaN(parseFloat(val.replace('.', '').replace(',', '.'))), { message: "Consumo KWh deve ser um número válido." }),
  ligacao: z.enum(['MONOFASICO', 'BIFASICO', 'TRIFASICO', 'NAO_INFORMADO', '']).optional().describe("Tipo de Fornecimento"),
  classificacao: z.string().optional().describe("Classe de Consumo"),
  
  clienteCep: z.string().optional().refine(val => val === "" || /^\d{5}-?\d{3}$/.test(val) || /^\d{8}$/.test(val), { message: "CEP inválido. Use XXXXX-XXX ou XXXXXXXX." }),
  clienteRua: z.string().optional(),
  clienteNumero: z.string().optional(),
  clienteComplemento: z.string().optional(),
  clienteBairro: z.string().optional(),
  clienteCidade: z.string().optional(),
  clienteUF: z.string().optional(),

  item3Valor: z.string().optional().refine(val => val === "" || !isNaN(parseFloat(val.replace('.', '').replace(',', '.'))), { message: "CIP/COSIP deve ser um número válido ou vazio." }),
  valorProducaoPropria: z.string().optional().refine(val => val === "" || !isNaN(parseFloat(val.replace('.', '').replace(',', '.'))), { message: "Valor da produção própria deve ser um número válido ou vazio." }),
  isencaoIcmsEnergiaGerada: z.enum(['sim', 'nao']).default('nao').describe("Há isenção de ICMS na Energia Gerada?"),
  comFidelidade: z.boolean().default(true).describe("A proposta inclui fidelidade?"),
});

type ProposalFormData = z.infer<typeof formSchema>;

export default function ProposalGeneratorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const initialKwhFromUrl = searchParams.get('item1Quantidade');
  const initialUfFromUrl = searchParams.get('clienteUF');

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteNome: "",
      clienteCnpjCpf: "",
      codigoClienteInstalacao: "",
      item1Quantidade: initialKwhFromUrl || "1500",
      ligacao: "TRIFASICO",
      classificacao: "RESIDENCIAL-CONVENCIONAL BAIXA TENSAO B1",
      clienteCep: "",
      clienteRua: "",
      clienteNumero: "",
      clienteComplemento: "",
      clienteBairro: "",
      clienteCidade: "",
      clienteUF: initialUfFromUrl || "",
      item3Valor: "13,75", 
      valorProducaoPropria: "0",
      isencaoIcmsEnergiaGerada: "nao",
      comFidelidade: true, 
    },
  });

  const cepValue = form.watch("clienteCep");

  useEffect(() => {
    // Reset form with new defaults if URL params change and are valid
    const kwhFromUrl = searchParams.get('item1Quantidade');
    const ufFromUrl = searchParams.get('clienteUF');

    if (kwhFromUrl && form.getValues("item1Quantidade") !== kwhFromUrl) {
      form.setValue("item1Quantidade", kwhFromUrl);
    }
    if (ufFromUrl && form.getValues("clienteUF") !== ufFromUrl) {
      form.setValue("clienteUF", ufFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, form.setValue]);


  useEffect(() => {
    const fetchAddress = async (cep: string) => {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) {
          throw new Error('Erro ao buscar CEP');
        }
        const data = await response.json();
        if (data.erro) {
          toast({
            title: "CEP não encontrado",
            description: "Por favor, verifique o CEP digitado.",
            variant: "destructive",
          });
          form.setValue("clienteRua", "");
          form.setValue("clienteBairro", "");
          form.setValue("clienteCidade", "");
          form.setValue("clienteUF", searchParams.get('clienteUF') || ""); // Keep UF from URL if CEP fails
        } else {
          form.setValue("clienteRua", data.logradouro || "");
          form.setValue("clienteBairro", data.bairro || "");
          form.setValue("clienteCidade", data.localidade || "");
          form.setValue("clienteUF", data.uf || ""); // Overwrite UF with VIA CEP result
          toast({
            title: "Endereço preenchido",
            description: "Os campos de endereço foram atualizados.",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast({
          title: "Erro na busca de CEP",
          description: "Não foi possível buscar o endereço. Tente novamente.",
          variant: "destructive",
        });
      }
    };

    if (cepValue) {
      const cleanedCep = cepValue.replace(/\D/g, ''); 
      if (cleanedCep.length === 8) {
        fetchAddress(cleanedCep);
      } else {
        if (form.getValues("clienteRua") || form.getValues("clienteBairro") || form.getValues("clienteCidade") || form.getValues("clienteUF") !== (searchParams.get('clienteUF') || "")) {
            if (cleanedCep.length === 0 || cleanedCep.length < 8 && !/^\d{0,7}$/.test(cleanedCep)) { 
                form.setValue("clienteRua", "");
                form.setValue("clienteBairro", "");
                form.setValue("clienteCidade", "");
                form.setValue("clienteUF", searchParams.get('clienteUF') || ""); // Reset UF to URL param or empty
            }
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepValue, form.setValue, toast, searchParams]);


  function onSubmit(values: ProposalFormData) {
    const queryParams = new URLSearchParams();
    (Object.keys(values) as Array<keyof ProposalFormData>).forEach((key) => {
      const value = values[key];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        if (typeof value === 'boolean') {
          queryParams.set(key, String(value));
        } else {
          queryParams.set(key, String(value));
        }
      }
    });
    // Explicitly add comFidelidade from form state
    queryParams.set("comFidelidade", String(form.getValues("comFidelidade")));

    router.push(`/?${queryParams.toString()}`);
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-background p-4 md:p-8 font-body">
      <Card className="w-full max-w-2xl shadow-xl bg-card/70 backdrop-blur-lg border">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline text-primary font-bold tracking-tight">
            Gerador de Proposta de Fatura
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Preencha os dados abaixo para personalizar a simulação da fatura. Os campos da fatura serão calculados automaticamente.
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
                      <Input placeholder="Ex: Mercado Mix LTDA" {...field} />
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
                      <Input placeholder="Ex: 123.456.789-00 ou XX.XXX.XXX/XXXX-XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="clienteCep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 78890-000 ou 78890000" {...field} />
                    </FormControl>
                    <FormDescription>Digite o CEP para buscar o endereço automaticamente.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clienteRua"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rua Caminho do Sol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clienteNumero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clienteComplemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: QD18 LT11, APTO 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="clienteBairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rota do Sol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clienteCidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sorriso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clienteUF"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: MT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                    <FormDescription>Este valor preencherá o "Consumo em kWh" e baseará outros cálculos.</FormDescription>
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
                        <SelectItem value="NAO_INFORMADO">Não especificado</SelectItem>
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
                    <FormDescription>Ex: RESIDENCIAL, COMERCIAL, INDUSTRIAL, etc.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="isencaoIcmsEnergiaGerada"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Há isenção de ICMS na Energia Gerada?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="sim" />
                          </FormControl>
                          <FormLabel className="font-normal">Sim</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="nao" />
                          </FormControl>
                          <FormLabel className="font-normal">Não</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Isto afeta a tarifa exibida para a "Energia Ativa Injetada" na fatura.
                    </FormDescription>
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
                      <Input type="text" placeholder="Ex: 13,75" {...field} />
                    </FormControl>
                    <FormDescription>Valor manual da CIP/COSIP.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valorProducaoPropria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Energia Ativa Injetada (R$)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ex: 146,60" {...field} />
                    </FormControl>
                    <FormDescription>Valor em R$ da energia injetada (produção própria).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comFidelidade"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50">
                    <div className="space-y-0.5">
                      <FormLabel>Incluir Fidelidade na Proposta?</FormLabel>
                      <FormDescription>
                        Afeta as regras de desconto aplicadas na simulação.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
