import EventEmitter from "events";

export interface TopOfBook { a: [ string, string ]; b: [ string, string ] }
export type IndexPrice = number;

const bus = new EventEmitter()

export function emitTopOfBook(top: TopOfBook) {
  bus.emit('top', top)
}

export function emitIndexPrice(index: IndexPrice) {
  bus.emit('index', index)
}

export default function onMarketDataUpdate(
  handler: (data: { top: TopOfBook; index: IndexPrice }) => void
) {
  let latestTop: TopOfBook | null = null
  let latestIndex: IndexPrice | null = null

  bus.on('top', top => {
    latestTop = top
    if(latestIndex) {
      handler({top, index: latestIndex})
    } else {
      handler({top, index: 90000})
    }
  })
  bus.on('index', index => {
    latestIndex = index
    if(latestTop) {
      handler({top: latestTop, index})
    }
  })
}