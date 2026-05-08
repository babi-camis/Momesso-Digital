import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Testimonial = {
  id: number;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  quote: string;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
};

type FormData = {
  clientName: string;
  clientRole: string;
  clientCompany: string;
  quote: string;
};

const initialFormData: FormData = {
  clientName: "",
  clientRole: "",
  clientCompany: "",
  quote: "",
};

export default function TestimonialsManager() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch testimonials
  const { data: testimonials = [], isLoading, refetch } = trpc.admin.testimonials.list.useQuery();

  // Create mutation
  const createTestimonial = trpc.admin.testimonials.create.useMutation({
    onSuccess: () => {
      toast.success("Depoimento criado com sucesso");
      setFormData(initialFormData);
      setShowForm(false);
      refetch();
    },
    onError: () => {
      toast.error("Erro ao criar depoimento");
    },
  });

  // Update mutation
  const updateTestimonial = trpc.admin.testimonials.update.useMutation({
    onSuccess: () => {
      toast.success("Depoimento atualizado com sucesso");
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      refetch();
    },
    onError: () => {
      toast.error("Erro ao atualizar depoimento");
    },
  });

  // Delete mutation
  const deleteTestimonial = trpc.admin.testimonials.delete.useMutation({
    onSuccess: () => {
      toast.success("Depoimento deletado com sucesso");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao deletar depoimento");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientRole || !formData.clientCompany || !formData.quote) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (editingId) {
      updateTestimonial.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createTestimonial.mutate(formData);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      clientName: testimonial.clientName,
      clientRole: testimonial.clientRole,
      clientCompany: testimonial.clientCompany,
      quote: testimonial.quote,
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
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
        <h3 className="text-lg font-semibold">Depoimentos ({testimonials.length})</h3>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) handleCancel();
          }}
          className="gap-2"
        >
          <Plus size={16} />
          Novo Depoimento
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Novo"} Depoimento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome do Cliente</label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Ex: Ana Silva"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cargo</label>
                <Input
                  value={formData.clientRole}
                  onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                  placeholder="Ex: CEO"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Empresa</label>
                <Input
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  placeholder="Ex: TechFlow"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Depoimento</label>
                <Textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Digite o depoimento..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createTestimonial.isPending || updateTestimonial.isPending}>
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

      {/* List */}
      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum depoimento cadastrado
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:border-accent/50 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{testimonial.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.clientRole} • {testimonial.clientCompany}
                    </p>
                    <p className="text-sm mt-2 italic">"{testimonial.quote}"</p>
                    <Badge variant={testimonial.isActive ? "default" : "secondary"} className="mt-2">
                      {testimonial.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja deletar este depoimento?")) {
                          deleteTestimonial.mutate({ id: testimonial.id });
                        }
                      }}
                      disabled={deleteTestimonial.isPending}
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
