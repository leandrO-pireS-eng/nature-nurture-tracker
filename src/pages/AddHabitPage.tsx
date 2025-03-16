
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Flower, Flower2, Leaf, LeafyGreen } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

const EMOJI_OPTIONS = [
  { emoji: '🌻', name: 'Girassol' },
  { emoji: '🌹', name: 'Rosa' },
  { emoji: '🌷', name: 'Tulipa' },
  { emoji: '🌸', name: 'Flor de Cerejeira' },
  { emoji: '🌺', name: 'Hibisco' },
  { emoji: '🌼', name: 'Margarida' },
  { emoji: '🌱', name: 'Broto' },
  { emoji: '🌿', name: 'Erva' },
  { emoji: '🍀', name: 'Trevo' },
  { emoji: '🌵', name: 'Cacto' },
  { emoji: '🌴', name: 'Palmeira' },
  { emoji: '🍄', name: 'Cogumelo' },
  { emoji: '🌳', name: 'Árvore' },
  { emoji: '🌲', name: 'Pinheiro' },
  { emoji: '🍃', name: 'Folhas ao Vento' },
  { emoji: '🍂', name: 'Folha de Outono' },
  { emoji: '🍁', name: 'Folha de Bordo' },
  { emoji: '🪷', name: 'Lótus' },
  { emoji: '🪴', name: 'Planta em Vaso' },
  { emoji: '🌾', name: 'Arroz' },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  emoji: z.string().min(1, {
    message: "Selecione uma flor ou planta.",
  }),
  minimumDays: z.number().min(1).max(365),
});

type HabitFormValues = z.infer<typeof formSchema>;

const AddHabitPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      emoji: "",
      minimumDays: 7,
    },
  });

  const onSubmit = (values: HabitFormValues) => {
    // In a real application, this would save to a database
    toast({
      title: "Hábito criado!",
      description: `${values.name} foi adicionado com sucesso. Meta: ${values.minimumDays} dias.`,
    });
    
    // Navigate back to the main screen
    navigate('/');
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    form.setValue('emoji', emoji);
  };

  return (
    <div className="container mx-auto max-w-4xl pb-10 pt-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Adicionar Novo Hábito</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Crie seu hábito</CardTitle>
          <CardDescription>
            Escolha um nome para seu hábito, um emoji que o represente, e quantos dias pretende mantê-lo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do hábito</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Beber água" {...field} />
                    </FormControl>
                    <FormDescription>
                      Escolha um nome simples e claro para seu hábito.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escolha uma flor ou planta</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                        {EMOJI_OPTIONS.map((option) => (
                          <Button
                            key={option.emoji}
                            type="button"
                            variant="outline"
                            className={`h-12 text-2xl ${selectedEmoji === option.emoji ? 'bg-primary/20 border-primary' : ''}`}
                            onClick={() => handleEmojiSelect(option.emoji)}
                            title={option.name}
                          >
                            {option.emoji}
                            {selectedEmoji === option.emoji && (
                              <div className="absolute top-0 right-0 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                                <Check size={10} className="text-white" />
                              </div>
                            )}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Este emoji representará seu hábito no jardim virtual.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="minimumDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta de dias</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={[field.value]}
                          min={1}
                          max={30}
                          step={1}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                        <div className="text-center font-medium text-2xl">
                          {field.value} {field.value === 1 ? 'dia' : 'dias'}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Por quantos dias, no mínimo, pretende manter este hábito?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => navigate('/')}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Hábito</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddHabitPage;
