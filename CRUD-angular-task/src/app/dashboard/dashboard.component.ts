import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { CardFormComponent } from '../card-form/card-form.component';
import { ApiService } from '../shared/api.service';
import { UserData } from '../shared/user-data-model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  cardDataArr: UserData[] = [];
  isFormShown: boolean = false;
  isEditMode: boolean = false;
  selectedCard: UserData | null = null;
  selectedCardIndex: number | null = null;
  loggedInUserId: string = '';
  userName: string = '';

  authService = inject(AuthService);
  route = inject(Router);
  dataService = inject(ApiService);

  ngOnInit(): void {
    this.getUserData();
    this.getAllData();
  }

  getUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.loggedInUserId = user.id;
      this.userName = user.name;
      this.getAllData();
    } else {
      alert('Error Found in feteching Data');
    }
  }

  getAllData(): void {
    if (this.loggedInUserId) {
      this.dataService.getTasks(this.loggedInUserId).subscribe((tasks) => {
        this.cardDataArr = tasks;
      });
    }
  }

  closeForm() {
    return (this.isFormShown = false);
  }

  recivedData(data: UserData): void {
    if (this.isEditMode && this.selectedCardIndex !== null) {
      const updatedTask: any = {
        ...this.cardDataArr[this.selectedCardIndex],
        ...data,
      };
      console.log(updatedTask);

      this.dataService.updateTask(updatedTask.id, updatedTask).subscribe(() => {
        this.getAllData();
        this.closeForm();
      });
    } else {
      if (this.loggedInUserId) {
        const newTask = { ...data, userId: this.loggedInUserId };

        this.dataService.addTask(newTask).subscribe(() => {
          this.getAllData();
          this.closeForm();
        });
      }
    }
  }

  onAddOrEdit(card?: UserData, index?: number) {
    this.isFormShown = true;
    if (card && index !== undefined) {
      this.isEditMode = true;
      this.selectedCard = card;
      this.selectedCardIndex = index;
    } else {
      this.isEditMode = false;
      this.selectedCard = null;
      this.selectedCardIndex = null;
    }
  }
  onDelete(index: number): void {
    const task: any = this.cardDataArr[index];
    if (confirm('Are you sure you want to delete this task?')) {
      this.dataService.deleteTask(task.id).subscribe(() => {
        this.getAllData();
      });
    }
  }

  logout() {
    this.authService.logout();
    this.route.navigate(['login']);
    this.userName = '';
    this.loggedInUserId = '';
    this.cardDataArr = [];
  }
}
