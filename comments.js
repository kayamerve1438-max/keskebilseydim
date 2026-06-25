import { db } from "./firebase-db.js";

import {
  collection, addDoc, getDocs, query, orderBy, serverTimestamp,
  doc, deleteDoc, getDoc, setDoc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const articleEl = document.querySelector(".article-detail");
const articleId = articleEl?.dataset.articleId || "depozito-article";

const auth = getAuth();

const commentInput = document.getElementById("commentInput");
const sendCommentBtn = document.getElementById("sendCommentBtn");
const commentsList = document.getElementById("commentsList");
const commentCountText = document.getElementById("commentCountText");
const commentBtn = document.getElementById("commentBtn");

const commentsRef = collection(db, "articles", articleId, "comments");

let currentUser = null;
let cachedComments = [];
let selectedQuote = null;

function safeText(text){
  return String(text || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function formatUserName(user){
  const savedName = localStorage.getItem("kb_user_name");
  const rawName = user.displayName || (savedName && !savedName.includes("@") ? savedName : "");

  if(rawName){
    const parts = rawName.trim().split(" ");
    if(parts.length >= 2) return `${parts[0]} ${parts[1][0]}.`;
    return parts[0];
  }

  return "İsimsiz Kullanıcı";
}

function ensureQuotePreview(){
  if(document.getElementById("quotePreview")) return;

  const preview = document.createElement("div");
  preview.id = "quotePreview";
  preview.className = "quote-preview";
  preview.style.display = "none";

  commentInput.parentElement.insertBefore(preview, commentInput);
}

function renderQuotePreview(){
  ensureQuotePreview();

  const preview = document.getElementById("quotePreview");

  if(!selectedQuote){
    preview.style.display = "none";
    preview.innerHTML = "";
    return;
  }

  preview.style.display = "block";
  preview.innerHTML = `
    <button type="button" id="cancelQuoteBtn">×</button>
    <strong>${safeText(selectedQuote.userName)}</strong>
    <p>${safeText(selectedQuote.text)}</p>
  `;

  document.getElementById("cancelQuoteBtn").onclick = function(){
    selectedQuote = null;
    renderQuotePreview();
  };
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  loadComments();
});

async function loadComments(){
  const q = query(commentsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  cachedComments = [];

  snap.forEach(docSnap => {
    cachedComments.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  commentCountText.textContent = `${cachedComments.length} yorum`;

  if(commentBtn){
    commentBtn.textContent = `💬 ${cachedComments.length}`;
  }

  if(cachedComments.length === 0){
    commentsList.innerHTML = `
      <div class="comment">
        <b>Bilge Kedi 🐾</b>
        <p>Henüz yorum yok. İlk patiyi sen bırak, insan dostum.</p>
      </div>
    `;
    return;
  }

  commentsList.innerHTML = cachedComments.map(comment => {
    const isOwner = currentUser && comment.userId === currentUser.uid;
    const reactions = comment.reactions || {};

    return `
      <div class="comment" data-comment-id="${comment.id}">
        <div class="comment-top">
          <b>${safeText(comment.userName || "İsimsiz Kullanıcı")}</b>

          ${isOwner ? `
            <button type="button" class="delete-comment-btn" data-comment-id="${comment.id}">
              🗑️ Sil
            </button>
          ` : ""}
        </div>

        ${comment.quote ? `
          <div class="quoted-comment">
            <strong>${safeText(comment.quote.userName)}</strong>
            <p>${safeText(comment.quote.text)}</p>
          </div>
        ` : ""}

        <p>${safeText(comment.text)}</p>

        <div class="comment-actions">
          <button type="button" class="reaction-btn" data-comment-id="${comment.id}" data-reaction="useful">
            ❤️ Faydalı ${reactions.useful || 0}
          </button>
          <button type="button" class="reaction-btn" data-comment-id="${comment.id}" data-reaction="learned">
            🧠 Öğrendim ${reactions.learned || 0}
          </button>
          <button type="button" class="reaction-btn" data-comment-id="${comment.id}" data-reaction="lived">
            🤝 Ben de yaşadım ${reactions.lived || 0}
          </button>
          <button type="button" class="reaction-btn" data-comment-id="${comment.id}" data-reaction="funny">
            😄 Güldürdü ${reactions.funny || 0}
          </button>

          <button type="button" class="quote-comment-btn" data-comment-id="${comment.id}">
            ↩️ Alıntıla
          </button>

          <button type="button">💬 Mesaj</button>
        </div>
      </div>
    `;
  }).join("");
}

sendCommentBtn?.addEventListener("click", async () => {
  const freshUser = auth.currentUser;
  const text = commentInput.value.trim();

  if(!freshUser){
    window.showAuthRequiredModal?.();
    return;
  }

  if(!text){
    alert("Yorum yazmadan gönderemezsin.");
    return;
  }

  await addDoc(commentsRef, {
    userId: freshUser.uid,
    userName: formatUserName(freshUser),
    userEmail: freshUser.email || "",
    text,
    quote: selectedQuote,
    createdAt: serverTimestamp(),
    likeCount: 0,
    replyCount: 0,
    reactions: {
      useful: 0,
      learned: 0,
      lived: 0,
      funny: 0
    }
  });

  selectedQuote = null;
  renderQuotePreview();

  commentInput.value = "";
  await loadComments();
});

commentsList?.addEventListener("click", async (e) => {
  const deleteBtn = e.target.closest(".delete-comment-btn");

  if(deleteBtn){
    const freshUser = auth.currentUser;

    if(!freshUser){
      window.showAuthRequiredModal?.();
      return;
    }

    const commentId = deleteBtn.dataset.commentId;

    window.showDeleteConfirmModal?.(async () => {
      await deleteDoc(doc(db, "articles", articleId, "comments", commentId));
      await loadComments();
    });

    return;
  }

  const quoteBtn = e.target.closest(".quote-comment-btn");

  if(quoteBtn){
    const commentId = quoteBtn.dataset.commentId;
    const comment = cachedComments.find(item => item.id === commentId);

    if(!comment) return;

    selectedQuote = {
      userName: comment.userName || "İsimsiz Kullanıcı",
      text: comment.text || ""
    };

    renderQuotePreview();

    commentInput.focus();
    commentInput.scrollIntoView({
      behavior:"smooth",
      block:"center"
    });

    return;
  }

  const reactionBtn = e.target.closest(".reaction-btn");

  if(reactionBtn){
    const freshUser = auth.currentUser;

    if(!freshUser){
      window.showAuthRequiredModal?.();
      return;
    }

    const commentId = reactionBtn.dataset.commentId;
    const reaction = reactionBtn.dataset.reaction;

    const commentRef = doc(db, "articles", articleId, "comments", commentId);
    const userReactionRef = doc(
      db,
      "articles",
      articleId,
      "comments",
      commentId,
      "reactions",
      `${freshUser.uid}_${reaction}`
    );

    const userReactionSnap = await getDoc(userReactionRef);
    const reactionField = `reactions.${reaction}`;

    if(userReactionSnap.exists()){
      await deleteDoc(userReactionRef);
      await updateDoc(commentRef, {
        [reactionField]: increment(-1)
      });
    }else{
      await setDoc(userReactionRef, {
        userId: freshUser.uid,
        reaction,
        createdAt: new Date().toISOString()
      });

      await updateDoc(commentRef, {
        [reactionField]: increment(1)
      });
    }

    await loadComments();
  }
});

commentBtn?.addEventListener("click", () => {
  document.querySelector(".comments-section")?.scrollIntoView({
    behavior:"smooth"
  });
});

ensureQuotePreview();
loadComments();