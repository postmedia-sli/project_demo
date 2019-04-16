// TODO: move/refactor

const iframeTimeout = 500

/*
 * General utils for managing cookies in Typescript.
 */
const setCookie = (name: string, val: any) => {
    const date = new Date()
    const expireMillis = 604800000 // 7 days
    const value = JSON.stringify(val)

    // Set expiry
    date.setTime(date.getTime() + expireMillis)

    // Set it
    document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/'
}

const getCookie = (name: string) => {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + name + '=')

    if (parts.length > 1) {
        return JSON.parse(parts.pop().split(';').shift())
    } else {
        return undefined
    }
}

// const deleteCookie = (name: string) => {
//     const date = new Date()

//     // Set it expire in -1 days
//     date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000))

//     // Set it
//     document.cookie = name + '=; expires=' + date.toUTCString() + '; path=/'
// }

class Message {
    public secret: string
    public action: string
    public payload: string

    constructor(secret: string, action: string, payload?: any) {
        this.secret = secret
        this.action = action
        this.payload = payload
    }
}

const getGlobalIFrame = async (secret: string, domain: string, path: string) => {
    const iFramePromise = new Promise(
        (resolve: any, reject: any) => {

            document.addEventListener('DOMContentLoaded', () => {
                const existingIframe = document.getElementById('iMessenger') as HTMLIFrameElement
                if (document.getElementById('iMessenger')) {
                    resolve(existingIframe)
                } else {
                    // in this example we use a IFrame to communicate with
                    const newIframe: HTMLIFrameElement = document.createElement('iframe')
                    newIframe.id = 'iMessenger'
                    newIframe.src = domain + path
                    document.body.append(newIframe)

                    // Set up the iframe with the responder
                    newIframe.contentWindow.addEventListener('message', (e) => {
                        if (e.data.secret === secret) {
                            if (e.data.action === 'set') {
                                setCookie('x', e.data.payload);
                                (e.source as Window).postMessage(
                                    new Message(secret, 'ack', e.data.payload), e.origin)
                            } else if (e.data.action === 'get') {
                                (e.source as Window).postMessage(
                                    new Message(secret, 'ack', getCookie('x')), e.origin)
                            }
                        }
                    })
                    resolve(newIframe)
                }
                // We will give half a sec for the iframe to load
                setTimeout(reject, iframeTimeout)
            })
        }
    )

    return iFramePromise
}

// TODO: add a message sequence number to secure concurrency
export const getGlobalCookie = async (secret: string, domain: string, path: string) => {
    const cookievalue = new Promise(
        (resolve: any, reject: any) => {
            getGlobalIFrame(secret, domain, path).then((iFrame: HTMLIFrameElement) => {
                const waitForResponse = (e: MessageEvent) => {
                    if (e.data.secret === secret) {
                        resolve(e.data.payload)
                        window.removeEventListener('message', waitForResponse)
                    }
                }

                window.addEventListener('message', waitForResponse)

                const question = new Message(secret, 'get')
                iFrame.contentWindow.postMessage(question, domain)

                // if we don't hear back from the iframe after half a sec, reject
                setTimeout(reject, iframeTimeout)
            }, () => {
                reject()
            })
        },
    )
    return cookievalue
}

// TODO: add a message sequence number to secure concurrency
export const setGlobalCookie = async (secret: string, domain: string, path: string, payload: object) => {
    const cookievalue = new Promise(
        (resolve: any, reject: any) => {
            getGlobalIFrame(secret, domain, path).then((iFrame: HTMLIFrameElement) => {
                // Self-destructing named function to collect the response
                const waitForResponse = (e: MessageEvent) => {
                    if (e.data.secret === secret) {
                        resolve(e.data.payload)
                        window.removeEventListener('message', waitForResponse)
                    }
                }

                window.addEventListener('message', waitForResponse)

                const question = new Message(secret, 'set', payload)
                iFrame.contentWindow.postMessage(question, domain)

                // if we don't hear back from the iframe after half a sec, reject
                setTimeout(reject, iframeTimeout)
            }, () => {
                reject()
            })
        },
    )
    return cookievalue
}
