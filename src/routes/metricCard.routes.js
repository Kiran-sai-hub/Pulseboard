import express from "express";
import {
  createMetricCard,
  deleteMetricCard,
  getAllMetricCards,
  getMetricCardById,
  updateMetricCard,
} from "../controllers/metricCard.controllers";
import protectRoutes from "../middlewares/protectRoutes.js";

const router = express.Router();

router.use(protectRoutes);

router.get("/", getAllMetricCards);
router.get("/:id", getMetricCardById);

router.post("/", createMetricCard);

router.put("/:id", updateMetricCard);

router.delete("/:id", deleteMetricCard);

export default router;
