import { parsingError, Parser } from "./parser";

export class Logger {
  constructor() {

  }

  showErrorInConsole(error: parsingError, text: string) {
    let texts = text.split('\n')
    let len = error.errorInfos.length
    for(let i=0; i<len; i++) {
      let startingPoint = 0
      let errorInfo = error.errorInfos[i]
      let cn = errorInfo.pos.cn
      let ln = errorInfo.pos.ln
      let msg = errorInfo.msg
      let lnAsString = ln.toString()
      if (cn-25 > 0) { startingPoint = cn-25}
      console.log(ln+1 + '  ', texts[ln].substring(startingPoint, startingPoint+50))
      console.log(' '.repeat(lnAsString.length) + '  ', ' '.repeat(cn-1-startingPoint) + '~' + ' '.repeat(5) + msg)
      console.log()
    }
  }
}