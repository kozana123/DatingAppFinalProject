import { addMatchToDB, getMatchedUsersFromDB, unMatchUserFromDB } from './matches.db.js';

export default class Match {
  constructor(User1ID, User2ID, MatchStatus = 'pending', chatId) {
    this.User1ID = User1ID;
    this.User2ID = User2ID;
    this.MatchStatus = MatchStatus;
    this.ChatId = chatId;

  }

  async addMatch() {
    return await addMatchToDB(this);
  }

  static async getMatchedUsers(userId) {
    return await getMatchedUsersFromDB(userId);
  }
  static async unMatchUser(userId, unmatchUserId) {
    return await unMatchUserFromDB(userId, unmatchUserId);
  }
}
