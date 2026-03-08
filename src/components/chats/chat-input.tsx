"use client"

import { useState } from "react"
import { Paperclip, Smile, SendHorizontal } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface ChatInputProps {
  onSend: (text: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("")

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <footer className="flex items-center gap-2 border-t border-border bg-card px-4 py-3">
      <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground hover:text-foreground">
        <Paperclip className="size-4" />
        <span className="sr-only">Adjuntar archivo</span>
      </Button>
      <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground hover:text-foreground">
        <Smile className="size-4" />
        <span className="sr-only">Emojis</span>
      </Button>
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-9 flex-1 rounded-full border border-border bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
      />
      <Button
        size="icon"
        className="shrink-0 rounded-full"
        onClick={handleSend}
        disabled={!value.trim()}
      >
        <SendHorizontal className="size-4" />
        <span className="sr-only">Enviar mensaje</span>
      </Button>
    </footer>
  )
}
