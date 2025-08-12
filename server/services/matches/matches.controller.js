import Match from './matches.model.js';

export async function addMatch(req, res) {
  try {
    const dto = req.body;
    if (!dto || !dto.User1ID || !dto.User2ID || !dto.MatchStatus) {
      return res.status(400).json({ message: 'Missing match data' });
    }

    const match = new Match(dto.User1ID, dto.User2ID, dto.MatchStatus);
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
