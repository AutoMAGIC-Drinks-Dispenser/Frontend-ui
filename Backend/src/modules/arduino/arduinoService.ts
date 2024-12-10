import { EventEmitter } from 'events';
const SerialPort = require('node-serialport').SerialPort;

class ArduinoService extends EventEmitter {
  private serialPort: any = null;
  private readonly PORT_PATH = '/dev/ttyS0';
  private readonly BAUD_RATE = 9600;
  private buffer: string = '';

  constructor() {
    super();
    this.init();
  }

  private init() {
    try {
      console.log(`Connecting to ${this.PORT_PATH}...`);
      
      this.serialPort = new SerialPort(this.PORT_PATH, {
        baudRate: this.BAUD_RATE
      });

      this.serialPort.on('data', (data: Buffer) => {
        this.buffer += data.toString();
        
        if (this.buffer.includes('\n')) {
          const lines = this.buffer.split('\n');
          this.buffer = lines.pop() || ''; // Keep the last incomplete line

          for (const line of lines) {
            const cleanData = line.trim();
            if (cleanData.startsWith('RFID:')) {
              const rfid = cleanData.split(':')[1].trim();
              this.emit('rfid', rfid);
              console.log('Received RFID:', rfid);
            }
          }
        }
      });

      this.serialPort.on('open', () => {
        console.log('Serial connection established on', this.PORT_PATH);
        this.emit('connected');
      });

      this.serialPort.on('error', (error: Error) => {
        console.error('Serial error:', error);
        this.emit('error', error);
      });

    } catch (error) {
      console.error('Failed to initialize serial connection:', error);
    }
  }

  public sendData(data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.serialPort?.isOpen) {
        reject(new Error('Serial port is not connected'));
        return;
      }

      this.serialPort.write(data + '\n', (error: Error | null) => {
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
    return this.PORT_PATH;
  }
}

export const arduinoService = new ArduinoService();