namespace ClusterExample.Actors
{
    using System;

    using Akka.Actor;
    using Akka.Cluster;
    using Akka.Routing;

    using Utils;
    using Utils.CommonActors;

    public class ClusterStateReceiverActor : ReceiveActor
    {
        private const int StateTellerDelayInMs = 20;

        private const int StateTellerIntervalInSecs = 1;

        private readonly Cluster cluster;

        protected ICancelable CurrentClusterStateTeller;

        public ClusterStateReceiverActor()
        {
            this.cluster = Cluster.Get(Context.System);
            this.cluster.Subscribe(
                this.Self,
                ClusterEvent.SubscriptionInitialStateMode.InitialStateAsSnapshot,
                new[] { typeof(ClusterEvent.IMemberEvent) });
            this.cluster.Subscribe(
                this.Self,
                ClusterEvent.InitialStateAsEvents,
                new[]
                    {
                        typeof(ClusterEvent.IMemberEvent), typeof(ClusterEvent.UnreachableMember),
                        typeof(ClusterEvent.LeaderChanged), typeof(ClusterEvent.RoleLeaderChanged),
                        typeof(ClusterEvent.IReachabilityEvent), typeof(ClusterEvent.IClusterDomainEvent)
                    });

            this.CurrentClusterStateTeller =
                Context.System.Scheduler.ScheduleTellRepeatedlyCancelable(
                    TimeSpan.FromMilliseconds(StateTellerDelayInMs),
                    TimeSpan.FromSeconds(StateTellerIntervalInSecs),
                    this.Self,
                    new Messages.CurrentClusterState(),
                    this.Self);

            this.ClusterStateSenderActor =
                Program.MyActorSystem.ActorOf(
                    Props.Create(() => new ClusterStateSenderActor()),
                    ActorPaths.ClusterStateSenderActor.Name);

            this.WorkerBroadcastRouterActor =
                Program.MyActorSystem.ActorOf(
                    Props.Create(() => new WorkerManagerActor())
                        .WithRouter(FromConfig.Instance)
                        .WithSupervisorStrategy(
                            new OneForOneStrategy(10, TimeSpan.FromSeconds(5), x => Directive.Restart)),
                    ActorPaths.ClusterWorkerRouter.Name);

            this.DefaultReceiveBehaviour();
        }

        public IActorRef ClusterStateSenderActor { get; set; }

        public IActorRef WorkerBroadcastRouterActor { get; set; }

        private void DefaultReceiveBehaviour()
        {
            this.Receive<Messages.CurrentClusterState>(msg => this.cluster.SendCurrentClusterState(this.Self));

            this.Receive<ClusterEvent.CurrentClusterState>(
                state => { this.ClusterStateSenderActor.Tell(new Messages.State(state)); });
        }
    }
}