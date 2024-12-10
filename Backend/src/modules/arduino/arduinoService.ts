import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { EventEmitter } from 'events';

class ArduinoService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private readonly PORT_PATH = '/dev/ttyS0'; // GPIO UART port on Raspberry Pi 4
  private readonly BAUD_RATE = 9600;

  constructor() {
    super();
    this.init();
  }

  private async init() {
    try {
      this.serialPort = new SerialPort({
        path: this.PORT_PATH,
        baudRate: this.BAUD_RATE,
        dataBits: 8,
        parity: 'none',
        stopBits: 1
      });

      this.parser = this.serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

      this.serialPort.on('open', () => {
        console.log('UART connection established');
        this.emit('connected');
      });

      this.parser.on('data', (data: string) => {
        const rfidData = data.trim();
        if (rfidData) {
          console.log('Received RFID:', rfidData);
          this.emit('rfid', rfidData);
        }
      });

      this.serialPort.on('error', (error) => {
        console.error('UART error:', error);
        this.emit('error', error);
      });

    } catch (error) {
      console.error('Failed to initialize UART:', error);
      this.emit('error', error);
    }
  }

  public isConnected(): boolean {
    return this.serialPort?.isOpen ?? false;
  }
}

export const arduinoService = new ArduinoService();