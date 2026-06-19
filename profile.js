function initProfile(){

    const loginBtn = document.querySelector(".login");
    if(!loginBtn) return;

    const savedName = localStorage.getItem("kb_user_name");
    if(!savedName) return;

    loginBtn.textContent = savedName;
    loginBtn.classList.add("logged-in");

    fetch("profile.html")
  .then(res => res.text())
  .then(data => {

      console.log("PROFILE YÜKLENDİ");
      console.log(data);

      document.body.insertAdjacentHTML("beforeend", data);

      const profileDropdown = document.getElementById("profileDropdown");

      console.log(profileDropdown);

      loginBtn.addEventListener("click", function(e){

          if(!loginBtn.classList.contains("logged-in")) return;

          e.preventDefault();

          profileDropdown.classList.toggle("active");
      });

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
}