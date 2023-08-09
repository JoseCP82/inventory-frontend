import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductElement } from 'src/app/modules/product/product/product.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  
  chartBar: any;

  constructor(private _productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this._productService.getProducts()
      .subscribe( (data: any) => {
        this.processProductResponse(data);
    }, (error: any) => {
      console.log("Error en productos");
    });
  }

  processProductResponse(resp: any) {
    const nameProduct: string[] = [];
    const account: number[] = [];
    if(resp.metadata[0].code === "00") {
      let listProduct = resp.productResponse.products;
      listProduct.forEach( (element: ProductElement) => {
        nameProduct.push(element.name);
        account.push(element.account);
      });

      this.chartBar = new Chart('canvas-bar', {
        type: 'bar',
        data: {
          labels: nameProduct,
          datasets: [
            {label: 'Productos', data: account}
          ]
        }
      });
    }
  }
}
