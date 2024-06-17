import { randomUUID } from 'node:crypto';
import * as path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { AWSConfig, Config } from '../../../configs/configs.type';
import { LoggerService } from '../../logger/logger.service';
import { ContentType } from '../models/enums/content-type.enum';

@Injectable()
export class FileStorageService {
  private awsConfig: AWSConfig;
  private client: S3Client; //Клієнт S3 для взаємодії з AWS S3.

  //Конструктор: Ініціалізує конфігурацію та створює клієнт S3 з відповідними параметрами.
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.awsConfig = this.configService.get<AWSConfig>('aws');
    const params: S3ClientConfig = {
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
      },
    };
    //Перевірка наявності значення endpoint в конфігурації AWS:
    if (this.awsConfig.endpoint) {
      params.forcePathStyle = true; //Це змушує клієнт S3 використовувати стилі шляху (path-style) замість стилю хоста (host-style) при формуванні URL для запитів.
      //У стилі шляху, ім'я бакету додається до шляху URL, наприклад, http://s3.amazonaws.com/mybucket/myobject.
      //У стилі хоста, ім'я бакету використовується як субдомен, наприклад, http://mybucket.s3.amazonaws.com/myobject
      params.endpoint = this.awsConfig.endpoint; //Призначає значення endpoint з конфігурації awsConfig до параметру params.endpoint.
      //endpoint визначає базовий URL для запитів до S3
    }

    this.client = new S3Client(params);
  }

  public async uploadFile(
    file: Express.Multer.File, //Файл, який завантажується.
    itemType: ContentType, //Тип контенту (наприклад, avatar, document).
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = this.buildPath(itemType, itemId, file.originalname); //Побудований шлях для збереження файлу.
      await this.client.send(
        //Команда для завантаження файлу в S3.
        new PutObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath, //Шлях до файлу в бакеті.
          Body: file.buffer, //Вміст файлу.
          ContentType: file.mimetype,
          ACL: 'public-read', //Права доступу до файлу
        }),
      );
      return filePath;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private buildPath(
    itemType: ContentType,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`; // use only  template string
  }
}
//randomUUID(): Генерує унікальний ідентифікатор для файлу.
// path.extname(fileName): Отримує розширення файлу.
