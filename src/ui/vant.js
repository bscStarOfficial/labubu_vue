import {
  Overlay,
  Button,
  Loading,
  Toast,
  Icon,
  Tab,
  Tabs,
  Dialog,
  Popup,
  Field,
  CellGroup,
  DropdownMenu,
  DropdownItem,
  Search,
  CountDown,
  Picker,
  Cell,
  Popover,
  List,
  RadioGroup,
  Radio,
} from "vant";
// 2. 引入组件样式
import 'vant/lib/index.css';
// import { Icon } from "vant";
const vant = {
  install: function (Vue) {
    Vue.use(Overlay);
    Vue.use(Button);
    Vue.use(Loading);
    Vue.use(Toast);
    Vue.use(Icon);
    Vue.use(Tab);
    Vue.use(Tabs);
    Vue.use(Dialog);
    Vue.use(Popup);
    Vue.use(Field);
    Vue.use(CellGroup);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Search);
    Vue.use(CountDown);
    Vue.use(Picker);
    Vue.use(Cell);
    Vue.use(Popover);
    Vue.use(List);
    Vue.use(Radio);
    Vue.use(RadioGroup);
  },
};

export default vant;
