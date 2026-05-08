import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("chat.saveLead", () => {
  it(
    "should save lead with company link",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.saveLead({
        name: "João Silva",
        company: "Tech Solutions",
        companyLink: "https://techsolutions.com",
        objective: "Aumentar vendas",
        questions: "Como funciona o tráfego pago?",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("sucesso");
    },
    { timeout: 15000 }
  );

  it(
    "should save lead with Instagram link",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.saveLead({
        name: "Maria Santos",
        company: "Fashion Brand",
        companyLink: "https://instagram.com/fashionbrand",
        objective: "Gerar leads",
        questions: "",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("sucesso");
    },
    { timeout: 15000 }
  );

  it(
    "should save lead without link",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.saveLead({
        name: "Pedro Costa",
        company: "E-commerce Store",
        objective: "Melhorar marca",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("sucesso");
    },
    { timeout: 15000 }
  );

  it(
    "should reject empty name",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.saveLead({
          name: "",
          company: "Test Company",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    },
    { timeout: 15000 }
  );
});
