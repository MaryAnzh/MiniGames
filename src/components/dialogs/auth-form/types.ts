import type { AuthTabType, ComponentProps, GoogleIconsType, InputType } from '@types';

export type FieldType = {
  label: string;
  placeholder: string;
  leftIcon: GoogleIconsType;
  rightIcon?: GoogleIconsType;
  type?: InputType;
  id: string;
  name: string;
};

export type AuthPopupProps = Pick<ComponentProps, 'parentNode'> & {
  tab: AuthTabType;
  onOpenAuthDialog?: (tab: AuthTabType) => void;
  onClose: () => void;
};
