import { Injectable } from '@angular/core';
import { UserData } from '../models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private readonly key = 'userData';

  constructor() { }

  guardar(userData: UserData): void {
    localStorage.setItem(this.key, JSON.stringify(userData));
  }

  obtener(): UserData | null {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) as UserData : null;
  }

  eliminar(): void {
    localStorage.removeItem(this.key);
  }

  existe(): boolean {
    return localStorage.getItem(this.key) !== null;
  }
}
