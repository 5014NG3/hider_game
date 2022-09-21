import { Injectable } from '@angular/core';
//service to make HTTP request to our api. 
import {HttpClient} from '@angular/common/http';
import { Observable, Subject} from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private url = 'http://localhost:5200';
  private employees$: Subject<Employee[]> = new Subject();
  private game$: Subject<[]> = new Subject();

  constructor(private httpClient: HttpClient) { }



  private refreshEmployees() {

      


    
    this.httpClient.get<{employees: Employee[], game: []}> (`${this.url}/employees`)
      .subscribe(db_data => {

        this.employees$.next(db_data.employees);
        this.game$.next(db_data.game)


      });
      

    
  }

  getEmployees(): Subject<Employee[]> {
    this.refreshEmployees();

    return this.employees$;
  }


  getGame(): Subject<[]> {
    this.refreshEmployees();
    return this.game$;
  }

  getEmployee(id: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.url}/employees/${id}`);
  }


  //maybe i can change the type when creating pics in the database 
  createEmployee(employee: Employee) : Observable<string> {
    return this.httpClient.post(`${this.url}/employees`, employee, {responseType: 'text'});
  }

  updateEmployee(id: string, employee: Employee): Observable<string> {
    console.log("id " + id)
    return this.httpClient.put(`${this.url}/employees/${id}`, employee, {responseType: 'text'});
  }

  deleteEmployee(id: string): Observable<string> {
    console.log("id " + id)

    return this.httpClient.delete(`${this.url}/employees/${id}`, {responseType: 'text'});
  }

}
