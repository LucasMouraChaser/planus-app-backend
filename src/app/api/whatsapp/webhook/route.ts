// src/app/api/whatsapp/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findLeadByPhoneNumber, createLeadFromWhatsapp, saveChatMessage } from '@/lib/firebase/firestore';

const VERIFY_TOKEN = "testeapi";

/**
 * Handles the webhook verification GET request from Meta.
 */
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode');
  const token = request.nextUrl.searchParams.get('hub.verify_token');
  const challenge = request.nextUrl.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verification successful!');
    return new Response(challenge, { status: 200 });
  } else {
    console.error('[WhatsApp Webhook] Verification failed. Mode or token mismatch.');
    return new Response('Forbidden', { status: 403 });
  }
}


/**
 * Handles incoming message notifications POST requests from Meta.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[WhatsApp Webhook] Received POST payload:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          const value = change.value;

          if (value && value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const contact = value.contacts?.[0];
            
            // Only process text messages for now
            if (message.type === 'text') {
              const from = message.from; // Phone number
              const text = message.text.body;
              const profileName = contact?.profile?.name || 'Sem Nome';

              console.log(`[WhatsApp Webhook] Processing message from: ${profileName} (${from}) | Text: "${text}"`);

              let lead = await findLeadByPhoneNumber(from);

              if (lead) {
                console.log(`[WhatsApp Webhook] Found lead: ${JSON.stringify(lead)}`);
                try {
                  await saveChatMessage(lead.id, { text: text, sender: 'lead' });
                } catch (e) {
                  console.error(`[WhatsApp Webhook] Error saving chat message:`, e);
                }
              } else {
                console.log(`[WhatsApp Webhook] Creating new lead...`);
                try {
                  const newLeadId = await createLeadFromWhatsapp(profileName, from, text);
                  console.log(`[WhatsApp Webhook] Lead created: ${newLeadId}`);
                } catch (e) {
                  console.error(`[WhatsApp Webhook] Error creating lead:`, e);
                }
              }
            } else {
               console.log(`[WhatsApp Webhook] Ignoring non-text message of type: ${message.type}`);
            }
          }
        }
      }
      // Respond to Meta that the message was received
      return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
    } else {
      // Not a WhatsApp payload
      return NextResponse.json({ message: "Not a WhatsApp payload" }, { status: 404 });
    }
  } catch (error) {
    console.error('[WhatsApp Webhook] FATAL Error processing webhook:', error);
    // Return a 500 error but still respond to avoid Meta retries
    return NextResponse.json({ message: "Error processing webhook" }, { status: 500 });
  }
}
