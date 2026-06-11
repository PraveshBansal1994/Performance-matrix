export interface EmployeeData {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
  joiningDate: string;
}

export interface IEmployees {
  data: EmployeeData[];
  first: number | null;
  items: number | null;
  last: number | null;
  next: number | null;
  pages: number;
  prev: number | null;
}
