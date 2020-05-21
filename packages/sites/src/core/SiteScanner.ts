import { app }     from './Application';
import glob from 'glob'

export class SiteScanner {

    public async scan(){
        if(app.apache.enabled){
            glob.sync(app.apache.path('site-available/*.conf'));
            for(const configPath of app.apache.getSiteConfigPaths()){
                const config = await app.apache.parseConfigFile(configPath)
                for(const vh of  config.VirtualHost){
                    vh.
                }
            }
        }
    }
}
