namespace Utils.Communication
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Akka.Actor;
    using Akka.Util.Internal;

    using Fleck;

    using Newtonsoft.Json;

    public class MyWebSocketServer
    {
        private static WebSocketServer server;

        private static readonly List<IWebSocketConnection> SocketClients = new List<IWebSocketConnection>();

        private static readonly List<IActorRef> SubscribedActors = new List<IActorRef>();

        internal MyWebSocketServer()
        {
            this.Server.Start(
                socket =>
                    {
                        socket.OnOpen = () => { SocketClients.Add(socket); };
                        socket.OnClose = () => { SocketClients.Remove(socket); };
                        socket.OnMessage = message => SubscribedActors.ForEach(actor => actor.Tell(message));
                    });
        }

        private WebSocketServer Server => server ?? (server = new WebSocketServer(WebSocketInfo.Url));

        public void Subscribe(IActorRef actor)
        {
            SubscribedActors.Add(actor);
        }

        public async Task BroadcastMessage<T>(T message)
        {
            var messageString = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(message));
            SocketClients.Where(socket => socket.IsAvailable).ForEach(s => s.Send(messageString));
        }
    }
}