export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  access_token: string;
}

export interface ChatResponse {
  id: number;
  name: string;
  isGroup: boolean;
  participants: UserResponse[];
  lastMessage?: MessageResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageResponse {
  id: number;
  content: string;
  chatId: number;
  authorId: number;
  createdAt: Date;
  author: UserResponse;
}

export interface ParticipantResponse {
  id: number;
  userId: number;
  chatId: number;
}
