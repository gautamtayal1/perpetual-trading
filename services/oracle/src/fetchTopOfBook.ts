import { SubscriptionManager } from "@repo/event-queue";
import EventEmitter from "events";
import { emitTopOfBook } from "./marketDataBus.js";

export async function fetchTopOfBook() {

  SubscriptionManager
    .getInstance()
    .subscribe("topOfBook:update", 
      top => {
        emitTopOfBook(top)
      }
  )
}
