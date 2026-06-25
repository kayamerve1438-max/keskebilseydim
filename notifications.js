import { db } from "./firebase-db.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function createNotification({
  toUserId,
  fromUserId,
  fromUserName,
  type,
  title,
  text,
  link = ""
}){
  if(!toUserId || !fromUserId) return;

  if(toUserId === fromUserId) return;

  await addDoc(collection(db, "notifications"), {
    toUserId,
    fromUserId,
    fromUserName,
    type,
    title,
    text,
    link,
    isRead:false,
    createdAt:serverTimestamp()
  });
}