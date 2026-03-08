"use client"

import { MessageSquare } from "lucide-react"

export function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-secondary/50">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
        <MessageSquare className="size-7 text-primary" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-base font-semibold text-foreground">InmoChat CRM</h2>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Selecciona un cliente del panel izquierdo para comenzar a gestionar la conversación.
        </p>
      </div>
    </div>
  )
}
