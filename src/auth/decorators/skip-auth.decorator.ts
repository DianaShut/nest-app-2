import { SetMetadata } from '@nestjs/common';

import { SKIP_AUTH } from '../constants/constants';

//Застосувавши декоратор @SkipAuth() на рівні контролера AuthController, всі маршрути, визначені в цьому контролері, будуть позначені як такі, що не потребують автентифікації.
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true); //передає true, щоб обійти необхідність авторизації
