import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SecureStorageService {
  private secretKey =
    'jP8Vx1M,&N"N!q!Ny.+^:6"MQ)!`[LJ?pVBl*t}2u?z_AeEg%C#%2={{[lK42Kv';
  constructor() {}
  set(key: string, value: any): void {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      this.secretKey
    ).toString();
    localStorage.setItem(key, encrypted);
  }

  get(key: string): any {
    const encrypted = localStorage.getItem(key);
    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch {
        return null;
      }
    }
    return null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
