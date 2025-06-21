
// src/app/api/whatsapp/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createLeadFromWhatsapp } from '@/lib/firebase/firestore';

// O token que você configurou no painel de desenvolvedores da Meta
const VERIFY_TOKEN = "testeapi";

/**
 * Handles the webhook verification GET request from Meta.
 */
export async function GET(request: NextRequest) {
  console.log('[WhatsApp Webhook] GET request received for verification.');
  const mode = request.nextUrl.searchParams.get('hub.mode');
  const token = request.nextUrl.searchParams.get('hub.verify_token');
  const challenge = request.nextUrl.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verification successful! Responding with challenge.');
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

    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry.length > 0) {
        for (const entry of body.entry) {
          if (entry.changes && entry.changes.length > 0) {
            for (const change of entry.changes) {
              if (change.field === 'messages' && change.value) {
                const value = change.value;

                if (value.messages && value.messages.length > 0) {
                  const message = value.messages[0];
                  
                  if (message.type === 'text') {
                    const from = message.from; // Phone number of the sender
                    const text = message.text.body;
                    const profileName = value.contacts?.[0]?.profile?.name || 'Sem Nome';

                    console.log(`[WhatsApp Webhook] Processing text message from: ${profileName} (${from})`);
                    
                    try {
                      // Directly create a new lead for every incoming message to simplify debugging
                      console.log(`[WhatsApp Webhook] Attempting to create new lead...`);
                      const newLeadId = await createLeadFromWhatsapp(profileName, from, text);
                      console.log(`[WhatsApp Webhook] Lead creation process finished. Result ID: ${newLeadId}`);
                    } catch (e) {
                       console.error(`[WhatsApp Webhook] CRITICAL: Error during lead creation process:`, e);
                    }
                  } else {
                    console.log(`[WhatsApp Webhook] Ignoring non-text message of type: ${message.type}`);
                  }
                }
              } else {
                 console.log('[WhatsApp Webhook] Received a change event that was not a message (e.g., status update). Ignoring.');
              }
            }
          }
        }
      }
    }
    
    // Acknowledge receipt to Meta immediately
    return NextResponse.json({ status: "success" }, { status: 200 });

  } catch (error) {
    console.error('[WhatsApp Webhook] FATAL Error processing webhook:', error);
    // IMPORTANT: Always return 200 to prevent Meta from resending/disabling the webhook
    return NextResponse.json({ message: "Error processing webhook, but acknowledged." }, { status: 200 });
  }
}
