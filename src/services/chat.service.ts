const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface FrontendMessage {
  id: string;
  clientId: string;
  text: string;
  origin: 'agent' | 'whatsapp';
  time: string;
}

export interface FrontendClient {
  id: string;
  name: string;
  number: string;
  score: 'hot' | 'warm' | 'cold';
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export const chatService = {
  async getChatData(): Promise<{ clients: FrontendClient[], messages: FrontendMessage[] }> {
    const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjA5NGZhNTA2LTYzNGYtNDc5OS1hOGFjLThkNzJkZmU1NTcxZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ppcWFsY21neWhsZHJhemFjZ2d6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2MDQ3ZmI3MS0zNTVlLTRiZGEtYmI0MC1mZDI3MDZjZDRkNzQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcyNTYyMjk5LCJpYXQiOjE3NzI1NTg2OTksImVtYWlsIjoiYWxlam9iYXNpbGUwM0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MjU1ODY5OX1dLCJzZXNzaW9uX2lkIjoiYzA3YTcwNjAtOGZhNi00MmY3LTg2NDgtZDRkYWFhNWNmNGRlIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.Ot2miFvWiOvqTzMf2WMmqx92HStj9KHW_0bRKEQSn3AgmlfCnDldicsjcfNMeF1ZRuoMqwNF8Uite18vOUnpLQ';

    const response = await fetch(`${API_URL}/agents/perfil/clientes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Error al obtener los datos del servidor');

    const data = await response.json();
    
    const frontendClients: FrontendClient[] = [];
    const allMessages: FrontendMessage[] = [];

    data.clients.forEach((client: any) => {
      const clientIdStr = client.id.toString();

      client.messages.forEach((msg: any, index: number) => {
        const dateObj = new Date(msg.createdAt);
        allMessages.push({
          id: `msg-${clientIdStr}-${index}`, 
          clientId: clientIdStr,
          text: msg.text,
          origin: msg.origin === 'whatsapp' ? 'whatsapp' : 'agent',
          time: dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        });
      });

      const lastMsg = allMessages.filter(m => m.clientId === clientIdStr).pop();
      
      frontendClients.push({
        id: clientIdStr,
        name: client.name,
        number: client.number,
        score: client.status.toLowerCase() as 'hot' | 'warm' | 'cold',
        lastMessage: lastMsg ? lastMsg.text : 'Sin mensajes',
        lastMessageTime: lastMsg ? lastMsg.time : '',
        unread: 0,
      });
    });

    return { clients: frontendClients, messages: allMessages };
  },

  async sendMessage(clientId: string, text: string): Promise<FrontendMessage> {
    const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjA5NGZhNTA2LTYzNGYtNDc5OS1hOGFjLThkNzJkZmU1NTcxZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ppcWFsY21neWhsZHJhemFjZ2d6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2MDQ3ZmI3MS0zNTVlLTRiZGEtYmI0MC1mZDI3MDZjZDRkNzQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcyNTYyMjk5LCJpYXQiOjE3NzI1NTg2OTksImVtYWlsIjoiYWxlam9iYXNpbGUwM0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MjU1ODY5OX1dLCJzZXNzaW9uX2lkIjoiYzA3YTcwNjAtOGZhNi00MmY3LTg2NDgtZDRkYWFhNWNmNGRlIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.Ot2miFvWiOvqTzMf2WMmqx92HStj9KHW_0bRKEQSn3AgmlfCnDldicsjcfNMeF1ZRuoMqwNF8Uite18vOUnpLQ';

    const response = await fetch(`${API_URL}/agents/mensajes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        clientId: parseInt(clientId),
        text: text
      })
    });

    if (!response.ok) {
      console.error('Error al enviar el mensaje:', await response.text());
      throw new Error('Error al enviar el mensaje');
    }

    const data = await response.json();

    return {
      id: data.id.toString(),
      clientId: data.clientId.toString(),
      text: data.text,
      origin: data.origin,
      time: new Date(data.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };
  }
};

