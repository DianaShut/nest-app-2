import * as dotenv from 'dotenv';

import configuration from './configs';
import { Config } from './configs.type';

//Цей код завантажує конфігурацію додатку з файлів environment, а також створює і експортує статичний конфігураційний сервіс.
//Оголошує клас ConfigStatic з публічним методом get, який викликає функцію configuration для отримання конфігурації і повертає її.
class ConfigStatic {
  public get(): Config {
    return configuration();
  }
}

//Отримує значення змінної оточення APP_ENVIRONMENT або використовує значення 'local', якщо змінна не визначена. Це визначає, який файл environment буде завантажено.
const environment = process.env.APP_ENVIRONMENT || 'local';
dotenv.config({ path: `environments/${environment}.env` });
//Використовує dotenv.config для завантаження змінних оточення з файлу, який визначається значенням змінної environment. Наприклад, якщо environment дорівнює 'production', буде завантажено файл environments/production.env.

const ConfigStaticService = new ConfigStatic();
export { ConfigStaticService };
