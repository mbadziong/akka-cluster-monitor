namespace Utils.Maintenance
{
    using System;

    public class CommonTasks
    {
        private readonly IMaintenanceTask cleanupNodeOperationSystemTask;

        private readonly IMaintenanceTask copyLogsTask;

        public CommonTasks(IMaintenanceTask copyLogsTask, IMaintenanceTask cleanupNodeOperationSystemTask)
        {
            this.copyLogsTask = copyLogsTask;
            this.cleanupNodeOperationSystemTask = cleanupNodeOperationSystemTask;
        }

        public void CopyLogs()
        {
            this.copyLogsTask.Run();

            Random rand = new Random();
            var randomInt = rand.Next(5);
            if (randomInt == 2)
            {
                throw new NotSupportedException();
            }
        }

        public void CleanupNodeOperationSystem()
        {
            this.cleanupNodeOperationSystemTask.Run();
        }
    }
}