
// src/app/api/whatsapp/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findLeadByPhoneNumber, createLeadFromWhatsapp, saveChatMessage } from '@/lib/firebase/firestore';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => {
    console.error("[WhatsApp Webhook] Failed to parse request body as JSON.");
    return null;
  });

  console.log("[WhatsApp Webhook] Received payload:", JSON.stringify(body, null, 2));

  if (!body || body.object !== "whatsapp_business_account") {
    console.error("[WhatsApp Webhook] Invalid or non-WhatsApp payload received.");
    return NextResponse.json({ message: "Error: Not a WhatsApp payload" }, { status: 200 });
  }

  try {
    const change = body.entry?.[0]?.changes?.[0];

    if (change?.field === "messages" && change?.value?.messages?.[0]) {
      const message = change.value.messages[0];
      const contact = change.value.contacts?.[0];

      if (message.type === "text") {
        const from = message.from;
        const text = message.text.body;
        const contactName = contact?.profile?.name || 'Novo Contato WhatsApp';

        console.log(`[WhatsApp Webhook] Processing text message from ${contactName} (${from}): "${text}"`);

        let lead = await findLeadByPhoneNumber(from);

        if (lead) {
          console.log(`[WhatsApp Webhook] Found existing lead ID: ${lead.id}. Saving message.`);
          await saveChatMessage(lead.id, { text: text, sender: 'lead' });
          console.log(`[WhatsApp Webhook] Message saved for lead ${lead.id}.`);
        } else {
          console.log(`[WhatsApp Webhook] No existing lead for ${from}. Creating new lead.`);
          const newLeadId = await createLeadFromWhatsapp(contactName, from, text); // Pass the text
          if (newLeadId) {
            console.log(`[WhatsApp Webhook] New lead created with ID: ${newLeadId}.`);
          } else {
            console.error(`[WhatsApp Webhook] Failed to create new lead for ${from}.`);
          }
        }
      } else {
        console.log(`[WhatsApp Webhook] Ignoring non-text message of type: ${message.type}`);
      }
    } else {
      console.log("[WhatsApp Webhook] Received a change, but it was not a message or was malformed. Ignoring.");
    }
  } catch (error) {
    console.error("[WhatsApp Webhook] FATAL Error processing webhook payload:", error);
  }
  
  return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
}


// GET endpoint for webhook verification (required by Meta)
export async function GET(request: NextRequest) {
    const mode = request.nextUrl.searchParams.get('hub.mode');
    const token = request.nextUrl.searchParams.get('hub.verify_token');
    const challenge = request.nextUrl.searchParams.get('hub.challenge');

    const VERIFY_TOKEN = "tokenparaapioficial";

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('[WhatsApp Webhook] Verification successful!');
        return new Response(challenge, { status: 200 });
    } else {
        console.error('[WhatsApp Webhook] Verification failed. Mode or token mismatch.');
        return new Response('Forbidden', { status: 403 });
    }
}
