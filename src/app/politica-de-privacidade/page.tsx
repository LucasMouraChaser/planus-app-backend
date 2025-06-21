"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-foreground">
      <header className="relative text-center mb-12">
        <Link href="/sobre" passHref className="absolute top-1/2 -translate-y-1/2 left-0">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Política de Privacidade
        </h1>
      </header>

      <Card className="max-w-4xl mx-auto bg-card/70 backdrop-blur-lg border shadow-xl">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-normal">
            Última atualização: 29 de Julho de 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="prose prose-sm md:prose-base dark:prose-invert text-muted-foreground space-y-6">
              <p>
                Bem-vindo à Política de Privacidade do aplicativo Planus Energia ("nós", "nosso"). A sua privacidade é importante para nós. Esta política explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nosso aplicativo.
              </p>

              <h2 className="text-xl font-semibold text-foreground">1. Informações que Coletamos</h2>
              <p>
                Podemos coletar as seguintes informações:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Informações de Registro e Perfil:</strong> Nome, e-mail, CPF, telefone e outras informações que você fornece ao criar sua conta.</li>
                <li><strong>Informações de Leads e Clientes:</strong> Dados que você insere no CRM, como nomes, contatos, consumo de energia e detalhes de propostas dos seus clientes.</li>
                <li><strong>Dados de Uso:</strong> Informações sobre como você interage com o aplicativo, como funcionalidades acessadas e tempo de uso.</li>
                <li><strong>Informações de Comunicação:</strong> Mensagens recebidas através de integrações (como WhatsApp) e comunicações salvas no histórico de contato do CRM.</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground">2. Como Usamos Suas Informações</h2>
              <p>
                Utilizamos as informações coletadas para:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fornecer, operar e manter nosso aplicativo.</li>
                <li>Melhorar, personalizar e expandir nosso aplicativo.</li>
                <li>Entender e analisar como você usa nosso aplicativo.</li>
                <li>Processar suas transações, como solicitações de saque de comissão.</li>
                <li>Comunicar com você, seja diretamente ou através de um de nossos parceiros, incluindo para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao serviço.</li>
                <li>Cumprir obrigações legais.</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground">3. Compartilhamento de Informações</h2>
              <p>
                Não compartilhamos suas informações pessoais com terceiros, exceto nas seguintes circunstâncias:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Com seu consentimento:</strong> Podemos divulgar suas informações para qualquer outro propósito com o seu consentimento.</li>
                <li><strong>Para cumprir a lei:</strong> Podemos divulgar suas informações quando formos legalmente obrigados a fazê-lo.</li>
                <li><strong>Provedores de Serviço:</strong> Podemos compartilhar informações com provedores de serviço terceirizados que realizam serviços para nós ou em nosso nome (ex: provedores de hospedagem em nuvem como Firebase/Google Cloud).</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-foreground">4. Segurança dos Dados</h2>
              <p>
                Utilizamos medidas de segurança administrativas, técnicas e físicas para proteger suas informações pessoais. Embora tenhamos tomado medidas razoáveis para proteger as informações pessoais que você nos fornece, esteja ciente de que nenhum sistema de segurança é perfeito ou impenetrável.
              </p>
              
              <h2 className="text-xl font-semibold text-foreground">5. Seus Direitos de Privacidade</h2>
              <p>
                Dependendo da sua localização, você pode ter os seguintes direitos em relação às suas informações pessoais: o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Você pode gerenciar as informações do seu perfil diretamente no aplicativo ou entrando em contato conosco.
              </p>

              <h2 className="text-xl font-semibold text-foreground">6. Alterações a Esta Política</h2>
              <p>
                Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página. Aconselhamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações.
              </p>

              <h2 className="text-xl font-semibold text-foreground">7. Contato</h2>
              <p>
                Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através dos canais de suporte oficiais da Planus Energia.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
