import express from "express";
import protectRoutes from "../middlewares/protectRoutes.js";
import {
  createDataSource,
  getAllDataSources,
  getDataSourceById,
  updateDataSource,
  deleteDataSource,
} from "../controllers/dataSource.controllers.js";

const router = express.Router();

router.get("/", protectRoutes, getAllDataSources);
router.get("/:id", protectRoutes, getDataSourceById);

router.post("/", protectRoutes, createDataSource);

router.put("/:id", protectRoutes, updateDataSource);

router.delete("/:id", protectRoutes, deleteDataSource);

export default router;
