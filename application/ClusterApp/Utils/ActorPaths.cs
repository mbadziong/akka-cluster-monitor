namespace Utils
{
    public static class ActorPaths
    {
        public static readonly string ActorSystem = "clusterexample";

        public static readonly ActorMetaData ClusterStateReceiverActor = new ActorMetaData(
            "clusterstatereceiver",
            "/user");

        public static readonly ActorMetaData ClusterWorkerRouter = new ActorMetaData("clusterWorkerRouter", "/user");

        public static readonly ActorMetaData ClusterStateSenderActor = new ActorMetaData("clusterstatesender", "/user");

        public static readonly ActorMetaData WorkerActor = new ActorMetaData("worker", "/user");

        public static readonly ActorMetaData KillerActor = new ActorMetaData("killer", "/user");

        public static readonly ActorMetaData TaskProcessorActor = new ActorMetaData("taskProcessor", "/user");

        public static readonly ActorMetaData ComplexCommandActor = new ActorMetaData("complexCommand", "/user");
    }

    public class ActorMetaData
    {
        public ActorMetaData(string name, string relativePath)
        {
            this.Name = name;
            this.RelativePath = $"{relativePath}/{name}";
        }

        public string Name { get; private set; }

        public string RelativePath { get; private set; }
    }
}