window.initProfile = function(){

    const loginBtn = document.querySelector(".login");
    if(!loginBtn) return;

    let savedName = localStorage.getItem("kb_user_name");

    if(!savedName || savedName === "Profilim"){
        savedName = "Profilim";
        localStorage.setItem("kb_user_name", savedName);
    }

    loginBtn.textContent = savedName;
    loginBtn.classList.add("logged-in");

    const oldMenu = document.getElementById("profileDropdown");
    if(oldMenu) oldMenu.remove();

    fetch("profile.html?v=3")
      .then(res => res.text())
      .then(data => {

          document.body.insertAdjacentHTML("beforeend", data);

          const profileDropdown = document.getElementById("profileDropdown");
          const logoutBtn = document.getElementById("logoutBtn");
          const notificationBadge = document.getElementById("notificationBadge");

          if(!profileDropdown) return;

          const totalUnreadNotifications = 2;
          const readNotifications =
          JSON.parse(localStorage.getItem("kb_read_notifications")) || [];

          const unreadCount = Math.max(totalUnreadNotifications - readNotifications.length, 0);

          if(notificationBadge){
              if(unreadCount > 0){
                  notificationBadge.textContent = unreadCount;
                  notificationBadge.style.display = "flex";
              }else{
                  notificationBadge.style.display = "none";
              }
          }

          loginBtn.onclick = function(e){
              e.preventDefault();
              e.stopPropagation();
              profileDropdown.classList.toggle("active");
          };

          document.addEventListener("click", function(e){
              if(!profileDropdown.contains(e.target) && e.target !== loginBtn){
                  profileDropdown.classList.remove("active");
              }
          });

          if(logoutBtn){
              logoutBtn.onclick = function(e){
                  e.preventDefault();
                  e.stopPropagation();
                  showLogoutConfirm();
              };
          }

      });
};

function showLogoutConfirm(){

    const oldConfirm = document.getElementById("logoutConfirmModal");
    if(oldConfirm) oldConfirm.remove();

    document.body.insertAdjacentHTML("beforeend", `
        <div class="logout-confirm-modal" id="logoutConfirmModal">
            <div class="logout-confirm-box">
                <h3>Çıkış yapılsın mı?</h3>
                <p>Hesabından çıkış yapmak istediğine emin misin?</p>

                <div class="logout-confirm-actions">
                    <button id="cancelLogout" class="cancel-logout">Vazgeç</button>
                    <button id="confirmLogout" class="confirm-logout">Çıkış Yap</button>
                </div>
            </div>
        </div>
    `);

    const modal = document.getElementById("logoutConfirmModal");
    const cancelBtn = document.getElementById("cancelLogout");
    const confirmBtn = document.getElementById("confirmLogout");

    cancelBtn.onclick = function(){
        modal.remove();
    };

    modal.onclick = function(e){
        if(e.target === modal){
            modal.remove();
        }
    };

    confirmBtn.onclick = async function(){

        try{
            const { getAuth, signOut } =
            await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js");

            const auth = getAuth();
            await signOut(auth);

        }catch(error){
            console.warn("Firebase çıkışı yapılamadı, yerel çıkış yapılacak:", error);
        }

        localStorage.removeItem("kb_user_name");
        localStorage.removeItem("kb_read_notifications");

        window.location.href = "index.html";
    };
}
.logout-confirm-modal{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:99999999;
}

.logout-confirm-box{
    width:90%;
    max-width:380px;
    background:white;
    border-radius:18px;
    padding:28px;
    box-shadow:0 18px 45px rgba(0,0,0,.25);
    text-align:center;
}

.logout-confirm-box h3{
    margin:0 0 10px;
    font-size:24px;
}

.logout-confirm-box p{
    color:#667085;
    margin-bottom:24px;
}

.logout-confirm-actions{
    display:flex;
    gap:12px;
}

.logout-confirm-actions button{
    flex:1;
    border:0;
    border-radius:12px;
    padding:14px;
    font-weight:900;
    cursor:pointer;
}

.cancel-logout{
    background:#eef2ff;
    color:#2563eb;
}

.confirm-logout{
    background:#ef4444;
    color:white;
}