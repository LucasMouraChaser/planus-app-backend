
// src/app/api/whatsapp/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findLeadByPhoneNumber, createLeadFromWhatsapp, saveChatMessage } from '@/lib/firebase/firestore';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => {
    console.error("Failed to parse request body as JSON.");
    return null;
  });
  
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  
  console.log("WhatsApp Webhook Received:", JSON.stringify(body, null, 2));
  
  try {
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "messages" && change.value.messages) {
              const message = change.value.messages[0];
              
              if (message && message.type === "text") {
                try {
                  const senderPhoneNumber = message.from;
                  const messageText = message.text.body;
                  const contactName = change.value.contacts?.[0]?.profile?.name || 'Novo Contato';

                  if (senderPhoneNumber && messageText) {
                    console.log(`Processing message from ${contactName} (${senderPhoneNumber}): ${messageText}`);
                    
                    let lead = await findLeadByPhoneNumber(senderPhoneNumber);
                    
                    if (!lead) {
                      console.log(`No existing lead found for ${senderPhoneNumber}. Creating new lead.`);
                      // Pass only the essential info to create the lead first.
                      const leadId = await createLeadFromWhatsapp(contactName, senderPhoneNumber, messageText);
                      if (leadId) {
                        console.log(`New lead created with ID: ${leadId}`);
                      } else {
                        console.error(`Failed to create lead for ${senderPhoneNumber}.`);
                      }
                    } else {
                      console.log(`Found existing lead with ID: ${lead.id}. Saving message.`);
                      await saveChatMessage(lead.id, { text: messageText, sender: 'lead' });
                      console.log(`Message added to existing lead: ${lead.id}`);
                    }
                  }
                } catch (innerError) {
                  console.error("Error processing a single message:", innerError);
                  // Continue processing other messages in the payload
                }
              }
            }
          }
        }
      }
    }
    // Always return 200 OK to Meta to keep the webhook active.
    // Errors are logged on the server for debugging.
    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });

  } catch (error) {
    console.error("Outer error processing WhatsApp webhook:", error);
    // Even in case of an outer error, it's often better to return 200 to Meta
    // to avoid the webhook being disabled. The error is logged for us to fix.
    return NextResponse.json({ message: "Webhook processed with errors" }, { status: 200 });
  }
}


// GET endpoint for webhook verification (required by Meta)
export async function GET(request: NextRequest) {
    const mode = request.nextUrl.searchParams.get('hub.mode');
    const token = request.nextUrl.searchParams.get('hub.verify_token');
    const challenge = request.nextUrl.searchParams.get('hub.challenge');

    const verifyToken = "tokenparaapioficial";

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK_VERIFIED');
        return new Response(challenge, { status: 200 });
    } else {
        console.error('Webhook verification failed. Token or mode mismatch.');
        return new Response('Forbidden', { status: 403 });
    }
}
