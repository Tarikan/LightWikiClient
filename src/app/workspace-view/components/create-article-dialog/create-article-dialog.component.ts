import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ArticleAccessRule} from "../../../shared/enums/article-access-rule";

export interface CreateArticleDialogData {
  name : string;
  accessRule : ArticleAccessRule;
}

@Component({
  selector: 'app-create-article-dialog',
  templateUrl: './create-article-dialog.component.html',
  styleUrls: ['./create-article-dialog.component.css']
})
export class CreateArticleDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateArticleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CreateArticleDialogData,) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
