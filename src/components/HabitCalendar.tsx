
import React from 'react';
import { format, subDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { desaturate } from '@/lib/utils';

export interface HabitEmoji {
  id: string;
  emoji: string;
  name: string;
  color?: string;
  streak: number;
  minimumDays: number;
}

export interface DailyHabit {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
  skipped: boolean;
}

interface HabitCalendarProps {
  habits: HabitEmoji[];
  dailyHabits: DailyHabit[];
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToggleHabit: (habitId: string, date: Date, completed: boolean) => void;
  onSkipHabit: (habitId: string, date: Date) => void;
  onHabitClick: (habitId: string) => void;
  onAddHabit: () => void;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({
  habits,
  dailyHabits,
  currentDate,
  onPreviousWeek,
  onNextWeek,
  onToggleHabit,
  onSkipHabit,
  onHabitClick,
  onAddHabit
}) => {
  // Generate an array of 7 days, starting from 3 days before current date
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    return subDays(currentDate, 3 - i);
  });

  // Check if a habit was completed on a specific date
  const isHabitCompleted = (habitId: string, date: Date) => {
    return dailyHabits.some(
      dh => dh.habitId === habitId && 
      format(dh.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
      dh.completed
    );
  };

  // Check if a habit was skipped on a specific date
  const isHabitSkipped = (habitId: string, date: Date) => {
    return dailyHabits.some(
      dh => dh.habitId === habitId && 
      format(dh.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
      dh.skipped
    );
  };

  // Is the date today or in the future
  const isFutureOrToday = (date: Date) => {
    return format(date, 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd');
  };

  // Is the date today
  const isToday = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        {/* Calendar header with navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onPreviousWeek}
            className="h-8 w-8"
          >
            <ArrowLeft size={16} />
          </Button>
          
          <div className="text-center">
            <h3 className="font-medium">
              {format(daysOfWeek[0], "d 'de' MMMM", { locale: ptBR })} - {format(daysOfWeek[6], "d 'de' MMMM", { locale: ptBR })}
            </h3>
            <p className="text-xs text-muted-foreground">
              {format(daysOfWeek[0], "yyyy", { locale: ptBR })}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onNextWeek}
            className="h-8 w-8"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
        
        {/* Day columns */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {daysOfWeek.map((day) => (
            <div 
              key={day.toString()} 
              className={`text-center p-1 ${isToday(day) ? 'bg-primary/10 rounded-t-md font-medium' : ''}`}
            >
              <div className="text-xs uppercase">{format(day, 'EEE', { locale: ptBR })}</div>
              <div className={`text-sm ${isToday(day) ? 'text-primary font-bold' : ''}`}>{format(day, 'd')}</div>
            </div>
          ))}
          
          {/* Habit rows */}
          {habits.map((habit) => (
            <React.Fragment key={habit.id}>
              {daysOfWeek.map((day) => {
                const completed = isHabitCompleted(habit.id, day);
                const skipped = isHabitSkipped(habit.id, day);
                
                return (
                  <div 
                    key={`${habit.id}-${day.toString()}`} 
                    className={`p-1 min-h-14 border border-gray-100 flex flex-col items-center justify-center ${
                      isToday(day) ? 'bg-primary/5' : ''
                    }`}
                  >
                    {completed ? (
                      <div 
                        className="cursor-pointer text-2xl relative group" 
                        onClick={() => onToggleHabit(habit.id, day, false)}
                        title={habit.name}
                      >
                        <span>{habit.emoji}</span>
                        
                        {/* Hover action to undo */}
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} className="text-gray-600" />
                        </div>
                      </div>
                    ) : skipped ? (
                      <div 
                        className="cursor-pointer text-2xl opacity-50 relative group"
                        onClick={() => onToggleHabit(habit.id, day, true)}
                        title={`${habit.name} (pulado)`}
                      >
                        <span className="grayscale">{habit.emoji}</span>
                        
                        {/* Hover action to undo skip */}
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} className="text-gray-600" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {!isFutureOrToday(day) ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => onToggleHabit(habit.id, day, true)}
                              title={`Marcar ${habit.name} como completo`}
                            >
                              <span className="text-xl">{habit.emoji}</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 text-[10px] px-1" 
                              onClick={() => onSkipHabit(habit.id, day)}
                            >
                              não fiz
                            </Button>
                          </>
                        ) : (
                          <div className="h-12 flex items-center justify-center text-gray-300 text-xs">
                            {isToday(day) ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onToggleHabit(habit.id, day, true)}
                                title={`Marcar ${habit.name} como completo`}
                              >
                                <span className="text-xl opacity-50">{habit.emoji}</span>
                              </Button>
                            ) : (
                              <span className="text-xl opacity-25">{habit.emoji}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        {/* Add habit button */}
        <div className="mt-4 flex justify-center">
          <Button onClick={onAddHabit} variant="outline" className="gap-2">
            Adicionar hábito
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCalendar;
