
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Droplet, 
  Scissors, 
  Sun, 
  Shovel, 
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type HabitType = 'water' | 'prune' | 'fertilize' | 'plant' | 'harvest';

interface HabitItemProps {
  id: string;
  name: string;
  description: string;
  type: HabitType;
  completed: boolean;
  streak: number;
  plantId: string;
  onToggle: (id: string, completed: boolean) => void;
  onViewDetails: (id: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  id,
  name,
  description,
  type,
  completed,
  streak,
  onToggle,
  onViewDetails
}) => {
  const getHabitIcon = () => {
    switch (type) {
      case 'water': return <Droplet className="text-garden-water" size={20} />;
      case 'prune': return <Scissors className="text-garden-leaf" size={20} />;
      case 'fertilize': return <Shovel className="text-garden-soil" size={20} />;
      case 'plant': return <Shovel className="text-garden-leaf" size={20} />;
      case 'harvest': return <Sun className="text-garden-sun" size={20} />;
      default: return <Droplet className="text-garden-water" size={20} />;
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
      completed ? "bg-green-50" : "bg-white",
      "hover:shadow-md"
    )}>
      <Checkbox 
        id={`habit-${id}`} 
        checked={completed}
        onCheckedChange={(checked) => onToggle(id, checked as boolean)}
        className="data-[state=checked]:bg-green-600 data-[state=checked]:text-white h-5 w-5"
      />
      
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-green-100">
            {getHabitIcon()}
          </div>
          <div className="font-medium">{name}</div>
          {streak > 4 && (
            <Badge variant="outline" className="bg-orange-50 text-orange-600 text-xs">
              {streak} dias 🔥
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{description}</p>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onViewDetails(id)}
        className="text-gray-500 hover:text-gray-700"
      >
        <Info size={18} />
      </Button>
    </div>
  );
};

export default HabitItem;
