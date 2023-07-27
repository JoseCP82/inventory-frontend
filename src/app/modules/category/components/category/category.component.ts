import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {

  displayedColumns: String[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  constructor(private _categoryService: CategoryService, 
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this._categoryService.getCategories()
      .subscribe( (data:any) => {
        console.log("Respuesta categorias: ", data)
        this.processCategoriesResponse(data);
      }, (error: any) => {
        console.log("Error", error);
      });
  }

  processCategoriesResponse(response: any) {
    const dataCategory: CategoryElement[] = [];
    
    if(response.metadata[0].code === "00") {
      let listCategory = response.categoryResponse.categories;
      listCategory.forEach( (element:CategoryElement) => {
        dataCategory.push(element);
      });
      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe( (result: any) => {
      if(result === 1) {
        this.openSnackBar("Categoría agregada", "Exitosa");
        this.getCategories();
      } else if(result === 2) {
        this.openSnackBar("Se produjo un error al guardar", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}

export interface CategoryElement {
  description: string,
  id: number,
  name: string
}