import apacheconf from 'apacheconf';

apacheconf('',{}, (error, config) => {
    config.VirtualHost.forEach(vh => {
        vh.Location.forEach(dir => {
        })
        vh.ServerName.forEach(d => {

        })
    })
})
