namespace Utils.Maintenance.TaskStubs
{
    public class CopyLogs : IMaintenanceTask
    {
        public void Run()
        {
            var type = this.GetType().ToString();
            var logger = new StubMethodLogger();
            logger.PrintFakeLog(type);
        }
    }
}