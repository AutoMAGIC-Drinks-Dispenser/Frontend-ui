// backend/src/modules/arduino/arduinoService.ts
import { SerialPort, ReadlineParser } from 'serialport';
import { EventEmitter } from 'events';

class ArduinoService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private autoReconnect: boolean = true;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    super();
    this.init();
  }

  private init() {
    try {
      this.serialPort = new SerialPort({
        path: '/dev/ttyACM0', // Adjust based on your RPi's Arduino port
        baudRate: 9600,
      });

      this.parser = new ReadlineParser();
      this.serialPort.pipe(this.parser);

      // Listen for incoming data from Arduino
      this.parser.on('data', (data: string) => {
        const cleanData = data.trim();
        if (cleanData) {
          this.emit('data', cleanData);
          console.log('Received from Arduino:', cleanData);
        }
      });

      // Handle connection events
      this.serialPort.on('open', () => {
        console.log('Arduino connection established');
        this.emit('connected');
      });

      this.serialPort.on('error', (error) => {
        console.error('Arduino error:', error);
        this.emit('error', error);
        this.handleDisconnect();
      });

      this.serialPort.on('close', () => {
        console.log('Arduino connection closed');
        this.emit('disconnected');
        this.handleDisconnect();
      });

    } catch (error) {
      console.error('Failed to initialize Arduino connection:', error);
      this.handleDisconnect();
    }
  }

  private handleDisconnect() {
    if (this.autoReconnect && !this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect to Arduino...');
        this.init();
        this.reconnectTimer = null;
      }, 5000);
    }
  }

  public async sendData(data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.serialPort?.isOpen) {
        reject(new Error('Arduino is not connected'));
        return;
      }

      this.serialPort.write(`${data}\n`, (error) => {
        if (error) {
          console.error('Failed to send data to Arduino:', error);
          reject(error);
        } else {
          console.log('Sent to Arduino:', data);
          resolve(true);
        }
      });
    });
  }

  public isConnected(): boolean {
    return this.serialPort?.isOpen ?? false;
  }

  public async disconnect(): Promise<void> {
    this.autoReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.serialPort?.isOpen) {
      await new Promise<void>((resolve, reject) => {
        this.serialPort!.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  }
}

export const arduinoService = new ArduinoService();