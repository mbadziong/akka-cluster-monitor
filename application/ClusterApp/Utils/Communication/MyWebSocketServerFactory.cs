using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utils.Communication
{
    public static class MyWebSocketServerFactory
    {
        private static MyWebSocketServer instance;

        public static MyWebSocketServer Instance => instance ?? (instance = new MyWebSocketServer());
    }
}
