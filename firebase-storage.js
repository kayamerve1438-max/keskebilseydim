import { app } from "./firebase-db.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

export const storage = getStorage(app);