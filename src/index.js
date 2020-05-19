import { XHeader } from 'vux';
import { parseButtonOptionsListFromVNodeList } from 'vnode-tls'


/**
 * 根据增强选项创建新的 Header 的组件选项
 * @param options : EnhanceOptions      必须；增强选项
 * @param name ?: string      可须；默认值："ByHeader"；新建 Header 组件的名字；
 * @returns ComponentOptions   返回新创建的增强后的 Header 组件选项
 */
export function createHeader(options,name = "ByHeader") {
  let NewHeader = Object.assign({},XHeader);
  NewHeader.name = name;
  return enhanceHeader(NewHeader,options);
}

/**
 * 根据增强选项扩展原来的 XHeader 组件选项
 * @param options : EnhanceOptions      必须；增强选项
 * @returns ComponentOptions   返回已扩展的 XHeader 组件选项
 */
export function expandXHeader(options) {
  return enhanceHeader(XHeader,options);
}



function enhanceHeader(Header, { updateNavBarOptions, hide = false }) {

  if (Header.__NavBarOptions__){
    return Header;
  }else {
    Header.__NavBarOptions__ = true;
  }

  var hideCB = typeof hide == "function" ? hide : function () { return hide };



  let agentMixin = {
    computed: {


      /**
       *
       * @return {{back: {hide: boolean, text: *}, preventBack: *, buttonOptionsList: *[]}}
       */
      navLeftOptions: function () {

        //props
        let { showBack, backText, preventGoBack } = this.leftOptions || {};
        let onClickBack = this.$listeners["on-click-back"];

        let backShow = showBack === false ? false : true;
        let back = {
          hide: !backShow,
          text: backText,
          click: onClickBack
        };

        // slot: overwrite-left
        let overwriteLeftVNodes = this.$slots.overwriteLeft;
        let owLeftSlotBtnOptionsList = null;
        if (overwriteLeftVNodes) {
          back.hide = true;
          owLeftSlotBtnOptionsList = parseButtonOptionsListFromVNodeList(overwriteLeftVNodes);
        }


        //slot: overwrite-left
        let leftVNodes = this.$slots.left;
        let leftSlotBtnOptionsList = null;
        if (leftVNodes) {
          leftSlotBtnOptionsList = parseButtonOptionsListFromVNodeList(leftVNodes);
        }


        let leftBtnOptionsList = null;

        if (owLeftSlotBtnOptionsList || leftSlotBtnOptionsList) {
          leftBtnOptionsList = [...owLeftSlotBtnOptionsList, ...leftSlotBtnOptionsList];
        }


        let leftOptions = {
          back: back,
          preventBack: preventGoBack,
          buttonOptionsList: leftBtnOptionsList
        };


        return leftOptions;

      },


      /**
       *
       * @return {{title: {hide: boolean, text: *, click: *}, buttonOptionsList: *}}
       */
      navTitleOptions: function () {
        let title = this.title;
        let onClickTitle = this.$listeners["on-click-title"];

        let titleBtnOptions = {
          hide: false,
          text: title,
          click: onClickTitle
        };

        let slotList = this.$slots;
        let titleVNodes = slotList.overwriteTitle || slotList.default;
        let titleSlotBtnOptionsList = null;
        if (titleVNodes) {
          titleBtnOptions.hide = true;
          titleSlotBtnOptionsList = parseButtonOptionsListFromVNodeList(titleVNodes);
        }


        let titleOptions = {
          title: titleBtnOptions,
          buttonOptionsList: titleSlotBtnOptionsList
        };


        return titleOptions;


      },


      /**
       *
       * @return {{more: {hide: boolean, click: *}, buttonOptionsList: *}}
       */
      navRightOptions: function () {
        let showMore = this.rightOptions && this.rightOptions.showMore;

        let onClickMore = this.$listeners["on-click-more"];

        let moreBtnOptions = {
          hide: !showMore,
          click: onClickMore
        };

        let rightVNodes = this.$slots.right;
        let rightSlotBtnOptionsList = null;
        if (rightVNodes) {
          rightSlotBtnOptionsList = parseButtonOptionsListFromVNodeList(rightVNodes);
        }


        let rightOptions = {
          more: moreBtnOptions,
          buttonOptionsList: rightSlotBtnOptionsList
        };


        return rightOptions;
      },


      navBarOptions: function () {
        let leftOptions = this.navLeftOptions;
        let titleOptions = this.navTitleOptions;
        let rightOptions = this.navRightOptions;

        let navBarOptions = {
          left: leftOptions,
          title: titleOptions,
          right: rightOptions
        };

        return navBarOptions;
      }


    },


    watch: {
      navBarOptions: function (newVal, oldVal) {
        this.updateNavBarOptions(newVal);
      }
    },

    mounted: function () {
      this.updateNavBarOptions(this.navBarOptions);
    },

    activated: function () {
      this.updateNavBarOptions(this.navBarOptions);
    },

    methods: {
      updateNavBarOptions: function (newNavBarOptions) {
        updateNavBarOptions.call(this, newNavBarOptions, this);
      }

    },


    created: function () {
      this.updateNavBarHandle = () => {
        this.$forceUpdate();
        this.updateNavBarOptions(this.navBarOptions);
      };
      window.addEventListener("updateNavBar", this.updateNavBarHandle);
    },
    beforeDestroy: function () {
      window.removeEventListener("updateNavBar", this.updateNavBarHandle);
    }


  };


  let headerMixins = Header.mixins || [];

  headerMixins = headerMixins.concat(agentMixin);

  Header.mixins = headerMixins;


  let oriRender = Header.render;
  Header.render = function (h) {
    return hideCB(this) ? null : oriRender.call(this, h);
  }

  return Header;

}


