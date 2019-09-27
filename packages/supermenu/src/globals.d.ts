import * as demo from './demo'
import * as supermenu from './index'

declare global {

    interface Window {
        demo: typeof demo
        supermenu: typeof supermenu
    }
}
