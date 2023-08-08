import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private keycloakService: KeycloakService) { }

  getRoles() {
    this.keycloakService.getUserRoles();
  }

  isAdmin() {
    let roles = this.keycloakService.getUserRoles().filter( role => role === "admin");
    if(roles.length > 0) {
      return true;
    }
    return false;
  }
}
