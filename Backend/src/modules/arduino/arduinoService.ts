import { SerialPort, ReadlineParser } from 'serialport';
import { EventEmitter } from 'events';

class ArduinoService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private autoReconnect: boolean = true;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly POSSIBLE_PORTS = [
    '/dev/ttyACM0',  // Most common for Arduino Mega
    '/dev/ttyUSB0',  // USB adapter
    '/dev/ttyS0',    // Hardware serial
  ];
  private currentPortIndex = 0;

  constructor() {
    super();
    this.init();
  }

  private async init() {
    try {
      for (let i = 0; i < this.POSSIBLE_PORTS.length; i++) {
        try {
          const portPath = this.POSSIBLE_PORTS[i];
          console.log(`Attempting to connect to ${portPath}...`);
          
          this.serialPort = new SerialPort({
            path: portPath,
            baudRate: 9600,
            autoOpen: false  // Don't open immediately
          });

          await new Promise<void>((resolve, reject) => {
            this.serialPort!.open((err) => {
              if (err) {
                console.log(`Failed to open ${portPath}:`, err.message);
                reject(err);
              } else {
                console.log(`Successfully connected to ${portPath}`);
                resolve();
              }
            });
          });

          this.currentPortIndex = i;
          break;
        } catch (err) {
          console.log(`Failed to connect to port ${this.POSSIBLE_PORTS[i]}`);
          if (i === this.POSSIBLE_PORTS.length - 1) {
            throw new Error('No available ports found');
          }
        }
      }

      this.parser = new ReadlineParser();
      this.serialPort!.pipe(this.parser);

      this.parser.on('data', (data: string) => {
        const cleanData = data.trim();
        if (cleanData.startsWith('RFID:')) {
          const rfid = cleanData.split(':')[1].trim();
          this.emit('rfid', rfid);
          console.log('Received RFID:', rfid);
        }
      });

      this.serialPort!.on('open', () => {
        console.log('UART connection established on /dev/serial0');
        this.emit('connected');
      });

      this.serialPort!.on('error', (error) => {
        console.error('UART error:', error);
        this.emit('error', error);
        this.handleDisconnect();
      });

      this.serialPort!.on('close', () => {
        console.log('UART connection closed');
        this.emit('disconnected');
        this.handleDisconnect();
      });

    } catch (error) {
      console.error('Failed to initialize UART connection:', error);
      this.handleDisconnect();
    }
  }

  private handleDisconnect() {
    if (this.autoReconnect && !this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect UART...');
        this.init();
        this.reconnectTimer = null;
      }, 5000);
    }
  }

  public async sendData(data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.serialPort?.isOpen) {
        reject(new Error('UART is not connected'));
        return;
      }

      this.serialPort.write(`${data}\n`, (error) => {
        if (error) {
          console.error('Failed to send data over UART:', error);
          reject(error);
        } else {
          console.log('Sent over UART:', data);
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

  public getCurrentPort(): string | null {
    return this.serialPort?.path ?? null;
  }
}

export const arduinoService = new ArduinoService();