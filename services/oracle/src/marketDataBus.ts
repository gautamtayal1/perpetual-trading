import EventEmitter from "events";

export interface TopOfBook { a: [ string, string ]; b: [ string, string ] }
export type IndexPrice = number;

const bus = new EventEmitter()

export function emitTopOfBook(top: TopOfBook) {
  console.log("emitting topOfBook", top)
  bus.emit('top', top)
  console.log("emitted topOfBook", top)
}

export function emitIndexPrice(index: IndexPrice) {
  console.log("emitting indexPrice", index)
  bus.emit('index', index)
  console.log("emitted indexPrice", index)
}

export function onMarketDataUpdate(
  handler: (data: { top: TopOfBook; index: IndexPrice }) => void
) {
  let latestTop: TopOfBook | null = null
  let latestIndex: IndexPrice | null = null

  bus.on('top', top => {
    latestTop = top
    console.log("top bus")
    if(latestIndex) {
      handler({top, index: latestIndex})
    }
  })
  bus.on('index', index => {
    latestIndex = index
    console.log("index bus")
    if(latestTop) {
      handler({top: latestTop, index})
    }
  })
}