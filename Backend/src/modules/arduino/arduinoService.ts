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

      // Check if port exists
      const ports = await SerialPort.list();
      console.log('Available ports:', ports);

      console.log(`Attempting to connect to ${this.PORT_PATH}...`);
      
      // Create port with more explicit options
      this.serialPort = new SerialPort({
        path: this.PORT_PATH,
        baudRate: this.BAUD_RATE,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        rtscts: false,
        xon: false,
        xoff: false,
        hupcl: true,
      });

      // Wait for port to open
      await new Promise<void>((resolve, reject) => {
        if (!this.serialPort) return reject(new Error('No serial port'));
        
        this.serialPort.on('open', () => {
          console.log('Port opened successfully');
          resolve();
        });
        
        this.serialPort.on('error', (error) => {
          console.error('Port error during opening:', error);
          reject(error);
        });
      });

      this.parser = new ReadlineParser({ delimiter: '\n' });
      this.serialPort.pipe(this.parser);

      this.parser.on('data', (data: string) => {
        const cleanData = data.trim();
        console.log('Raw data received:', cleanData);
        
        // Try to extract a number from the data
        const numericValue = cleanData.replace(/\D/g, '');
        if (numericValue) {
          console.log('Emitting RFID:', numericValue);
          this.emit('rfid', numericValue);
        }
      });

      this.serialPort.on('error', (error) => {
        console.error('Serial error:', error);
        this.emit('error', error);
      });

      console.log('Serial port setup complete');

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