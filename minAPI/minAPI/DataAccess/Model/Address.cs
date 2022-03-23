namespace minAPI.DataAccess.Model
{
    public class Address
    {
        public Address()
        {


        }
        public Address(int id, string addressDetail, User user, int userId)
        {
            Id = id;
            AddressDetail = addressDetail;
            User = user;
            UserId = userId;
        }

        public int Id { get; set; }
        public string AddressDetail { get; set; }
        //[ForeignKey("UserId")]
        public User User { get; set; }

        public int UserId { get; set; }
    }
}
