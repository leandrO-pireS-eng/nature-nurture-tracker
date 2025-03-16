
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Droplet, 
  Leaf, 
  Trash2,
  Award
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Habit } from './HabitList';
import { Separator } from '@/components/ui/separator';

interface HabitDialogProps {
  habit: Habit | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const HabitDialog: React.FC<HabitDialogProps> = ({
  habit,
  open,
  onClose,
  onDelete
}) => {
  if (!habit) return null;

  // Get a nice description of the streak
  const getStreakText = (streak: number) => {
    if (streak === 0) return "Ainda não iniciou uma sequência";
    if (streak === 1) return "1 dia consecutivo";
    if (streak < 5) return `${streak} dias consecutivos`;
    if (streak < 10) return `${streak} dias consecutivos 🔥`;
    return `${streak} dias consecutivos 🔥🔥`;
  };

  // Get the habit type icon and color
  const getHabitTypeIcon = () => {
    switch (habit.type) {
      case 'water': return <Droplet className="text-blue-500" />;
      case 'prune': return <Leaf className="text-green-500" />;
      case 'fertilize': return <Leaf className="text-green-700" />;
      case 'plant': return <Leaf className="text-green-600" />;
      case 'harvest': return <Leaf className="text-yellow-600" />;
      default: return <Leaf className="text-green-500" />;
    }
  };

  // Format habit type for display
  const formatHabitType = (type: string) => {
    const typeMap: Record<string, string> = {
      'water': 'Regar',
      'prune': 'Podar',
      'fertilize': 'Fertilizar',
      'plant': 'Plantar',
      'harvest': 'Colher'
    };
    return typeMap[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-green-100">
              {getHabitTypeIcon()}
            </div>
            {habit.name}
          </DialogTitle>
          <DialogDescription>
            {habit.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Horário ideal: 09:00</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Diariamente</span>
            </div>
          </div>

          <Separator />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-yellow-500" size={18} />
              <span className="font-medium">Sequência atual</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{getStreakText(habit.streak)}</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                {habit.streak > 3 ? 'Ótimo progresso!' : 'Continue assim!'}
              </span>
            </div>
            <Progress value={Math.min(habit.streak * 10, 100)} className="h-2 mt-2" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="text-green-500" size={18} />
              <span className="font-medium">Tipo de cuidado</span>
            </div>
            <div className="bg-green-50 text-green-800 px-3 py-2 rounded-md text-sm">
              {formatHabitType(habit.type)}
            </div>
          </div>

          <Separator />
          
          <div className="text-sm text-gray-600">
            <p>Este hábito está conectado à planta "{habit.plantId}" no seu jardim.</p>
            <p className="mt-1">Complete este hábito regularmente para ver sua planta crescer!</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="destructive"
            onClick={() => onDelete(habit.id)}
            className="gap-2"
          >
            <Trash2 size={16} />
            Deletar
          </Button>
          <Button
            onClick={onClose}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitDialog;
