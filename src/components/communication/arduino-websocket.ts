type ArduinoDataCallback = (data: string) => void;

class ArduinoWebSocket {
  private ws: WebSocket | null = null;
  private callbacks: Set<ArduinoDataCallback> = new Set();

  connect() {
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onmessage = (event) => {
      console.log('Received Arduino data:', event.data);
      this.callbacks.forEach(callback => callback(event.data));
    };

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  subscribe(callback: ArduinoDataCallback) {
    this.callbacks.add(callback);
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
    }
  }

  unsubscribe(callback: ArduinoDataCallback) {
    this.callbacks.delete(callback);
  }
}

export const arduinoWebSocket = new ArduinoWebSocket(); 