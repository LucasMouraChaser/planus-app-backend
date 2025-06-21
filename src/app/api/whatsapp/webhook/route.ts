
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
  console.log('[WhatsApp Webhook] POST request received.');
  try {
    const body = await request.json();
    console.log('[WhatsApp Webhook] Received POST payload:', JSON.stringify(body, null, 2));

    // Check if the request is a valid WhatsApp message payload
    if (
      body.object &&
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const value = body.entry[0].changes[0].value;
      const message = value.messages[0];
      const contact = value.contacts?.[0];

      if (message.type === 'text') {
        const from = message.from; // Phone number
        const text = message.text.body;
        const profileName = contact?.profile?.name || 'Sem Nome';

        console.log(`[WhatsApp Webhook] Processing text message from: ${profileName} (${from}) | Text: "${text}"`);

        // Find if lead exists
        let lead = await findLeadByPhoneNumber(from);

        if (lead) {
          console.log(`[WhatsApp Webhook] Found existing lead: ${lead.id}`);
          try {
            await saveChatMessage(lead.id, { text: text, sender: 'lead' });
            console.log(`[WhatsApp Webhook] Chat message saved for lead ID: ${lead.id}`);
          } catch (e) {
            console.error(`[WhatsApp Webhook] Error saving chat message for existing lead:`, e);
          }
        } else {
          console.log(`[WhatsApp Webhook] Phone number not found. Creating new lead...`);
          try {
            const newLeadId = await createLeadFromWhatsapp(profileName, from, text);
            if (newLeadId) {
              console.log(`[WhatsApp Webhook] New lead and first message successfully created with ID: ${newLeadId}`);
            } else {
              console.error(`[WhatsApp Webhook] createLeadFromWhatsapp returned null or undefined.`);
            }
          } catch (e) {
            console.error(`[WhatsApp Webhook] Error creating new lead:`, e);
          }
        }
      } else {
        console.log(`[WhatsApp Webhook] Ignoring non-text message of type: ${message.type}`);
      }
    } else if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.statuses) {
      console.log('[WhatsApp Webhook] Received a delivery status update. Ignoring.');
    } else {
      console.log('[WhatsApp Webhook] Received a valid but unhandled payload type.');
    }
    
    // Acknowledge receipt to Meta immediately
    return NextResponse.json({ status: "success" }, { status: 200 });

  } catch (error) {
    console.error('[WhatsApp Webhook] FATAL Error processing webhook:', error);
    // Return 200 to prevent Meta from resending/disabling the webhook
    return NextResponse.json({ message: "Error processing webhook, but acknowledged." }, { status: 200 });
  }
}
