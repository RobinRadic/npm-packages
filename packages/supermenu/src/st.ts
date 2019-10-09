import { style } from 'typestyle';
import { NestedCSSProperties, NestedCSSSelectors } from 'typestyle/lib/types';
import { flex, vertical, selfStretch } from 'csstips';

style;


export const theme = {
    itemPaddingY: 25,
};

export const mixins: Record<string, (...args) => NestedCSSProperties> = {
    menu: () => ({}),
};

export const partials: Record<string, NestedCSSProperties> = {
    get menu(): NestedCSSProperties {
        return {};
    },
};

export namespace menu {
    export const menu = style({
        margin   : 0,
        padding  : 0,
        listStyle: 'none',
    });

    export const item         = style({
        ...flex,
        ...vertical,
        position: 'relative',
        // display      : 'flex',
        float   : 'none',
        // flexDirection: 'column',
        flexGrow: 1,
        margin  : 0,
        padding : 0,
        $nest   : {},
    });
    export const content      = style({
        ...flex,
        ...selfStretch,

        position: 'relative',
        float   : 'none',

        flexGrow      : 1,
        outline       : 0,
        padding       : [ theme.itemPaddingY, 20, theme.itemPaddingY, 5 ],
        textDecoration: 'none',
        borderLeft    : [ '1px', 'solid' ],
        $nest         : {
            [ '&:hover' ]: {},
        },
    });
    export const arrow        = style({});
    export const submenu      = style({});
    export const item_is_open = style({
        $nest: {
            [ `> .${content} > ${arrow} > i` ]: {
                transform: `rotate(90deg)`,
            },
        },
    });

}
console.dir({ theme, mixins, partials, menu });
