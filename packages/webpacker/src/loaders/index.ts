import { resolve } from 'path';


export const CustomLoaders = {
    saveContent: resolve(__dirname, 'save-content-loader'),
    stripCssComments: resolve(__dirname, 'strip-css-comments-loader')
}
