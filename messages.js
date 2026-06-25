import { db } from "./firebase-db.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const auth = getAuth();

const articleEl = document.querySelector(".article-detail");
const articleId = articleEl?.dataset.articleId || "depozito-article";

let selectedMessageTarget = null;

function safeText(text){
  return String(text || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

window.openMessageModal = function(comment){
  const user = auth.currentUser;

  if(!user){
    window.showAuthRequiredModal?.();
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
  document.getElementById("messageModal").classList.remove("active");
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
      alert("Mesaj yazmadan gönderemezsin.");
      return;
    }

    await addDoc(collection(db, "messages"), {
      articleId,
      fromUserId: user.uid,
      fromUserName: user.displayName || user.email || "Kullanıcı",
      toUserId: selectedMessageTarget.userId || "",
      toUserName: selectedMessageTarget.userName || "",
      quotedCommentId: selectedMessageTarget.id || "",
      quotedCommentText: selectedMessageTarget.text || "",
      message: messageText,
      createdAt: serverTimestamp(),
      isRead: false
    });

    window.closeMessageModal();
    window.showSuccessModal?.("Mesaj gönderildi 🐾");
  }
});