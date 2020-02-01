export * from './interfaces';
export * from './kindOf';
export * from './kindsOf';
export * from './thenBy';


export async function tester(){
    let tb =  await import('./thenBy')
    return tb.firstBy('a')
}
