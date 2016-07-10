namespace Worker
{
    using System;

    using Akka.Actor;
    using Akka.Configuration;
    using Utils;
    using Utils.CommonActors;

    public class Program
    {
        public static ActorSystem MyActorSystem { get; set; }

        public static IActorRef WorkerActor { get; set; }

        public static void Main(string[] args)
        {
            MyActorSystem = ActorSystem.Create(ActorPaths.ActorSystem, ConfigurationFactory.Load());

            Console.ReadKey(true);
        }
    }
}