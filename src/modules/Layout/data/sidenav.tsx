import {
  GearIcon,
  GroupIcon,
  HomeIcon,
  PersonIcon,
  TimerIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

const sidenavItems = [
  {
    title: "Home",
    icon: HomeIcon,
    variant: "default",
    key: "home",
  },
  {
    title: "Profile",
    icon: PersonIcon,
    variant: "default",
    key: "profile",
  },
  //   {
  //     title: "Favorites",
  //     icon: "<FavoritesIcon />",
  //     variant: "default",
  //   },
  // {
  //   title: "Recents",
  //   icon: TimerIcon,
  //   variant: "default",
  //   key: "recents",
  // },
  // {
  //   title: "Shared",
  //   icon: GroupIcon,
  //   variant: "default",
  //   key: "shared",
  // },
  //   {
  //     title: "Workspaces",
  //     icon: "<WorkspacesIcon />",
  //     variant: "default",
  //   },
  //   {
  //     title: "Messages",
  //     icon: "<MessagesIcon />",
  //     variant: "default",
  //   },
  {
    title: "Settings",
    icon: GearIcon,
    variant: "default",
    key: "settings",
  },
  // {
  //   title: "Trash",
  //   icon: TrashIcon,
  //   variant: "default",
  //   key: "trash",
  // },
  //   {
  //     title: "Cloud",
  //     icon: "<CloudIcon />",
  //     variant: "default",
  //   },
];

export default sidenavItems;
