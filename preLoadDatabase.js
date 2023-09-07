import Item from './models/Item.js';
import User from './models/User.js';
import Domain from './models/Domain.js';
import Match from './models/Match.js';
import Sequelize from 'sequelize';
import { preLoadedDomains, preLoadedItems, preLoadedUsers, preLoadedMatches } from './preloadContent.js';
import bcrypt from 'bcrypt';

export const prealoadDatabase = async ()=>{
    try {
      await preLoadedDomains.forEach(async (domain) => {
        await createNewDomain(domain);
      });
      await preLoadedItems.forEach(async (item) => {
        await createNewItem(Object.assign({}, item));
      });
      await preLoadedUsers.forEach(async (user) => {
        await createNewUser(user);
      });
      await preLoadedMatches.forEach(async (match) => {
        await createNewMatch(match);
      });
    } catch (error) {
      console.error('Error preloading database:', error);
    }
  
  }
  // Function to create a new user
  async function createNewUser({ email, username, password, role}) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ email, username, password:hashedPassword, role});
    } catch (error) {
      console.error('Error preloading users:', error);
    }
  
  }
  
  // Function to create a new item
  async function createNewItem({ name, image, domainId, properties }) {
    try {
      await Item.create({ name, image, domainId, properties });
    } catch (error) {
      console.error('Error preloading items:', error);
    }
  }
  
  // Function to create a new domain
  async function createNewDomain({ name }) {
    try {
      await Domain.create({ name });
    } catch (error) {
      console.error('Error preloading domains:', error);
    }
  }

  // Function to create a new match
  async function createNewMatch({ date, difficulty, score, userId, isWon }) {
    try {
      const user = await User.findOne({ where: { id: userId } });
      const secretItem = await Item.findOne({
        order: Sequelize.literal('random()'), // Use random() to randomize the order
        limit: 1,
      })

      const getRandomInt =(min, max) => Math.floor(Math.random() * (max - min)) + min;
      const month = getRandomInt(0, 12);
      const day = getRandomInt(1, 32);
      const hours = getRandomInt(0, 24);
      const minutes = getRandomInt(0, 60);
      const randomDate = new Date(2023, month, day, hours, minutes, 0, 0);

      await Match.create({ date: randomDate, difficulty, score, userId: user.id, secretItemId: secretItem.id, isWon });
    } catch (error) {
      console.error('Error preloading matches:', error);
    }
  };
  