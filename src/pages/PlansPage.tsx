
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Leaf } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PLANS = [
  {
    id: 'basic',
    name: 'Plano Gratuito',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Comece a cultivar seus hábitos',
    features: [
      'Até 3 hábitos simultâneos',
      'Histórico de 7 dias',
      'Jardim virtual básico',
    ],
    recommended: false,
    buttonText: 'Continuar Gratuito',
  },
  {
    id: 'pro',
    name: 'Plano Jardim',
    price: 'R$ 9,90',
    period: 'por mês',
    description: 'Cultive hábitos sem limites',
    features: [
      'Hábitos ilimitados',
      'Histórico completo',
      'Jardim virtual personalizado',
      'Análises detalhadas',
      'Suporte prioritário',
    ],
    recommended: true,
    buttonText: 'Escolher Plano',
  },
  {
    id: 'family',
    name: 'Plano Floresta',
    price: 'R$ 19,90',
    period: 'por mês',
    description: 'Cultive hábitos em família',
    features: [
      'Tudo do Plano Jardim',
      'Até 5 perfis de usuários',
      'Jardins compartilhados',
      'Competições em grupo',
      'Suporte VIP',
    ],
    recommended: false,
    buttonText: 'Escolher Plano',
  },
];

const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handlePlanSelect = () => {
    // Redirect to the adapta.org website as requested
    window.open('https://adapta.org', '_blank');
  };

  return (
    <div className="container mx-auto max-w-5xl pb-10 pt-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Planos de Assinatura</h1>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Escolha o plano perfeito para você</h2>
        <p className="text-muted-foreground">
          Cultive seus hábitos e veja seu jardim florescer
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`relative overflow-hidden ${plan.recommended ? 'border-primary shadow-lg' : ''}`}>
            {plan.recommended && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-bl-lg rounded-tr-lg rounded-br-none rounded-tl-none px-3 py-1.5 bg-primary text-white">
                  Recomendado
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className={plan.recommended ? "text-primary" : "text-muted-foreground"} />
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-2">
                <div className="text-3xl font-bold">{plan.price}</div>
                <div className="text-sm text-muted-foreground">{plan.period}</div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="text-primary shrink-0 mt-0.5" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handlePlanSelect}
                className={`w-full gap-2 ${plan.recommended ? '' : 'bg-muted-foreground/80 hover:bg-muted-foreground'}`}
              >
                <span>{plan.buttonText}</span>
                <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Todos os planos incluem acesso ao app Horta Habits. 
          Pagamentos processados de forma segura.
        </p>
        <p className="mt-1">
          Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>
      </div>
    </div>
  );
};

export default PlansPage;
