const walkingCat = document.getElementById("walkingCat");
const catBubble = document.getElementById("catBubble");
const walkingCatImg = document.getElementById("walkingCatImg");

const catWords = [
  "Sen onu benim patime anlat.",
  "Keşke demek bedava ama sonucu pahalı.",
  "Ben bilge değilim, çok yaşadım.",
  "Bu kararı kediye sorsaydın daha az üzülürdün.",
  "Miyav dedim, yine dinlemedin.",
  "Bazı kararlar mama kabı kadar boş çıkar.",
  "Önce yorumları oku, sonra pişman ol.",
  "Ben bile bu kadar meraklı değilim."
];

function showCatBubble(text) {
  catBubble.textContent = text || catWords[Math.floor(Math.random() * catWords.length)];
  catBubble.classList.add("show");

  setTimeout(() => {
    catBubble.classList.remove("show");
  }, 3500);
}

function moveCat() {
  const screenWidth = window.innerWidth;
  const catWidth = 120;
  const randomLeft = Math.floor(Math.random() * (screenWidth - catWidth));

  const currentLeft = walkingCat.offsetLeft;

  if (randomLeft < currentLeft) {
    walkingCat.style.transform = "scaleX(-1)";
    catBubble.style.transform = "scaleX(-1)";
  } else {
    walkingCat.style.transform = "scaleX(1)";
    catBubble.style.transform = "scaleX(1)";
  }

  walkingCat.style.left = randomLeft + "px";
}

walkingCatImg.addEventListener("click", () => {
  showCatBubble();
});

setTimeout(() => {
  showCatBubble("Ben geldim. Kararları yakından takip ediyorum.");
}, 1200);

setInterval(() => {
  moveCat();

  if (Math.random() > 0.45) {
    setTimeout(() => {
      showCatBubble();
    }, 1800);
  }
}, 6000);