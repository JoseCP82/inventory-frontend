import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {

  displayedColumns: String[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();
  isAdmin: any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _categoryService: CategoryService, 
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private _util: UtilService) {}

  ngOnInit(): void {
    this.getCategories();
    this.isAdmin = this._util.isAdmin();
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
      this.dataSource.paginator = this.paginator;
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

  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: {id: id, name: name, description: description}
    });

    dialogRef.afterClosed().subscribe( (result: any) => {
      if(result === 1) {
        this.openSnackBar("Categoría actualizada", "Exitosa");
        this.getCategories();
      } else if(result === 2) {
        this.openSnackBar("Se produjo un error al actualizar", "Error");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {id: id, module: "category"}
    });

    dialogRef.afterClosed().subscribe( (result: any) => {
      if(result === 1) {
        this.openSnackBar("Categoría eliminada", "Exitosa");
        this.getCategories();
      } else if(result === 2) {
        this.openSnackBar("Se produjo un error al eliminar", "Error");
      }
    });  
  }

  search(data: string) {
    if(this.search.length === 0) {
      return this.getCategories();
    }

    this._categoryService.getCategoryById(data).subscribe( (resp: any) => {
      this.processCategoriesResponse(resp);
    });
  }
}

export interface CategoryElement {
  description: string,
  id: number,
  name: string
}