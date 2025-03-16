
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar as CalendarIcon, PieChart } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { HabitEmoji, DailyHabit } from '@/components/HabitCalendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface StatsPageProps {
  // Demo data would be passed from the parent component in a real app
  habits?: HabitEmoji[];
  dailyHabits?: DailyHabit[];
}

const StatsPage: React.FC<StatsPageProps> = ({ 
  habits = [], 
  dailyHabits = [] 
}) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<"month" | "custom">("month");
  
  // Demo habits if none are provided
  const demoHabits: HabitEmoji[] = habits.length > 0 ? habits : [
    { id: '1', emoji: '🌻', name: 'Beber água', streak: 7, minimumDays: 30 },
    { id: '2', emoji: '🌷', name: 'Meditar', streak: 4, minimumDays: 21 },
    { id: '3', emoji: '🌱', name: 'Exercício', streak: 2, minimumDays: 14 },
    { id: '4', emoji: '🍀', name: 'Leitura', streak: 5, minimumDays: 7 },
  ];
  
  // Generate demo daily habits data
  const getDemoDailyHabits = (): DailyHabit[] => {
    if (dailyHabits.length > 0) return dailyHabits;
    
    const today = new Date();
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
    
    const result: DailyHabit[] = [];
    
    daysInMonth.forEach(day => {
      // Skip future days
      if (day > today) return;
      
      demoHabits.forEach(habit => {
        // Random completion with higher chance of completion for older dates
        const dayDiff = Math.floor((today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24));
        const completionChance = Math.min(0.7, 0.4 + (dayDiff / 100));
        const skipChance = 0.1;
        
        const random = Math.random();
        
        if (random < completionChance) {
          result.push({
            id: `${habit.id}-${format(day, 'yyyy-MM-dd')}`,
            habitId: habit.id,
            date: day,
            completed: true,
            skipped: false
          });
        } else if (random < completionChance + skipChance) {
          result.push({
            id: `${habit.id}-${format(day, 'yyyy-MM-dd')}`,
            habitId: habit.id,
            date: day,
            completed: false,
            skipped: true
          });
        }
      });
    });
    
    return result;
  };
  
  const demoDailyHabits = getDemoDailyHabits();
  
  // Calculate completion stats
  const getCompletionStats = () => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
    
    const today = new Date();
    const pastDays = daysInMonth.filter(day => day <= today);
    
    const totalPossible = pastDays.length * demoHabits.length;
    const totalCompleted = demoDailyHabits.filter(h => h.completed).length;
    const totalSkipped = demoDailyHabits.filter(h => h.skipped).length;
    
    return {
      totalPossible,
      totalCompleted,
      totalSkipped,
      completionRate: totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0,
      skipRate: totalPossible > 0 ? (totalSkipped / totalPossible) * 100 : 0,
    };
  };
  
  const stats = getCompletionStats();
  
  // Calculate the best streak for each habit
  const getBestStreaks = () => {
    return demoHabits.map(habit => ({
      ...habit,
      streak: habit.streak // In a real app, you would calculate this from dailyHabits
    }));
  };
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };
  
  const handleDateRangeChange = (value: string) => {
    setDateRange(value as "month" | "custom");
  };

  return (
    <div className="container mx-auto max-w-4xl pb-10 pt-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Estatísticas de Hábitos</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Conclusão</CardTitle>
            <CardDescription>Mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {stats.completionRate.toFixed(0)}%
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.totalCompleted} de {stats.totalPossible} hábitos completados
            </p>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Maior Sequência</CardTitle>
            <CardDescription>Ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {Math.max(...demoHabits.map(h => h.streak))} dias
            </div>
            <p className="text-sm text-muted-foreground">
              {demoHabits.find(h => h.streak === Math.max(...demoHabits.map(h => h.streak)))?.name}
            </p>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hábitos Pulados</CardTitle>
            <CardDescription>Mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              {stats.skipRate.toFixed(0)}%
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.totalSkipped} de {stats.totalPossible} hábitos pulados
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Visualização de Hábitos</CardTitle>
              <CardDescription>
                Veja seu desempenho ao longo do tempo
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mês inteiro</SelectItem>
                  <SelectItem value="custom">Data específica</SelectItem>
                </SelectContent>
              </Select>
              
              {dateRange === "month" ? (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePreviousMonth}
                    className="h-9 w-9"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  
                  <div className="text-sm font-medium w-28 text-center">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextMonth}
                    className="h-9 w-9"
                  >
                    <ArrowLeft size={16} className="rotate-180" />
                  </Button>
                </div>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Month view */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
                  <div key={i} className="text-center text-xs font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {eachDayOfInterval({
                  start: startOfMonth(currentMonth),
                  end: endOfMonth(currentMonth)
                }).map((day, index) => {
                  // Get all habits for this day
                  const dayHabits = demoDailyHabits.filter(
                    dh => format(dh.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                  );
                  
                  const completedCount = dayHabits.filter(dh => dh.completed).length;
                  const skippedCount = dayHabits.filter(dh => dh.skipped).length;
                  const totalForDay = demoHabits.length;
                  
                  // Calculate completion percentage
                  const completionPercentage = totalForDay > 0 
                    ? (completedCount / totalForDay) * 100 
                    : 0;
                  
                  const isEmpty = dayHabits.length === 0;
                  const isFuture = day > new Date();
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "h-16 border rounded-md p-1 flex flex-col",
                        isToday(day) ? "border-primary" : "border-gray-200",
                        !isSameMonth(day, currentMonth) && "opacity-50"
                      )}
                    >
                      <div className={cn(
                        "text-xs font-medium",
                        isToday(day) && "text-primary"
                      )}>
                        {format(day, 'd')}
                      </div>
                      
                      {!isEmpty && !isFuture ? (
                        <div className="flex-1 flex flex-col justify-center items-center">
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            {completedCount}/{totalForDay}
                          </div>
                          {skippedCount > 0 && (
                            <div className="text-[10px] text-yellow-500">
                              {skippedCount} pulado{skippedCount > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      ) : isFuture ? (
                        <div className="flex-1 flex items-center justify-center text-gray-300 text-xs">
                          -
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-300 text-xs">
                          Sem dados
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Seus Hábitos</CardTitle>
          <CardDescription>
            Detalhes e progresso de cada hábito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoHabits.map(habit => {
              // Count completions for this habit in the current month
              const habitCompletions = demoDailyHabits.filter(
                dh => dh.habitId === habit.id && dh.completed && isSameMonth(dh.date, currentMonth)
              );
              
              // Calculate progress towards minimum days
              const progress = (habit.streak / habit.minimumDays) * 100;
              
              return (
                <div key={habit.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="text-3xl">{habit.emoji}</div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{habit.name}</h4>
                    
                    <div className="flex items-center text-sm gap-2">
                      <span className="text-muted-foreground">Sequência:</span>
                      <span className="font-medium">{habit.streak} dias</span>
                      
                      <span className="text-muted-foreground ml-2">Meta:</span>
                      <span className="font-medium">{habit.minimumDays} dias</span>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          progress >= 100 ? "bg-green-500" : "bg-primary"
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {habitCompletions.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      completados<br />este mês
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;
