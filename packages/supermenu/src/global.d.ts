import { SMU as _SMU } from '#';


declare global {
    interface Window {
        SMU:typeof _SMU
    }
    const SMU:typeof _SMU
}
