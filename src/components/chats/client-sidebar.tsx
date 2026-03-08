"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { cn } from "../../lib/utils"
import type { FrontendClient } from "../../services/chat.service"

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function getScoreBadge(score: "hot" | "warm" | "cold") {
  switch (score) {
    case "hot":
      return { label: "Hot", icon: "\u{1F525}", className: "bg-red-50 text-red-700 border-red-200" }
    case "warm":
      return { label: "Warm", icon: "\u{1F7E1}", className: "bg-amber-50 text-amber-700 border-amber-200" }
    case "cold":
      return { label: "Cold", icon: "\u{2744}\u{FE0F}", className: "bg-sky-50 text-sky-700 border-sky-200" }
  }
}

function getAvatarColor(id: string) {
  const colors = [
    "bg-primary/90 text-primary-foreground",
    "bg-sky-600 text-card",
    "bg-teal-600 text-card",
    "bg-slate-600 text-card",
    "bg-indigo-600 text-card",
  ]
  const index = parseInt(id) % colors.length
  return colors[index]
}

interface ClientSidebarProps {
  clients: FrontendClient[]
  selectedClientId: string
  onSelectClient: (id: string) => void
}

export function ClientSidebar({ clients, selectedClientId, onSelectClient }: ClientSidebarProps) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.number.includes(search)
      ),
    [clients, search]
  )

  return (
    <aside className="flex w-[350px] shrink-0 flex-col border-r border-gray-200 bg-card">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Mensajes</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cliente o número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Client List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {filtered.map((client) => {
            const isActive = client.id === selectedClientId
            const score = getScoreBadge(client.score)

            return (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={cn(
                  "relative flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/50",
                  isActive && "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                {/* Avatar */}
                <Avatar className={cn("size-10 shrink-0", getAvatarColor(client.id))}>
                  <AvatarFallback className={cn("text-xs font-semibold", getAvatarColor(client.id))}>
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{client.name}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{client.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">{client.number}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[10px] font-medium leading-tight",
                        score.className
                      )}
                    >
                      <span className="text-[10px]">{score.icon}</span>
                      {score.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs leading-relaxed text-muted-foreground">{client.lastMessage}</p>
                    {client.unread && client.unread > 0 && (
                      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {client.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}
