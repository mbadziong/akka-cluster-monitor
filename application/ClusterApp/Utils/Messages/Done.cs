using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utils.Messages
{
    public class Done
    {
        public Done(string message)
        {
            this.Message = message;
        }

        public string Message { get; set; }
    }
}
