import { startOracle } from "./fetchBinanceWs.js";
import { fetchTopOfBook } from "./fetchTopOfBook.js";
import  "./publisher.js";

startOracle()
fetchTopOfBook()