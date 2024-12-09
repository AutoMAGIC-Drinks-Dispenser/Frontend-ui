import { SerialPort } from "serialport";
import { EventEmitter } from "events";
import { TextEncoder, TextDecoder } from "util";

class ArduinoService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private encoder: TextEncoder | null = new TextEncoder();
  private decoder: TextDecoder | null = new TextDecoder();
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

      this.serialPort.on("open", () => {
        console.log("Serial port opened successfully.");
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

      this.listenForData();
    } catch (error) {
      console.error("Failed to connect to Arduino:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.serialPort?.isOpen) {
      await new Promise<void>((resolve, reject) => {
        this.serialPort!.close((err) => {
          if (err) {
            console.error("Failed to close serial port:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
      this.serialPort = null;
      console.log("Serial port disconnected.");
    }
  }

  public async sendData(data: string): Promise<void> {
    if (!this.serialPort?.isOpen) {
      throw new Error("Serial port is not connected.");
    }

    const encodedData = this.encoder!.encode(data + "\n");
    this.serialPort.write(encodedData, (err) => {
      if (err) {
        console.error("Failed to send data to Arduino:", err);
        throw err;
      }
      console.log(`Sent to Arduino: ${data}`);
    });
  }

  private listenForData(): void {
    if (!this.serialPort) {
      console.error("Serial port not initialized.");
      return;
    }

    this.serialPort.on("data", (data: Buffer) => {
      const decodedData = this.decoder!.decode(data).trim();
      console.log(`Received from Arduino: ${decodedData}`);
      this.emit("data", decodedData);
    });
  }

  public isConnected(): boolean {
    return this.serialPort?.isOpen ?? false;
  }

  // Test connection functionality
  public async testConnection(): Promise<void> {
    if (!this.serialPort?.isOpen) {
      console.log("Serial port is not open. Connecting...");
      await this.connect();
    }

    console.log("Starting test...");

    // Test sending data
    const testData = "Test message from Raspberry Pi";
    try {
      await this.sendData(testData);
      console.log(`Sent test data: "${testData}"`);
    } catch (err) {
      console.error("Error sending test data:", err);
    }

    // Test receiving data
    this.on("data", (receivedData) => {
      console.log(`Test received data: "${receivedData}"`);
    });

    console.log("Test setup complete. Waiting for Arduino response...");
  }
}

export const arduinoService = new ArduinoService();
