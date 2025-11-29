import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  firstname: string = '';
  lastname: string = '';
  age: number = 0;
  gender: string = '';

  student_list = signal<any[]>([]);
  update_index: number | null = null; // Track index for editing

  save() {
    const first = this.firstname.trim();
    const last = this.lastname.trim();

    if (!first) {
      alert('First Name is required and cannot be empty.');
      return;
    }

    if (!last) {
      alert('Last Name is required and cannot be empty.');
      return;
    }

    // FIXED: missing || operators
    if (!this.age || this.age < 17 || this.age > 80) {
      alert('Age is required and must be between 17 and 80.');
      return;
    }

    if (!this.gender) {
      alert('Gender is required.');
      return;
    }

    if (this.update_index !== null) {
      // Update existing student
      this.student_list.update((list) =>
        list.map((student, index) =>
          index === this.update_index
            ? {
                ...student,
                firstname: first,
                lastname: last,
                age: this.age,
                gender: this.gender,
              }
            : student
        )
      );
      alert('Student updated successfully!');
      this.update_index = null;
    } else {
      // Add new student
      const newStudent = {
        id:
          this.student_list().length > 0
            ? this.student_list()[this.student_list().length - 1].id + 1
            : 1,
        firstname: first,
        lastname: last,
        age: this.age,
        gender: this.gender,
      };

      this.student_list.update((list) => [...list, newStudent]);
      alert('Student added successfully!');
    }

    this.clearForm();
  }

  editStudent(student: any, index: number) {
    // FIXED: confirm requires quotes + template string
    if (confirm(`Do you want to edit ${student.firstname} ${student.lastname}?`)) {
      this.firstname = student.firstname;
      this.lastname = student.lastname;
      this.age = student.age;
      this.gender = student.gender;
      this.update_index = index;
    }
  }

  deleteStudent(index: number) {
    const student = this.student_list()[index];

    // FIXED: confirm template string
    if (confirm(`Are you sure you want to delete ${student.firstname} ${student.lastname}?`)) {
      this.student_list.update((list) => list.filter((_, i) => i !== index));
      alert('Student deleted successfully!');

      if (this.update_index === index) {
        this.clearForm();
      }
    }
  }

  clearForm() {
    this.firstname = '';
    this.lastname = '';
    this.age = 0;
    this.gender = 'male'; // Your default
    this.update_index = null;
  }
}
