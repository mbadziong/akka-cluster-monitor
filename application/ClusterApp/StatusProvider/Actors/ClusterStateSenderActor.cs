namespace ClusterExample.Actors
{
    using Akka.Actor;

    using ClusterExample.Messages;

    using Utils;
    using Utils.Communication;

    public class ClusterStateSenderActor : ReceiveActor
    {
        private readonly MyWebSocketServer socketServer;

        public ClusterStateSenderActor()
        {
            this.socketServer = MyWebSocketServerFactory.Instance;

            this.TaskProcessorActor = Program.MyActorSystem.ActorOf(
                Props.Create(() => new TaskProcessorActor()),
                ActorPaths.TaskProcessorActor.Name);

            this.socketServer.Subscribe(this.TaskProcessorActor);

            this.DefaultReceiveBehaviour();
        }

        public IActorRef TaskProcessorActor { get; }

        private void DefaultReceiveBehaviour()
        {
            this.ReceiveAsync<State>(state => this.socketServer.BroadcastMessage(state).PipeTo(this.Self));
        }
    }
}