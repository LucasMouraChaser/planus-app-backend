"use client";

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Save, ScanSearch, AlertTriangle } from 'lucide-react';
import EditableField from './editable-field';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { InvoiceData } from '@/types/invoice';
import { INVOICE_FIELDS_CONFIG, initialInvoiceData as defaultInitialData } from '@/config/invoice-fields';

const InvoiceEditor: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInitialData);
  const fieldRefs = useRef<Record<string, SVGForeignObjectElement | null>>({});
  const [overlappingFields, setOverlappingFields] = useState<Set<string>>(new Set());
  const [overlapWarningMsg, setOverlapWarningMsg] = useState<string | null>(null); // For text display
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
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
      const warningText = `Overlap detected! Fields involved: ${Array.from(newOverlaps).join(', ')}.`;
      setOverlapWarningMsg(warningText);
      toast({
        title: 'Overlap Warning',
        description: 'Some fields are overlapping. Please check the highlighted fields.',
        variant: 'destructive',
        duration: 5000,
      });
    } else {
      setOverlapWarningMsg(null);
      toast({
        title: 'Overlap Check Complete',
        description: 'No overlaps detected.',
        duration: 3000,
      });
    }
  }, [toast]);
  
  // For client-side only logic like getBoundingClientRect
  useEffect(() => {
    // This effect could be used to run initial checks if needed,
    // but for now, the check is manual via button.
  }, []);


  const handleSave = () => {
    try {
      const jsonString = JSON.stringify(invoiceData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoice-data.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast({
        title: 'Success!',
        description: 'Invoice data has been saved to invoice-data.json.',
      });
    } catch (error) {
      console.error("Failed to save invoice data:", error);
      toast({
        title: 'Error Saving Data',
        description: 'There was an issue saving your invoice data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <Button onClick={handleSave} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
          <Save className="mr-2 h-5 w-5" /> Save Data
        </Button>
        <Button onClick={checkForOverlaps} variant="outline" className="border-accent text-accent-foreground hover:bg-accent/10 hover:text-accent-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
          <ScanSearch className="mr-2 h-5 w-5" /> Check Overlaps
        </Button>
      </div>

      {overlapWarningMsg && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive-foreground rounded-lg shadow-sm flex items-center text-sm max-w-xl w-full">
          <AlertTriangle className="h-5 w-5 mr-3 shrink-0 text-destructive" />
          <span className="font-medium">{overlapWarningMsg}</span>
        </div>
      )}
      
      <div className="invoice-container bg-white shadow-xl rounded-lg" style={{ width: '827px', height: '580px', overflow: 'hidden', position: 'relative' }}>
        <svg width="827" height="580" viewBox="0 0 827 580" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <image 
            href="https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/86dc9c43c4be1f9265bb146d607212a360025633/pagina%201_P%C3%A1gina_1.jpg" 
            data-ai-hint="bill background" 
            x="0" y="0" width="827" height="1169" 
          />
          
          <foreignObject x="45" y="25" width="130" height="65">
            <image 
              href="https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/refs/heads/main/FATURA%20ENERGISA%2017.06_P%C3%A1gina_1%20(2).svg" 
              width="130" height="65" data-ai-hint="energisa logo"
            />
          </foreignObject>

          {INVOICE_FIELDS_CONFIG.map(field => (
            <EditableField
              key={field.name}
              name={field.name}
              x={field.x}
              y={field.y}
              width={field.width}
              height={field.height}
              value={invoiceData[field.name]}
              onChange={handleInputChange}
              inputStyle={field.style}
              inputClassName={field.className}
              isTextarea={field.isTextarea}
              fieldRef={el => (fieldRefs.current[field.name] = el)}
              isOverlapping={overlappingFields.has(field.name)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default InvoiceEditor;
