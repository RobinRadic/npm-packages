const sass = require('node-sass');


const ctxStacks = {};

module.exports = {
    'mul-arg($value)': function (value) {
        let values = value.getValue().toString().split(' ');
        // console.dir({values, value});
        let res = {
            sign : sass.types.Null(),
            mixin: sass.types.Null(),
            name : sass.types.Null(),
            // name : sass.types.Null(),
        };

        const segments = values.map(value => {
            // console.dir({value});
            let isMixin = ['b', 'e', 'm', 'is', 'has'].includes(value);
            let isSelector = value.startsWith('.');
            let isSign = ['>', '+', '~', '&'].includes(value);
            let type = isMixin ? 'mixin' : isSelector ? 'selector' : isSign ? 'sign' : 'name';
            return {value, type}
        });
        // console.dir({segments});

        for(const segment of segments){
            if(segment.type){
                res[segment.type] = new sass.types.String(segment.value)
            }
        }

        let map = new sass.types.List(3);

        map.setValue(0, res.sign);
        map.setValue(1, res.mixin);
        map.setValue(2, res.name);
        return map;
    },
    'sm-b($name)': function(name){

    }
};
