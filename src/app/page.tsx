import InvoiceEditor from '@/components/invoice-editor';

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
      </header>
      <InvoiceEditor />
    </main>
  );
}
