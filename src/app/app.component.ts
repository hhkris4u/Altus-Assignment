import { AppService } from './app.service';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface School {
  schoolName: string;
}
export interface Student {
  schoolId: number;
  schoolName: string;
  studentName: string;
  studentGrade: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'altus-client';

  uniqueSchools!: School[];

  selectedSchoolName!: string;

  myControl = new FormControl();

  filteredSchools!: Observable<School[]>;

  displayedColumns: string[] = ['schoolName', 'studentName', 'studentGrade'];
  studentGradeData!: Student[];

  constructor(private readonly appService: AppService) { }

  ngOnInit(): void {

    //Get unique Schools to auto complete search box
    this.appService.fetchUniqueSchools().subscribe((data: any) => {
      this.uniqueSchools = data;
    });

    this.filteredSchools = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.schoolName)),
      map(name => (name ? this._filter(name) : this.uniqueSchools.slice())),
    );
  }

  // Displat School name in auto complete
  displaySchoolName(school: School): string {
    return school && school.schoolName ? school.schoolName : '';
  }

  //Filter schools on search 
  private _filter(name: string): School[] {
    const filterValue = name.toLowerCase();
    return this.uniqueSchools.filter(s => s.schoolName.toLowerCase().includes(filterValue));
  }

  // On School selected
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.selectedSchoolName = event.option.value.schoolName
  }

  /* 
  1. Fetch Students Grades Data from server.
  2. Bind data to the grid
  3. Creates & download CSV 
  */
  async fetchStudentGradeData() {
    this.studentGradeData = [];

    if (this.selectedSchoolName === '' || this.selectedSchoolName == undefined) {
      window.alert('School cannot be found!!!');
      this.selectedSchoolName = '';
      return;
    }

    let headers = ["schoolId", "schoolName", "studentName", "studentGrade"];
    this.appService.fetchStudentGradeData(this.selectedSchoolName).subscribe((data: Student[]) => {
      this.studentGradeData = data;
      console.log(this.studentGradeData)
      console.log(data)
      if (!this.studentGradeData.length) {
        window.alert(`Data for school ${this.selectedSchoolName} not found`);
        this.selectedSchoolName = '';
        return;
      }


      let csvData = this.ConvertToCSV(this.studentGradeData, headers);
      let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
      let d = Date.now();
      saveAs(blob, `${this.selectedSchoolName}_${d}.csv`);
      this.selectedSchoolName = '';

    });
  }

  ConvertToCSV(objArray: any, headerList: any) {

    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    let newHeaders = ["schoolId", "schoolName", "studentName", "studentGrade"];

    for (let index in newHeaders) {
      row += newHeaders[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += ',' + this.strRep(array[i][head]);
      }
      str += line + '\r\n';
    }
    return str;
  }

  // Helper method for formatting 
  strRep(data: any) {
    if (typeof data == "string") {
      let newData = data.replace(/,/g, " ");
      return newData;
    }
    else if (typeof data == "undefined") {
      return "-";
    }
    else if (typeof data == "number") {
      return data.toString();
    }
    else {
      return data;
    }
  }

}
