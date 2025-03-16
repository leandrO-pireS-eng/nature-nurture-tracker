
import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, User, Settings, BarChart3 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface NavBarProps {
  username: string;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onReportClick: () => void;
  streak: number;
}

const NavBar: React.FC<NavBarProps> = ({
  username,
  onProfileClick,
  onSettingsClick,
  onReportClick,
  streak
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-2">
        <Leaf className="text-green-600" size={24} />
        <h1 className="font-bold text-xl">HORTA HABITS</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {streak > 0 && (
          <Badge variant="outline" className="bg-orange-50 text-orange-600 hidden md:flex">
            {streak} dias de sequência 🔥
          </Badge>
        )}
        
        <div className="hidden md:flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onReportClick}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <BarChart3 size={20} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSettingsClick}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings size={20} />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onProfileClick}
            className="gap-2"
          >
            <User size={16} />
            <span>{username}</span>
          </Button>
        </div>
        
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onReportClick}>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Relatórios</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
