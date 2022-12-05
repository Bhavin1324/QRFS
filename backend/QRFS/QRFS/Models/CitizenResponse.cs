using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace QRFS.Models
{
    public partial class CitizenResponse
    {
        public string Id { get; set; }
        public string QuestionId { get; set; }
        public string OptionId { get; set; }
        public string LogId { get; set; }
        public string StationId { get; set; }

        public virtual FeedbackLog Log { get; set; }
        public virtual Options Option { get; set; }
        public virtual Questions Question { get; set; }
        public virtual PoliceStation Station { get; set; }
    }
}
