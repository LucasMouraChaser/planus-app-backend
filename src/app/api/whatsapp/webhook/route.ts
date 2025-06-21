
// src/app/api/whatsapp/webhook/route.ts
import { NextResponse } from 'next/server';
import { findLeadByPhoneNumber, createLeadFromWhatsapp, saveChatMessage } from '@/lib/firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("WhatsApp Webhook Received:", JSON.stringify(body, null, 2));

    // Process the webhook payload from Meta
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === "messages" && change.value.messages) {
            const message = change.value.messages[0];
            
            // Handle only text messages for now
            if (message.type === "text") {
              const senderPhoneNumber = message.from;
              const messageText = message.text.body;
              const contactName = change.value.contacts?.[0]?.profile?.name || 'Novo Contato';

              if (senderPhoneNumber && messageText) {
                console.log(`Processing message from ${contactName} (${senderPhoneNumber}): ${messageText}`);

                let lead = await findLeadByPhoneNumber(senderPhoneNumber);
                
                if (!lead) {
                  console.log(`No existing lead found for ${senderPhoneNumber}. Creating new lead.`);
                  const leadId = await createLeadFromWhatsapp(contactName, senderPhoneNumber, messageText);
                  if (leadId) {
                    console.log(`New lead created from WhatsApp with ID: ${leadId}`);
                  }
                } else {
                  console.log(`Found existing lead with ID: ${lead.id}. Saving message.`);
                  await saveChatMessage(lead.id, { text: messageText, sender: 'lead' });
                  console.log(`Message added to existing lead: ${lead.id}`);
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error);
    // Return a generic error message to avoid leaking implementation details
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

// GET endpoint for webhook verification (required by Meta)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const verifyToken = "PLANUS_WHATSAPP_SECRET_TOKEN_12345";

    if (mode === 'subscribe' && token === verifyToken) {
        // Verification successful
        return new Response(challenge, { status: 200 });
    } else {
        // Verification failed
        return new Response('Forbidden', { status: 403 });
    }
}
