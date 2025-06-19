
"use client";

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import EditableField from './editable-field';
import type { InvoiceData } from '@/types/invoice';
import { ENERGISA_INVOICE_FIELDS_CONFIG } from '@/config/invoice-fields'; // Only Energisa config needed

interface InvoiceEditorProps {
  invoiceData: InvoiceData | null;
  onInvoiceDataChange?: (newData: InvoiceData) => void;
  isEditable?: boolean;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ invoiceData, onInvoiceDataChange, isEditable = true }) => {
  const fieldRefs = useRef<Record<string, SVGForeignObjectElement | null>>({});
  const [overlappingFields, setOverlappingFields] = useState<Set<string>>(new Set());

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
    // let overlapDetected = false; // Not strictly needed if no warning message

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
            // overlapDetected = true; // Not strictly needed
          }
        }
      }
    }
    setOverlappingFields(newOverlaps);
  }, []);
  
  useEffect(() => {
    if (isEditable) { // Only check for overlaps if editable (Energisa invoice)
       checkForOverlaps(); 
    } else {
      setOverlappingFields(new Set());
    }
  }, [currentInvoiceData, checkForOverlaps, isEditable]);


  if (!currentInvoiceData) {
    return <div className="flex justify-center items-center h-96">Carregando dados da fatura...</div>;
  }
  
  const activeFieldConfig = ENERGISA_INVOICE_FIELDS_CONFIG; // Always use Energisa config now
  
  const energisaBgUrl = "https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/86dc9c43c4be1f9265bb146d607212a360025633/pagina%201_P%C3%A1gina_1.jpg";
  const energisaLogoUrl = "https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/refs/heads/main/FATURA%20ENERGISA%2017.06_P%C3%A1gina_1%20(2).svg";
  
  const logoConfig = { url: energisaLogoUrl, x: 45, y: 25, width: 130, height: 65, hint: "energisa logo" };


  return (
    <div className="w-full flex flex-col items-center">
      <div className="invoice-container bg-white shadow-xl rounded-lg" style={{ width: '827px', height: 'auto', minHeight: '580px', overflow: 'hidden', position: 'relative' }}>
        <svg width="827" height="580" viewBox="0 0 827 580" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <image 
            href={energisaBgUrl}
            data-ai-hint="energisa bill background"
            x="0" y="0" width="827" height="1169" 
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
                isOverlapping={isEditable && overlappingFields.has(field.name)} // Only show overlap if editable
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default InvoiceEditor;

    