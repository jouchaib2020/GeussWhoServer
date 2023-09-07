import { Router } from "express";
import { login, logout } from "../controllers/authController.js";
import {
  startGame,
  addMatch,
  getItem,
  getHistory,
} from "../controllers/gameController.js";


const router = Router();

/**
 * Routes that do not require authentication
 */
router.post("/login", login);
router.get("/game/:difficulty/:domain", startGame);
router.get("/item/:itemId", getItem)

/**
 * Routes for authenticated users
 */

router.get("/:userId/history", getHistory);
router.post("/:userId/addMatch", (addMatch))


// Logout
router.get("/logout", logout);
export default router;
