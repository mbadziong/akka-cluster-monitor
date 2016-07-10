namespace ClusterExample
{
    using System;

    using Akka.Actor;

    using ClusterExample.Actors;
    using Akka.Configuration;
    using Utils;

    class Program
    {
        public static ActorSystem MyActorSystem { get; set; }

        public static IActorRef ClusterStateReceiverActor { get; set; }

        public static void Main(string[] args)
        {
            MyActorSystem = ActorSystem.Create(ActorPaths.ActorSystem, ConfigurationFactory.Load());
            ClusterStateReceiverActor = MyActorSystem.ActorOf(
                Props.Create(() => new ClusterStateReceiverActor()),
                ActorPaths.ClusterStateReceiverActor.Name);

            Console.Title = "StatusProvider";
            Console.ReadKey(true);
        }
    }
}