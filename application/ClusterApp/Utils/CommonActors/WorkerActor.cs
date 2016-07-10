namespace Utils.CommonActors
{
    using System;

    using Akka.Actor;
    using Akka.Cluster;

    using Utils.Maintenance;
    using Utils.Maintenance.TaskStubs;
    using Utils.Messages;

    public class WorkerActor : ReceiveActor
    {
        public WorkerActor()
        {
            this.TaskRunner = new CommonTasks(new CopyLogs(), new CleanupNodeOperationSystem());

            var cluster = Cluster.Get(Context.System);
            cluster.Subscribe(
                this.Self,
                ClusterEvent.SubscriptionInitialStateMode.InitialStateAsSnapshot,
                new[] { typeof(ClusterEvent.IMemberEvent) });
            cluster.Subscribe(this.Self, ClusterEvent.InitialStateAsEvents, new[] { typeof(ClusterEvent.IMemberEvent) });

            this.DefaultBehaviour();
        }

        private CommonTasks TaskRunner { get; set; }

        private void DefaultBehaviour()
        {
            this.Receive<string>(
                task => task.Equals("cleanup"),
                task =>
                    {
                        Console.WriteLine("Cleanup started by actor with path: {0}", this.Self.Path);

                        this.TaskRunner.CleanupNodeOperationSystem();
                        this.Sender.Tell(new Done(this.TaskCompleted(task)));
                    });

            this.Receive<string>(
                task => task.Equals("copylogs"),
                task =>
                    {
                        Console.WriteLine("Copylogs started by actor with path: {0}", this.Self.Path);
                        this.TaskRunner.CopyLogs();
                        this.Sender.Tell(new Done(this.TaskCompleted(task)));
                    });

            this.Receive<ClusterEvent.IMemberEvent>(memberEvent => this.ShutdownWorker(memberEvent.Member));
        }

        private string TaskCompleted(string task)
        {
            return $"{task} from node {this.Self.Path.Parent.Name}/{this.Self.Path.Name} completed";
        }

        private void ShutdownWorker(Member member)
        {
            if (member.Status != MemberStatus.Removed)
            {
                return;
            }

            var path = this.Self.ToString();

            if (path.Contains(member.Address.Port.ToString()))
            {
                Environment.Exit(0);
            }
        }

        public override void AroundPreStart()
        {
            base.AroundPreStart();
            Console.WriteLine("Starting new instance...");
        }

        public override void AroundPreRestart(Exception cause, object message)
        {
            Console.WriteLine("Restarting");
        }

        public override void AroundPostRestart(Exception cause, object message)
        {
            Console.WriteLine("Restarted");
        }
    }
}