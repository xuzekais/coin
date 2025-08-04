//  原子css配置列表
import type { VitePluginConfig } from 'unocss/vite';

/**
 * 用法
 * 从1到7     1 是大标题  2 是正文  3 是辅助文案
 * .c-gray { color: #1E2536 };
 * .bg-gray1 { background-color:#1E2536 }
 * .b-gray1 { border-color:#1E2536 }
 */
const $colorGrayList = ['#1E2536', '#4B515E', '#A5A7AE', '#D2D3D6', '#E8E9EB'];

/**
 * 用法
 * 从1到7     1 是大标题  2 是正文  3 是辅助文案
 * .c-main { color: #1E2536 };
 * .bg-main1 { background-color:#1E2536 }
 * .b-main1 { border-color:#1E2536 }
 */
const $colorMainList = ['#C79156', '#E8D3BB', '#DDBD99', '#D2A777', '#C79156', '#9F7444', '#775733'];

const themeColor: Record<string, string> = {
    transparent: 'transparent',
    red: '#EA6766',
    green: '#4EBB72',
    white: 'white',
    black: 'black',
    mask: '#1E2536B5',
    block1: '#F8F8F8',
    block2: '#F4F5F5',
};
$colorGrayList.map((v, i) => {
    themeColor[`gray${i}`] = v;
});
$colorMainList.map((v, i) => {
    themeColor[`main${i}`] = v;
});

