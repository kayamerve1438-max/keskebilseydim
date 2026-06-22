// 1. ORTAK HEADER (MENÜ) BİLEŞENİ
class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="main-header">
            <nav>...</nav> 
        </header>
        `;
    }
}
customElements.define('site-header', SiteHeader);

// 2. ORTAK BİLGE KEDI VE BALON BİLEŞENİ
class BilgeKedi extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="kb-cat-wrapper" style="position: relative; display: inline-block;">
            <img src="images/bilge-kedi.png" alt="Bilge Kedi" style="display: block; max-width: 100%; height: auto;">
            <div class="chat-bubble" style="position: absolute; top: -20px; left: 105%; background: white; border-radius: 20px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); min-width: 200px;">
                <p style="margin: 0; color: #333; font-size: 14px;">Ev almadan önce keşke komşuları tanısaydım...</p>
            </div>
        </div>
        `;
    }
}
customElements.define('bilge-kedi', BilgeKedi);