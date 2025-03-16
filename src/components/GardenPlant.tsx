
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Flower2, 
  Sprout, 
  Leaf, 
  TreePine,
  CheckCircle2
} from 'lucide-react';

type PlantStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'flowering';
type PlantType = 'flower' | 'vegetable' | 'tree' | 'herb';

interface GardenPlantProps {
  name: string;
  type: PlantType;
  stage: PlantStage;
  completed: number; // Percentage of tasks completed (0-100)
  onClick?: () => void;
}

const GardenPlant = ({ name, type, stage, completed, onClick }: GardenPlantProps) => {
  const getPlantIcon = () => {
    if (stage === 'seed') return null;
    
    switch (type) {
      case 'flower':
        return stage === 'flowering' || stage === 'mature' 
          ? <Flower2 className="text-garden-flower animate-sway" /> 
          : <Sprout className="text-garden-leaf animate-sway" />;
      case 'vegetable':
        return stage === 'mature' || stage === 'flowering'
          ? <Leaf className="text-garden-leaf animate-sway" size={24} />
          : <Sprout className="text-garden-leaf animate-sway" />;
      case 'tree':
        return stage === 'mature' || stage === 'flowering'
          ? <TreePine className="text-garden-leaf animate-sway" size={28} />
          : <Sprout className="text-garden-leaf animate-sway" />;
      case 'herb':
        return stage === 'mature' || stage === 'flowering'
          ? <Leaf className="text-garden-leaf animate-sway" />
          : <Sprout className="text-garden-leaf animate-sway" />;
      default:
        return <Sprout className="text-garden-leaf animate-sway" />;
    }
  };

  const getSizeByStage = () => {
    switch (stage) {
      case 'seed': return 'h-2';
      case 'sprout': return 'h-6';
      case 'growing': return 'h-10';
      case 'mature': return 'h-16';
      case 'flowering': return 'h-20';
      default: return 'h-6';
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-end cursor-pointer group transition-all duration-300"
      onClick={onClick}
    >
      {/* Plant pot */}
      <div className="w-12 h-6 bg-orange-700 rounded-t-full relative overflow-hidden">
        <div className="absolute bottom-0 w-full rounded-t-full bg-orange-800 h-2"></div>
      </div>
      
      {/* Soil */}
      <div className="w-10 h-4 bg-garden-soil rounded-t-full relative -mt-2 z-10">
        <div className="absolute bottom-0 w-full h-1 bg-garden-soil/70 rounded-t-full"></div>
      </div>
      
      {/* Plant stem */}
      <div 
        className={cn(
          "w-1 bg-garden-leaf rounded-full -mt-2 z-0 animate-grow", 
          getSizeByStage(),
          { "opacity-50": completed < 50 }
        )}
      ></div>
      
      {/* Plant icon */}
      <div className="absolute bottom-4 transform -translate-y-1/2">
        {getPlantIcon()}
      </div>
      
      {/* Plant name */}
      <div className="mt-2 text-xs font-medium text-center max-w-20 truncate">{name}</div>
      
      {/* Completed indicator */}
      {completed >= 100 && (
        <div className="absolute -top-2 -right-2 text-green-500 bg-white rounded-full">
          <CheckCircle2 size={16} />
        </div>
      )}
      
      {/* Hover info */}
      <div className="absolute bottom-full mb-2 w-28 bg-white/90 p-2 rounded-lg shadow-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 text-xs">
        <div className="font-bold">{name}</div>
        <div className="text-gray-600">Growth: {completed}%</div>
        <div className="text-gray-600">Stage: {stage}</div>
      </div>
    </div>
  );
};

export default GardenPlant;
