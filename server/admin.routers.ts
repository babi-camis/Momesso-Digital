import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { contacts, chatLeads } from "../drizzle/schema";
import {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "./admin.db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  leads: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(contacts);
    }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(contacts).where(eq(contacts.id, input.id));
        return { success: true };
      }),
  }),

  chatLeads: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(chatLeads);
    }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(chatLeads).where(eq(chatLeads.id, input.id));
        return { success: true };
      }),
  }),

  testimonials: router({
    list: adminProcedure.query(async () => {
      return await getAllTestimonials();
    }),

    create: adminProcedure
      .input(
        z.object({
          clientName: z.string().min(1),
          clientRole: z.string().min(1),
          clientCompany: z.string().min(1),
          quote: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        await createTestimonial({
          clientName: input.clientName,
          clientRole: input.clientRole,
          clientCompany: input.clientCompany,
          quote: input.quote,
          isActive: 1,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          clientName: z.string().optional(),
          clientRole: z.string().optional(),
          clientCompany: z.string().optional(),
          quote: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateTestimonial(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteTestimonial(input.id);
        return { success: true };
      }),
  }),

  contracts: router({
    list: adminProcedure.query(async () => {
      return await getContracts();
    }),

    create: adminProcedure
      .input(
        z.object({
          clientName: z.string().min(1),
          clientEmail: z.string().email(),
          contractType: z.string().min(1),
          fileUrl: z.string().optional(),
          fileKey: z.string().optional(),
          status: z.enum(["draft", "sent", "signed", "completed"]).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createContract(input);
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          clientName: z.string().optional(),
          clientEmail: z.string().email().optional(),
          contractType: z.string().optional(),
          fileUrl: z.string().optional(),
          fileKey: z.string().optional(),
          status: z.enum(["draft", "sent", "signed", "completed"]).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateContract(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteContract(input.id);
        return { success: true };
      }),
  }),

  appointments: router({
    list: adminProcedure.query(async () => {
      return await getAppointments();
    }),

    create: adminProcedure
      .input(
        z.object({
          clientName: z.string().min(1),
          clientEmail: z.string().email(),
          clientPhone: z.string().optional(),
          appointmentDate: z.date(),
          appointmentTime: z.string().min(1),
          duration: z.number().optional(),
          type: z.string().optional(),
          notes: z.string().optional(),
          status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createAppointment(input);
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          clientName: z.string().optional(),
          clientEmail: z.string().email().optional(),
          clientPhone: z.string().optional(),
          appointmentDate: z.date().optional(),
          appointmentTime: z.string().optional(),
          duration: z.number().optional(),
          type: z.string().optional(),
          notes: z.string().optional(),
          status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateAppointment(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteAppointment(input.id);
        return { success: true };
      }),
  }),
});
