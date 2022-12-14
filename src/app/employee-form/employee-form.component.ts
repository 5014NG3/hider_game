import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../employee';



@Component({
  selector: 'mean-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  //pass initial state of the form from the parent component,
  //type is BehaviorSubject<Employee> because async date may 
  //be passed into the form, ex: parent component might fetch employee data from an API
  // and pass it into the form. child component will get notified when new data is available

  @Input()
  initialState: BehaviorSubject<Employee> = new BehaviorSubject({});
  


  //is an event emitter that will emit form values whenever the form is submitted
  //parent will handle submission and send and API call
  @Output()
  formValuesChanged = new EventEmitter<Employee>();

  @Output()
  formSubmitted = new EventEmitter<Employee>();

  employeeForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  get name() {return this.employeeForm.get('name')!;}
  get position() {return this.employeeForm.get('position')!;}
  get level() {return this.employeeForm.get('level')!;}

  ngOnInit() {
    this.initialState.subscribe(  employee => {
      this.employeeForm = this.fb.group({
        name: [employee['NAME' as keyof JSON], [Validators.required, Validators.minLength(3)]],
        position: [employee['POSITION' as keyof JSON], [Validators.required, Validators.minLength(5)]],
        level: [employee['LEVEL' as keyof JSON], [Validators.required]]

      });

    });

    this.employeeForm.valueChanges.subscribe((val) => {
      this.formValuesChanged.emit(val);

    });

  }

  submitForm(){
    this.formSubmitted.emit(this.employeeForm.value);
    console.log("IM IN THIS BITCH MOTERHFUCKER");

  }

}
