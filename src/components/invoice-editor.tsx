
"use client";

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import EditableField from './editable-field';
import { useToast } from '@/hooks/use-toast';
import type { InvoiceData } from '@/types/invoice';
import { INVOICE_FIELDS_CONFIG } from '@/config/invoice-fields';

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
      const warningText = `Campos sobrepostos: ${Array.from(newOverlaps).join(', ')}.`;
      setOverlapWarningMsg(warningText);
      toast({
        title: 'Aviso de Sobreposição',
        description: 'Alguns campos estão sobrepostos. Verifique os campos destacados.',
        variant: 'destructive',
        duration: 5000,
      });
    } else {
      setOverlapWarningMsg(null);
    }
  }, [toast]);
  
  // Expose checkForOverlaps via a ref if needed by parent, or keep internal for now
  // useEffect(() => {
  //  checkForOverlaps(); // Check on initial render or when data changes
  // }, [currentInvoiceData, checkForOverlaps]);


  if (!currentInvoiceData) {
    return <div className="flex justify-center items-center h-96">Carregando dados da fatura...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {overlapWarningMsg && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive-foreground rounded-lg shadow-sm flex items-center text-sm max-w-xl w-full">
          <AlertTriangle className="h-5 w-5 mr-3 shrink-0 text-destructive" />
          <span className="font-medium">{overlapWarningMsg}</span>
        </div>
      )}
      
      <div className="invoice-container bg-white shadow-xl rounded-lg" style={{ width: '827px', height: '580px', overflow: 'hidden', position: 'relative' }}>
        <svg width="827" height="580" viewBox="0 0 827 580" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <image 
            href={currentInvoiceData.companyName?.toLowerCase().includes("planus") ? "https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/cf7eecf500041fa7dbbd31545c2c611f4beaa6cf/fatura%20bowe_P%C3%A1gina_1.jpg" : "https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/86dc9c43c4be1f9265bb146d607212a360025633/pagina%201_P%C3%A1gina_1.jpg"}
            data-ai-hint="bill background" 
            x="0" y="0" width="827" height="1169" 
          />
          
           {/* Conditional Logo based on company name or a prop */}
           {!(currentInvoiceData.companyName?.toLowerCase().includes("planus")) && (
            <foreignObject x="45" y="25" width="130" height="65">
                <image 
                href="https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/refs/heads/main/FATURA%20ENERGISA%2017.06_P%C3%A1gina_1%20(2).svg" 
                width="130" height="65" data-ai-hint="energisa logo"
                />
            </foreignObject>
           )}
            {currentInvoiceData.companyName?.toLowerCase().includes("planus") && (
             <foreignObject x="50" y="25" width="120" height="45">
                <image 
                href="https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/8db885232a58b629749f753826c0c9e8f8d464a5/logo%20planus%20(1).png"  // Placeholder for Planus logo
                width="120" height="45" data-ai-hint="planus logo"
                />
            </foreignObject>
            )}


          {INVOICE_FIELDS_CONFIG.map(field => {
            // For Planus invoice, some fields might have different style or not be rendered if their value is specific to Energisa
            // For now, we render all based on currentInvoiceData
            // Skip rendering the company address block if it's Planus, as it's different in the target image
            if (currentInvoiceData.companyName?.toLowerCase().includes("planus") && 
                (field.name === 'companyAddress' || field.name === 'companyCityStateZip' || field.name === 'companyCnpj' || field.name === 'companyInscEst')
            ) {
              // For planus, the header fields are different or placed differently.
              // The general headerTitle is sufficient for planus, and specific details are not on the "bowe" image.
              // So, we can skip rendering these specific Energisa address details for the Planus version.
              if (field.name === 'companyCnpj' && currentInvoiceData[field.name]) {
                 // Render only CNPJ for Planus, in a slightly different spot if needed, or use its default
                 const planusCnpjField = {...field, y: field.y + 10, initialValue: currentInvoiceData[field.name] || ""}; // Adjust y if needed
                 return (
                    <EditableField
                        key={planusCnpjField.name}
                        name={planusCnpjField.name}
                        x={planusCnpjField.x}
                        y={planusCnpjField.y}
                        width={planusCnpjField.width}
                        height={planusCnpjField.height}
                        value={currentInvoiceData[planusCnpjField.name] || ''}
                        onChange={handleInputChange}
                        inputStyle={planusCnpjField.style}
                        inputClassName={planusCnpjField.className}
                        isTextarea={planusCnpjField.isTextarea}
                        fieldRef={el => (fieldRefs.current[planusCnpjField.name] = el)}
                        isOverlapping={overlappingFields.has(planusCnpjField.name)}
                    />
                 )
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
                value={currentInvoiceData[field.name] || ''}
                onChange={handleInputChange}
                inputStyle={field.style}
                inputClassName={field.className}
                isTextarea={field.isTextarea}
                fieldRef={el => (fieldRefs.current[field.name] = el)}
                isOverlapping={overlappingFields.has(field.name)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default InvoiceEditor;
