import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ExternalLink, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Lead = {
  id: number;
  name: string;
  whatsapp: string;
  company: string;
  interest: string;
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: Date;
  updatedAt: Date;
};

type ChatLead = {
  id: number;
  name: string;
  company: string | null;
  companyLink: string | null;
  objective: string | null;
  questions: string | null;
  status: "initiated" | "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
};

export default function LeadsManager() {
  const [selectedLead, setSelectedLead] = useState<Lead | ChatLead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch leads using tRPC hooks
  const { data: formLeads = [], isLoading: isLoadingForm } = trpc.admin.leads.list.useQuery();
  const { data: chatLeadsData = [], isLoading: isLoadingChat } = trpc.admin.chatLeads.list.useQuery();
  
  // Delete mutations
  const deleteFormLead = trpc.admin.leads.delete.useMutation({
    onSuccess: () => {
      toast.success("Lead deletado com sucesso");
      setSelectedLead(null);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao deletar lead");
    },
  });

  const deleteChatLead = trpc.admin.chatLeads.delete.useMutation({
    onSuccess: () => {
      toast.success("Lead deletado com sucesso");
      setSelectedLead(null);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao deletar lead");
    },
  });

  const handleViewLead = (lead: Lead | ChatLead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const handleDeleteLead = (id: number, source: "form" | "chat") => {
    if (!confirm("Tem certeza que deseja deletar este lead?")) return;

    if (source === "form") {
      deleteFormLead.mutate({ id });
    } else {
      deleteChatLead.mutate({ id });
    }
  };

  const isLoading = isLoadingForm || isLoadingChat;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Leads */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Leads do Formulário ({formLeads.length})</h3>
        {formLeads.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum lead do formulário ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {formLeads.map((lead) => (
              <Card key={lead.id} className="hover:border-accent/50 transition-colors">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{lead.interest}</Badge>
                        <Badge variant="secondary">Formulário</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        WhatsApp: <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                          {lead.whatsapp}
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLead(lead)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLead(lead.id, "form")}
                        disabled={deleteFormLead.isPending}
                      >
                        {deleteFormLead.isPending ? "..." : "Deletar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Chat Leads */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Leads do Chat ({chatLeadsData.length})</h3>
        {chatLeadsData.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum lead do chat ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {chatLeadsData.map((lead) => (
              <Card key={lead.id} className="hover:border-accent/50 transition-colors">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                      <div className="flex gap-2 mt-2">
                        {lead.objective && <Badge variant="outline">{lead.objective}</Badge>}
                        <Badge variant="secondary">Chat</Badge>
                      </div>
                      {lead.companyLink && (
                        <a
                          href={lead.companyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline text-sm mt-2 flex items-center gap-1"
                        >
                          {lead.companyLink}
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLead(lead)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLead(lead.id, "chat")}
                        disabled={deleteChatLead.isPending}
                      >
                        {deleteChatLead.isPending ? "..." : "Deletar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Lead Details Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-semibold">{selectedLead.name}</p>
              </div>
              {selectedLead.company && (
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-semibold">{selectedLead.company}</p>
                </div>
              )}
              {"companyLink" in selectedLead && selectedLead.companyLink && (
                <div>
                  <p className="text-sm text-muted-foreground">Link da Empresa</p>
                  <a
                    href={selectedLead.companyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {selectedLead.companyLink}
                  </a>
                </div>
              )}
              {"whatsapp" in selectedLead && selectedLead.whatsapp && (
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <a
                    href={`https://wa.me/${selectedLead.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {selectedLead.whatsapp}
                  </a>
                </div>
              )}
              {"objective" in selectedLead && selectedLead.objective && (
                <div>
                  <p className="text-sm text-muted-foreground">Objetivo</p>
                  <p className="font-semibold">{selectedLead.objective}</p>
                </div>
              )}
              {"questions" in selectedLead && selectedLead.questions && (
                <div>
                  <p className="text-sm text-muted-foreground">Dúvidas</p>
                  <p className="font-semibold">{selectedLead.questions}</p>
                </div>
              )}
              {"interest" in selectedLead && selectedLead.interest && (
                <div>
                  <p className="text-sm text-muted-foreground">Serviço de Interesse</p>
                  <p className="font-semibold">{selectedLead.interest}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-semibold">
                  {new Date(selectedLead.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
