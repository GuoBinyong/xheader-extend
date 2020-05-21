import Vue,{ComponentOptions} from "vue"


/**
 * 按钮选项
 */
export interface ButtonOptions {
    text: string;       //按钮的文本
    hide?:boolean;      //是否隐藏
    click?: Function;    //按钮的点击事件回调函数；
}


/**
 * 导航条的组成部件的基本选项
 * 导航条一般由左、中、右 三部分组成；
 */
export interface NavPart {
    buttonOptionsList?: ButtonOptions[]|null;      //按钮的选项数组
}


/**
 * 导航条的左部分选项
 */
export interface NavLeftOptions extends NavPart {
    back: ButtonOptions;
    preventBack ?: boolean;    //是否阻止返回
}


/**
 * 导航条的标题部分(也就是中间部分)选项
 */
export interface NavTitleOptions extends NavPart {
    title: ButtonOptions;
}


/**
 * 导航条的右部分选项
 */
export interface NavRightOptions extends NavPart {
    more: ButtonOptions;
}


/**
 * 导航条的选项
 */
export interface NavBarOptions {
    left: NavLeftOptions;   //导航条的左部分选项
    title: NavTitleOptions;  //导航条的标题部分(也就是中间部分)选项
    right: NavRightOptions;  //导航条的右部分选项
}



/**
 * 更改导航条选项的回调函数；
 */
export type UpdateNavBarOptions = (this:Vue,navBarOptions:NavBarOptions,headerInst:Vue)=>void;

export type HideGet = (headerInst:Vue)=>boolean; 
export type Hide = boolean | HideGet;


/**
 * Header 的增强配置选项
 */
export interface EnhanceOptions {
    updateNavBarOptions:UpdateNavBarOptions;   //更改导航条选项的回调函数；会在 Header 有变化时自动调用，使用者可在该回调函数中获取导航条的配置选项
    hide?: Hide;  //可选；是否隐藏 Header
}


/**
 * 根据增强选项创建新的 Header 的组件选项，该 Header 组件支持转发 Header（导航条） 的配置，以便其它种类的导航条也能够统一应用配置
 * @param options : EnhanceOptions      必须；增强选项
 * @param name ?: string      可须；默认值："ByHeader"；新建 Header 组件的名字；
 * @returns ComponentOptions   返回新创建的增强后的 Header 组件选项
 */
export function createHeader(options:EnhanceOptions,name?:string):ComponentOptions;


/**
 * 根据增强选项扩展原来的 XHeader 组件选项，使其支持转发 Header（导航条） 的配置，以便其它种类的导航条也能够统一应用配置
 * @param options : EnhanceOptions      必须；增强选项
 * @returns ComponentOptions   返回已扩展的 XHeader 组件选项
 */
export function expandXHeader(options:EnhanceOptions):ComponentOptions;



/**
 * 根据增加配置选项来增强指定的 Header，使其支持转发 Header（导航条） 的配置，以便其它种类的导航条也能够统一应用配置
 * @param Header : ComponentOptions    必须；被增强的 Header 的组件选项；
 * @param options : EnhanceOptions    必须；增强选项
 */
function enhanceHeader(Header:ComponentOptions, options:EnhanceOptions):ComponentOptions;






