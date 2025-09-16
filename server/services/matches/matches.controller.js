import Match from './matches.model.js';

export async function addMatch(req, res) {
  try {
    const dto = req.body;
    
    if (!dto || !dto.user1ID || !dto.user2ID || !dto.matchStatus) {
      return res.status(400).json({ message: 'Missing match data' });
    }

    const match = new Match(dto.user1ID, dto.user2ID, dto.matchStatus, dto.chatId);
    console.log(match);
    const success = await match.addMatch();

    if (success) {
      res.json({ message: 'Match added successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to insert match.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMatchedUsers(req, res) {
  try {
    const { userId } = req.params;
    const matchedUsers = await Match.getMatchedUsers(parseInt(userId));
    res.json(matchedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function unMatchUser(req, res) {
  try {
    const { userId } = req.params;
    const { unmatchUserId } = req.body;
    console.log(userId,unmatchUserId);
    
    
    const matchedUser = await Match.unMatchUser(parseInt(userId), parseInt(unmatchUserId));
    res.json(matchedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
