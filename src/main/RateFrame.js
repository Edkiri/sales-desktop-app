
class RateFrame {
  constructor(parentId) {
    this.parent = document.getElementById(parentId);
    this.rateInput = document.createElement('input');
    this.rateSpan = document.createElement('span');
    this.acceptBtn = document.createElement('button');
    this.changeBtn = document.createElement('button');
    this.init();
    this.addListeners();
  }

  init() {
    const rateLabel = document.createElement('span');
    rateLabel.textContent = "Tasa del día";
    this.rateInput.type = "number";
    this.acceptBtn.type = "button";
    this.acceptBtn.textContent = "Aceptar";
    this.changeBtn.type = "button";
    this.changeBtn.textContent = "Cambiar";
    this.rateSpan.style.display = "none";
    this.changeBtn.style.display = "none";
    this.parent.append(
      rateLabel, 
      this.rateInput,
      this.rateSpan, 
      this.acceptBtn,
      this.changeBtn
    );
  }

  addListeners() {

    this.acceptBtn.onclick = () => {
      const dailyRate = this.rateInput.value
      window.api.send('setDailyRate', dailyRate);
    }

    this.changeBtn.onclick = () => {
      this.rateSpan.style.display = "none";
      this.changeBtn.style.display = "none";
      this.rateInput.style.display = "inline-block";
      this.acceptBtn.style.display = "inline-block";
    }

    window.api.recieve("rateValue", (DAILY_RATE) => {
      this.rateInput.style.display = "none";
      this.acceptBtn.style.display = "none";
      this.rateSpan.textContent = DAILY_RATE;
      this.rateSpan.style.display = "inline-block";
      this.changeBtn.style.display = "inline-block";
    })
    
  }
}