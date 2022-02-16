import {User} from "../users/user";

export interface ArticleVersion {
  id : number;
  articleId : number;
  userId : number;
  user: User;
  creationDate : Date;
}
