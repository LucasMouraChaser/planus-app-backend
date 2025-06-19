
import InvoiceEditor from '@/components/invoice-editor';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-background p-4 md:p-8 font-body">
      <header className="mb-8 text-center py-4">
        <h1 className="text-3xl md:text-4xl font-headline text-primary font-bold tracking-tight">
          Energisa Invoice Editor
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl mx-auto">
          Interactively edit the fields of the Energisa invoice below. Your changes can be saved to a JSON file, and you can perform a sanity check for any overlapping elements on the form.
        </p>
        <div className="mt-6">
          <Link href="/proposal-generator" passHref>
            <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
              <FileText className="mr-2 h-5 w-5" />
              Iniciar Nova Proposta
            </Button>
          </Link>
        </div>
      </header>
      <InvoiceEditor />
    </main>
  );
}
