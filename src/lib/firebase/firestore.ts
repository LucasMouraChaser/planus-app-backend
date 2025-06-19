
// src/lib/firebase/firestore.ts
// Placeholder for Firestore interaction functions related to CRM
import type { LeadDocumentData, LeadWithId, ChatMessage as ChatMessageType, StageId } from '@/types/crm';
import type { WithdrawalRequestData, WithdrawalRequestWithId, PixKeyType, WithdrawalStatus, WithdrawalType } from '@/types/wallet'; // Import wallet types
// import { Timestamp, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, arrayUnion, getDoc } from 'firebase/firestore';
// import { db } from './firebase-config'; // Assuming you have a firebase-config.ts initializing 'db'

// --- Leads ---

export async function createCrmLead(
  leadData: Omit<LeadDocumentData, 'id' | 'createdAt' | 'lastContact' | 'userId'>,
  // photoDocumentFile?: File, 
  // billDocumentFile?: File
): Promise<LeadWithId> {
  console.log("Placeholder: createCrmLead called with data:", leadData);
  // const userId = auth.currentUser?.uid; // Get current user ID
  // if (!userId) throw new Error("User not authenticated");

  // const fullLeadData: LeadDocumentData = {
  //   ...leadData,
  //   userId,
  //   createdAt: Timestamp.now(),
  //   lastContact: Timestamp.now(),
  //   needsAdminApproval: leadData.needsAdminApproval ?? false,
  // };

  // const docRef = await addDoc(collection(db, "crm_leads"), fullLeadData);
  
  // // Handle file uploads (simplified example, actual upload logic in storage.ts)
  // let photoUrl, billUrl;
  // if (photoDocumentFile) {
  //   photoUrl = await uploadFile(photoDocumentFile, `crm_lead_documents/${docRef.id}/photo_document/${photoDocumentFile.name}`);
  // }
  // if (billDocumentFile) {
  //   billUrl = await uploadFile(billDocumentFile, `crm_lead_documents/${docRef.id}/bill_document/${billDocumentFile.name}`);
  // }

  // if (photoUrl || billUrl) {
  //   await updateDoc(docRef, {
  //     ...(photoUrl && { photoDocumentUrl: photoUrl }),
  //     ...(billUrl && { billDocumentUrl: billUrl }),
  //   });
  // }

  // return { ...fullLeadData, id: docRef.id, createdAt: fullLeadData.createdAt.toDate().toISOString(), lastContact: fullLeadData.lastContact.toDate().toISOString(), photoDocumentUrl: photoUrl, billDocumentUrl: billUrl };
  
  // Mocked response:
  const mockTimestamp = new Date().toISOString();
  return {
    id: `mock-${Date.now()}`,
    ...leadData,
    userId: 'mockUser',
    createdAt: mockTimestamp,
    lastContact: mockTimestamp,
    needsAdminApproval: leadData.needsAdminApproval ?? false,
  } as LeadWithId;
}

export async function fetchCrmLeads(
  // currentUser: AppUser // Assuming AppUser type from your auth context
): Promise<LeadWithId[]> {
  console.log("Placeholder: fetchCrmLeads called");
  // let q;
  // if (currentUser.type === 'admin') {
  //   q = query(collection(db, "crm_leads"), orderBy("createdAt", "desc"));
  // } else {
  //   q = query(collection(db, "crm_leads"), where("sellerName", "==", currentUser.email), orderBy("createdAt", "desc"));
  // }
  // const querySnapshot = await getDocs(q);
  // return querySnapshot.docs.map(doc => ({ 
  //   id: doc.id, 
  //   ...doc.data(),
  //   createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
  //   lastContact: (doc.data().lastContact as Timestamp).toDate().toISOString(),
  // } as LeadWithId));
  return []; // Return empty or mock data for now
}

export async function fetchAllCrmLeadsGlobally(
  // currentUser: AppUser | null
): Promise<LeadWithId[]> {
  console.log("Placeholder: fetchAllCrmLeadsGlobally called");
  // Similar to fetchCrmLeads, but might have broader permissions or be used for dashboard
  return [];
}


export async function updateCrmLeadStage(
  leadId: string, 
  newStageId: StageId, 
  newLastContactIso: string, 
  updates?: Partial<LeadDocumentData>
): Promise<void> {
  console.log("Placeholder: updateCrmLeadStage called for lead:", leadId, "to stage:", newStageId, "with updates:", updates);
  // const leadRef = doc(db, "crm_leads", leadId);
  // await updateDoc(leadRef, {
  //   stageId: newStageId,
  //   lastContact: Timestamp.fromDate(new Date(newLastContactIso)),
  //   ...updates
  // });
}

export async function updateCrmLeadDetails(
  leadId: string,
  updates: Partial<Omit<LeadDocumentData, 'createdAt' | 'userId'>> & { lastContactIso: string }
): Promise<void> {
  console.log("Placeholder: updateCrmLeadDetails called for lead:", leadId, "with updates:", updates);
  // const { lastContactIso, ...otherUpdates } = updates;
  // const leadRef = doc(db, "crm_leads", leadId);
  // await updateDoc(leadRef, {
  //   ...otherUpdates,
  //   lastContact: Timestamp.fromDate(new Date(lastContactIso)),
  // });
}


