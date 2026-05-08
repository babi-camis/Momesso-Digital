import { describe, expect, it, vi } from "vitest";
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

describe("contact.submitForm", () => {
  it("should accept valid form data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submitForm({
      name: "João Silva",
      whatsapp: "+5511999999999",
      company: "Tech Solutions",
      interest: "Tráfego",
    });

    expect(result).toEqual({
      success: true,
      message: "Formulário enviado com sucesso!",
    });
  });

  it("should reject empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submitForm({
        name: "",
        whatsapp: "+5511999999999",
        company: "Tech Solutions",
        interest: "Tráfego",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Nome é obrigatório");
    }
  });

  it("should reject empty whatsapp", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submitForm({
        name: "João Silva",
        whatsapp: "",
        company: "Tech Solutions",
        interest: "Tráfego",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("WhatsApp é obrigatório");
    }
  });

  it("should reject empty company", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submitForm({
        name: "João Silva",
        whatsapp: "+5511999999999",
        company: "",
        interest: "Tráfego",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Empresa é obrigatória");
    }
  });

  it("should reject empty interest", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submitForm({
        name: "João Silva",
        whatsapp: "+5511999999999",
        company: "Tech Solutions",
        interest: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Serviço é obrigatório");
    }
  });
});

describe("chat.sendMessage", () => {
  it(
    "should accept valid message",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "Quais são seus serviços?",
      });

      expect(result).toHaveProperty("text");
      expect(typeof result.text).toBe("string");
      expect(result.text.length).toBeGreaterThan(0);
    },
    { timeout: 15000 }
  );

  it("should reject empty message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.sendMessage({
        message: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toBeDefined();
    }
  });

  it(
    "should return text response for marketing question",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "Como a Momesso Digital pode ajudar meu e-commerce?",
      });

      expect(result.text).toBeDefined();
      expect(result.text.length).toBeGreaterThan(0);
      // Response should be related to services
      expect(result.text.toLowerCase()).toMatch(
        /momesso|serviço|digital|marketing|e-commerce|desenvolvimento|tráfego/i
      );
    },
    { timeout: 15000 }
  );
});
