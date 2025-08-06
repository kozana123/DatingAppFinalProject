using System.ComponentModel.DataAnnotations;

namespace datingApp.Classes
{
    public class UserPreferences
    {
        [Key]
        // [ForeignKey("User")]
        [Required]
        public int UserId { get; set; }
        public string PreferredPartner { get; set; }
        public string RelationshipType { get; set; }
        public string HeightPreferences { get; set; }
        public string Religion { get; set; }
        public bool IsSmoker { get; set; }
        public int PreferredDistanceKm { get; set; }
        public int MinAgePreference { get; set; }
        public int MaxAgePreference { get; set; }
        public string Interests { get; set; }

    }
}
