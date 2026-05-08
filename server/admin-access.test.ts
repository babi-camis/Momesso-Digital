import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { ENV } from "./_core/env";
import type { TrpcContext } from "./_core/context";

describe("Admin Access Control", () => {
  it("should return owner as admin when authenticated", async () => {
    const ownerContext: TrpcContext = {
      user: {
        id: 1,
        openId: ENV.ownerOpenId,
        email: "owner@momesso.com",
        name: "Owner",
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

    const caller = appRouter.createCaller(ownerContext);
    const user = await caller.auth.me();

    expect(user).toBeDefined();
    expect(user?.role).toBe("admin");
    expect(user?.openId).toBe(ENV.ownerOpenId);
  });

  it("should allow admin to access admin procedures", async () => {
    const adminContext: TrpcContext = {
      user: {
        id: 1,
        openId: "admin-user",
        email: "admin@momesso.com",
        name: "Admin",
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

    const caller = appRouter.createCaller(adminContext);
    
    // Should not throw error
    const testimonials = await caller.admin.testimonials.list();
    expect(Array.isArray(testimonials)).toBe(true);
  });

  it("should deny non-admin from accessing admin procedures", async () => {
    const userContext: TrpcContext = {
      user: {
        id: 2,
        openId: "regular-user",
        email: "user@example.com",
        name: "User",
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

    const caller = appRouter.createCaller(userContext);
    
    try {
      await caller.admin.testimonials.list();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
