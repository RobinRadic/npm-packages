import { KnownBlock } from '@slack/types';

export const blocks: Record<string, KnownBlock> = {
    a: {
        'type'    : 'context',
        'elements': [
            {
                'type': 'mrkdwn',
                'text': '_mylink/zwolle_',
            },
        ],
    },
    b: {
        'type'    : 'actions',
        'elements': [
            {
                'type'          : 'static_select',
                'placeholder'   : {
                    'type': 'plain_text',
                    'text': 'Target',
                },
                'action_id'     : 'target',
                'initial_option': {
                    'text'       : {
                        'type': 'plain_text',
                        'text': 'Staging',
                    },
                    'value'      : 'staging',
                    'description': {
                        'type': 'plain_text',
                        'text': 'zwolle.wmomotest.nl',
                    },
                },
                'options'       : [
                    {
                        'text'       : {
                            'type': 'plain_text',
                            'text': 'Staging',
                        },
                        'value'      : 'staging',
                        'description': {
                            'type': 'plain_text',
                            'text': 'zwolle.wmomotest.nl',
                        },
                    },
                    {
                        'text'       : {
                            'type': 'plain_text',
                            'text': 'Live',
                        },
                        'value'      : 'live',
                        'description': {
                            'type': 'plain_text',
                            'text': 'crvs-zwd.nl',
                        },
                    },
                ],
            },
            {
                'type': 'button',
                'text': {
                    'type': 'plain_text',
                    'text': 'Deploy',
                },
            },
            {
                'type': 'button',
                'text': {
                    'type': 'plain_text',
                    'text': 'Rollback',
                },
            },
        ],
    },
    c: {
        'type': 'divider',
    },
    d: {
        'type'    : 'context',
        'elements': [
            {
                'type': 'mrkdwn',
                'text': '_mylink/crvs_',
            },
        ],
    },
    e: {
        'type'    : 'actions',
        'elements': [
            {
                'type'          : 'static_select',
                'placeholder'   : {
                    'type': 'plain_text',
                    'text': 'Target',
                },
                'action_id'     : 'target',
                'initial_option': {
                    'text' : {
                        'type': 'plain_text',
                        'text': 'Staging',
                    },
                    'value': 'staging',
                },
                'options'       : [
                    {
                        'text' : {
                            'type': 'plain_text',
                            'text': 'Staging',
                        },
                        'value': 'staging',
                    },
                    {
                        'text' : {
                            'type' : 'plain_text',
                            'text' : 'Live',
                            'emoji': true,
                        },
                        'value': 'live',
                    },
                ],
            },
            {
                'type': 'button',
                'text': {
                    'type': 'plain_text',
                    'text': 'Deploy',
                },
            },
            {
                'type': 'button',
                'text': {
                    'type': 'plain_text',
                    'text': 'Rollback',
                },
            },
        ],
    },
    f: {
        'type': 'divider',
    },
    g: {
        'type': 'section',
        'text': {
            'type' : 'plain_text',
            'text' : 'This is a plain text section block.',
            'emoji': true,
        },
    },
    h: {
        'type'     : 'section',
        'text'     : {
            'type': 'mrkdwn',
            'text': 'Selecteer repository om te deployen',
        },
        'accessory': {
            'type'       : 'static_select',
            'placeholder': {
                'type' : 'plain_text',
                'text' : 'Select an item',
                'emoji': true,
            },
            'options'    : [
                {
                    'text' : {
                        'type' : 'plain_text',
                        'text' : 'Zwolle',
                        'emoji': true,
                    },
                    'value': 'value-0',
                },
                {
                    'text' : {
                        'type' : 'plain_text',
                        'text' : 'Markant',
                        'emoji': true,
                    },
                    'value': 'value-1',
                },
                {
                    'text' : {
                        'type' : 'plain_text',
                        'text' : 'Sustvarius',
                        'emoji': true,
                    },
                    'value': 'value-2',
                },
            ],
        },
    },
};
