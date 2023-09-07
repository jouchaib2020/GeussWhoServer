import Item from "../models/Item.js";
import User from "../models/User.js";
import Domain from "../models/Domain.js";
import Match from "../models/Match.js";
import Sequelize from 'sequelize';


const getRandomItems = async (count, domainId) => {
  try {
    const randomItems = await Item.findAll({
      order: Sequelize.literal('random()'), // Use random() to randomize the order
      limit: count,
      where: {
        domainId: domainId,
        },
    });

    return randomItems;
  } catch (error) {
    console.error('Error getting random items:', error);
    throw error;
  }
};

export const getItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(`------incoming GETITEM reqest params : itemId = ${itemId} `)
    const item = await Item.findOne({ where: { id: itemId } });
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ item });
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const startGame =  async (req, res) => {
  try {
    console.log(`------incoming STARTGAME reqest params : difficulty = ${req.params.difficulty}, domain=${req.params.domain} `)
    const {difficulty, domain} = req.params;
    const numberOfItems = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 24 : 36;
    const domainId = await Domain.findOne({ 
        attributes: ['id'],
        where: { name:domain }
    });
    if(!domainId) {
        res.status(404).json({ error: 'Domain not found' });
        return;
    }
    const randomItems = await getRandomItems(numberOfItems, domainId.id);

    // Generate a secret item by selecting one from the random items
    const secretItem = randomItems[Math.floor(Math.random() * randomItems.length)];

    // Return the random items and the secret item
    res.json({ randomItems, secretItem });
  } catch (error) {
    console.error('Error starting a new game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addMatch = async (req, res) => {
    try {
      if (!req.user) {      
        const {  difficulty, score, secretItemId, isWon } = req.body;
        const {userId} = req.params;
        console.log(`------incoming ADDMATCH reqest body : userId = ${userId}, secretItemId=${secretItemId}, difficulty=${difficulty}, score=${score} `)

        const user = await User.findOne({ where: { id: userId } });
        const item = await Item.findOne({ where: { id: secretItemId } });
        if (!user || !item) { 
            res.status(404).json({ error: 'User or item not found' });
            return;
        }
        const match = await Match.create({
            userId : user.id,
            secretItemId: item.id,
            difficulty,
            score,
            isWon,
            date: new Date(),
        });
        console.log(`------match created : ${JSON.stringify(match)}`)
        return res.status(200).json({ message: 'Match added successfully' });
      } else { console.log('------ NO incoming ADDMATCH reqest----------')}
      } catch (error) {
        console.error('Error adding match:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}


export const getHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ where: { id: userId } });
        console.log(`------incoming getHistory reqest params : userId=${user.id} `)
        const history = await Match.findAll({
            where: { userId: user.id },
        });
    
        res.json({ history });
    } catch (error) {
        console.error('Error getting user history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
