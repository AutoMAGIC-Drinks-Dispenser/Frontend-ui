// import { useState } from "react";
// import { SerialPort } from "serialport";

// let globalWriter: WritableStreamDefaultWriter<string> | null = null;

// export const sendDataToArduino = async (data: string) => {
//   if (!globalWriter) {
//     console.error("No serial writer available. Connect to the Arduino first.");
//     return;
//   }

//   try {
//     await globalWriter.write(data + "\n"); // Send data with a newline character
//     console.log(`Sent to Arduino: ${data}`);
//   } catch (err) {
//     console.error("Failed to write to Arduino:", err);
//   }
// };

// export const WebSerialCommunication: React.FC = () => {
//   const [port, setPort] = useState<SerialPort | null>(null);

//   const requestSerialPort = async () => {
//     try {
//       const newPort =   await (
//         navigator as unknown as {
//           serial: { requestPort: () => Promise<SerialPort> };
//         }
//       ).serial.requestPort(); // Prompts user to select a serial port
//       await (newPort as SerialPort).open({ baudRate: 9600 }); // Match baud rate with the Arduino
//       setPort(newPort);

//       const textEncoder = new TextEncoderStream();
//       textEncoder.readable.pipeTo(
//         newPort.writable as unknown as WritableStream<Uint8Array>
//       );
//       globalWriter = textEncoder.writable.getWriter();

//       console.log("Serial port opened successfully!");
//     } catch (err) {
//       console.error("Failed to open serial port:", err);
//     }
//   };

//   const closeSerialPort = async () => {
//     try {
//       if (globalWriter) {
//         await globalWriter.close();
//         globalWriter = null;
//       }
//       if (port) {
//         await (port as SerialPort).close();
//         setPort(null);
//       }
//       console.log("Serial port closed.");
//     } catch (err) {
//       console.error("Failed to close serial port:", err);
//     }
//   };

//   return (
//     <div>
//       {!port ? (
//         <button
//           className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32 h-12"
//           onClick={requestSerialPort}
//         >
//           Connect to Arduino
//         </button>
//       ) : (
//         <button
//           className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32 h-12"
//           onClick={closeSerialPort}
//         >
//           Disconnect
//         </button>
//       )}
//     </div>
//   );
// };