import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {ApplicationStackParamList} from '../../@types/navigation';

export const navigationRef =
  createNavigationContainerRef<ApplicationStackParamList>();

export function navigate(name: keyof ApplicationStackParamList, params: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function navigateAndReset(routes = [], index = 0) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
}

export function navigateAndSimpleReset(name: string, index = 0) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{name}],
      }),
    );
  }
}
