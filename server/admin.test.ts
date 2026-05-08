import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@momesso.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Admin Procedures", () => {
  describe("testimonials", () => {
    it("should allow admin to create testimonial", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.testimonials.create({
        clientName: "Test Client",
        clientRole: "CEO",
        clientCompany: "Test Company",
        quote: "Great service!",
      });

      expect(result.success).toBe(true);
    });

    it("should deny regular user from creating testimonial", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.testimonials.create({
          clientName: "Test Client",
          clientRole: "CEO",
          clientCompany: "Test Company",
          quote: "Great service!",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin to list testimonials", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.testimonials.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny regular user from listing testimonials", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.testimonials.list();
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("contracts", () => {
    it("should allow admin to create contract", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.contracts.create({
        clientName: "Test Client",
        clientEmail: "client@test.com",
        contractType: "Marketing Services",
        status: "draft",
      });

      expect(result.success).toBe(true);
    });

    it("should deny regular user from creating contract", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.contracts.create({
          clientName: "Test Client",
          clientEmail: "client@test.com",
          contractType: "Marketing Services",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin to list contracts", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.contracts.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("appointments", () => {
    it("should allow admin to create appointment", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const result = await caller.admin.appointments.create({
        clientName: "Test Client",
        clientEmail: "client@test.com",
        appointmentDate: futureDate,
        type: "Consultation",
        status: "scheduled",
      });

      expect(result.success).toBe(true);
    });

    it("should deny regular user from creating appointment", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      try {
        await caller.admin.appointments.create({
          clientName: "Test Client",
          clientEmail: "client@test.com",
          appointmentDate: futureDate,
          type: "Consultation",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin to list appointments", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.appointments.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
