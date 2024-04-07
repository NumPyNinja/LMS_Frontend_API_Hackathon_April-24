import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { Assignment, AssignmentSelect, UploadedAssignment } from '../assignment/assignment';
import { AssignmentService } from '../assignment/assignment.service';
import { User } from 'src/app/user/user';
import { UserService } from 'src/app/user/user.service';
import { Batch } from 'src/app/batch/batch';
import { BatchService } from 'src/app/batch/batch.service';
import { StudentdataService } from './studentdata/studentdata.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  inputFilePath: string = "";
  selectedUploadAssignment: AssignmentSelect;
  message1: Message[] = [];
  userId: string = "";
  userEmailId: string = "";
  assignmentSelectList: AssignmentSelect[] = [];
  visibility: boolean = false;
  users: User[];
  selectedUsers: User[];
  user: User;
  batchList: Batch[];
  batch : Batch;
  getBatchList: Batch[];
  first: number;
assignment: Assignment[];
userRoles:String[]=[];
userName:string;

  


  constructor(
    private authService:AuthService,
    private studentDataService:StudentdataService,
    private userService: UserService,
    private batchService: BatchService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {
    this.userService.getAllStudents().subscribe((data)=>{
      this.users = data;
    });
    this.batchService.getBatchList().subscribe((data)=>{
      this.batchList = data;
      console.log(this.batchList);
    });
    this.authService.loggedInUserId.subscribe((res) => {
      this.userEmailId = res;
    });
    this.userRoles=this.authService.loggedInUserRole; 
    this.userRoles = this.authService.loggedInUserRole.map((str) => str.slice(5));
    this.userService.getAllUsers().subscribe((data)=>{
      this.users = data;
      const userWithEmail = this.users.find(user => user.userLoginEmail === this.userEmailId);
      this.userId=userWithEmail.userId;
      this.userName=userWithEmail.userFirstName+" "+userWithEmail.userLastName;
      this.getMissingAssignments();
     });
    
  }
  getMissingAssignments() {
    this.studentDataService.getAllMissingAssignment(this.userId).subscribe((assignmentData) => {
      this.assignment = assignmentData;
      console.log("Assignment data: ", this.assignment);
    });
  }



  // upload Assigment button

  displayUploadAssignmentDialog: boolean = false;

  showDialog() {
    this.displayUploadAssignmentDialog = true;
  }

  closePopup() {
    this.displayUploadAssignmentDialog = false;
  }

  uploadAssignment() {
    const uploadedAssignment: UploadedAssignment = {
      filePath: this.inputFilePath,
      assignmentId: this.selectedUploadAssignment.assignmentId,
      uploadDate: new Date(),
      uploadUser: this.userId
    };
    this.assignmentService.uploadAssignments(uploadedAssignment).subscribe((res) => {
      this.inputFilePath = "";
      this.selectedUploadAssignment = undefined;
      this.closePopup();
      this.message1 = [
        { severity: 'success', summary: 'Filepath Uploaded Successfully', detail: '' }];
    });
  }

}


