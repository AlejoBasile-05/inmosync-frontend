"use client"

import { useRef, useEffect } from "react"
import { cn } from "../../lib/utils"
import type { Message } from "../../lib/mock-data"

interface ChatMessagesProps {
  messages: Message[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto bg-secondary/50 px-6 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {messages.map((msg) => {
          const isAgent = msg.origin === "agent"

          return (
            <div
              key={msg.id}
              className={cn("flex", isAgent ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "relative max-w-[75%] px-3.5 py-2.5 shadow-sm",
                  isAgent
                    ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-2xl rounded-bl-md bg-card text-foreground border border-border"
                )}
              >
                <p className="text-[13px] leading-relaxed">{msg.text}</p>
                <span
                  className={cn(
                    "mt-1 block text-right text-[10px]",
                    isAgent ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
