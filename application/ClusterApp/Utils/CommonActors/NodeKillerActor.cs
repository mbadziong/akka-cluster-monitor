namespace Utils.CommonActors
{
    using Akka.Actor;
    using Akka.Cluster;

    public class NodeKillerActor : ReceiveActor
    {
        public NodeKillerActor()
        {
            this.Receive<Member>(member => Kill(member));
        }

        private static void Kill(Member member)
        {
            Cluster.Get(Context.System).Down(member.Address);
        }
    }
}