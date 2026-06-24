import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfWhRF8BpXTxXlE5Hzs45FDuoocWy9H9E",
  authDomain: "keskebilseydim-f56dc.firebaseapp.com",
  projectId: "keskebilseydim-f56dc",
  storageBucket: "keskebilseydim-f56dc.firebasestorage.app",
  messagingSenderId: "524443729178",
  appId: "1:524443729178:web:abc85bbcbcf65a3075c0a3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);