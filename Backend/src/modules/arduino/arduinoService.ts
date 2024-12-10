import { SerialPort } from 'serialport';
import { EventEmitter } from 'events';

class ArduinoService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private readonly PORT_PATH = '/dev/ttyACM0';  // Arduino Mega typically uses this port
  private readonly BAUD_RATE = 9600;
  private autoReconnect: boolean = false;  // Changed to false by default

  public async connect(): Promise<void> {
    try {
      if (this.serialPort?.isOpen) {
        console.log('Already connected to Arduino');
        return;
      }

      this.serialPort = new SerialPort({
        path: this.PORT_PATH,
        baudRate: this.BAUD_RATE,
      });

      this.serialPort.on('open', () => {
        console.log('Arduino connected successfully');
        this.emit('connected');
      });

      this.serialPort.on('error', (error) => {
        console.error('Arduino connection error:', error);
        this.emit('error', error);
      });

      this.serialPort.on('close', () => {
        console.log('Arduino connection closed');
        this.emit('disconnected');
      });

    } catch (error) {
      console.error('Failed to connect to Arduino:', error);
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
    }
  }

  // ... rest of the service code
}

export const arduinoService = new ArduinoService();