import { TaskListModel } from "./models/TaskListModel";

export const PROJECT_MANAGER = "Project Manager";

export enum list {
  DOING,
  SUSPENDED,
  FOR_REALISATION,
  SOLVED,
  DONE
}

export const initTasks: Array<TaskListModel> = [
  {
    id: list.DOING,
    text: "Realizowane",
    list: []
  },
  {
    id: list.SUSPENDED,
    text: "Wstrzymane",
    list: []
  },
  {
    id: list.FOR_REALISATION,
    text: "Do realizacji",
    list: []
  },
  {
    id: list.SOLVED,
    text: "Rozwiązane",
    list: []
  },
  {
    id: list.DONE,
    text: "Zakończone",
    list: []
  }
];

//DEV fill tasks when is no localStorage
export const fillData =
  '[{"id":3,"text":"Rozwiązane","list":[{"id":"_0h650vvlu","text":"nowe zadanie","date":"2.09.2020, 10:04:53","favourite":true,"description":null,"user":{"id":4,"first_name":"Fiona","last_name":"Battisson","email":"fbattisson3@infoseek.co.jp","gender":"Female","avatar":"https://robohash.org/magnivoluptatesrem.jpg?size=250x250&set=set1","description":"Lateral dislocation of proximal end of tibia, left knee","job_title":"Desktop Support Technician","lat":26.082873,"lng":103.187824,"postal_code":null,"street":"86648 Packers Terrace","city":"Dongchuan"}}]},{"id":1,"text":"Wstrzymane","list":[{"id":"_exceuz6ix","text":"kupić dwa rowery","date":"1.09.2020, 22:10:34","favourite":true,"description":"asdas","user":{"id":25,"first_name":"Erica","last_name":"Luna","email":"elunao@biglobe.ne.jp","gender":"Female","avatar":"https://robohash.org/impeditautnam.jpg?size=250x250&set=set1","description":"Plasmodium malariae malaria with other complications","job_title":"Recruiting Manager","lat":"-8.44983","lng":"124.05402","postal_code":null,"street":"837 Dakota Circle","city":"Puntaru"}}]},{"id":0,"text":"Realizowane","list":[{"id":"_eel1bpzoc","text":"nowe zadanie","date":"1.09.2020, 22:12:01","favourite":true,"description":"nowy opis","user":{"id":4,"first_name":"Fiona","last_name":"Battisson","email":"fbattisson3@infoseek.co.jp","gender":"Female","avatar":"https://robohash.org/magnivoluptatesrem.jpg?size=250x250&set=set1","description":"Lateral dislocation of proximal end of tibia, left knee","job_title":"Desktop Support Technician","lat":26.082873,"lng":103.187824,"postal_code":null,"street":"86648 Packers Terrace","city":"Dongchuan"}},{"id":"_w14e8l22w","text":"asd","date":"2.09.2020, 11:55:12","favourite":false,"description":null,"user":{"id":12,"first_name":"Kimmi","last_name":"Goff","email":"kgoffb@smugmug.com","gender":"Female","avatar":"https://robohash.org/sitdoloremsint.jpg?size=250x250&set=set1","description":"Corrosion of second degree of left lower leg, sequela","job_title":"Research Associate","lat":28.133945,"lng":111.656407,"postal_code":null,"street":"45107 Summerview Place","city":"Meicheng"}},{"id":"_svgwi46u5","text":"sprzedać stary samochód","date":"1.09.2020, 23:37:17","favourite":true,"description":null,"user":null}]},{"id":2,"text":"Do realizacji","list":[]},{"id":4,"text":"Zakończone","list":[]}]';
