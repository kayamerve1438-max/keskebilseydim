import { db } from "./firebase-db.js";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { createNotification } from "./notifications.js";

const auth = getAuth();

let selectedMessageTarget = null;

function getConversationId(uid1, uid2){
  return [uid1, uid2].sort().join("_");
}

function formatUserName(user){
  const savedName = localStorage.getItem("kb_user_name");
  return user.displayName || savedName || user.email || "Kullanıcı";
}

window.openMessageModal = function(comment){
  const user = auth.currentUser;

  if(!user){
    window.showAuthRequiredModal?.();
    return;
  }

  if(!comment.userId || comment.userId === "seed-user"){
    window.showSuccessModal?.("Bu yorum örnek içerik olduğu için mesaj gönderilemez. 🐾");
    return;
  }

  if(comment.userId === user.uid){
    window.showSuccessModal?.("Kendi yorumuna mesaj gönderemezsin, insan dostum. 🐾");
    return;
  }

  selectedMessageTarget = comment;

  document.getElementById("messageTargetName").textContent =
    comment.userName || "Kullanıcı";

  document.getElementById("messageQuotedText").textContent =
    comment.text || "";

  document.getElementById("messageInput").value = "";

  document.getElementById("messageModal").classList.add("active");
};

window.closeMessageModal = function(){
  selectedMessageTarget = null;
  document.getElementById("messageModal")?.classList.remove("active");
};

document.addEventListener("click", async function(e){
  if(e.target.id === "cancelMessageBtn"){
    window.closeMessageModal();
  }

  if(e.target.id === "messageModal"){
    window.closeMessageModal();
  }

  if(e.target.id === "sendMessageBtn"){
    const user = auth.currentUser;
    const messageText = document.getElementById("messageInput").value.trim();

    if(!user){
      window.showAuthRequiredModal?.();
      return;
    }

    if(!selectedMessageTarget){
      return;
    }

    if(!messageText){
      window.showSuccessModal?.("Mesaj yazmadan gönderemezsin, insan dostum. 🐾");
      return;
    }

    const conversationId = getConversationId(user.uid, selectedMessageTarget.userId);
    const conversationRef = doc(db, "conversations", conversationId);

    await setDoc(conversationRef, {
  participants: [user.uid, selectedMessageTarget.userId],
  participantNames: {
    [user.uid]: formatUserName(user),
    [selectedMessageTarget.userId]: selectedMessageTarget.userName || "Kullanıcı"
  },
  lastMessage: messageText,
  lastMessageFrom: user.uid,
  unreadBy: {
    [selectedMessageTarget.userId]: true,
    [user.uid]: false
  },
  updatedAt: serverTimestamp()
}, { merge:true });

    await addDoc(collection(db, "conversations", conversationId, "messages"), {
      fromUserId: user.uid,
      fromUserName: formatUserName(user),
      toUserId: selectedMessageTarget.userId,
      toUserName: selectedMessageTarget.userName || "Kullanıcı",
      message: messageText,
      quotedCommentId: selectedMessageTarget.id || "",
      quotedCommentText: selectedMessageTarget.text || "",
      createdAt: serverTimestamp(),
      isRead:false
    });
try{

    console.log("✅ Bildirim oluşturuldu");

}catch(err){

    console.error("❌ Notification Error:", err);

}
    window.closeMessageModal();
    window.showSuccessModal?.("Mesaj gönderildi 🐾");
  }
});
document.addEventListener("keydown", function(e){
  if(e.key === "Enter" && !e.shiftKey && e.target.id === "messageInput"){
    e.preventDefault();
    document.getElementById("sendMessageBtn")?.click();
  }
});