export interface AuthSliceProps {
  token: string | null;
  current_screen?: null | string;
  user_data: {[key: string]: number | string | boolean};
  isell_stack: null | boolean;
  guest: boolean;
  image_uploading?: any;
  isAppUpdate: boolean;
  mobileSettings: any;
  user_permissions: any;
}
