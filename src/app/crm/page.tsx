
"use client";

import { useState, useEffect, Suspense } from 'react';
import type { LeadWithId, LeadDocumentData } from '@/types/crm';
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { LeadForm } from '@/components/crm/LeadForm';
import { LeadDetailView } from '@/components/crm/LeadDetailView';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, Filter, Plus, X } from 'lucide-react'; // Added Plus and X
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Timestamp } from 'firebase/firestore'; // For mock data
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';


// Mock Data - Replace with Firestore fetching
const MOCK_LEADS: LeadWithId[] = [
  {
    id: '1', name: 'Empresa Alpha', company: 'Alpha Soluções LTDA', value: 50000, kwh: 2500, stageId: 'contato', sellerName: 'vendedor1@example.com', leadSource: 'Tráfego Pago', phone: '(11) 99999-0001', email: 'contato@alpha.com', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), lastContact: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), userId: 'user1', needsAdminApproval: false
  },
  {
    id: '2', name: 'Mercado Beta', value: 120000, kwh: 8000, stageId: 'proposta', sellerName: 'vendedor2@example.com', leadSource: 'Indicação', phone: '(21) 98888-0002', email: 'compras@beta.com.br', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), userId: 'user2', needsAdminApproval: false
  },
  {
    id: '3', name: 'Padaria Gama', value: 8000, kwh: 700, stageId: 'fatura', sellerName: 'vendedor1@example.com', leadSource: 'WhatsApp', phone: '(31) 97777-0003', email: 'padariagama@email.com', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), lastContact: new Date(Date.now() - 1000 * 60 * 30).toISOString(), userId: 'user1', needsAdminApproval: false
  },
  {
    id: '4', name: 'Indústria Delta', company: 'Delta Industrial S/A', value: 350000, kwh: 22000, stageId: 'contrato', sellerName: 'vendedor3@example.com', leadSource: 'Porta a Porta (PAP)', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), userId: 'user3', needsAdminApproval: true, correctionReason: 'Verificar CNPJ.'
  },
  {
    id: '5', name: 'Restaurante Epsilon', value: 15000, kwh: 1200, stageId: 'assinado', sellerName: 'vendedor2@example.com', leadSource: 'Tráfego Pago', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), userId: 'user2', needsAdminApproval: false
  },
   {
    id: '6', name: 'Escola Zeta', value: 22000, kwh: 1800, stageId: 'conformidade', sellerName: 'vendedor1@example.com', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), lastContact: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), userId: 'user1', needsAdminApproval: true
  },
  {
    id: '7', name: 'Loja Kappa', value: 5000, kwh: 300, stageId: 'perdido', sellerName: 'vendedor3@example.com', leadSource: 'Disparo de E-mail', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), userId: 'user3'
  },
];


// Placeholder for actual Firebase interaction functions
// async function createCrmLeadFirestore(data: Omit<LeadDocumentData, 'createdAt' | 'lastContact' | 'id'>): Promise<LeadWithId> { /* ... */ return MOCK_LEADS[0]; }
// async function updateCrmLeadFirestore(leadId: string, data: Partial<LeadDocumentData>): Promise<LeadWithId> { /* ... */ return MOCK_LEADS[0]; }
// async function fetchCrmLeadsFirestore(): Promise<LeadWithId[]> { /* ... */ return MOCK_LEADS; }

function CrmPageContent() {
  const [leads, setLeads] = useState<LeadWithId[]>(MOCK_LEADS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadWithId | null>(null);
  const [editingLead, setEditingLead] = useState<LeadWithId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial load

  // useEffect(() => {
  //   const loadLeads = async () => {
  //     setIsLoading(true);
  //     // const fetchedLeads = await fetchCrmLeadsFirestore(); // Replace with actual fetch
  //     setLeads(MOCK_LEADS);
  //     setIsLoading(false);
  //   };
  //   loadLeads();
  // }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeads(MOCK_LEADS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);


  const handleOpenForm = (leadToEdit?: LeadWithId) => {
    setEditingLead(leadToEdit || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLead(null);
  };

  const handleFormSubmit = async (formData: any /* LeadFormData from LeadForm */) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingLead) {
      // Update existing lead (mock)
      setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...formData, lastContact: new Date().toISOString() } : l));
      // await updateCrmLeadFirestore(editingLead.id, { ...formData, lastContact: Timestamp.now() });
    } else {
      // Create new lead (mock)
      const newLead: LeadWithId = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString(),
        userId: 'currentUserMockId', // Replace with actual user ID
      };
      setLeads([newLead, ...leads]);
      // await createCrmLeadFirestore({ ...formData, userId: 'currentUserMockId', createdAt: Timestamp.now(), lastContact: Timestamp.now() });
    }
    // const fetchedLeads = await fetchCrmLeadsFirestore();
    // setLeads(fetchedLeads);
    setIsSubmitting(false);
    handleCloseForm();
  };
  
  const handleViewLeadDetails = (lead: LeadWithId) => {
    setSelectedLead(lead);
  };

  const handleCloseLeadDetails = () => {
    setSelectedLead(null);
  };

  if (isLoading) {
     return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-56px)] bg-transparent text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Carregando leads...</p>
      </div>
    );
  }


  return (
    <div className="relative flex flex-col h-[calc(100vh-56px)] overflow-hidden"> {/* Adjust height based on header, ADDED relative */}
      <header className="p-4 border-b border-sidebar-border bg-card/70 backdrop-blur-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground flex items-center">
            <Users className="w-7 h-7 mr-3 text-primary" />
            CRM - Gestão de Leads
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button onClick={() => handleOpenForm()} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </div>
        </div>
      </header>
      
      <KanbanBoard leads={leads} onViewLeadDetails={handleViewLeadDetails} />

      {/* Floating Action Button */}
      <Button
        onClick={() => handleOpenForm()}
        className="absolute bottom-6 left-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg z-20"
        aria-label="Adicionar Novo Lead"
        size="icon"
      >
        <Plus className="w-7 h-7" />
      </Button>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className="sm:max-w-[600px] bg-card/70 backdrop-blur-lg border shadow-2xl text-foreground">
          <DialogHeader>
            <DialogTitle className="text-primary">{editingLead ? 'Editar Lead' : 'Criar Novo Lead'}</DialogTitle>
            <DialogDescription>
              {editingLead ? 'Atualize os dados do lead.' : 'Preencha os dados para criar um novo lead.'}
            </DialogDescription>
          </DialogHeader>
          <LeadForm 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseForm}
            initialData={editingLead || undefined}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && handleCloseLeadDetails()}>
          <DialogContent className="max-w-3xl w-[90vw] h-[90vh] p-0 bg-transparent border-none shadow-none text-foreground">
            {selectedLead && (
              <LeadDetailView 
                lead={selectedLead} 
                onClose={handleCloseLeadDetails} 
                onEdit={() => {
                    handleCloseLeadDetails(); // Close detail view first
                    handleOpenForm(selectedLead); // Then open edit form
                }}
                // isAdmin={true} // Example for admin view
              />
            )}
          </DialogContent>
      </Dialog>

    </div>
  );
}

export default function CRMPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Carregando CRM...</p>
      </div>
    }>
      <CrmPageContent />
    </Suspense>
  );
}
