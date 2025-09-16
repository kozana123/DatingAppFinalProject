import ChatSession from './videoChats.model.js';

export async function addSession(req, res) {
  try {
    const dto = req.body;
    
    if (!dto || !dto.CallDate || dto.CallDurationMinutes === null || dto.IsMatch === undefined) {
      return res.status(400).json({ message: 'Missing chat session data' });
    }

    const chatSession = new ChatSession(
      dto.CallDate,
      dto.CallDurationMinutes,
      dto.IsMatch
    );

    const success = await chatSession.addChatSession();

    if (success) {
      res.json({ message: 'Chat session added successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to insert chat session.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}