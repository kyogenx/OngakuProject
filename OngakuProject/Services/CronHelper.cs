namespace OngakuProject.Services
{
    public class CronHelper
    {
        public static string RunEvery_N_Hours(int HourInterval = 2) => $"0 */{HourInterval} * * *";
        public static string RunEvery_N_Minutes(int MinuteInterval = 5) => $"*/{MinuteInterval} * * * *";
    }
}
