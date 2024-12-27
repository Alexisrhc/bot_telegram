import { UserContext } from "../interfaces/userContext";
import fs from 'fs';

export const getUserContext = (
  chatId: number
): Array<{ role: string; content: string }> => {
  const data = JSON.parse(fs.readFileSync("context.json", "utf-8")) as {
    users: UserContext[];
  };
  let user = data.users.find((u) => u.chatId === chatId);
  if (!user) {
    user = { chatId, context: [] };
    data.users.push(user);
    fs.writeFileSync("context.json", JSON.stringify(data, null, 2));
  }
  return user.context;
};

export const saveUserContext = (
  chatId: number,
  context: Array<{ role: string; content: string }>
): void => {
  const data = JSON.parse(fs.readFileSync("context.json", "utf-8")) as {
    users: UserContext[];
  };
  const userIndex = data.users.findIndex((u) => u.chatId === chatId);
  if (userIndex !== -1) {
    data.users[userIndex].context = context;
  } else {
    data.users.push({ chatId, context });
  }
  fs.writeFileSync("context.json", JSON.stringify(data, null, 2));
};
