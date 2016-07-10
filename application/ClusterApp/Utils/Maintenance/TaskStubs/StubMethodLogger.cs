namespace Utils.Maintenance.TaskStubs
{
    using System;
    using System.Threading;

    public class StubMethodLogger : IStubMethod
    {
        public void PrintFakeLog(string stubName)
        {
            Console.WriteLine($"Running {stubName} stub...");
            Thread.Sleep(TimeSpan.FromSeconds(1));
            Console.WriteLine($"{stubName} stub done!");
        }
    }
}