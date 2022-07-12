type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

interface Interview {
  student: string;
  interviewer: number;
}

interface Day {
  id: number;
  name: WeekDay;
  appointments: number[];
  interviewers: number[];
  spots: number;
}

interface Appointment {
  id: number;
  time: string;
  interview: Interview | null;
}

interface Interviewer {
  id: number;
  name: string;
  avatar: string;
}
