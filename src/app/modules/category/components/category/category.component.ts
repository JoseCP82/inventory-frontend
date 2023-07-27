import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {

  displayedColumns: String[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  constructor(private _categoryService: CategoryService) {}

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
}

export interface CategoryElement {
  description: string,
  id: number,
  name: string
}