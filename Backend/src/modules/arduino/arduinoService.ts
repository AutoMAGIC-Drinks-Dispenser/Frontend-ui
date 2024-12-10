import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { EventEmitter } from 'events';

class ArduinoService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private readonly PORT_PATH = '/dev/ttyS0';
  private readonly BAUD_RATE = 9600;

  constructor() {
    super();
  }

  public async connect(): Promise<void> {
    try {
      if (this.serialPort?.isOpen) {
        console.log('Already connected');
        return;
      }

      console.log(`Connecting to ${this.PORT_PATH}...`);
      this.serialPort = new SerialPort({
        path: this.PORT_PATH,
        baudRate: this.BAUD_RATE
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

      this.serialPort.on('error', (error) => {
        console.error('Serial error:', error);
        this.emit('error', error);
      });

    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.serialPort?.isOpen) {
      await new Promise<void>((resolve, reject) => {
        this.serialPort!.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      console.log('Disconnected from serial port');
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
}

export const arduinoService = new ArduinoService();