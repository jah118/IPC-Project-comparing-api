namespace DataAccess.Model
{
    public class User
    {
        public User()
        {

        }

        public User(int id, string firstName, string lastName, int age, string email, Gender gender, string framework)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Age = age;
            Email = email;
            Gender = gender;
            Framework = framework;
        }

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }

        public Gender Gender { get; set; }
        public string Framework { get; set; }

        //public ICollection<Address> UserAddress { get; set; }
        //    = new List<Address>();
    }
}