export interface ChatUser {
  id: string;
  username: string;
  room: string;
  isTyping?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  author: string;
  room: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  users: ChatUser[];
  messages: ChatMessage[];
}

export interface ServerToClientEvents {
  'message:new': (message: ChatMessage) => void;
  'user:joined': (user: ChatUser) => void;
  'user:left': (user: ChatUser) => void;
  'user:typing': (data: { username: string; room: string }) => void;
  'user:stop-typing': (data: { username: string; room: string }) => void;
  'room:users': (users: ChatUser[]) => void;
  'room:messages': (messages: ChatMessage[]) => void;
}

export interface ClientToServerEvents {
  'message:send': (data: { content: string; author: string; room: string }) => void;
  'user:join': (data: { username: string; room: string }) => void;
  'user:leave': (data: { username: string; room: string }) => void;
  'user:typing': (data: { username: string; room: string }) => void;
  'user:stop-typing': (data: { username: string; room: string }) => void;
} 