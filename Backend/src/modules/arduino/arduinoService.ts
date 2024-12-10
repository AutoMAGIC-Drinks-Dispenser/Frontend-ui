import { SerialPort, ReadlineParser } from 'serialport';
import { EventEmitter } from 'events';

class ArduinoService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private readonly PORT_PATH = '/dev/ttyS0';
  private readonly BAUD_RATE = 9600;

  constructor() {
    super();
    this.init();
  }

  private async init() {
    try {
      console.log(`Connecting to ${this.PORT_PATH}...`);
      
      this.serialPort = new SerialPort({
        path: this.PORT_PATH,
        baudRate: this.BAUD_RATE,
      });

      this.parser = new ReadlineParser();
      this.serialPort.pipe(this.parser);

      this.parser.on('data', (data: string) => {
        const cleanData = data.trim();
        if (cleanData.startsWith('RFID:')) {
          const rfid = cleanData.split(':')[1].trim();
          this.emit('rfid', rfid);
          console.log('Received RFID:', rfid);
        }
      });

      this.serialPort.on('open', () => {
        console.log('Serial connection established on', this.PORT_PATH);
        this.emit('connected');
      });

      this.serialPort.on('error', (error) => {
        console.error('Serial error:', error);
        this.emit('error', error);
      });

      this.serialPort.on('close', () => {
        console.log('Serial connection closed');
        this.emit('disconnected');
      });

    } catch (error) {
      console.error('Failed to initialize serial connection:', error);
    }
  }

  public async sendData(data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.serialPort?.isOpen) {
        reject(new Error('Serial port is not connected'));
        return;
      }

      this.serialPort.write(`${data}\n`, (error) => {
        if (error) {
          console.error('Failed to send data:', error);
          reject(error);
        } else {
          console.log('Sent:', data);
          resolve(true);
        }
      });
    });
  }

  public isConnected(): boolean {
    return this.serialPort?.isOpen ?? false;
  }

  public getCurrentPort(): string | null {
    return this.serialPort?.path ?? null;
  }
}

export const arduinoService = new ArduinoService();