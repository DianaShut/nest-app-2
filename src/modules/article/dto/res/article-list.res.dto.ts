import { ArticleResDto } from './article.res.dto';

export class ArticleListResDto {
  data: ArticleResDto[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