export async function deleteCrmLead(leadId: string): Promise<void> {
  console.log("Placeholder: deleteCrmLead called for lead:", leadId);
  // // Check admin permissions before allowing deletion
  // const leadRef = doc(db, "crm_leads", leadId);
  // // Optionally delete associated files from Storage and chat document
  // await deleteDoc(leadRef);
}

// --- Lead Approval Flow ---

export async function approveCrmLead(leadId: string): Promise<void> {
  console.log("Placeholder: approveCrmLead called for lead:", leadId);
  // const leadRef = doc(db, "crm_leads", leadId);
  // await updateDoc(leadRef, {
  //   stageId: 'assinado',
  //   needsAdminApproval: false,
  //   correctionReason: null, // or FieldValue.delete()
  //   lastContact: Timestamp.now(),
  // });
}

export async function requestCrmLeadCorrection(leadId: string, reason: string): Promise<void> {
  console.log("Placeholder: requestCrmLeadCorrection called for lead:", leadId, "Reason:", reason);
  // const leadRef = doc(db, "crm_leads", leadId);
  // await updateDoc(leadRef, {
  //   // Example: revert to a previous stage, or a specific "needs_correction" stage
  //   stageId: 'contrato', // This might depend on your workflow
  //   correctionReason: reason,
  //   needsAdminApproval: false, 
  //   lastContact: Timestamp.now(),
  // });
}


// --- Chat ---

export async function fetchChatHistory(leadId: string): Promise<ChatMessageType[]> {
  console.log("Placeholder: fetchChatHistory called for lead:", leadId);
  // const chatDocRef = doc(db, "crm_lead_chats", leadId);
  // const chatDoc = await getDoc(chatDocRef);
  // if (chatDoc.exists()) {
  //   const messages = chatDoc.data().messages as ChatMessageType[];
  //   return messages
  //     .map(msg => ({...msg, timestamp: (msg.timestamp as Timestamp).toDate().toISOString()}))
  //     .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  // }
  return [];
}

export async function saveChatMessage(
  leadId: string, 
  messageData: { text: string; sender: 'user' | 'lead' }
): Promise<ChatMessageType> {
  console.log("Placeholder: saveChatMessage called for lead:", leadId, "Message:", messageData);
  // const chatDocRef = doc(db, "crm_lead_chats", leadId);
  // const newMessage: ChatMessageType = {
  //   id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
  //   ...messageData,
  //   timestamp: Timestamp.now(),
  // };
  // await updateDoc(chatDocRef, {
  //   messages: arrayUnion(newMessage)
  // }, { merge: true }); // merge: true creates the document if it doesn't exist
  // // Update lastContact on the lead
  // const leadRef = doc(db, "crm_leads", leadId);
  // await updateDoc(leadRef, { lastContact: Timestamp.now() });
  // return {...newMessage, timestamp: (newMessage.timestamp as Timestamp).toDate().toISOString() };
  
  // Mocked response:
  const mockTimestamp = new Date().toISOString();
  return {
    id: `mock-msg-${Date.now()}`,
    ...messageData,
    timestamp: mockTimestamp,
  };
}


// --- WhatsApp Integration Helpers (Server-side or Admin context) ---

export async function findLeadByPhoneNumber(phoneNumber: string): Promise<LeadWithId | null> {
  console.log("Placeholder: findLeadByPhoneNumber called for phone:", phoneNumber);
  // const q = query(collection(db, "crm_leads"), where("phone", "==", phoneNumber));
  // const querySnapshot = await getDocs(q);
  // if (!querySnapshot.empty) {
  //   const doc = querySnapshot.docs[0];
  //   return { 
  //     id: doc.id, 
  //     ...doc.data(),
  //     createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
  //     lastContact: (doc.data().lastContact as Timestamp).toDate().toISOString(),
  //   } as LeadWithId;
  // }
  return null;
}

export async function createLeadFromWhatsapp(contactName: string, phoneNumber: string, firstMessage?: string): Promise<string | null> {
  console.log("Placeholder: createLeadFromWhatsapp called for:", contactName, phoneNumber);
  // const leadData: Omit<LeadDocumentData, 'id' | 'createdAt' | 'lastContact' | 'userId'> = {
  //   name: contactName,
  //   phone: phoneNumber,
  //   stageId: 'contato',
  //   sellerName: 'admin@example.com', // Assign to a default admin or use rotation logic
  //   leadSource: 'WhatsApp',
  //   value: 0, // Initial default value
  //   kwh: 0,   // Initial default value
  //   // userId will be assigned by createCrmLead if called from an authenticated context,
  //   // or needs a system/admin UID if called from a webhook.
  // };
  // const newLead = await createCrmLead(leadData); // This needs context for userId
  // if (newLead && firstMessage) {
  //   await saveChatMessage(newLead.id, { text: firstMessage, sender: 'lead' });
  // }
  // return newLead?.id || null;
  return `mock-whatsapp-lead-${Date.now()}`;
}

// --- Wallet / Commission Functions ---

