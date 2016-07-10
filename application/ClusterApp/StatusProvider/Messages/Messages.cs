namespace ClusterExample.Messages
{
    using Akka.Cluster;

    public class Initialize
    {
        public Initialize(string message)
        {
            this.Message = message;
        }

        public string Message { get; private set; }
    }

    public class Start
    {
    }

    public class AppLeaveCluster
    {
    }

    public class CurrentClusterState
    {
    }

    public class State
    {
        public State(ClusterEvent.CurrentClusterState clusterState)
        {
            this.ClusterState = clusterState;
        }

        public ClusterEvent.CurrentClusterState ClusterState { get; set; }
    }

    public class AppJoinCluster
    {
    }

    public class AppDownCluster
    {
    }

    public class MemberLeave
    {
        public MemberLeave(string address)
        {
            this.Address = address;
        }

        public string Address { get; private set; }
    }

    public class MemberDown
    {
        public MemberDown(string address)
        {
            this.Address = address;
        }

        public string Address { get; private set; }
    }
}