import { db } from "./firebase-db.js";

import {
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const auth = getAuth();

let unsubscribeMessages = null;
let unsubscribeNotifications = null;

function updateBadge(selector, count){
  const badge = document.querySelector(selector);

  if(!badge) return;

  if(count > 0){
    badge.textContent = count;
    badge.style.display = "flex";
  }else{
    badge.textContent = "";
    badge.style.display = "none";
  }
}

function listenUnreadMessages(user){
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", user.uid)
  );

  if(unsubscribeMessages){
    unsubscribeMessages();
  }

  unsubscribeMessages = onSnapshot(q, (snap) => {
    let count = 0;

    snap.forEach(docSnap => {
      const data = docSnap.data();

      if(data.unreadBy && data.unreadBy[user.uid]){
        count++;
      }
    });

    updateBadge("#messageBadge", count);
  });
}

function listenUnreadNotifications(user){
  const q = query(
    collection(db, "notifications"),
    where("toUserId", "==", user.uid),
    where("isRead", "==", false)
  );

  if(unsubscribeNotifications){
    unsubscribeNotifications();
  }

  unsubscribeNotifications = onSnapshot(q, (snap) => {
    let count = 0;

    snap.forEach(docSnap => {
      const data = docSnap.data();

      if(data.type !== "message"){
        count++;
      }
    });

    updateBadge("#notificationBadge", count);
  });
}

onAuthStateChanged(auth, (user) => {
  if(!user){
    updateBadge("#messageBadge", 0);
    updateBadge("#notificationBadge", 0);

    if(unsubscribeMessages) unsubscribeMessages();
    if(unsubscribeNotifications) unsubscribeNotifications();

    return;
  }

  listenUnreadMessages(user);
  listenUnreadNotifications(user);
});