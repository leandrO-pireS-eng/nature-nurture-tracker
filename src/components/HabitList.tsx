
import React from 'react';
import HabitItem, { HabitType } from './HabitItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Habit {
  id: string;
  name: string;
  description: string;
  type: HabitType;
  completed: boolean;
  streak: number;
  plantId: string;
}

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: string, completed: boolean) => void;
  onViewHabitDetails: (id: string) => void;
  onAddHabit: () => void;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggleHabit,
  onViewHabitDetails,
  onAddHabit
}) => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Seus Hábitos</CardTitle>
          <Button onClick={onAddHabit} size="sm" className="gap-1">
            <Plus size={16} />
            <span>Novo</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">Pendentes</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">Completos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-3 mt-0">
            {habits.length > 0 ? (
              habits.map(habit => (
                <HabitItem
                  key={habit.id}
                  id={habit.id}
                  name={habit.name}
                  description={habit.description}
                  type={habit.type}
                  completed={habit.completed}
                  streak={habit.streak}
                  plantId={habit.plantId}
                  onToggle={onToggleHabit}
                  onViewDetails={onViewHabitDetails}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum hábito encontrado</p>
                <p className="text-sm mt-1">Clique em "Novo" para adicionar um hábito</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-3 mt-0">
            {habits.filter(h => !h.completed).length > 0 ? (
              habits.filter(h => !h.completed).map(habit => (
                <HabitItem
                  key={habit.id}
                  id={habit.id}
                  name={habit.name}
                  description={habit.description}
                  type={habit.type}
                  completed={habit.completed}
                  streak={habit.streak}
                  plantId={habit.plantId}
                  onToggle={onToggleHabit}
                  onViewDetails={onViewHabitDetails}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Todos os hábitos foram completados. Parabéns! 🎉</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-3 mt-0">
            {habits.filter(h => h.completed).length > 0 ? (
              habits.filter(h => h.completed).map(habit => (
                <HabitItem
                  key={habit.id}
                  id={habit.id}
                  name={habit.name}
                  description={habit.description}
                  type={habit.type}
                  completed={habit.completed}
                  streak={habit.streak}
                  plantId={habit.plantId}
                  onToggle={onToggleHabit}
                  onViewDetails={onViewHabitDetails}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum hábito completado ainda</p>
                <p className="text-sm mt-1">Complete seus hábitos para ver progresso no seu jardim</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HabitList;
