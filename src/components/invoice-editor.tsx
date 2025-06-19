
"use client";

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import EditableField from './editable-field';
import { useToast } from '@/hooks/use-toast';
import type { InvoiceData } from '@/types/invoice';
import { ENERGISA_INVOICE_FIELDS_CONFIG, PLANUS_INVOICE_FIELDS_CONFIG } from '@/config/invoice-fields';

interface InvoiceEditorProps {
  invoiceData: InvoiceData | null;
  onInvoiceDataChange?: (newData: InvoiceData) => void;
  isEditable?: boolean;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ invoiceData, onInvoiceDataChange, isEditable = true }) => {
  const fieldRefs = useRef<Record<string, SVGForeignObjectElement | null>>({});
  const [overlappingFields, setOverlappingFields] = useState<Set<string>>(new Set());
  const [overlapWarningMsg, setOverlapWarningMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const [currentInvoiceData, setCurrentInvoiceData] = useState<InvoiceData | null>(invoiceData);

  useEffect(() => {
    setCurrentInvoiceData(invoiceData);
  }, [invoiceData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isEditable || !currentInvoiceData) return;
    const { name, value } = e.target;
    const updatedData = { ...currentInvoiceData, [name]: value };
    setCurrentInvoiceData(updatedData);
    if (onInvoiceDataChange) {
      onInvoiceDataChange(updatedData);
    }
  };

  const checkForOverlaps = useCallback(() => {
    const newOverlaps = new Set<string>();
    const elements = Object.entries(fieldRefs.current).filter(([, el]) => el !== null);
    let overlapDetected = false;

    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const [name1, el1] = elements[i];
        const [name2, el2] = elements[j];
        if (el1 && el2) {
          const rect1 = el1.getBoundingClientRect();
          const rect2 = el2.getBoundingClientRect();
          
          const isOverlapping = !(
            rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom
          );

          if (isOverlapping) {
            newOverlaps.add(name1);
            newOverlaps.add(name2);
            overlapDetected = true;
          }
        }
      }
    }
    setOverlappingFields(newOverlaps);
    if (overlapDetected) {
      const warningText = `Campos sobrepostos: ${Array.from(newOverlaps).join(', ')}. Verifique os campos destacados na fatura Energisa.`;
      setOverlapWarningMsg(warningText);
      // Only show toast for Energisa (original) invoice overlaps as Planus is non-editable and layout is fixed.
      if (!currentInvoiceData?.companyName?.toLowerCase().includes("planus")) {
        toast({
          title: 'Aviso de Sobreposição',
          description: 'Alguns campos estão sobrepostos na fatura original. Verifique os campos destacados.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } else {
      setOverlapWarningMsg(null);
    }
  }, [toast, currentInvoiceData]);
  
  useEffect(() => {
    // Only check for overlaps on the editable (Energisa) invoice.
    if (isEditable && !currentInvoiceData?.companyName?.toLowerCase().includes("planus")) {
       checkForOverlaps(); 
    } else {
      setOverlappingFields(new Set()); // Clear overlaps for Planus/non-editable
      setOverlapWarningMsg(null);
    }
  }, [currentInvoiceData, checkForOverlaps, isEditable]);


  if (!currentInvoiceData) {
    return <div className="flex justify-center items-center h-96">Carregando dados da fatura...</div>;
  }
  
  const isPlanusInvoice = currentInvoiceData.companyName?.toLowerCase().includes("planus");
  const activeFieldConfig = isPlanusInvoice ? PLANUS_INVOICE_FIELDS_CONFIG : ENERGISA_INVOICE_FIELDS_CONFIG;
  
  const energisaBgUrl = "https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/86dc9c43c4be1f9265bb146d607212a360025633/pagina%201_P%C3%A1gina_1.jpg";
  const planusBgUrl = "https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/cf7eecf500041fa7dbbd31545c2c611f4beaa6cf/fatura%20bowe_P%C3%A1gina_1.jpg";
  const currentBgUrl = isPlanusInvoice ? planusBgUrl : energisaBgUrl;

  const energisaLogoUrl = "https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/refs/heads/main/FATURA%20ENERGISA%2017.06_P%C3%A1gina_1%20(2).svg";
  const planusLogoUrl = "https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/8db885232a58b629749f753826c0c9e8f8d464a5/logo%20planus%20(1).png";
  
  const logoConfig = isPlanusInvoice 
    ? { url: planusLogoUrl, x: 50, y: 25, width: 120, height: 45, hint: "planus logo" }
    : { url: energisaLogoUrl, x: 45, y: 25, width: 130, height: 65, hint: "energisa logo" };


  return (
    <div className="w-full flex flex-col items-center">
      {overlapWarningMsg && !isPlanusInvoice && ( // Show warning only for Energisa overlaps
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive-foreground rounded-lg shadow-sm flex items-center text-sm max-w-xl w-full">
          <AlertTriangle className="h-5 w-5 mr-3 shrink-0 text-destructive" />
          <span className="font-medium">{overlapWarningMsg}</span>
        </div>
      )}
      
      <div className="invoice-container bg-white shadow-xl rounded-lg" style={{ width: '827px', height: 'auto', minHeight: isPlanusInvoice ? '780px' : '580px', overflow: 'hidden', position: 'relative' }}>
        <svg width="827" height={isPlanusInvoice ? "780" : "580"} viewBox={`0 0 827 ${isPlanusInvoice ? 780 : 580}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <image 
            href={currentBgUrl}
            data-ai-hint={isPlanusInvoice ? "bowe bill background" : "energisa bill background"}
            x="0" y="0" width="827" height={isPlanusInvoice ? "780" : "1169"} // Bowe image height might be different or cropped.
          />
          
           <foreignObject x={logoConfig.x} y={logoConfig.y} width={logoConfig.width} height={logoConfig.height}>
                <image 
                  href={logoConfig.url}
                  width={logoConfig.width}
                  height={logoConfig.height}
                  data-ai-hint={logoConfig.hint}
                />
            </foreignObject>

          {activeFieldConfig.map(field => {
            // Skip rendering certain original Energisa header fields if it's Planus and they are not in PLANUS_INVOICE_FIELDS_CONFIG
            // or if they are meant to be replaced by new Planus-specific fields.
            if (isPlanusInvoice && 
                (field.name === 'companyAddress' || field.name === 'companyCityStateZip' || field.name === 'companyInscEst') &&
                !PLANUS_INVOICE_FIELDS_CONFIG.find(f => f.name === field.name) // Only skip if not explicitly in Planus config
            ) {
              return null;
            }
            // Special handling for companyCnpj for Planus to use boweCpfCnpj styling/position from PLANUS_CONFIG
            if (isPlanusInvoice && field.name === 'companyCnpj') {
                const planusCnpjField = PLANUS_INVOICE_FIELDS_CONFIG.find(f => f.name === 'boweCpfCnpj');
                 if (planusCnpjField) {
                     return (
                        <EditableField
                            key={planusCnpjField.name}
                            name={planusCnpjField.name} // Map to boweCpfCnpj
                            x={planusCnpjField.x}
                            y={planusCnpjField.y}
                            width={planusCnpjField.width}
                            height={planusCnpjField.height}
                            value={currentInvoiceData['boweCpfCnpj'] || currentInvoiceData['clienteCnpjCpf'] || ''}
                            onChange={handleInputChange}
                            inputStyle={planusCnpjField.style}
                            inputClassName={planusCnpjField.className}
                            isTextarea={planusCnpjField.isTextarea}
                            fieldRef={el => (fieldRefs.current[planusCnpjField.name] = el)}
                            isOverlapping={false} // Planus is not checked for overlaps here
                        />
                    );
                 }
                 return null; 
            }


            return (
              <EditableField
                key={field.name}
                name={field.name}
                x={field.x}
                y={field.y}
                width={field.width}
                height={field.height}
                value={currentInvoiceData[field.name] || field.initialValue || ''}
                onChange={handleInputChange}
                inputStyle={field.style}
                inputClassName={field.className}
                isTextarea={field.isTextarea}
                fieldRef={el => (fieldRefs.current[field.name] = el)}
                isOverlapping={!isPlanusInvoice && overlappingFields.has(field.name)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default InvoiceEditor;
