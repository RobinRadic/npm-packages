import Conf from 'conf';


export interface ConfData {
    doppies: Array<{ timestamp?: Date, [ key: string ]: any }>
}

export const conf = new Conf<ConfData>({
    accessPropertiesByDotNotation: true,
    defaults                     : {
        doppies: [],
    },
});
