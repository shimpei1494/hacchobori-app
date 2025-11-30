"use client";

import { useChat } from "@ai-sdk/react";
import { BotIcon, PlusIcon, SparklesIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SUGGESTED_PROMPTS = [
  "800円以内で5分以内のラーメン屋を教えて",
  "カフェでゆっくりできる場所はある?",
  "今日のランチのおすすめは?",
  "定食屋さんを探している",
];

export function AIChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, setMessages } = useChat();

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage({ text: prompt });
    setInput("");
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {messages.length > 0 && (
        <div className="flex shrink-0 items-center justify-end border-b px-4 py-2">
          <Button variant="outline" size="sm" onClick={handleNewChat}>
            <PlusIcon className="mr-2 size-4" />
            新規チャット
          </Button>
        </div>
      )}
      <Conversation className="flex-1 overflow-y-auto">
        <ConversationContent>
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
              <div className="text-center">
                <h2 className="mb-2 font-bold text-2xl">八丁堀レストランガイド</h2>
                <p className="text-muted-foreground">おすすめのお店を教えてください</p>
              </div>

              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 md:grid-cols-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <Card
                    key={prompt}
                    className="cursor-pointer p-4 transition-colors hover:bg-accent"
                    onClick={() => handleSuggestedPrompt(prompt)}
                  >
                    <p className="text-sm">{prompt}</p>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <Message key={msg.id} from={msg.role}>
                {msg.role === "user" && (
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10">
                      <UserIcon className="size-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}

                {msg.role === "assistant" && (
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10">
                      <BotIcon className="size-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <MessageContent variant="flat">
                  {msg.role === "assistant" ? (
                    <Response>
                      {msg.parts
                        .filter((part) => part.type === "text")
                        .map((part) => part.text)
                        .join("")}
                    </Response>
                  ) : (
                    msg.parts
                      .filter((part) => part.type === "text")
                      .map((part) => <span key={`${msg.id}-${part.text.slice(0, 20)}`}>{part.text}</span>)
                  )}
                </MessageContent>
              </Message>
            ))
          )}

          {status === "streaming" && (
            <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-3">
              <div className="flex items-center justify-center rounded-full bg-primary/10 p-2">
                <SparklesIcon className="size-4 animate-pulse text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">考え中</span>
                <span className="flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
        </ConversationContent>
      </Conversation>

      <footer className="shrink-0 border-t bg-background p-4">
        <PromptInput
          className="mx-auto max-w-3xl"
          onSubmit={(message, event) => {
            event.preventDefault();
            if (message.text && status === "ready") {
              sendMessage({ text: message.text });
              setInput("");
            }
          }}
        >
          <PromptInputTextarea
            placeholder="レストランについて質問してください..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (input.trim() && status === "ready") {
                  sendMessage({ text: input });
                  setInput("");
                }
              }
            }}
          />
          <PromptInputFooter>
            <div className="flex-1" />
            <div className="group/submit relative">
              <PromptInputSubmit status={status} disabled={!input.trim() || status !== "ready"} />
              <div className="pointer-events-none absolute -top-10 right-0 hidden whitespace-nowrap rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md group-hover/submit:block">
                {status === "streaming" ? "回答中..." : "Cmd+Enter または Ctrl+Enter で送信"}
              </div>
            </div>
          </PromptInputFooter>
        </PromptInput>
      </footer>
    </div>
  );
}
