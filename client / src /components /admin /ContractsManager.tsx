import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Contract = {
  id: number;
  clientName: string;
  clientEmail: string;
  contractType: string;
  fileUrl: string | null;
  fileKey: string | null;
  status: "draft" | "sent" | "signed" | "completed";
  startDate: Date | null;
  endDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type FormData = {
  clientName: string;
  clientEmail: string;
  contractType: string;
  status: "draft" | "sent" | "signed" | "completed";
  startDate: string;
  endDate: string;
  notes: string;
};

const initialFormData: FormData = {
  clientName: "",
  clientEmail: "",
  contractType: "",
  status: "draft",
  startDate: "",
  endDate: "",
  notes: "",
};

export default function ContractsManager() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: contracts = [], isLoading, refetch } = trpc.admin.contracts.list.useQuery();

  const createContract = trpc.admin.contracts.create.useMutation({
    onSuccess: () => {
      toast.success("Contrato criado com sucesso");
      setFormData(initialFormData);
      setShowForm(false);
      refetch();
    },
    onError: () => {
      toast.error("Erro ao criar contrato");
    },
  });

  const updateContract = trpc.admin.contracts.update.useMutation({
    onSuccess: () => {
      toast.success("Contrato atualizado com sucesso");
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      refetch();
    },
    onError: () => {
      toast.error("Erro ao atualizar contrato");
    },
  });

  const deleteContract = trpc.admin.contracts.delete.useMutation({
    onSuccess: () => {
      toast.success("Contrato deletado com sucesso");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao deletar contrato");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientEmail || !formData.contractType) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const payload = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      contractType: formData.contractType,
      status: formData.status,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      notes: formData.notes || undefined,
    };

    if (editingId) {
      updateContract.mutate({
        id: editingId,
        ...payload,
      });
    } else {
      createContract.mutate(payload);
    }
  };

  const handleEdit = (contract: Contract) => {
    setFormData({
      clientName: contract.clientName,
      clientEmail: contract.clientEmail,
      contractType: contract.contractType,
      status: contract.status,
      startDate: contract.startDate ? new Date(contract.startDate).toISOString().split("T")[0] : "",
      endDate: contract.endDate ? new Date(contract.endDate).toISOString().split("T")[0] : "",
      notes: contract.notes || "",
    });
    setEditingId(contract.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "sent":
        return "outline";
      case "signed":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contratos ({contracts.length})</h3>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) handleCancel();
          }}
          className="gap-2"
        >
          <Plus size={16} />
          Novo Contrato
        </Button>
      </div>

      {showForm && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Novo"} Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome do Cliente</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="Ex: joao@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Contrato</label>
                  <Input
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    placeholder="Ex: Serviços de Marketing"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="sent">Enviado</option>
                    <option value="signed">Assinado</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data de Início</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Término</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notas</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Adicione notas sobre o contrato..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createContract.isPending || updateContract.isPending}>
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum contrato cadastrado
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:border-accent/50 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{contract.clientName}</p>
                    <p className="text-sm text-muted-foreground">{contract.contractType}</p>
                    <p className="text-sm text-muted-foreground">{contract.clientEmail}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={getStatusColor(contract.status) as any}>
                        {contract.status}
                      </Badge>
                      {contract.startDate && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(contract.startDate).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                    {contract.notes && (
                      <p className="text-sm mt-2 text-muted-foreground italic">"{contract.notes}"</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {contract.fileUrl && (
                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (contract.fileUrl) window.open(contract.fileUrl, "_blank");
                      }}
                    >
                      <Download size={16} />
                    </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(contract)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja deletar este contrato?")) {
                          deleteContract.mutate({ id: contract.id });
                        }
                      }}
                      disabled={deleteContract.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
