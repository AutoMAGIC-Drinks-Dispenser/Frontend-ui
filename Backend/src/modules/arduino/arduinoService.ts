import { SerialPort, ReadlineParser } from "serialport";
import { EventEmitter } from "events";
import { TextEncoder, TextDecoder } from "util";

class ArduinoService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private encoder: TextEncoder = new TextEncoder();
  private decoder: TextDecoder = new TextDecoder();
  private readonly PORT_PATH = "/dev/ttyS0";
  private readonly BAUD_RATE = 9600;

  public async connect(): Promise<void> {
    try {
      this.serialPort = new SerialPort({
        path: this.PORT_PATH,
        baudRate: this.BAUD_RATE,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
      });

      this.parser = this.serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

      this.serialPort.on("open", () => {
        console.log("Arduino connected on", this.PORT_PATH);
        this.emit("connected");
      });

      this.parser.on("data", (data: string) => {
        try {
          const message = data.trim();
          console.log('------- Arduino Data Flow -------');
          console.log('1. Raw serial data received:', message);
          console.log('2. Data type:', typeof message);
          console.log('3. Formatted message:', `user:${message}`);
          this.emit("data", `user:${message}`);
          console.log('4. Data emitted to listeners');
          console.log('-------------------------------');
        } catch (error) {
          console.error('Error processing serial data:', error);
        }
      });

      // Add error handlers
      this.serialPort.on("error", (err) => {
        console.error("Serial port error:", err);
        this.emit("error", err);
      });

      this.parser.on("error", (err) => {
        console.error("Parser error:", err);
        this.emit("error", err);
      });

    } catch (error) {
      console.error('Error connecting to serial port:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.serialPort?.isOpen) {
      await new Promise<void>((resolve, reject) => {
        this.serialPort!.close((err) => {
          if (err) {
            console.error("Error closing serial port:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }

  public async sendData(key: string, value: string): Promise<void> {
    if (!this.serialPort?.isOpen) {
      throw new Error("Arduino is not connected.");
    }

    const formattedData = `${key}:${value}\n`;
    const encodedData = this.encoder.encode(formattedData);

    this.serialPort.write(encodedData, (err) => {
      if (err) {
        console.error("Failed to send data to Arduino:", err);
        throw err;
      }
      console.log(`Sent to Arduino: ${formattedData}`);
    });
  }
}

export const arduinoService = new ArduinoService();
