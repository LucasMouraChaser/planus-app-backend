
'use server';
/**
 * @fileOverview A bulk WhatsApp message sending simulation flow.
 *
 * - sendBulkWhatsappMessages - A function that simulates sending bulk messages.
 * - SendBulkWhatsappMessagesInput - The input type for the function.
 * - SendBulkWhatsappMessagesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const OutboundLeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  consumption: z.number(),
  company: z.string().optional(),
});
export type OutboundLead = z.infer<typeof OutboundLeadSchema>;

const SendingConfigurationSchema = z.object({
  sendPerChip: z.number().int().positive(),
  sendInterval: z.number().int().positive(),
  randomDelay: z.number().int().nonnegative(),
  restAfterRound: z.string(),
  numberOfSimultaneousWhatsapps: z.number().int().positive(),
});
export type SendingConfiguration = z.infer<typeof SendingConfigurationSchema>;

const SendBulkWhatsappMessagesInputSchema = z.object({
  leads: z.array(OutboundLeadSchema),
  messageTemplate: z.string(),
  configuration: SendingConfigurationSchema,
});
export type SendBulkWhatsappMessagesInput = z.infer<typeof SendBulkWhatsappMessagesInputSchema>;

const SendBulkWhatsappMessagesOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  sentCount: z.number(),
});
export type SendBulkWhatsappMessagesOutput = z.infer<typeof SendBulkWhatsappMessagesOutputSchema>;


export async function sendBulkWhatsappMessages(input: SendBulkWhatsappMessagesInput): Promise<SendBulkWhatsappMessagesOutput> {
  return sendBulkWhatsappMessagesFlow(input);
}


const sendBulkWhatsappMessagesFlow = ai.defineFlow(
  {
    name: 'sendBulkWhatsappMessagesFlow',
    inputSchema: SendBulkWhatsappMessagesInputSchema,
    outputSchema: SendBulkWhatsappMessagesOutputSchema,
  },
  async (input) => {
    // This is a simulation. We are not actually sending messages.
    // We'll just log the action and return a success response.
    
    console.log(`Simulating bulk message send for ${input.leads.length} leads.`);
    console.log(`Message Template: ${input.messageTemplate}`);
    console.log('Sending Configuration:', input.configuration);

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const sentCount = input.leads.length;

    return {
      success: true,
      message: `Simulação de disparo concluída com sucesso para ${sentCount} contatos.`,
      sentCount: sentCount,
    };
  }
);
