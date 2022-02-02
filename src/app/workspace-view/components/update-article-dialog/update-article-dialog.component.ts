import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ArticleAccessRule} from "../../../shared/enums/article-access-rule";

export interface UpdateArticleDialogData {
  name : string;
  slug: string;
  accessRule : ArticleAccessRule;
}

@Component({
  selector: 'app-update-article-dialog',
  templateUrl: './update-article-dialog.component.html',
  styleUrls: ['./update-article-dialog.component.css']
})
export class UpdateArticleDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UpdateArticleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UpdateArticleDialogData,) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
