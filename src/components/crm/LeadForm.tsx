
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { LeadDocumentData, StageId, LeadSource } from '@/types/crm';
import { STAGE_IDS, LEAD_SOURCES } from '@/types/crm'; // Import defined arrays

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
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Timestamp } from "firebase/firestore"; // Will be handled in the actual save function

// Adjust Zod schema to match LeadDocumentData, making some fields optional for creation
const leadFormSchema = z.object({
  name: z.string().min(2, "Nome/Razão Social é obrigatório."),
  company: z.string().optional(),
  value: z.preprocess(
    (val) => parseFloat(String(val).replace(",", ".")),
    z.number().positive("Valor deve ser positivo.")
  ),
  kwh: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().int().positive("KWh deve ser um inteiro positivo.")
  ),
  stageId: z.enum(STAGE_IDS, { required_error: "Estágio é obrigatório." }),
  sellerName: z.string().min(1, "Nome do vendedor é obrigatório."), // Assuming current user's name or email
  leadSource: z.enum(LEAD_SOURCES).optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido.").optional(),
  correctionReason: z.string().optional(),
  naturality: z.string().optional(),
  maritalStatus: z.string().optional(),
  profession: z.string().optional(),
  // photoDocumentFile: typeof window === 'undefined' ? z.any().optional() : z.instanceof(FileList).optional(),
  // billDocumentFile: typeof window === 'undefined' ? z.any().optional() : z.instanceof(FileList).optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  onSubmit: (data: LeadFormData, photoFile?: File, billFile?: File) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<LeadDocumentData & { id?: string }>; // For editing
  isSubmitting?: boolean;
}

export function LeadForm({ onSubmit, onCancel, initialData, isSubmitting }: LeadFormProps) {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      company: initialData?.company || "",
      value: initialData?.value || 0,
      kwh: initialData?.kwh || 0,
      stageId: initialData?.stageId || 'contato',
      sellerName: initialData?.sellerName || "Vendedor Atual", // Placeholder
      leadSource: initialData?.leadSource || undefined,
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      correctionReason: initialData?.correctionReason || "",
      naturality: initialData?.naturality || "",
      maritalStatus: initialData?.maritalStatus || "",
      profession: initialData?.profession || "",
    },
  });

  const photoFileRef = form.register("photoDocumentFile");
  const billFileRef = form.register("billDocumentFile");


  const handleSubmit = async (values: LeadFormData) => {
    // const photoFile = values.photoDocumentFile?.[0];
    // const billFile = values.billDocumentFile?.[0];
    // await onSubmit(values, photoFile, billFile);
    await onSubmit(values); // Simplified for now
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome / Razão Social *</FormLabel>
                  <FormControl><Input placeholder="Ex: João Silva ou Empresa XYZ" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa (Opcional)</FormLabel>
                  <FormControl><Input placeholder="Ex: Consultoria ABC" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Valor Estimado (R$) *</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="Ex: 1500.50" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="kwh"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Consumo Médio (KWh) *</FormLabel>
                    <FormControl><Input type="number" placeholder="Ex: 350" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="stageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estágio *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione o estágio" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {STAGE_IDS.map(stage => <SelectItem key={stage} value={stage}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendedor Responsável *</FormLabel>
                  <FormControl><Input placeholder="Email ou nome do vendedor" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="leadSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonte do Lead</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione a fonte" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {LEAD_SOURCES.map(source => <SelectItem key={source} value={source}>{source}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl><Input placeholder="Ex: (XX) XXXXX-XXXX" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="Ex: contato@empresa.com" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="naturality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naturalidade</FormLabel>
                  <FormControl><Input placeholder="Ex: Brasileiro(a), São Paulo-SP" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Estado Civil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        <SelectItem value="uniao_estavel">União Estável</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Profissão</FormLabel>
                    <FormControl><Input placeholder="Ex: Engenheiro(a)" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormItem>
                <FormLabel>Documento de Identidade (Foto/PDF)</FormLabel>
                <FormControl><Input type="file" {...photoFileRef} /></FormControl>
                <FormDescription>Anexe uma foto ou PDF do documento do cliente.</FormDescription>
                <FormMessage />
            </FormItem>

            <FormItem>
                <FormLabel>Fatura de Energia (PDF/Imagem)</FormLabel>
                <FormControl><Input type="file" {...billFileRef} /></FormControl>
                <FormDescription>Anexe a última fatura de energia do cliente.</FormDescription>
                <FormMessage />
            </FormItem>

            {initialData?.id && ( // Only show for existing leads being edited
                <FormField
                control={form.control}
                name="correctionReason"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Motivo da Correção (se aplicável)</FormLabel>
                    <FormControl><Textarea placeholder="Admin solicitou correção por..." {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (initialData?.id ? "Salvar Alterações" : "Criar Lead")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
