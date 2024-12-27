export interface UserContext {
  chatId: number;
  context: Array<{ role: string; content: string }>;
}
