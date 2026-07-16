export default class User {
    UserName;
    Password;
    Image;
    FirstName;
    LastName;
    Email;
    Birthday;
    City;
    Street;
    Number;

    constructor(UserName, Password, Image, FirstName, LastName,
        Email, Birthday, City, Street, Number) {
        this.UserName = UserName;
        this.Password = Password;
        this.Image = Image;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
        this.Birthday = Birthday;
        this.City = City;
        this.Street = Street;
        this.Number = Number;
    }
}