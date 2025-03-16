import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays, subDays, format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import NavBar from '@/components/NavBar';
import GardenView from '@/components/GardenView';
import HabitList, { Habit } from '@/components/HabitList';
import HabitDialog from '@/components/HabitDialog';
import HabitCalendar, { HabitEmoji, DailyHabit } from '@/components/HabitCalendar';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowDown } from 'lucide-react';

// Mock data for the initial app state
const MOCK_PLANTS = [
  {
    id: "plant1",
    name: "Tomate",
    type: "vegetable" as const,
    stage: "growing" as const,
    completed: 60
  },
  {
    id: "plant2",
    name: "Girassol",
    type: "flower" as const,
    stage: "sprout" as const,
    completed: 20
  },
  {
    id: "plant3",
    name: "Manjericão",
    type: "herb" as const,
    stage: "mature" as const,
    completed: 100
  },
  {
    id: "plant4",
    name: "Pinheiro",
    type: "tree" as const,
    stage: "seed" as const,
    completed: 30
  }
];

const MOCK_HABITS: Habit[] = [
  {
    id: "habit1",
    name: "Regar o tomate",
    description: "Regar a planta de tomate diariamente pela manhã",
    type: "water",
    completed: false,
    streak: 3,
    plantId: "plant1"
  },
  {
    id: "habit2",
    name: "Podar o girassol",
    description: "Remover folhas secas e amareladas",
    type: "prune",
    completed: true,
    streak: 2,
    plantId: "plant2"
  },
  {
    id: "habit3",
    name: "Fertilizar o manjericão",
    description: "Adicionar adubo orgânico uma vez por semana",
    type: "fertilize",
    completed: false,
    streak: 7,
    plantId: "plant3"
  },
  {
    id: "habit4",
    name: "Verificar o pinheiro",
    description: "Verificar se as raízes estão se desenvolvendo bem",
    type: "plant",
    completed: true,
    streak: 1,
    plantId: "plant4"
  }
];

// Mock emoji habits for the calendar
const MOCK_EMOJI_HABITS: HabitEmoji[] = [
  { id: "emoji1", emoji: "🌻", name: "Meditar", streak: 5, minimumDays: 21 },
  { id: "emoji2", emoji: "🌷", name: "Ler", streak: 3, minimumDays: 14 },
  { id: "emoji3", emoji: "🌱", name: "Exercitar", streak: 7, minimumDays: 30 },
  { id: "emoji4", emoji: "🍀", name: "Beber água", streak: 10, minimumDays: 60 }
];

// Generate mock daily habits data
const generateMockDailyHabits = (): DailyHabit[] => {
  const result: DailyHabit[] = [];
  const today = new Date(2025, 2, 12); // March 12, 2025, as specified
  
  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    
    MOCK_EMOJI_HABITS.forEach(habit => {
      // More likely to have completed habits in recent days
      const completionChance = i < 5 ? 0.7 : i < 10 ? 0.6 : i < 20 ? 0.5 : 0.4;
      const skipChance = 0.1;
      
      const random = Math.random();
      
      if (random < completionChance) {
        result.push({
          id: `${habit.id}-${format(date, 'yyyy-MM-dd')}`,
          habitId: habit.id,
          date: date,
          completed: true,
          skipped: false
        });
      } else if (random < completionChance + skipChance) {
        result.push({
          id: `${habit.id}-${format(date, 'yyyy-MM-dd')}`,
          habitId: habit.id,
          date: date,
          completed: false,
          skipped: true
        });
      }
    });
  }
  
  return result;
};

const MOCK_DAILY_HABITS = generateMockDailyHabits();

