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
  private db_data$: Subject<{employees: any, game: any}> = new Subject();

  constructor(private httpClient: HttpClient) { }


  //used to fetch full list of employees
  private refreshEmployees() {



    /*
    this.httpClient.get<[]> (`${this.url}/employees`)
      .subscribe(game => {
        this.game$.next(game);

      });



    
    this.httpClient.get<Employee[]> (`${this.url}/employees`)
      .subscribe(employees => {
        //console.log(employees)
        this.employees$.next(employees);

      });
      */
      


    
    this.httpClient.get<{employees: any, game: any}> (`${this.url}/employees`)
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

  getDb_data() : Subject<{employees: any, game: any}>{
    this.refreshEmployees();
    return this.db_data$;

  }

  getEmployee(id: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.url}/employees/${id}`);
  }


  //maybe i can change the type when creating pics in the database 
  createEmployee(employee: Employee) : Observable<string> {
    return this.httpClient.post(`${this.url}/employees`, employee, {responseType: 'text'});
  }

  updateEmployee(id: string, employee: Employee): Observable<string> {
    return this.httpClient.put(`${this.url}/employees/${id}`, employee, {responseType: 'text'});
  }

  deleteEmployee(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/employees/${id}`, {responseType: 'text'});
  }

}
