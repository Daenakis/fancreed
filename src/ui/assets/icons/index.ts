import Academia from './Academia';
import Apple from './Apple';
import ArrowDown from './ArrowDown';
import ArrowLeft from './ArrowLeft';
import ArrowRight from './ArrowRight';
import ArrowUp from './ArrowUp';
import Ball from './Ball';
import Bell from './Bell';
import Bus from './Bus';
import Calendar from './Calendar';
import CalendarCheck from './CalendarCheck';
import CalendarFill from './CalendarFill';
import ChangeImage from './ChangeImage';
import Check from './Check';
import Close from './Close';
import Collapse from './Collapse';
import Cup from './Cup';
import Edit from './Edit';
import Expand from './Expand';
import EyeClose from './EyeClose';
import EyeOpen from './EyeOpen';
import Facebook from './Facebook';
import Filters from './Filters';
import Google from './Google';
import Home from './Home';
import HomeFill from './HomeFill';
import IdCard from './IdCard';
import Info from './Info';
import Instagram from './Instagram';
import Language from './Language';
import Lion from './Lion';
import List from './List';
import Location from './Location';
import Logout from './Logout';
import Menu from './Menu';
import News from './News';
import NothingFound from './NothingFound';
import Notification from './Notification';
import Party from './Party';
import Play from './Play';
import Plus from './Plus';
import Search from './Search';
import Settings from './Settings';
import Shop from './Shop';
import ShopFill from './ShopFill';
import Sort from './Sort';
import StarEmpty from './StarEmpty';
import StarFilled from './StarFilled';
import Support from './Support';
import Table from './Table';
import Team from './Team';
import Telegram from './Telegram';
import Tiktok from './Tiktok';
import TShirt from './TShirt';
import Upload from './Upload';
import User from './User';
import UserMinus from './UserMinus';
import UserPlus from './UserPlus';
import Verification from './Verification';
import Video from './Video';
import Volleyball from './Volleyball';
import Website from './Website';
import Woman from './Woman';
import XTwitter from './XTwitter';

export const ICONS = {
  academia: Academia,
  apple: Apple,
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  ball: Ball,
  bell: Bell,
  bus: Bus,
  calendar: Calendar,
  calendarCheck: CalendarCheck,
  calendarFill: CalendarFill,
  changeImage: ChangeImage,
  check: Check,
  close: Close,
  collapse: Collapse,
  cup: Cup,
  edit: Edit,
  expand: Expand,
  eyeClose: EyeClose,
  eyeOpen: EyeOpen,
  facebook: Facebook,
  filters: Filters,
  google: Google,
  home: Home,
  homeFill: HomeFill,
  idCard: IdCard,
  info: Info,
  instagram: Instagram,
  language: Language,
  lion: Lion,
  list: List,
  location: Location,
  logout: Logout,
  menu: Menu,
  news: News,
  nothingFound: NothingFound,
  notification: Notification,
  party: Party,
  play: Play,
  plus: Plus,
  search: Search,
  settings: Settings,
  shop: Shop,
  shopFill: ShopFill,
  sort: Sort,
  starEmpty: StarEmpty,
  starFilled: StarFilled,
  support: Support,
  tShirt: TShirt,
  team: Team,
  telegram: Telegram,
  tiktok: Tiktok,
  upload: Upload,
  user: User,
  userMinus: UserMinus,
  userPlus: UserPlus,
  verification: Verification,
  video: Video,
  website: Website,
  woman: Woman,
  xTwitter: XTwitter,
  table: Table,
  volleyball: Volleyball,
} as const;

export type IconName = keyof typeof ICONS;
