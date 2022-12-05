using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace QRFS.Models
{
    public partial class FeedbackLog
    {
        public FeedbackLog()
        {
            CitizenResponse = new HashSet<CitizenResponse>();
        }

        public string Id { get; set; }
        public string CitizenEmail { get; set; }
        public DateTime? LogTimeStamp { get; set; }
        public bool? IsSubmitted { get; set; }
        public string StationId { get; set; }

        public virtual PoliceStation Station { get; set; }
        public virtual ICollection<CitizenResponse> CitizenResponse { get; set; }
    }
}
