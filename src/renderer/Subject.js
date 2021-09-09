class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(obs) {
    this.observers.push(obs);
  }

  unsubscribe(obs) {
    this.observers = this.observers.filter(e => e != obs);
  }

  notify(o) {
    this.observers.forEach(obs => {
      obs.notify(o);
    })
  }
}