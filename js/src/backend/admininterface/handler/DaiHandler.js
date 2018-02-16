export function sendAndHandleRequest(json) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://daiservices.fokus.fraunhofer.de:3001/json/fame/vod', true)
        xhr.setRequestHeader('Content-type', 'application/json')
        xhr.onload = function () {
            if (this.status === 200 ) {
                resolve(JSON.parse(xhr.responseText).dashUrl)
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
        }
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            })
        }
        xhr.send(JSON.stringify(json))
    })
}

export function getDuration(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.onload = function () {
            if (this.status === 200 ) {
                const response = xhr.response
                if (response === "") {
                    resolve(0)
                } else {

                    let xmlDoc = $.parseXML(response)

                    let mpd = xmlDoc.getElementsByTagName("MPD")[0]
                    let rawTime = mpd.getAttribute('mediaPresentationDuration')


                    if (rawTime.length === 0) {
                        reject(0)
                    } else {
                        //remove PT
                        rawTime = rawTime.substr(1)
                        rawTime = rawTime.substr(1)

                        

                        //H
                        let h = 0
                        let hPosi = rawTime.search("H")
                        if (hPosi !== -1) {
                            h = rawTime.substring(0, hPosi)
                            rawTime = rawTime.slice(hPosi + 1)
                            h = parseInt(h)
                        }

                        //M
                        let m = 0
                        let mPosi = rawTime.search("M")
                        if (mPosi !== -1) {
                            m = rawTime.substring(0, mPosi)
                            rawTime = rawTime.slice(mPosi + 1)
                            m = parseInt(m)
                        }


                        //S + ms
                        let s = 0
                        let bigS = 0
                        let ms = 0
                        if (rawTime.search("S") !== -1) {

                            let pPosi = rawTime.search(/\./)
                            if (pPosi !== -1){
                                bigS = (rawTime.substring(0,pPosi) * 1000)
                                rawTime = rawTime.slice(pPosi +1)

                                let sPosi = rawTime.search("S")
                                ms = rawTime.substring(0,sPosi)

                                switch (ms.length) {
                                    case 2:
                                        ms = (ms + "0")
                                        break
                                    case 1:
                                        ms = (ms + "00")
                                        break
                                    default:
                                        ms = ms
                                }
                                
                                s = parseInt(bigS) + parseInt(ms) 

                            }else {
                                //nur Seckunden
                                let sPosi = rawTime.search("S")
                                bigS = rawTime.substring(0,sPosi)

                                s = parseInt(bigS) * 1000
                            }
                        }    

                        s = parseInt(s)
                        let duration = 0

                        if (isInt(h) && isInt(m) && isInt(s)) {
                            duration = (h * 3600000) + (m * 60000) + (s)
                        }
                        resolve(duration)

                    }
                }
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
        }
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            })
        }
        xhr.send()
    })
}


function isInt(n){
    return Number(n) === n && n % 1 === 0
}