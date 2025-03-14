import { Router } from "express";
import { getAllPosts, createPost, getPost, deletePost } from "../controllers/post-controller";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticated)

router.post('/create-post',createPost)

router.get("/all-posts", getAllPosts)

router.get("/:id", getPost)

router.delete("/:id", deletePost)

export default router;