import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Appointment = {
  id: number;
  clientName: string;
  clientEmail: string;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number;
  notes: string | null;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
};

type FormData = {
  clientName: string;
  clientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  notes: string;
  status: "scheduled" | "completed" | "cancelled";
};

const initialFormData: FormData = {
  clientName: "",
  clientEmail: "",
  appointmentDate: "",
  appointmentTime: "",
  duration: 60,
  notes: "",
  status: "scheduled",
};

export default function AppointmentsManager() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: appointments = [], isLoading, refetch } = trpc.admin.appointments.list.useQuery();

  const createAppointment = trpc.admin.appointments.create.useMutation({
    onSuccess: () => {
      toast.success("Reunião agendada com sucesso");
      setFormData(initialFormData);
      setShowForm(false);
      refetch();
    },
    onError: () => {
      toast.error("Erro ao agendar reunião");
    },
  });

  const updateAppointment = trpc.admin.appointments.update.useMutation({
    onSuccess: () => {
      toast.success("Reunião atualizada com sucesso");
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      refetch();
    },
    onError: () => {
      toast.error("Erro ao atualizar reunião");
    },
  });

  const deleteAppointment = trpc.admin.appointments.delete.useMutation({
    onSuccess: () => {
      toast.success("Reunião deletada com sucesso");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao deletar reunião");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientEmail || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);

    const payload = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      appointmentDate: appointmentDateTime,
      appointmentTime: formData.appointmentTime,
      duration: formData.duration,
      notes: formData.notes || undefined,
      status: formData.status,
    };

    if (editingId) {
      updateAppointment.mutate({
        id: editingId,
        ...payload,
      });
    } else {
      createAppointment.mutate(payload);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    const date = new Date(appointment.appointmentDate);
    setFormData({
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      appointmentDate: date.toISOString().split("T")[0],
      appointmentTime: appointment.appointmentTime,
      duration: appointment.duration,
      notes: appointment.notes || "",
      status: appointment.status,
    });
    setEditingId(appointment.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendada";
      case "completed":
        return "Concluída";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
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
        <h3 className="text-lg font-semibold">Agenda ({appointments.length})</h3>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) handleCancel();
          }}
          className="gap-2"
        >
          <Plus size={16} />
          Nova Reunião
        </Button>
      </div>

      {showForm && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Nova"} Reunião</CardTitle>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hora</label>
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duração (minutos)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="scheduled">Agendada</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Notas</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Adicione notas sobre a reunião..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createAppointment.isPending || updateAppointment.isPending}>
                  {editingId ? "Atualizar" : "Agendar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma reunião agendada
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:border-accent/50 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{appointment.clientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.clientEmail}</p>
                    <div className="flex gap-2 mt-2 items-center">
                      <Clock size={14} className="text-accent" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(appointment.appointmentDate).toLocaleDateString("pt-BR")} às{" "}
                        {appointment.appointmentTime}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({appointment.duration} min)
                      </span>
                    </div>
                    <Badge variant={getStatusColor(appointment.status) as any} className="mt-2">
                      {getStatusLabel(appointment.status)}
                    </Badge>
                    {appointment.notes && (
                      <p className="text-sm mt-2 text-muted-foreground italic">"{appointment.notes}"</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja deletar esta reunião?")) {
                          deleteAppointment.mutate({ id: appointment.id });
                        }
                      }}
                      disabled={deleteAppointment.isPending}
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
