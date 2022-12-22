using QRFS.QueryModels;
using QRFS.Utils;
using System.Collections.Generic;
using System.Xml.Schema;

namespace QRFS.Helper
{
    public static class QueryHelper
    {
        private static Dictionary<string, int> MonthKeyVal = new Dictionary<string, int>(){
            { "Jan", 1 },
            { "Fab", 2 },
            { "Mar", 3 },
            { "Apr", 4 },
            { "May", 5 },
            { "Jun", 6 },
            { "Jul", 7 },
            { "Aug", 8 },
            { "Sep", 9 },
            { "Oct", 10 },
            { "Nov", 11 },
            { "Dec", 12 },
        };
        private static Dictionary<string, int> RateKeyVal = new Dictionary<string, int>() {
            { "1 (Poor)", 1 },
            { "2 (Bad)", 2 },
            { "3 (Modular)", 3 },
            { "4 (Good)", 4 },
            { "5 (Excellent)", 5 },
        };
        public static List<CitizenResponsePerMonth> DateToMonthResp(List<CitizenResponsePerDate> data)
        {
            List<CitizenResponsePerMonth> convertedResp = new List<CitizenResponsePerMonth>();
            foreach (var item in data)
            {
                convertedResp.Add(new CitizenResponsePerMonth() { qCount = item.qCount, Month = CommonUtils.ExtractMonth(item.DateString), MonthNumber = MonthKeyVal[CommonUtils.ExtractMonth(item.DateString)] }); 
            }
            for(int i = 0; i < convertedResp.Count; i++)
            {
                for(int j = i + 1; j < convertedResp.Count; j++)
                {
                    if (convertedResp[i].Month.Equals(convertedResp[j].Month))
                    {
                        convertedResp[i].qCount += convertedResp[j].qCount;
                        convertedResp.Remove(convertedResp[j]);
                    }
                }
            }
            return convertedResp;
        }
        public static CitizenResponseRatingInt GetAverageRating(List<CitizenResponseRating> data)
        {
            List<int> rates = new List<int>();
            double totalRateCount = 0;
            foreach (var item in data) { 
                for(int i = 0; i < item.qCount; i++)
                {
                    rates.Add(RateKeyVal[item.OptionText]);
                }
            }
            for(int i = 0; i < rates.Count; i++)
            {
                totalRateCount += rates[i];
            }
            return new CitizenResponseRatingInt() { Rating = (double)System.Math.Round(totalRateCount/rates.Count,1), StationId = data[0].StationId };
        }
    }
}
