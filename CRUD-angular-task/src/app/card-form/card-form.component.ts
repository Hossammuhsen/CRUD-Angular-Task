import { Component, Output ,EventEmitter , Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { title } from 'process';
import { UserData } from '../shared/user-data-model';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css'
})
export class CardFormComponent implements OnInit{
  @Input() isEditMode:boolean = false
  @Input() cardData: UserData | null = null; 
  
  @Output() close = new EventEmitter(); 
  @Output() formDataEmitted = new EventEmitter<UserData>();
  popupForm:FormGroup

  constructor(private fb: FormBuilder){
    this.popupForm = this.fb.group({
      title : ['' , Validators.required],
      description  : ['' , Validators.required]
    })
  }
  ngOnInit() {
    if (this.isEditMode && this.cardData) {
      this.popupForm.patchValue(this.cardData);
    } else {
      this.popupForm.reset();
    }
  }
  
  closeForm() {
    this.close.emit();
  }
  onSubmit(){
    this.formDataEmitted.emit(this.popupForm.value);
    this.closeForm()
 }
}
