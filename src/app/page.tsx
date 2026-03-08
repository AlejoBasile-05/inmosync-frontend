"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { chatService, type FrontendClient, type FrontendMessage } from "../services/chat.service"
import { ClientSidebar } from "../components/chats/client-sidebar"
import { ChatHeader } from "../components/chats/chat-header"
import { ChatMessages } from "../components/chats/chat-messages"
import { ChatInput } from "../components/chats/chat-input"
import { EmptyChat } from "../components/chats/empty-chat"
import { io, Socket } from "socket.io-client";

export default function CRMPage() {
  const [clients, setClients] = useState<FrontendClient[]>([])
  const [allMessages, setAllMessages] = useState<FrontendMessage[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadedChats, setLoadedChats] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await chatService.getChatData()
        setClients(data.clients)
        setAllMessages(data.messages)
        if (data.clients.length > 0) {
          setSelectedClientId(data.clients[0].id)
        }
      } catch (error) {
        console.error("Error cargando el chat:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {

    if (!selectedClientId) return; 

    const socket: Socket = io("http://localhost:3000");

    const eventName = `newMessage-${selectedClientId}`;

    socket.on(eventName, (incomingMessage: FrontendMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });

    return () => {
      socket.disconnect();
    };

  }, [selectedClientId]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId),
    [clients, selectedClientId]
  )

  const clientMessages = useMemo(
    () => allMessages.filter((m) => m.clientId.toString() === selectedClientId.toString()),
    [allMessages, selectedClientId]
  )

  const handleSend = useCallback(
    async (text: string) => {
      if (!selectedClientId) return;

      try {
        const newMsg = await chatService.sendMessage(selectedClientId, text);

        setAllMessages((prev) => [...prev, newMsg]);
        
      } catch (error) {
        console.error("Error al enviar:", error);
        alert("Hubo un error al enviar el mensaje de WhatsApp. Revisa la consola.");
      }
    },
    [selectedClientId] 
  )

  const handleReactivateBot = async () => {
    if (!selectedClientId) return; 

    try {

      await chatService.handleReactivateBot(selectedClientId);

      alert('🤖 Bot reactivado exitosamente. La IA responderá el próximo mensaje de este cliente.');

    } catch (error) {
      console.error('Error reactivando el bot:', error);
      alert('Hubo un error al intentar reactivar el bot. Revisa la conexión.');
    }
  };

  useEffect(() => {
    if (!selectedClientId) return;

    if (loadedChats.includes(selectedClientId.toString())) return;

    const fetchHistory = async () => {
      try {
        const history = await chatService.getClientHistory(selectedClientId);

        setAllMessages((prevMessages) => {
          const otherClientsMessages = prevMessages.filter(
            (m) => m.clientId?.toString() !== selectedClientId?.toString()
          );
          return [...otherClientsMessages, ...history];
        });

        setLoadedChats((prev) => [...prev, selectedClientId.toString()]);

      } catch (error) {
        console.error("Error al cargar el historial:", error);
      }
    };

    fetchHistory();
  }, [selectedClientId, loadedChats]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-background">Cargando chats...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ClientSidebar
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {selectedClient ? (
          <>
            <ChatHeader client={selectedClient} handle={handleReactivateBot} />
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