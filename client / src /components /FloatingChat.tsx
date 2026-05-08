import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, SendHorizontal, Loader2, Bot } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

type ChatStage = 'greeting' | 'questions' | 'company' | 'link' | 'objective' | 'closing';

export default function FloatingChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStage, setCurrentStage] = useState<ChatStage>('greeting');
  const [collectedData, setCollectedData] = useState({
    name: '',
    company: '',
    companyLink: '',
    objective: '',
    questions: '',
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<ChatStage>('greeting');

  const chatMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data: any) => {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
      setIsTyping(false);
    },
    onError: (error: any) => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '⚠️ Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        },
      ]);
      setIsTyping(false);
    },
  });

  const saveLeadMutation = trpc.chat.saveLead.useMutation({
    onSuccess: () => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Obrigado! Suas informações foram registradas. Nossa equipe da Momesso Digital entrará em contato em breve para discutir sua estratégia. 👋',
        },
      ]);
    },
    onError: () => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Houve um erro ao salvar suas informações, mas não se preocupe - nossa equipe ainda entrará em contato!',
        },
      ]);
    },
  });

  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      setTimeout(() => {
        setChatMessages([
          {
            role: 'assistant',
            text: 'Olá! Bem-vindo à Momesso Digital 👋 Sou seu consultor virtual. Para começar, qual é o seu nome?',
          },
        ]);
      }, 300);
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (chatEndRef.current && isChatOpen) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, isChatOpen]);

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMessage = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    // Update collected data based on current stage
    const updatedData = { ...collectedData };
    let nextStage: ChatStage = 'greeting';

    if (stageRef.current === 'greeting') {
      updatedData.name = userMessage;
      nextStage = 'questions';
    } else if (stageRef.current === 'questions') {
      updatedData.questions = userMessage;
      nextStage = 'company';
    } else if (stageRef.current === 'company') {
      updatedData.company = userMessage;
      nextStage = 'link';
    } else if (stageRef.current === 'link') {
      updatedData.companyLink = userMessage;
      nextStage = 'objective';
    } else if (stageRef.current === 'objective') {
      updatedData.objective = userMessage;
      nextStage = 'closing';
    }

    setCollectedData(updatedData);
    stageRef.current = nextStage;
    setCurrentStage(nextStage);

    // Send message with current stage (before advancing)
    chatMutation.mutate({ message: userMessage, stage: stageRef.current });

    // If we've reached the closing stage, save the lead after a brief delay
    if (nextStage === 'closing') {
      setTimeout(() => {
        saveLeadMutation.mutate({
          name: updatedData.name,
          company: updatedData.company,
          companyLink: updatedData.companyLink,
          objective: updatedData.objective,
          questions: updatedData.questions,
        });
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isChatOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in">
          {/* Chat Header */}
          <div className="bg-background p-6 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground shadow-lg">
                <Bot size={20} />
              </div>
              <span className="font-black text-sm text-foreground tracking-widest uppercase">
                Consultor Virtual
              </span>
            </div>
            <button
              onClick={() => {
                setIsChatOpen(false);
                setChatMessages([]);
                setCurrentStage('greeting');
                stageRef.current = 'greeting';
                setCollectedData({ name: '', company: '', companyLink: '', objective: '', questions: '' });
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-background">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-accent text-accent-foreground font-bold rounded-2xl rounded-tr-sm'
                      : 'bg-card text-muted-foreground border border-border rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-[10px] font-black text-accent uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                <Loader2 className="animate-spin" size={14} /> Analisando Estratégia...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="p-4 bg-card border-t border-border">
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  currentStage === 'greeting'
                    ? 'Digite seu nome...'
                    : currentStage === 'questions'
                      ? 'Suas dúvidas...'
                      : currentStage === 'company'
                        ? 'Nome da empresa...'
                        : currentStage === 'link'
                          ? 'Link do site ou Instagram...'
                          : currentStage === 'objective'
                            ? 'Seu objetivo...'
                            : 'Mensagem...'
                }
                className="w-full bg-background border border-border focus:border-accent rounded-2xl pl-5 pr-14 py-4 text-sm outline-none text-foreground transition-all shadow-inner placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={isTyping || !chatInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent text-accent-foreground rounded-xl flex items-center justify-center disabled:opacity-30 hover:scale-105 transition-transform"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isChatOpen
            ? 'bg-card text-accent border border-border'
            : 'bg-accent text-accent-foreground'
        }`}
      >
        {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}