const Index = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState(MOCK_PLANTS);
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [emojiHabits, setEmojiHabits] = useState<HabitEmoji[]>(MOCK_EMOJI_HABITS);
  const [dailyHabits, setDailyHabits] = useState<DailyHabit[]>(MOCK_DAILY_HABITS);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHabitDialogOpen, setIsHabitDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 2, 12)); // March 12, 2025
  
  // Calculate the longest streak for the NavBar
  const longestStreak = Math.max(...habits.map(h => h.streak));

  const handleToggleHabit = (id: string, completed: boolean) => {
    // Update the habit completion status
    const updatedHabits = habits.map(habit => 
      habit.id === id 
        ? { 
            ...habit, 
            completed, 
            streak: completed ? habit.streak + 1 : Math.max(0, habit.streak - 1) 
          } 
        : habit
    );
    setHabits(updatedHabits);
    
    // Update the related plant progress
    const habit = habits.find(h => h.id === id);
    if (habit) {
      const updatedPlants = plants.map(plant => {
        if (plant.id === habit.plantId) {
          // Calculate new completion percentage
          const relatedHabits = habits.filter(h => h.plantId === plant.id);
          const completedCount = relatedHabits.filter(h => h.id === id ? completed : h.completed).length;
          const newCompletionPercentage = (completedCount / relatedHabits.length) * 100;
          
          // Determine plant stage based on completion
          let newStage = plant.stage;
          if (newCompletionPercentage >= 100) newStage = "mature";
          else if (newCompletionPercentage >= 75) newStage = "flowering";
          else if (newCompletionPercentage >= 50) newStage = "growing";
          else if (newCompletionPercentage >= 25) newStage = "sprout";
          else newStage = "seed";
          
          return {
            ...plant,
            completed: newCompletionPercentage,
            stage: newStage as any
          };
        }
        return plant;
      });
      
      setPlants(updatedPlants);
    }
    
    // Show toast notification
    if (completed) {
      toast({
        title: "Hábito concluído!",
        description: "Sua planta está ficando mais saudável! 🌱",
      });
    }
  };

  const handleViewHabitDetails = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      setSelectedHabit(habit);
      setIsHabitDialogOpen(true);
    }
  };

  const handleAddHabit = () => {
    navigate('/add-habit');
  };

  const handlePlantInteract = (plantId: string) => {
    // Find the plant and related habits
    const plant = plants.find(p => p.id === plantId);
    const relatedHabits = habits.filter(h => h.plantId === plantId);
    
    if (plant && relatedHabits.length > 0) {
      const pendingHabits = relatedHabits.filter(h => !h.completed);
      
      if (pendingHabits.length > 0) {
        toast({
          title: `${plant.name} precisa de cuidados!`,
          description: `Complete ${pendingHabits.length} hábito(s) pendente(s) para ajudar esta planta a crescer.`,
        });
      } else {
        toast({
          title: `${plant.name} está saudável!`,
          description: "Todos os hábitos para esta planta estão completos. Ótimo trabalho!",
        });
      }
    }
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setIsHabitDialogOpen(false);
    
    toast({
      title: "Hábito removido",
      description: "O hábito foi removido com sucesso.",
    });
  };

  // Calendar handlers
  const handleToggleCalendarHabit = (habitId: string, date: Date, completed: boolean) => {
    setDailyHabits(prev => {
      // Check if this habit already has an entry for this date
      const existingIndex = prev.findIndex(
        dh => dh.habitId === habitId && format(dh.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          completed,
          skipped: false
        };
        return updated;
      } else {
        // Add new entry
        return [...prev, {
          id: `${habitId}-${format(date, 'yyyy-MM-dd')}`,
          habitId,
          date,
          completed,
          skipped: false
        }];
      }
    });
    
    // Show toast notification
    toast({
      title: completed ? "Hábito concluído!" : "Hábito desmarcado",
      description: completed 
        ? "Continue assim para cultivar hábitos saudáveis!" 
        : "Você pode marcar novamente quando completar este hábito.",
    });
  };
  
  const handleSkipCalendarHabit = (habitId: string, date: Date) => {
    setDailyHabits(prev => {
      // Check if this habit already has an entry for this date
      const existingIndex = prev.findIndex(
        dh => dh.habitId === habitId && format(dh.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          completed: false,
          skipped: true
        };
        return updated;
      } else {
        // Add new entry
        return [...prev, {
          id: `${habitId}-${format(date, 'yyyy-MM-dd')}`,
          habitId,
          date,
          completed: false,
          skipped: true
        }];
      }
    });
    
    // Show toast notification
    toast({
      title: "Hábito pulado",
      description: "Não tem problema pular de vez em quando. Continue com os outros hábitos!",
    });
  };
  
  const handlePreviousWeek = () => {
    setCurrentDate(prev => subDays(prev, 7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };
  
  const handleHabitClick = (habitId: string) => {
    // In a real app, this would navigate to habit details
    toast({
      title: "Detalhes do hábito",
      description: "Esta funcionalidade estará disponível em breve!",
    });
  };

  // Handler functions for NavBar actions
  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/plans');
  };

  const handleReportClick = () => {
    navigate('/stats');
  };

  return (
    <div className="min-h-screen garden-background">
      <div className="container mx-auto max-w-4xl pb-10">
        <NavBar 
          username="Jardineiro"
          streak={longestStreak}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onReportClick={handleReportClick}
        />
        
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Seu Jardim Virtual</h1>
          <p className="text-gray-700 mb-6">Cultive bons hábitos e veja suas plantas crescerem!</p>
        </div>
        
        <GardenView 
          plants={plants} 
          onPlantInteract={handlePlantInteract} 
        />
        
        <div className="flex justify-center -mt-2 mb-4">
          <Button variant="outline" size="sm" className="rounded-full gap-1 bg-white shadow-sm">
            <ArrowDown size={16} />
            <span>Hábitos</span>
          </Button>
        </div>
        
        {/* Calendar view of habits by day */}
        <HabitCalendar
          habits={emojiHabits}
          dailyHabits={dailyHabits}
          currentDate={currentDate}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          onToggleHabit={handleToggleCalendarHabit}
          onSkipHabit={handleSkipCalendarHabit}
          onHabitClick={handleHabitClick}
          onAddHabit={handleAddHabit}
        />
        
        {/* List view of habits (keeping for reference) */}
        <HabitList 
          habits={habits}
          onToggleHabit={handleToggleHabit}
          onViewHabitDetails={handleViewHabitDetails}
          onAddHabit={handleAddHabit}
        />
        
        <HabitDialog
          habit={selectedHabit}
          open={isHabitDialogOpen}
          onClose={() => setIsHabitDialogOpen(false)}
          onDelete={handleDeleteHabit}
        />
        
        <footer className="mt-12 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf size={16} className="text-green-600" />
            <p>HORTA HABITS</p>
          </div>
          <p>Cultive bons hábitos, colha bons resultados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
