import { addChatSessionToDB } from './videoChats.db.js';

export default class ChatSession {
  constructor(CallDate, CallDurationMinutes, IsMatch) {
    this.CallDate = CallDate;
    this.CallDurationMinutes = CallDurationMinutes;
    this.IsMatch = IsMatch;
  }

  async addChatSession() {
    return await addChatSessionToDB(this);
  }
}
