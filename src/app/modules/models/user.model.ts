export class UserModel {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  communeName: string;

  constructor(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.communeName = user.communeName;
  }
}
