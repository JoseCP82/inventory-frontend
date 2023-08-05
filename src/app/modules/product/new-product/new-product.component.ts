import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { CategoryElement } from '../../category/components/category/category.component';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})

export class NewProductComponent implements OnInit {

  public productForm: FormGroup;
  estadoFormulario: string = "";
  categories: CategoryElement[] = [];
  selectedFile: any;
  imageName: string = "";

  constructor(private fb: FormBuilder, 
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private dialogRef: MatDialogRef<NewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    this.estadoFormulario = "Agregar";
    this.productForm = this.fb.group( {
      name: ['', Validators.required],
      price: ['', Validators.required],
      account: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  onSave() {
    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      account: this.productForm.get('account')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectedFile
    }

    const uploadImageData = new FormData();
    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('account', data.account);
    uploadImageData.append('categoryId', data.category);

    this._productService.saveProducts(uploadImageData)
      .subscribe( (data: any) => {
        this.dialogRef.close(1);  
      }, (error: any) => {
        this.dialogRef.close(3);
    });
  }

  onCancel() {
    this.dialogRef.close(3);
  }

  getCategories() {
    this._categoryService.getCategories()
      .subscribe( (data:any) => {
        this.categories = data.categoryResponse.categories;
      }, (error:any) => {
        console.log("Error en categorías");
    });
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.imageName = event.target.files[0].name;
  }
}
