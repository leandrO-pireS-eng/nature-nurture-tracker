
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, User, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Jardineiro');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setProfileImage(e.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!",
    });
    navigate('/');
  };
  
  const handleRemoveImage = () => {
    setProfileImage(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto max-w-4xl pb-10 pt-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações pessoais</CardTitle>
          <CardDescription>
            Personalize seu perfil no Horta Habits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile image */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt="Imagem de perfil" />
                ) : (
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <User size={32} />
                  </AvatarFallback>
                )}
              </Avatar>
              {profileImage && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X size={12} />
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                id="profile-image" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Camera size={14} />
                <span>{profileImage ? 'Alterar foto' : 'Adicionar foto'}</span>
              </Button>
            </div>
          </div>
          
          {/* User name */}
          <div className="space-y-2">
            <Label htmlFor="name">Seu nome</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Seu nome" 
            />
          </div>
          
          {/* Email (disabled for this demo) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value="exemplo@horta.habits.com" 
              disabled 
              className="bg-gray-100"
            />
            <p className="text-xs text-muted-foreground">
              Para alterar seu email, entre em contato com o suporte.
            </p>
          </div>
          
          {/* Save button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
