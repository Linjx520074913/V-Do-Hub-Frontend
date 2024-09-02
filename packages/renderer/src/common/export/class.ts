class Queue<T> {
      items: T[]
  
      constructor(initialList?: T[]) {
        if (undefined != initialList) {
            this.items = JSON.parse(JSON.stringify(initialList));
        }
          this.items = [];
      }
  
      enQueue(element: T) {
          this.items.push(element);
      }
  
      deQueue() {
          return this.items.shift();
      }
  
      front() {
          return this.items[0];
      }
  
      isEmpty() {
          return this.items.length === 0;
      }
  
      size() {
          return this.items.length;
      }
};

export {
      Queue
}