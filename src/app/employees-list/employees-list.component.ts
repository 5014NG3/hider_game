import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../employee';
import { EmployeeService  } from '../employee.service';

@Component({
  selector: 'mean-employees-list',
  templateUrl: './employees-list.component.html',
})
export class EmployeesListComponent implements OnInit {

  //need this shit for the images

  employees$: Observable<Employee[]> = new Observable();

  constructor(private employeesService: EmployeeService) { }

  //called when component is rendered on the page
  ngOnInit(): void {
    this.fetchEmployees();
  }

  deleteEmployee(id: string) : void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => this.fetchEmployees()
    });
  }

  //from employ service use getemployees service this return an 
  //observable, subscribe to it with a async pipe in the template
  //this will automatically render the list of employees as soon
  //as the data is avaiable. use table to display with
  //bootstrap classes, the pipe is in the html by the <tr></tr> thing
  //the async pipe automatically render list of employees as soon
  // as the data is available.
  private fetchEmployees(): void {
    this.employees$ = this.employeesService.getEmployees();
  }

}
