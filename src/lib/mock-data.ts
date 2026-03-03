export type LeadScore = "hot" | "warm" | "cold"

export interface Client {
  id: string
  name: string
  number: string
  score: LeadScore
  lastMessage: string
  lastMessageTime: string
  unread?: number
}

export interface Message {
  id: string
  clientId: string
  text: string
  origin: "whatsapp" | "agent"
  time: string
}

export const clients: Client[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    number: "+52 55 1234 5678",
    score: "hot",
    lastMessage: "Me interesa mucho el departamento en Polanco, ¿podemos agendar una visita?",
    lastMessageTime: "10:45",
    unread: 2,
  },
  {
    id: "2",
    name: "Ana García López",
    number: "+52 33 9876 5432",
    score: "warm",
    lastMessage: "Gracias por la información, lo voy a revisar con mi esposo.",
    lastMessageTime: "09:30",
  },
  {
    id: "3",
    name: "Roberto Jiménez",
    number: "+52 81 5555 1234",
    score: "hot",
    lastMessage: "¿El precio incluye estacionamiento? Necesito 2 lugares.",
    lastMessageTime: "Ayer",
    unread: 1,
  },
  {
    id: "4",
    name: "María Fernanda Ruiz",
    number: "+52 55 7777 8888",
    score: "cold",
    lastMessage: "Por ahora no estoy buscando, quizás el próximo año.",
    lastMessageTime: "Ayer",
  },
  {
    id: "5",
    name: "Jorge Hernández",
    number: "+52 55 3333 4444",
    score: "warm",
    lastMessage: "¿Tienen algo en la zona de Santa Fe con 3 recámaras?",
    lastMessageTime: "Mar",
  },
  {
    id: "6",
    name: "Patricia Sánchez",
    number: "+52 33 2222 1111",
    score: "hot",
    lastMessage: "Ya tengo pre-aprobado el crédito. ¿Cuándo firmamos?",
    lastMessageTime: "Mar",
    unread: 3,
  },
  {
    id: "7",
    name: "Luis Alberto Torres",
    number: "+52 81 6666 7777",
    score: "cold",
    lastMessage: "Solo estaba cotizando, gracias.",
    lastMessageTime: "Lun",
  },
  {
    id: "8",
    name: "Gabriela Morales",
    number: "+52 55 9999 0000",
    score: "warm",
    lastMessage: "Me gustaría ver las fotos del penthouse.",
    lastMessageTime: "Lun",
  },
]

export const messages: Message[] = [
  {
    id: "m1",
    clientId: "1",
    text: "Hola, buenas tardes. Vi su anuncio en el portal inmobiliario.",
    origin: "whatsapp",
    time: "10:02",
  },
  {
    id: "m2",
    clientId: "1",
    text: "¡Hola Carlos! Bienvenido. ¿En cuál propiedad estás interesado?",
    origin: "agent",
    time: "10:05",
  },
  {
    id: "m3",
    clientId: "1",
    text: "El departamento de 120m² en Polanco, el que tiene terraza.",
    origin: "whatsapp",
    time: "10:08",
  },
  {
    id: "m4",
    clientId: "1",
    text: "Excelente elección. Ese departamento tiene 3 recámaras, 2 baños completos, terraza de 25m² con vista al parque, cocina integral y 2 cajones de estacionamiento. El precio es de $8,500,000 MXN.",
    origin: "agent",
    time: "10:12",
  },
  {
    id: "m5",
    clientId: "1",
    text: "Suena muy bien. ¿Aceptan crédito Infonavit o bancario?",
    origin: "whatsapp",
    time: "10:20",
  },
  {
    id: "m6",
    clientId: "1",
    text: "Sí, aceptamos ambos esquemas. También contamos con un asesor financiero que puede ayudarte a encontrar la mejor opción de crédito. ¿Te gustaría que te contacte?",
    origin: "agent",
    time: "10:25",
  },
  {
    id: "m7",
    clientId: "1",
    text: "Sí, por favor. Y también quisiera saber si puedo visitarlo esta semana.",
    origin: "whatsapp",
    time: "10:30",
  },
  {
    id: "m8",
    clientId: "1",
    text: "Por supuesto. Tenemos disponibilidad el jueves y viernes de esta semana. ¿A qué hora te queda mejor?",
    origin: "agent",
    time: "10:33",
  },
  {
    id: "m9",
    clientId: "1",
    text: "El jueves a las 11am estaría perfecto.",
    origin: "whatsapp",
    time: "10:38",
  },
  {
    id: "m10",
    clientId: "1",
    text: "Perfecto, queda agendada tu visita para el jueves a las 11:00 AM. Te enviaré la ubicación exacta y los datos de acceso un día antes. ¿Alguna otra pregunta?",
    origin: "agent",
    time: "10:40",
  },
  {
    id: "m11",
    clientId: "1",
    text: "Me interesa mucho el departamento en Polanco, ¿podemos agendar una visita?",
    origin: "whatsapp",
    time: "10:45",
  },
  // Client 2 messages
  {
    id: "m20",
    clientId: "2",
    text: "Hola, estoy buscando una casa en Guadalajara.",
    origin: "whatsapp",
    time: "09:00",
  },
  {
    id: "m21",
    clientId: "2",
    text: "¡Buenos días Ana! Tenemos varias opciones en Guadalajara. ¿Tienes alguna zona de preferencia?",
    origin: "agent",
    time: "09:10",
  },
  {
    id: "m22",
    clientId: "2",
    text: "Nos gusta la zona de Providencia o Chapalita.",
    origin: "whatsapp",
    time: "09:15",
  },
  {
    id: "m23",
    clientId: "2",
    text: "Excelente. En Providencia tenemos una casa de 200m² con jardín a $6,200,000 y un departamento nuevo en Chapalita de 150m² a $4,800,000. Te envío las fichas técnicas.",
    origin: "agent",
    time: "09:22",
  },
  {
    id: "m24",
    clientId: "2",
    text: "Gracias por la información, lo voy a revisar con mi esposo.",
    origin: "whatsapp",
    time: "09:30",
  },
]
