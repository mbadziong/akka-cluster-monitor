namespace ClusterExample.Actors
{
    using System.Linq;

    using Akka.Actor;
    using Akka.Cluster;

    using Newtonsoft.Json;

    using Utils;
    using Utils.CommonActors;
    using Utils.Communication;
    using Utils.Messages;

    public class TaskProcessorActor : ReceiveActor
    {
        private const string WorkerRouterRole = "WorkerRouter";

        private const string ShutdownTaskName = "shutdown";

        private const string ComplexCommand = "complexCommand";

        private readonly MyWebSocketServer socketServer;

        public TaskProcessorActor()
        {
            this.socketServer = MyWebSocketServerFactory.Instance;

            this.DefaultReceiveBehaviour();
        }

        private void DefaultReceiveBehaviour()
        {
            this.Receive<Member>(member => ShutdownNode(member));
            this.ReceiveAsync<Done>(job => this.socketServer.BroadcastMessage(job));
            this.Receive<string>(message => this.ProcessMessage(message));
        }

        private static void ShutdownNode(Member member)
        {
            var killer = Context.System.ActorOf(Props.Create(() => new NodeKillerActor()), ActorPaths.KillerActor.Name);
            killer.Tell(member);
            killer.Tell(PoisonPill.Instance);
        }

        private static void SendComplexCommand(string code)
        {
            var complexCommandActor =
                Context.System.ActorOf(
                    Props.Create(() => new ComplexCommandActor()),
                    ActorPaths.ComplexCommandActor.Name);
            complexCommandActor.Tell(code);
            complexCommandActor.Tell(PoisonPill.Instance);
        }

        private void ProcessMessage(string message)
        {
            dynamic jsonObject = JsonConvert.DeserializeObject(message);
            string task = jsonObject.Task.Value;

            if (task == ShutdownTaskName)
            {
                var port = jsonObject.Node.Port.Value;
                var host = jsonObject.Node.Host.Value;
                var memberToShutdown =
                    Cluster.Get(Context.System)
                        .ReadView.Members.Single(member => member.Address.Host == host && member.Address.Port == port);
                this.Self.Tell(memberToShutdown);
            }
            else if (task == ComplexCommand)
            {
                SendComplexCommand(jsonObject.Code.Value);
            }
            else
            {
                //common maintenance task
                this.SendTaskToWorkers(message);
            }
        }

        private void SendTaskToWorkers(string message)
        {
            dynamic jsonObject = JsonConvert.DeserializeObject(message);
            string task = jsonObject.Task.Value;

            var members = Cluster.Get(Context.System).ReadView.Members;
            foreach (var mem in members)
            {
                if (mem.HasRole(WorkerRouterRole))
                {
                    var address = $"{mem.Address}{ActorPaths.ClusterWorkerRouter.RelativePath}";

                    Context.System.ActorSelection(address).Tell(task);
                }
            }
        }
    }
}