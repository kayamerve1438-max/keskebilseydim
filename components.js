class BilgeKedi extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Sözler listesi
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
    
    // Her 10 saniyede bir kedi resmini ve sözü güvenli bir şekilde günceller
    this.intervalId = setInterval(() => this.yeniKediGetir(), 10000);
  }

  disconnectedCallback() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  yeniKediGetir() {
    const kediImg = this.shadowRoot.getElementById('kediGorsel');
    const balon Kutusu = this.shadowRoot.getElementById('balonKutusu');
    
    if (!kediImg || !balonKutusu) return;

    const rastgeleNumara = Math.floor(Math.random() * 90) + 1;
    const rastgeleSoz = this.sozler[Math.floor(Math.random() * this.sozler.length)];

    // Animasyonlu geçiş efekti
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
          height: 380px;
          min-height: 380px;
        }

        .cat-container {
          position: relative;
          width: 450px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding-bottom: 20px;
        }

        .bilge-kedi_img {
          width: 150px;
          height: auto;
          z-index: 2;
          transition: opacity 0.3s ease-in-out;
          opacity: 0;
        }

        .speech {
          position: absolute;
          bottom: 210px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
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
        <div class="speech" id="balonKutusu">Yükleniyor... 🐾</div>
        <img class="bilge-kedi_img" id="kediGorsel" src="images/kedi_1.png" alt="Bilge Kedi">
      </div>
    `;
  }
}

// Bileşeni tarayıcıya kaydetme
if (!customElements.get('bilge-kedi')) {
  customElements.define('bilge-kedi', BilgeKedi);
}