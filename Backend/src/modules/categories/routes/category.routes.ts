import { Router } from "express";
import { container, TYPES } from "../../../di";
import { CategoryController } from "../controllers/category.controller";

const router = Router()

const categoryController = container.get<CategoryController>(TYPES.CategoryController)

router.get("/",categoryController.getCategories)

export default router