import { Injectable } from '@angular/core';
//service to make HTTP request to our api. 
import {HttpClient} from '@angular/common/http';
import { Observable, Subject} from 'rxjs';
import { Pic } from './pic';

@Injectable({
  providedIn: 'root'
})
export class PicService {
  private url = 'http://localhost:5200';
  private pics$: Subject<Pic[]> = new Subject();

  constructor(private httpClient: HttpClient) { }


  //used to fetch full list of Pics
  private refreshPics() {
    this.httpClient.get<Pic[]> (`${this.url}/pics`)
      .subscribe(pics => {
        this.pics$.next(pics);

      });
  }

  getPics(): Subject<Pic[]> {
    this.refreshPics();
    return this.pics$;
  }

  getPic(id: string): Observable<Pic> {
    return this.httpClient.get<Pic>(`${this.url}/pics/${id}`);
  }

  createPic(pic: Pic) : Observable<string> {
    return this.httpClient.post(`${this.url}/pics`, pic, {responseType: 'text'});
  }

  updatePic(id: string, pic: Pic): Observable<string> {
    return this.httpClient.put(`${this.url}/pics/${id}`, pic, {responseType: 'text'});
  }

  deletePic(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/pics/${id}`, {responseType: 'text'});
  }

}
