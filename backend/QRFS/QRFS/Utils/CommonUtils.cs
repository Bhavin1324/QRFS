using System;

namespace QRFS.Utils
{
    public static class CommonUtils
    {   
        public static string ExtractMonth(string dateString)
        {
            string[] dateElems = dateString.Split("-");
            DateTime dt = new DateTime(Convert.ToInt32(dateElems[0]), Convert.ToInt32(dateElems[1]), Convert.ToInt32(dateElems[2]));
            return dt.ToString("MMM");
        }
    }
}
