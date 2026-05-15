export type DropdownAction = 'logout';

export type LinkOption =
    | {
          id: string;
          title: string;
          type: 'link';
          href: string;
      }
    | {
          id: string;
          title: string;
          type: 'action';
          action: DropdownAction;
      };
