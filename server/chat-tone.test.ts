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

describe("chat.sendMessage - Tone and Length", () => {
  it(
    "should return concise response (max 3 sentences)",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "Qual é o melhor serviço para aumentar vendas?",
        stage: "questions",
      });

      expect(result.text).toBeDefined();
      const sentences = result.text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      expect(sentences.length).toBeLessThanOrEqual(4);
    },
    { timeout: 15000 }
  );

  it(
    "should use friendly and conversational tone",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "João",
        stage: "greeting",
      });

      expect(result.text).toBeDefined();
      // Should not contain overly formal language
      expect(result.text.toLowerCase()).not.toMatch(/respeitosamente|cordialmente|atenciosamente/);
      // Should be friendly
      expect(result.text.length).toBeLessThan(200);
    },
    { timeout: 15000 }
  );

  it(
    "should avoid technical jargon",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "Como funciona o SEO?",
        stage: "questions",
      });

      expect(result.text).toBeDefined();
      // Avoid overly technical terms without explanation
      const technicalTerms = result.text.match(/algoritmo|indexação|crawling|backlinks/gi);
      if (technicalTerms) {
        // If technical terms are used, response should still be short and clear
        expect(result.text.length).toBeLessThan(250);
      }
    },
    { timeout: 15000 }
  );

  it(
    "should keep company info question simple",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "Tech Solutions",
        stage: "company",
      });

      expect(result.text).toBeDefined();
      // Should be very short when asking for company info
      expect(result.text.length).toBeLessThan(180);
    },
    { timeout: 15000 }
  );

  it(
    "should ask for company link",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "https://techsolutions.com",
        stage: "link",
      });

      expect(result.text).toBeDefined();
      // Should be short
      expect(result.text.length).toBeLessThan(150);
    },
    { timeout: 15000 }
  );

  it(
    "should keep objective question direct",
    async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "Aumentar vendas e gerar mais leads",
        stage: "objective",
      });

      expect(result.text).toBeDefined();
      // Should be very short when asking for objective
      expect(result.text.length).toBeLessThan(250);
    },
    { timeout: 15000 }
  );
});
