namespace QRFS.QueryModels
{
    public class CitizenResponseRating
    {
        public int qCount { get; set; }
        public string OptionId { get; set; }
        public string StationId { get; set; }
        public string OptionText { get; set; }
    }
    public class CitizenResponseRatingInt
    {
        public string StationId { get; set; }
        public double Rating { get; set; }
    }
    
}
