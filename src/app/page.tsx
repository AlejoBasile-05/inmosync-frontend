"use client"

import { useState, useMemo, useCallback } from "react"
import { clients as mockClients, messages as mockMessages, type Message } from "../lib/mock-data"
import { ClientSidebar } from "../components/client-sidebar"
import { ChatHeader } from "../components/chat-header"
import { ChatMessages } from "../components/chat-messages"
import { ChatInput } from "../components/chat-input"
import { EmptyChat } from "../components/empty-chat"

export default function CRMPage() {
  const [selectedClientId, setSelectedClientId] = useState<string>("1")
  const [allMessages, setAllMessages] = useState<Message[]>(mockMessages)

  const selectedClient = useMemo(
    () => mockClients.find((c) => c.id === selectedClientId),
    [selectedClientId]
  )

  const clientMessages = useMemo(
    () => allMessages.filter((m) => m.clientId === selectedClientId),
    [allMessages, selectedClientId]
  )

  const handleSend = useCallback(
    (text: string) => {
      const now = new Date()
      const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        clientId: selectedClientId,
        text,
        origin: "agent",
        time,
      }
      setAllMessages((prev) => [...prev, newMsg])
    },
    [selectedClientId]
  )

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Left sidebar */}
      <ClientSidebar
        clients={mockClients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
      />

      {/* Main chat area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {selectedClient ? (
          <>
            <ChatHeader client={selectedClient} />
            <ChatMessages messages={clientMessages} />
            <ChatInput onSend={handleSend} />
          </>
        ) : (
          <EmptyChat />
        )}
      </main>
    </div>
  )
}
