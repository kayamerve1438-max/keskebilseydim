window.initProfile = function(){

    const loginBtn = document.querySelector(".login");
    if(!loginBtn) return;

    const savedName = localStorage.getItem("kb_user_name");

    const oldMenu = document.getElementById("profileDropdown");
    if(oldMenu) oldMenu.remove();

    if(!savedName){
        loginBtn.textContent = "Giriş Yap";
        loginBtn.classList.remove("logged-in");
        return;
    }

    loginBtn.textContent = savedName;
    loginBtn.classList.add("logged-in");

    fetch("profile.html?v=10")
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

    const oldModal = document.getElementById("logoutConfirmModal");
    if(oldModal) oldModal.remove();

    document.body.insertAdjacentHTML("beforeend", `
        <div class="logout-confirm-modal" id="logoutConfirmModal">
            <div class="logout-confirm-box">
                <h3>Çıkış yapılsın mı?</h3>
                <p>Hesabından çıkış yapmak istediğine emin misin?</p>

                <div class="logout-confirm-actions">
                    <button type="button" id="cancelLogout" class="cancel-logout">Vazgeç</button>
                    <button type="button" id="confirmLogout" class="confirm-logout">Çıkış Yap</button>
                </div>
            </div>
        </div>
    `);

    const modal = document.getElementById("logoutConfirmModal");

    document.getElementById("cancelLogout").onclick = function(){
        modal.remove();
    };

    document.getElementById("confirmLogout").onclick = async function(e){
    e.preventDefault();

    const { getAuth, signOut } = await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js");

    const auth = getAuth();

    await signOut(auth);

    localStorage.removeItem("kb_user_name");
    localStorage.removeItem("kb_user");

    modal.remove();

    window.location.href = "index.html";
};

    modal.onclick = function(e){
        if(e.target === modal){
            modal.remove();
        }
    };
}