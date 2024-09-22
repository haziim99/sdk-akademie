import { Component, OnInit } from '@angular/core';

interface Instructor {
  name: string;
  picture: string;
  position: string;
  bio: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  instructors: Instructor[] = [
    {
      name: 'Dr. Anna Müller',
      picture: 'assets/images/instructor1.png',
      position: 'Senior German Language Instructor',
      bio: 'Dr. Anna Müller has over 15 years of experience in teaching German. She specializes in advanced grammar and conversation practice.'
    },
    {
      name: 'Mr. Michael Schmidt',
      picture: 'assets/images/instructor2.jpg',
      position: 'German Language Tutor',
      bio: 'Mr. Michael Schmidt is an experienced tutor with a passion for helping students achieve their language goals.'
    },
    {
      name: 'Ms. Lisa Weber',
      picture: 'assets/images/instructor3.png',
      position: 'German Conversation Specialist',
      bio: 'Ms. Lisa Weber specializes in coclnversation practice and phonetics. She helps students improve their speaking skills through dynamic sessions.'
    },
    {
      name: 'Dr. Hans Becker',
      picture: 'assets/images/instructor4.png',
      position: 'German Literature Expert',
      bio: 'Dr. Hans Becker brings extensive knowledge of German literature and cultural studies to his classes.'
    }
  ];

  ngOnInit(): void {
    // Any initialization logic goes here
  }
}
