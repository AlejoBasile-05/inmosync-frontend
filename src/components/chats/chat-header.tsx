"use client"

import { Home } from "lucide-react"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { PropertyCatalog } from "@/src/components/properties/property-catalog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet"
import { cn } from "../../lib/utils"
import type { Client, LeadScore } from "../../lib/mock-data"

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function getScoreBadge(score: LeadScore) {
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

interface ChatHeaderProps {
  client: Client
  handle: () => void
}

export function ChatHeader({ client, handle }: ChatHeaderProps) {
  const score = getScoreBadge(client.score)

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
      <div className="flex items-center gap-3">
        <Avatar className={cn("size-10", getAvatarColor(client.id))}>
          <AvatarFallback className={cn("text-xs font-semibold", getAvatarColor(client.id))}>
            {getInitials(client.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{client.name}</span>
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
          <span className="text-xs text-muted-foreground">{client.number}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button onClick={handle} variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          🤖 Reactivar IA
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <Home className="size-3.5" />
              Ver Propiedades
            </Button>
          </SheetTrigger>

          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto p-0 flex flex-col">
            <SheetHeader className="border-b border-border px-4 py-4">
              <SheetTitle>Propiedades Disponibles</SheetTitle>
              <SheetDescription>
                Catálogo de inmuebles para ofrecer a {client.name}.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-hidden">
              <PropertyCatalog clientId={client.id} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}