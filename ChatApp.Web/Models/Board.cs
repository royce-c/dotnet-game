namespace ChatApp.Web.Models
{
    public class Tile
    {
        public int Id { get; set; } // Primary key
        public int Row { get; set; }
        public int Column { get; set; }
        public int Value { get; set; }
    }
}
