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
    if (this.serialPort?.isOpen) return;

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

    this.serialPort.on("error", (err) => {
      console.error("Serial port error:", err);
      this.emit("error", err);
    });

    this.serialPort.on("close", () => {
      console.log("Serial port closed.");
      this.emit("disconnected");
    });

    this.parser.on("data", (data: string) => {
      const message = data.trim();
      console.log(`Received from Arduino: ${message}`);
      this.emit("data", message);
    });
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

  public isConnected(): boolean {
    return this.serialPort?.isOpen ?? false;
  }
}

export const arduinoService = new ArduinoService();
