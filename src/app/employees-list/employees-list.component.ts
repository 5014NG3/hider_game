import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  game$: Observable<[]> = new Observable();
  db_data$: Observable<{employees: any, game: any}> = new Observable();



  form: FormGroup;

  imageData: string;
  
  constructor(private employeesService: EmployeeService) { }

  //called when component is rendered on the page
  ngOnInit(): void {
    this.fetchEmployees();
    this.form = new FormGroup({
      image: new FormControl(null)
    });
    
  }


  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.form.patchValue({ image: file });
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (file && allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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
    this.game$ = this.employeesService.getGame();
    

    //console.log(this.game$);



  }



}
