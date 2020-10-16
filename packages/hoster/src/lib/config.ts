import Conf from 'conf';


export interface PersistanceData {
}

export const config = new Conf<PersistanceData>({
    defaults: {
    },
});
