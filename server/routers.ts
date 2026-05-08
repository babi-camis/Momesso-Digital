import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { createChatLead } from "./db";
import { adminRouter } from "./admin.routers";

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submitForm: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome é obrigatório"),
          whatsapp: z.string().min(1, "WhatsApp é obrigatório"),
          company: z.string().min(1, "Empresa é obrigatória"),
          interest: z.string().min(1, "Serviço é obrigatório"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const message = `
            Novo formulário de contato recebido!
            
            Nome: ${input.name}
            WhatsApp: ${input.whatsapp}
            Empresa: ${input.company}
            Serviço de Interesse: ${input.interest}
          `;

          const notificationSent = await notifyOwner({
            title: "Novo Lead - Momesso Digital",
            content: message,
          });

          if (!notificationSent) {
            console.warn("Notification service unavailable, but form was accepted", input);
          }

          return {
            success: true,
            message: "Formulário enviado com sucesso!",
          };
        } catch (error) {
          console.error("Error submitting form:", error);
          throw new Error("Erro ao enviar formulário");
        }
      }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          message: z.string().min(1),
          stage: z.enum(["greeting", "questions", "company", "link", "objective", "closing"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          let systemPrompt = `Você é um consultor amigável da Momesso Digital, uma agência de marketing digital.
Seja MUITO BREVE, direto e conversacional. Use linguagem simples e natural.
Não use jargão técnico. Respostas curtas (1-2 frases no máximo).
Serviços: Tráfego Pago, Web, Branding, Posicionamento, SEO, Social Media, Vídeos.`;

          if (input.stage === "greeting") {
            systemPrompt += `
Pergunte o nome de forma super simples e amigável. Só isso.`;
          } else if (input.stage === "questions") {
            systemPrompt += `
Responda a dúvida de forma breve e amigável. Sem textos longos.`;
          } else if (input.stage === "company") {
            systemPrompt += `
Pergunte o nome da empresa e o que ela faz. Bem simples.`;
          } else if (input.stage === "link") {
            systemPrompt += `
Pergunte o link do site ou Instagram da empresa para análise. Seja bem direto: "Qual é o site ou Instagram da empresa?"`;
          } else if (input.stage === "objective") {
            systemPrompt += `
Pergunte o que ele quer alcançar: vender mais, gerar leads, crescer marca, etc. Bem direto.`;
          } else if (input.stage === "closing") {
            systemPrompt += `
Agradece e diz que a equipe vai entrar em contato em breve. Curto e doce.`;
          }

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: input.message,
              },
            ],
          });

          const text =
            response.choices?.[0]?.message?.content ||
            "Desculpe, não consegui processar sua mensagem. Tente novamente.";

          return {
            text: typeof text === "string" ? text : JSON.stringify(text),
          };
        } catch (error) {
          console.error("Error in chat:", error);
          throw new Error("Erro ao processar mensagem");
        }
      }),

    saveLead: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          company: z.string().optional(),
          companyLink: z.string().optional(),
          objective: z.string().optional(),
          questions: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createChatLead({
            name: input.name,
            company: input.company,
            companyLink: input.companyLink,
            objective: input.objective,
            questions: input.questions,
            status: "completed",
          });

          const message = `
            Novo lead coletado via chat!
            
            Nome: ${input.name}
            Empresa: ${input.company || "Não informado"}
            Link: ${input.companyLink || "Não informado"}
            Objetivo: ${input.objective || "Não informado"}
            Dúvidas: ${input.questions || "Nenhuma dúvida registrada"}
          `;

          const notificationSent = await notifyOwner({
            title: "Novo Lead via Chat - Momesso Digital",
            content: message,
          });

          if (!notificationSent) {
            console.warn("Notification service unavailable for chat lead", input);
          }

          return {
            success: true,
            message: "Lead salvo com sucesso!",
          };
        } catch (error) {
          console.error("Error saving chat lead:", error);
          throw new Error("Erro ao salvar informações do lead");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
