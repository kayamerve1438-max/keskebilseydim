class BilgeKedi extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="cat-hero" style="position: relative; height: 360px; display: block; width: 100%;">
            <div class="speech" style="
                position: absolute;
                left: 240px;
                top: 50px;
                width: 260px;
                background: white;
                border: 2px solid #eadfd4;
                border-radius: 20px;
                padding: 18px 22px;
                font-family: Georgia, serif;
                font-size: 15px;
                line-height: 1.5;
                text-align: center;
                box-shadow: 0 8px 24px rgba(0,0,0,0.06);
                z-index: 10;
                color: #101828;
            ">
                Ev almadan önce keşke komşuları tanısaydım...
                <span style="content:'🐾'; color:#ef3f7a; display:block; font-size:16px; margin-top:6px;">🐾</span>
            </div>
            <img id="bilgeKedi" class="bilge-kedi_img" src="images/kedi_1.png" alt="Bilge Kedi" style="
                position: absolute;
                width: 160px;
                left: 50px;
                top: 80px;
                transition: all .4s ease;
                z-index: 2;
            ">
        </div>
        `;
    }
}
customElements.define('bilge-kedi', BilgeKedi);