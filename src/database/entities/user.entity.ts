import { Column, Entity, OneToMany } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { FollowEntity } from './follow.entity';
import { LikeEntity } from './like.entity';
import { BaseModel } from './models/base.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: TableNameEnum.USERS })
export class UserEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text', { nullable: true })
  bio?: string;

  @Column('text', { nullable: true })
  image?: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[]; //Зв'язок з сутністю RefreshTokenEntity, де user є властивістю, що посилається на користувача.

  @OneToMany(() => ArticleEntity, (entity) => entity.user)
  articles?: ArticleEntity[]; //Зв'язок з сутністю ArticleEntity, де user є властивістю, що посилається на користувача.

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[]; //Зв'язок з сутністю LikeEntity, де user є властивістю, що посилається на користувача.

  @OneToMany(() => FollowEntity, (entity) => entity.follower)
  followers?: FollowEntity[]; //Зв'язок з сутністю FollowEntity, де follower є властивістю, що посилається на користувача як на підписника.

  @OneToMany(() => FollowEntity, (entity) => entity.following)
  followings?: FollowEntity[]; //Зв'язок з сутністю FollowEntity, де following є властивістю, що посилається на користувача як на того, на кого підписуються.

  @OneToMany(() => CommentEntity, (entity) => entity.article)
  comments?: CommentEntity[];
}