export async function requestWithdrawal(
  userId: string, // Added userId as it's crucial for creating the request
  userEmail: string, // Added userEmail
  userName: string | undefined, // Added userName
  amount: number,
  pixKeyType: PixKeyType,
  pixKey: string,
  withdrawalType: WithdrawalType
): Promise<string | null> {
  console.log("Placeholder: requestWithdrawal called for user:", userId, { amount, pixKeyType, pixKey, withdrawalType });
  // const newRequest: WithdrawalRequestData = {
  //   userId,
  //   userEmail,
  //   userName,
  //   amount,
  //   pixKeyType,
  //   pixKey,
  //   withdrawalType,
  //   status: 'pendente',
  //   requestedAt: Timestamp.now(),
  // };
  // const docRef = await addDoc(collection(db, "withdrawal_requests"), newRequest);
  // return docRef.id;
  return `mock-req-${Date.now()}`; // Mocked response
}

export async function fetchWithdrawalHistory(userId: string): Promise<WithdrawalRequestWithId[]> {
  console.log("Placeholder: fetchWithdrawalHistory called for user:", userId);
  // const q = query(collection(db, "withdrawal_requests"), where("userId", "==", userId), orderBy("requestedAt", "desc"));
  // const querySnapshot = await getDocs(q);
  // return querySnapshot.docs.map(doc => {
  //   const data = doc.data() as WithdrawalRequestData;
  //   return {
  //     id: doc.id,
  //     ...data,
  //     requestedAt: (data.requestedAt as Timestamp).toDate().toISOString(),
  //     processedAt: data.processedAt ? (data.processedAt as Timestamp).toDate().toISOString() : undefined,
  //   };
  // });
  // Mocked response:
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() -1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);

  return [
    { id: 'wr1', userId, userEmail: 'user@example.com', userName: 'Usuário Teste', amount: 150.75, pixKeyType: 'CPF/CNPJ', pixKey: '123.456.789-00', status: 'concluido', withdrawalType: 'personal', requestedAt: twoDaysAgo.toISOString(), processedAt: yesterday.toISOString(), adminNotes: 'Pagamento efetuado.' },
    { id: 'wr2', userId, userEmail: 'user@example.com', userName: 'Usuário Teste', amount: 300.00, pixKeyType: 'Email', pixKey: 'teste@email.com', status: 'pendente', withdrawalType: 'mlm', requestedAt: yesterday.toISOString() },
    { id: 'wr3', userId, userEmail: 'user@example.com', userName: 'Usuário Teste', amount: 50.20, pixKeyType: 'Aleatória', pixKey: 'abc123xyz789', status: 'falhou', withdrawalType: 'personal', requestedAt: now.toISOString(), processedAt: now.toISOString(), adminNotes: 'Chave PIX inválida.' },
  ];
}

// Admin functions (placeholders)
export async function adminFetchAllWithdrawalRequests(statusFilter?: WithdrawalStatus): Promise<WithdrawalRequestWithId[]> {
  console.log("Placeholder: adminFetchAllWithdrawalRequests called with filter:", statusFilter);
  // // Actual implementation would query Firestore, filter by status if provided, and order.
  // // For now, return a generic mock or empty array.
  // const allMockRequests: WithdrawalRequestWithId[] = [ // Example, expand this
  //   { id: 'adm_wr1', userId: 'user123', userEmail: 'user1@example.com', userName: 'User One', amount: 100, pixKeyType: 'Celular', pixKey: '(11)99999-0000', status: 'pendente', withdrawalType: 'personal', requestedAt: new Date().toISOString() },
  //   { id: 'adm_wr2', userId: 'user456', userEmail: 'user2@example.com', userName: 'User Two', amount: 250, pixKeyType: 'Email', pixKey: 'user2@mail.com', status: 'concluido', withdrawalType: 'mlm', requestedAt: new Date(Date.now() - 86400000).toISOString(), processedAt: new Date().toISOString() },
  // ];
  // if (statusFilter) {
  //   return allMockRequests.filter(req => req.status === statusFilter);
  // }
  return []; // Or a more comprehensive mock if needed for admin UI testing.
}

export async function adminUpdateWithdrawalStatus(
  requestId: string,
  newStatus: WithdrawalStatus,
  adminNotes?: string
): Promise<boolean> {
  console.log("Placeholder: adminUpdateWithdrawalStatus called for request:", requestId, "New status:", newStatus, "Notes:", adminNotes);
  // const requestRef = doc(db, "withdrawal_requests", requestId);
  // const updateData: Partial<WithdrawalRequestData> = {
  //   status: newStatus,
  //   adminNotes: adminNotes || '', // Or FieldValue.delete() if notes are removed
  // };
  // if (newStatus === 'concluido' || newStatus === 'falhou') {
  //   updateData.processedAt = Timestamp.now();
  // }
  // await updateDoc(requestRef, updateData);
  // // IMPORTANT: If newStatus === 'concluido', trigger backend logic (e.g., Cloud Function)
  // // to actually deduct the balance from the user's document and update commission_records.
  // // This function should NOT directly modify user balances.
  return true; // Mock success
}
