class BilgeKedi extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.sozler = [
      "Sözleşme okumak sıkıcıdır ama depozitodan ucuzdur. 🐾",
      "Sessiz mahalle dediler, alt katım müzisyen çıktı... 🎸",
      "Maaşına bakıp iş seçtin ama huzurun nerede? Mırr.. 💼",
      "Ev kiralarken her köşenin fotoğrafını çekmeyi unutma! 📸",
      "Keşke bilseydim demek istemiyorsan, doğru yerdesin. 😼",
      "Sen onu benim patime anlat. 🐾",
      "Kitaplarımı taradım, mantığını bulamadım. 📚",
      "Düşünmüşsün... ama yeterince değil. 🧠",
      "Ben bile bu kadar meraklı değilim. 🐈"
    ];
  }

  connectedCallback() {
    this.render();
    this.yeniKediGetir();
    this.intervalId = setInterval(() => this.yeniKediGetir(), 10000);
  }

  disconnectedCallback() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  yeniKediGetir() {
    const kediImg = this.shadowRoot.getElementById('kediGorsel');
    const balonKutusu = this.shadowRoot.getElementById('balonKutusu');
    
    if (!kediImg || !balonKutusu) return;

    const rastgeleNumara = Math.floor(Math.random() * 90) + 1;
    const rastgeleSoz = this.sozler[Math.floor(Math.random() * this.sozler.length)];

    kediImg.style.opacity = '0';
    setTimeout(() => {
      kediImg.src = `images/kedi_${rastgeleNumara}.png`;
      balonKutusu.textContent = rastgeleSoz;
      kediImg.style.opacity = '1';
    }, 300);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 100%;
          min-height: 380px;
        }

        .cat-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 380px;
        }
          .cat-container::before {
  content: "";
  position: absolute;
  width: 460px;
  height: 260px;
  right: -40px;
  bottom: 15px;
  z-index: 0;
  pointer-events: none;

  background:
    radial-gradient(circle at 70% 35%, rgba(236,72,153,.45), transparent 32%),
    radial-gradient(circle at 30% 65%, rgba(56,189,248,.35), transparent 34%),
    linear-gradient(to top, rgba(15,23,42,.95), transparent 70%);
  filter: blur(2px);
  opacity: .85;
}

.cat-container::after {
  content: "✦  ·  ✧     ✦        ·  ✧";
  position: absolute;
  right: -10px;
  top: 40px;
  width: 380px;
  height: 240px;
  color: rgba(236,72,153,.75);
  font-size: 24px;
  letter-spacing: 22px;
  line-height: 2.4;
  z-index: 1;
  pointer-events: none;
  text-shadow:
    0 0 12px rgba(236,72,153,.8),
    0 0 18px rgba(56,189,248,.45);
}

        .bilge-kedi_img {
  width: 150px;
  height: auto;
  z-index: 3;
  transition: opacity 0.3s ease-in-out;
  margin-top: auto;
  filter:
    drop-shadow(0 0 18px rgba(236,72,153,.35))
    drop-shadow(0 0 26px rgba(56,189,248,.18));
}

        .speech {
          position: relative;
          margin-bottom: 20px;
          width: 100%;
          max-width: 280px;
          background: white;
          border: 2px solid #eadfd4;
          border-radius: 20px;
          padding: 16px;
          font-family: Georgia, serif;
          font-size: 15px;
          line-height: 1.5;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          color: #101828;
          z-index: 10;
          box-sizing: border-box;
        }

        .speech:before {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px 10px 0 10px;
          border-style: solid;
          border-color: white transparent transparent transparent;
          filter: drop-shadow(0px 2px 1px #eadfd4);
        }

        .speech:after {
          content: "🐾";
          color: #ef3f7a;
          display: block;
          font-size: 14px;
          margin-top: 6px;
        }
      </style>

      <div class="cat-container">
        <div class="speech" id="balonKutusu">Yükleniyor...</div>
        <img class="bilge-kedi_img" id="kediGorsel" src="images/kedi_1.png" alt="Bilge Kedi">
      </div>
    `;
  }
}

if (!customElements.get('bilge-kedi')) {
  customElements.define('bilge-kedi', BilgeKedi);
}