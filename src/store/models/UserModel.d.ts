export default interface UserModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  avatar: string;
  description: string;
  job_title: string | null;
  lat: number;
  lng: number;
  postal_code: string | null;
  street: string;
  city: string;
}
