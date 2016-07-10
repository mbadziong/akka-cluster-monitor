namespace Utils.CommonActors
{
    using System;

    using Akka.Actor;

    using Utils.Messages;

    public class WorkerManagerActor : UntypedActor
    {
        public WorkerManagerActor()
        {
            this.Worker = Context.ActorOf(Props.Create(() => new WorkerActor()));
        }

        public IActorRef Worker { get; set; }

        protected override SupervisorStrategy SupervisorStrategy()
        {
            return new OneForOneStrategy(10, TimeSpan.FromSeconds(5), x => Directive.Restart);
        }

        protected override void OnReceive(object message)
        {
            var done = message as Done;
            if (done != null)
            {
                Console.WriteLine(done.Message);
            }
            else
            {
                this.Worker.Tell(message);
            }
        }
    }
}