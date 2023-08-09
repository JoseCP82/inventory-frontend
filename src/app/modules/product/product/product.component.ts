import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { UtilService } from '../../shared/services/util.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  isAdmin: any;

  constructor(private _productService: ProductService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private _util: UtilService) {}

  ngOnInit(): void {
    this.getProducts();
    this.isAdmin = this._util.isAdmin();
  }

  displayedColumns: String[] = ['id', 'name', 'price', 'account', 'category', 'picture', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getProducts() {
    this._productService.getProducts()
      .subscribe( (data: any) => {
        this.processProductResponse(data);
    }, (error: any) => {
      console.log("Error en productos");
    });
  }

  processProductResponse(resp: any) {
    const dataProduct: ProductElement[] = [];
    if(resp.metadata[0].code === "00") {
      let listProduct = resp.productResponse.products;
      listProduct.forEach( (element: ProductElement) => {
        //element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64,'+element.picture;
        dataProduct.push(element);
      });
      this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe( (result: any) => {
      if(result === 1) {
        this.openSnackBar("Producto agregado", "Exitosa");
        this.getProducts();
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

  getCategories() {
    throw new Error('Method not implemented.');
  }

  edit(id: number, name: string, price: number, account: number, category: any) {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
      data: {id: id, name: name, price: price, account: account, category: category}
    });

    dialogRef.afterClosed().subscribe( (result: any) => {
      if(result === 1) {
        this.openSnackBar("Producto editado", "Exitosa");
        this.getProducts();
      } else if(result === 2) {
        this.openSnackBar("Se produjo un error al editar", "Error");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: {id: id, module: "product"}
    });

    dialogRef.afterClosed().subscribe( (result: any) => {
      if(result === 1) {
        this.openSnackBar("Producto eliminado", "Exitosa");
        this.getProducts();
      } else if(result === 2) {
        this.openSnackBar("Se produjo un error al eliminar", "Error");
      }
    });
  }

  search(name: any) {
    if(name.length === 0) {
      return this.getProducts();
    } else {
      this._productService.getProductsByName(name)
      .subscribe( (resp: any) => {
        this.processProductResponse(resp);
      });
    }
  }

  exportExcel() {
    this._productService.exportProducts()
    .subscribe( (data: any) => {
      let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let fileUrl = URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = "products.xlsx";
      anchor.href = fileUrl;
      anchor.click();

      this.openSnackBar("Archivo exportado correctamente", "Exitosa");
    }, (error: any) => {
      this.openSnackBar("No se pudo exportar el archivo", "Error");
    });
  }
}

export interface ProductElement {
  id: number,
  name: string,
  price: number,
  account: number,
  category: any,
  picture: any
}
