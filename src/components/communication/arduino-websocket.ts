class ArduinoWebSocket {
  private ws: WebSocket | null = null;
  private subscribers: ((data: string) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    console.log('Attempting to connect to WebSocket...');
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      console.log('Raw data received:', event.data);
      this.subscribers.forEach(callback => callback(event.data));
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed, attempting to reconnect...');
      setTimeout(() => this.connect(), 3000);
    };
  }

  public subscribe(callback: (data: string) => void) {
    console.log('New subscriber added');
    this.subscribers.push(callback);
    return () => this.unsubscribe(callback); // Return unsubscribe function
  }

  public unsubscribe(callback: (data: string) => void) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
    console.log('Subscriber removed. Remaining subscribers:', this.subscribers.length);
  }
}

export const arduinoWebSocket = new ArduinoWebSocket(); 