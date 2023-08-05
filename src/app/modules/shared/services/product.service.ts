import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  /**
   * Get all products
   * @returns
   */
  getProducts() {
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }

  /**
   * Save products
   * @param body
   * @returns 
   */
  saveProducts(body: any) {
    const endpoint = `${base_url}/products`;
    return this.http.post(endpoint, body);
  }

  /**
   * Update products
   * @param body 
   * @param id 
   */
  updateProducts(body: any, id: any) {
    const endpoint = `${base_url}/products/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * Delete products
   * @param id 
   * @returns 
   */
  deleteProducts(id :any) {
    const endpoint = `${base_url}/products/${id}`;
    return this.http.delete(endpoint);
  }
}
