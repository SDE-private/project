import dotenv from "dotenv";
import business_server from "./business/index.js";
import process_server from "./process/index.js";

dotenv.config();

const business_port = process.env.BUSINESS_PORT || 3000;
const process_port = process.env.PROCESS_PORT || 3001;

business_server.listen(business_port, () => {
  console.log(`Business service listening on port ${business_port}`);
});

process_server.listen(process_port, () => {
  console.log(`Process service listening on port ${process_port}`);
});
