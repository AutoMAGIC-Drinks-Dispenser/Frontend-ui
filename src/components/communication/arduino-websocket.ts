class ArduinoWebSocket {
  private ws: WebSocket | null = null;
  private subscribers: ((data: string) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      console.log('Received from WebSocket:', event.data);
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
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: (data: string) => void) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }
}

export const arduinoWebSocket = new ArduinoWebSocket(); 