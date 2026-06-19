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

    fetch("profile.html")
      .then(res => res.text())
      .then(data => {

          document.body.insertAdjacentHTML("beforeend", data);

          const profileDropdown = document.getElementById("profileDropdown");
          const notificationBadge = document.getElementById("notificationBadge");

const totalUnreadNotifications = 2; 
const readNotifications =
JSON.parse(localStorage.getItem("kb_read_notifications")) || [];

const unreadCount = Math.max(totalUnreadNotifications - readNotifications.length, 0);

if(notificationBadge){
    if(unreadCount > 0){
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = "flex";
    }else{
        notificationBadge.textContent = "0";
        notificationBadge.style.display = "none";
    }
}
          const logoutBtn = document.getElementById("logoutBtn");

          if(!profileDropdown) return;

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
              logoutBtn.onclick = function(){
                  localStorage.removeItem("kb_user_name");
                  location.reload();
              };
          }

      });
};