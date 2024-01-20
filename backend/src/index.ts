import dotenv from "dotenv";

dotenv.config();

const business_port = process.env.BUSINESS_PORT || 3000;
const process_port = process.env.PROCESS_PORT || 3001;

import business_server from "./business/index.js";
import process_server from "./process/index.js";

business_server.listen(business_port, () => {
  console.log(`Business service listening on port ${business_port}`);
});

process_server.listen(process_port, () => {
  console.log(`Process service listening on port ${process_port}`);
})