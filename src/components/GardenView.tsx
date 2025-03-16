
import React from 'react';
import GardenPlant from './GardenPlant';
import { toast } from '@/components/ui/use-toast';
import { Cloud, Sun } from 'lucide-react';

interface Plant {
  id: string;
  name: string;
  type: 'flower' | 'vegetable' | 'tree' | 'herb';
  stage: 'seed' | 'sprout' | 'growing' | 'mature' | 'flowering';
  completed: number;
}

interface GardenViewProps {
  plants: Plant[];
  onPlantInteract: (plantId: string) => void;
}

const GardenView = ({ plants, onPlantInteract }: GardenViewProps) => {
  const handlePlantClick = (plantId: string) => {
    onPlantInteract(plantId);
    toast({
      title: "Planta examinada!",
      description: "Continue completando suas tarefas para ajudar essa planta a crescer.",
    });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-garden-gradient p-4 min-h-[300px] md:min-h-[400px]">
      {/* Sun */}
      <div className="absolute top-4 right-8 text-garden-sun">
        <Sun size={40} className="animate-pulse" />
      </div>
      
      {/* Clouds */}
      <div className="absolute top-6 left-10 text-white opacity-80">
        <Cloud size={30} />
      </div>
      <div className="absolute top-12 right-24 text-white opacity-70">
        <Cloud size={24} />
      </div>
      
      {/* Garden bed */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-garden-soil/20 rounded-t-3xl">
        {/* Garden plants container */}
        <div className="relative flex flex-wrap justify-center gap-6 px-4 pt-10 pb-6">
          {plants.length > 0 ? (
            plants.map((plant) => (
              <GardenPlant
                key={plant.id}
                name={plant.name}
                type={plant.type}
                stage={plant.stage}
                completed={plant.completed}
                onClick={() => handlePlantClick(plant.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p className="font-medium">Seu jardim está vazio!</p>
              <p className="text-sm mt-2">Complete hábitos para fazer suas plantas crescerem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GardenView;
