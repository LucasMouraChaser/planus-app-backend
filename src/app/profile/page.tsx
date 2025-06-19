
"use client";

import { Suspense, useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Edit3, Save, X, Mail, Shield, Calendar, KeyRound, Camera } from 'lucide-react';

import type { AppUser, FirestoreUser } from '@/types/user'; // Assuming AppUser contains necessary fields

// Mock user data - replace with actual data from auth context
const MOCK_USER_PROFILE: AppUser & { createdAt?: string; cpf?: string } = {
  uid: 'user123',
  email: 'usuario@example.com',
  displayName: 'Usuário Exemplo Silva',
  type: 'vendedor',
  photoURL: 'https://placehold.co/150x150.png?text=UE',
  personalBalance: 1250.75, // Example field from AppUser
  mlmBalance: 875.20,    // Example field from AppUser
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // Example: 30 days ago
  cpf: "123.456.789-00", // Example CPF
};

const profileFormSchema = z.object({
  displayName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres.").max(50, "O nome não pode exceder 50 caracteres."),
  // photoFile: z.instanceof(FileList).optional(), // For file upload
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres."),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(6, "A confirmação da senha deve ter pelo menos 6 caracteres."),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "As novas senhas não coincidem.",
    path: ["confirmPassword"],
});


type ProfileFormData = z.infer<typeof profileFormSchema>;
type PasswordFormData = z.infer<typeof passwordFormSchema>;

function ProfilePageContent() {
  const { toast } = useToast();
  const [userData, setUserData] = useState<AppUser & { createdAt?: string; cpf?: string } | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Simulate fetching user data
  useEffect(() => {
    setUserData(MOCK_USER_PROFILE);
    if (MOCK_USER_PROFILE.photoURL) {
        setPreviewImage(MOCK_USER_PROFILE.photoURL);
    }
  }, []);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: userData?.displayName || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    },
  });

  useEffect(() => {
    if (userData) {
      profileForm.reset({
        displayName: userData.displayName || "",
      });
      setPreviewImage(userData.photoURL || null);
    }
  }, [userData, profileForm.reset, profileForm]);

  const handleProfileSubmit = (values: ProfileFormData) => {
    // In a real app, call an updateProfile function from your auth context
    console.log("Profile update data:", values);
    // if (values.photoFile && values.photoFile.length > 0) {
    //   console.log("New photo file:", values.photoFile[0]);
    //   // Handle file upload here
    // }
    setUserData(prev => prev ? { ...prev, displayName: values.displayName } : null);
    toast({
      title: "Perfil Atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
    setIsEditingProfile(false);
  };

  const handlePasswordChangeSubmit = (values: PasswordFormData) => {
    console.log("Password change data:", values);
    // In a real app, call a changePassword function from your auth context
    toast({
        title: "Senha Atualizada (Simulado)",
        description: "Sua senha foi alterada com sucesso.",
    });
    setIsChangingPassword(false);
    passwordForm.reset();
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        // profileForm.setValue('photoFile', event.target.files); // Set for react-hook-form
        setPreviewImage(URL.createObjectURL(file)); // Set for immediate preview
    }
  };


  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-foreground">
      <header className="mb-12 text-center">
        <UserCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight">
          Meu Perfil
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Visualize e gerencie suas informações pessoais e de conta.
        </p>
      </header>

      <Card className="max-w-2xl mx-auto bg-card/70 backdrop-blur-lg border shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={previewImage || userData.photoURL || undefined} alt={userData.displayName || "User"} data-ai-hint="user avatar large" />
                    <AvatarFallback className="text-4xl">{userData.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                {isEditingProfile && (
                    <Label htmlFor="photoInput" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90">
                        <Camera size={18} />
                        <Input id="photoInput" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                    </Label>
                )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-2xl text-foreground">{isEditingProfile ? profileForm.watch("displayName") : userData.displayName}</CardTitle>
              <CardDescription className="text-muted-foreground">{userData.email}</CardDescription>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center justify-center md:justify-start text-muted-foreground">
                    <Shield size={16} className="mr-2 text-primary/80" /> Tipo: <span className="font-medium text-foreground ml-1 capitalize">{userData.type}</span>
                </div>
                {userData.cpf && (
                    <div className="flex items-center justify-center md:justify-start text-muted-foreground">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary/80 lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                         CPF: <span className="font-medium text-foreground ml-1">{userData.cpf}</span>
                    </div>
                )}
                {userData.createdAt && (
                    <div className="flex items-center justify-center md:justify-start text-muted-foreground">
                        <Calendar size={16} className="mr-2 text-primary/80" /> Membro desde: <span className="font-medium text-foreground ml-1">{format(parseISO(userData.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-2">
          {!isEditingProfile && !isChangingPassword && (
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsChangingPassword(true)} className="w-full sm:w-auto">
                <KeyRound className="mr-2 h-4 w-4" /> Alterar Senha
              </Button>
              <Button onClick={() => setIsEditingProfile(true)} className="w-full sm:w-auto">
                <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
            </div>
          )}

          {isEditingProfile && (
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de Exibição</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Photo upload input is handled by the Label around Camera icon */}
                <FormDescription className="text-xs text-center">
                    Para alterar o email ou CPF, por favor, entre em contato com o suporte.
                </FormDescription>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={() => { setIsEditingProfile(false); setPreviewImage(userData.photoURL || null); profileForm.reset({displayName: userData.displayName || ""}); }}>
                    <X className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                  <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                  </Button>
                </div>
              </form>
            </Form>
          )}

        {isChangingPassword && (
            <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordChangeSubmit)} className="space-y-6 mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold text-center text-primary mb-4">Alterar Senha</h3>
                    <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha Atual</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nova Senha</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar Nova Senha</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsChangingPassword(false)}>
                           <X className="mr-2 h-4 w-4" /> Cancelar
                        </Button>
                        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" /> Salvar Nova Senha
                        </Button>
                    </div>
                </form>
            </Form>
        )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Carregando...</p>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
