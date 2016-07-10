namespace Utils.Maintenance.TaskStubs
{
    public class CleanupNodeOperationSystem : IMaintenanceTask
    {
        public void Run()
        {
            var type = this.GetType().ToString();
            var logger = new StubMethodLogger();
            logger.PrintFakeLog(type);
        }
    }
}