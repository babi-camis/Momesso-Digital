import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, MessageSquare, FileText, Calendar } from "lucide-react";
import LeadsManager from "@/components/admin/LeadsManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import ContractsManager from "@/components/admin/ContractsManager";
import AppointmentsManager from "@/components/admin/AppointmentsManager";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Don't redirect - let the user see the login screen or access denied message
  // useEffect(() => {
  //   if (!loading && (!user || user.role !== "admin")) {
  //     setLocation("/");
  //   }
  // }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Autenticação Necessária</CardTitle>
            <CardDescription>Você precisa fazer login para acessar o painel admin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href={getLoginUrl()}
              className="block w-full bg-accent text-accent-foreground px-4 py-2 rounded-lg text-center font-bold hover:bg-accent/90 transition-all"
            >
              Fazer Login
            </a>
            <Button onClick={() => setLocation("/")} variant="outline" className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar esta página. Apenas administradores podem acessar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">Painel Admin</h1>
              <p className="text-muted-foreground mt-1">Bem-vindo, {user.name || "Admin"}</p>
            </div>
            <Button variant="outline" onClick={() => setLocation("/")}>
              Voltar ao Site
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Leads</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Depoimentos</span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">Contratos</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gerenciar Leads</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Visualize e gerencie todos os leads coletados via formulário e chat
                </p>
              </div>
            </div>
            <LeadsManager />
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gerenciar Depoimentos</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Crie, edite e ative depoimentos de clientes no site
                </p>
              </div>
            </div>
            <TestimonialsManager />
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gerenciar Contratos</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Gerencie contratos com clientes, upload de arquivos e status
                </p>
              </div>
            </div>
            <ContractsManager />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gerenciar Agenda</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Visualize e gerencie reuniões e consultas agendadas
                </p>
              </div>
            </div>
            <AppointmentsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
