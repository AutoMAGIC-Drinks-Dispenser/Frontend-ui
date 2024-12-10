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

      // Open port with minimal options
      this.serialPort = new SerialPort({
        path: this.PORT_PATH,
        baudRate: this.BAUD_RATE,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        // Don't use flow control
        rtscts: false,
        xon: false,
        xoff: false
      });

      // Create parser with simpler delimiter
      this.parser = new ReadlineParser({ delimiter: '\n' });
      this.serialPort.pipe(this.parser);

      // Raw data logging
      this.serialPort.on('data', (data: Buffer) => {
        console.log('Raw data received:', data.toString('hex'));
      });

      this.parser.on('data', (line: string) => {
        console.log('Parsed line:', line);
        // Try to extract any number sequence
        const matches = line.match(/\d+/);
        if (matches) {
          const rfid = matches[0];
          console.log('Found RFID:', rfid);
          this.emit('rfid', rfid);
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

  public getCurrentPort(): string | null {
    return this.serialPort?.path ?? null;
  }
}

export const arduinoService = new ArduinoService();