export default {

    /**
     * https://unocss.dev/interactive/?s=m-200px
     * 默认规则查询地址：
     */
    rules: [
        /**
         * width height
         * Such As:
         *   w-100   =>  width: 100px;
         *   h-200%  =>  height: 200%;
         *   min-w-100   =>  min-width: 100px;
         *   max-h-100%  =>  max-height: 100%;
         */
        [/^(min-|max-)(h|w)-(.*)$/, ([, $1, $2, $3]) => {
            const wh = { w: 'width', h: 'height' }[$2];
            return { [$1 + wh]: `${$3}` };
        }],

        /**
         * width height calc
         * Such As:  []中不能存在空格
         *   w-calc[100vh-30px]      =>   width: calc(100vh - 30px);
         *   h-calc[100%-50px]       =>   height: calc(100% - 50px);
         *   min-w-calc[100%-20px]   =>   min-width: calc(100% - 20px);
         */
        [/^(min-|max-)(h|w)-calc\[(.*)\]$/, ([, $1, $2, $3]) => {
            const wh = { w: 'width', h: 'height' }[$2];
            return {
                [$1 + wh]: `calc(${$3.replace(/([*-]|[+/])/, ' $1 ')})`
            }
        }],

        /**
         * margin
         * Such As:
         *   m-20    =>  margin: 20px;
         *   mt-20   =>  margin-top: 20px;
         */
        [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
        [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` })],
        [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` })],
        [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` })],
        [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` })],

        /**
         * padding
         * Such As:
         *   p-10   => 
         */
        [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })],
        [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` })],
        [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` })],
        [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` })],
        [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` })],

        /**
         * border
         * Such As:
         *   b-20   =>  border-width: 20px;
         *   bt-20  =>  border-top-width: 20px;
         */
        [/^b-(\d+)$/, ([, d]) => ({ 'border-width': `${d}px` })],
        [/^bt-(\d+)$/, ([, d]) => ({ 'border-top-width': `${d}px` })],
        [/^bb-(\d+)$/, ([, d]) => ({ 'border-bottom-width': `${d}px` })],
        [/^bl-(\d+)$/, ([, d]) => ({ 'border-left-width': `${d}px` })],
        [/^brw-(\d+)$/, ([, d]) => ({ 'border-right-width': `${d}px` })],

        /**
         * flex
         * Such As:
         *   flex-1  =>  flex: 1;
         */
        [/^flex-(\d+)$/, ([, d]) => ({ 'flex': d })],

        /**
         * border-style
         * Such As:
         *   b-dashed   =>  border: dashed;
         *   bt-solid   =>  border-top-style: solid;
         */
        [/^b-([dotted|solid|double|dashed]+)$/, ([, mode]) => ({ border: `${mode}` })],
        [/^bt-([dotted|solid|double|dashed]+)$/, ([, mode]) => ({ 'border-top-style': `${mode}` })],
        [/^bb-([dotted|solid|double|dashed]+)$/, ([, mode]) => ({ 'border-bottom-style': `${mode}` })],
        [/^bl-([dotted|solid|double|dashed]+)$/, ([, mode]) => ({ 'border-left-style': `${mode}` })],
        [/^br-([dotted|solid|double|dashed]+)$/, ([, mode]) => ({ 'border-right-style': `${mode}` })],

        /**
         * border-radius
         * Such As:
         *   br-20  =>  border-radius: 20px;
         */
        [/^br-(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],

        /**
         * cursor
         * Such As:
         *   cursor-pointer  =>  cursor: pointer;
         */
        [/^cursor-([auto|default|pointer|wait|text|move|help|not\-allowed]+)$/, ([, mode]) => ({ cursor: `${mode}` })],
        
        /**
         * font
         * Such As:
         *   fw-normal: font-weight: normal;
         */
        [/^fw-([normal|medium|bold]+)$/, ([, mode]) => ({ 'font-weight': `${mode}` })],

        /**
         * font-size
         * Such As:
         *   fs-24  =>  font-size: 24px;
         */
        [/^fs-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],

        /**
         * 单行字截断
         */
        [
            'tf',
            {
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                overflow: 'hidden',
            },
        ],
        
        /**
         * layout
         * 部分布局样式缩写
         */
        ['visible', { visibility: 'visible' }],
        ['invisible', { visibility: 'hidden' }],
        ['hidden', { display: 'none' }],
        ['inline-block', { display: 'inline-block' }],
        ['inline', { display: 'inline' }],
        ['inline-flex', { display: 'inline-flex' }],
        ['flex', { display: 'flex' }],
        ['flex-h', { display: 'flex', 'flex-direction': 'row' }],
        ['flex-v', { display: 'flex', 'flex-direction': 'column' }],
        ['align-items-center', { 'align-items': 'center' }],
        ['justify-content-center', { 'justify-content': 'center' }],
        ['space-between', { 'justify-content': 'space-between' }],
        ['box-border', { 'box-sizing': 'border-box' }],
        ['box-content', { 'box-sizing': 'content-box' }],
        [/^opacity-(\d+)$/, ([, d]: any) => ({ opacity: d / 100 })],
        ['static', { position: 'static' }],
        ['fixed', { position: 'fixed' }],
        ['absolute', { position: 'absolute' }],
        ['relative', { position: 'relative' }],
        ['sticky', { position: 'sticky' }],
        ['static', { position: 'static' }],
        ['w-full', { width: '100%' }],
        ['h-full', { height: '100%' }],

        /**
         * color
         * Such As:
         *   c-gray1  =>  color：灰色1
         *   c-main1  =>  color：主色调1
         *   c-red | c-green | c-white | c-black | c-transparent
         */
        [
            /^c-([gray\d|main\d|transparent|red|green|white|black]+)$/,
            ([, c], { theme }) => {
                if (theme[`${c}`]) {
                    return { color: theme[`${c}`] };
                }
            },
        ],
        
        /**
         * background-color
         * Such As:
         *   bg-gray1  =>  background-color：灰色1
         *   bg-main1  =>  background-color：主色调1
         *   bg-red | bg-green | bg-white | bg-black | bg-transparent
         */
        [
            /^bg-([gray\d|main\d|transparent|red|green|white|black]+)$/,
            ([, c], { theme }) => {
                if (theme[`${c}`]) {
                    return { 'background-color': theme[`${c}`] };
                }
            },
        ],

        /**
         * border-color
         * Such As:
         *   b-gray1  =>  border-color: 灰色1
         *   b-main1  =>  border-color: 主色调1
         *   b-red | b-green | b-white | b-black | b-transparent
         */
        [
            /^b-([gray\d|main\d|transparent|red|green|white|black]+)$/,
            ([, c], { theme }) => {
                if (theme[`${c}`]) {
                    return { 'border-color': theme[`${c}`] };
                }
            },
        ],


        /**
         * z-index
         * Such As:
         *   z-10   =>  z-index: 10;
         */
        [/^z-(\d+)$/, ([, d]: any) => ({ 'z-index': d })],
        

        /**
         * -top -bottom -left -right   
         * top bottom left right
         * Such As:
         *   -top-10     =>  top: -10px;
         *   -bottom-10  =>  bottom: -10px; 
         *   left-10     =>  left: 10px;
         */
        [
            /^(-?)(top|left|right|bottom)+-(\d+)$/,
            ([, syb, po, d]) => {
                return {
                    [po as 'top' | 'left' | 'right' | 'bottom']: `${syb || ''}${d}px`,
                };
            },
        ],


        /** 
         * overflow
         * Such As: 
         *   overflow-x-auto    =>  overflow-x: auto;
         *   overflow-y-scroll  =>  overflow-y: scroll;
         */
        [
            /^overflow(-[x|y])-([auto|hidden|scroll|visible]+)$/,
            ([, xy, mode]) => {
                return {
                    [('overflow' + xy) as '-x' | '-y' | '']: `${mode as 'auto' | 'hidden' | 'scroll' | 'visible'}`,
                };
            },
        ],
    ],
    theme: themeColor,
    shortcuts: {
        border: 'b-1 b-solid',
        'border-t': 'bt-1 bt-solid',
        'border-r': 'br-1 br-solid',
        'border-b': 'bb-1 bb-solid',
        'border-l': 'bl-1 bl-solid',
        'line-bottom': 'border-b',
        'vh-center': 'flex-v align-items-center justify-content-center'
    },
    //  选择器定义
    variants: [
        matcher => {
            /** hover:  */
            if (matcher.startsWith('hover:')) {
                return {
                    matcher: matcher.slice(6),
                    selector: s => `${s}:hover`,
                };
            /** active:  */
            } else if (matcher.startsWith('active:')) {
                return {
                    matcher: matcher.slice(7),
                    selector: s => `${s}:active`,
                };
            }
            return matcher;
        },
    ],
} as VitePluginConfig;
