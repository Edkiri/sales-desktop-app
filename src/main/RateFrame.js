
class RateFrame {
  constructor(parentId) {
    this.parent = document.getElementById(parentId);
    this.rateInput = document.createElement('input');
    this.rateSpan = document.createElement('span');
    this.rateSpan.classList.add("rateSpan");
    this.acceptBtn = document.createElement('button');
    this.changeBtn = document.createElement('button');
    this.todayBtn = document.createElement('button');
    this.todayBtn.classList.add("todayBtn");
    this.init();
    this.addListeners();
  }

  init() {
    const rateLabel = document.createElement('span');
    rateLabel.textContent = "Tasa del día :";
    rateLabel.classList.add("title");
    this.rateInput.type = "number";
    this.acceptBtn.type = "button";
    this.acceptBtn.classList.add("acceptBtn");
    this.changeBtn.type = "button";
    this.changeBtn.classList.add("changeBtn");
    this.rateSpan.style.display = "none";
    this.changeBtn.style.display = "none";
    this.todayBtn.type = "button";
    this.parent.append(
      rateLabel, 
      this.rateInput,
      this.rateSpan, 
      this.acceptBtn,
      this.changeBtn,
      this.todayBtn
    );
  }

  addListeners() {

    this.acceptBtn.onclick = () => {
      const dailyRate = this.rateInput.value
      window.api.send('setDailyRate', dailyRate);
    }
    this.rateInput.addEventListener("keydown", e => {
      if(e.key === "Enter") {
        const dailyRate = this.rateInput.value
        window.api.send('setDailyRate', dailyRate);
      }
    })

    this.todayBtn.onclick = () => {
      this.getDataFromDollarToday((rateDollarTodayInt) => {
        window.api.send('setDailyRate', rateDollarTodayInt);
        document.body.style.cursor = "default";
      })
    }

    this.changeBtn.onclick = () => {
      this.rateSpan.style.display = "none";
      this.changeBtn.style.display = "none";
      this.rateInput.style.display = "inline-block";
      this.acceptBtn.style.display = "inline-block";
      this.todayBtn.style.display = "inline-block";
      this.rateInput.value = this.rateSpan.textContent;
    }

    window.api.recieve("rateValue", (DAILY_RATE) => {
      this.rateInput.style.display = "none";
      this.acceptBtn.style.display = "none";
      this.todayBtn.style.display = "none";
      this.rateSpan.textContent = DAILY_RATE;
      this.rateSpan.style.display = "inline-block";
      this.changeBtn.style.display = "inline-block";
    })
    
  }

  getDataFromDollarToday(callback) {
    document.body.style.cursor = "wait";
    const dollarTodayUrl = "https://www.bing.com/search?q=dollar+today+Refinitiv";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", dollarTodayUrl, true);
    xhr.responseType = "document";
    xhr.onreadystatechange = () => {
      if(xhr.readyState == 4 && xhr.status == 200) {
        const response = xhr.responseXML;
        const rateDollarToday = response.querySelector("#cc_tv").defaultValue;
        const rateDollarTodayInt = Math.ceil(parseFloat(rateDollarToday.replaceAll(".", "")));
        callback(rateDollarTodayInt);
      }
    };
    xhr.onerror = () => {
      console.error(`Error intentando obtener la venta del día de DolarToday - ${xhr.statusText}`);
      document.body.style.cursor = "default";
    }
    xhr.send();
  }
}