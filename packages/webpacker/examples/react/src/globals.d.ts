import * as main from './index'

declare global {

    interface Window {
        // history:H.History
        main: typeof main
    }
}
