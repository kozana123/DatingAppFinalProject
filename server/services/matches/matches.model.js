import { addMatchToDB, getMatchedUsersFromDB } from './matches.db.js';

export default class Match {
  constructor(User1ID, User2ID, MatchStatus = 'pending') {
    this.User1ID = User1ID;
    this.User2ID = User2ID;
    this.MatchStatus = MatchStatus;
  }

  async addMatch() {
    return await addMatchToDB(this);
  }

  static async getMatchedUsers(userId) {
    return await getMatchedUsersFromDB(userId);
  }
}
