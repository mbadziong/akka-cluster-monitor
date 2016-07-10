namespace Utils.CommonActors
{
    using System;
    using System.CodeDom.Compiler;
    using System.Globalization;
    using System.Reflection;
    using System.Reflection.Emit;
    using System.Text;

    using Akka.Actor;

    using Microsoft.CSharp;

    using Utils.Messages;

    public class ComplexCommandActor : ReceiveActor
    {
        private const string TaskDoneMessageTemplate = "Complex command result: {0}";

        public ComplexCommandActor()
        {
            this.Receive<string>(
                code =>
                    {
                        var result = InvokeCode(code);
                        var message = string.Format(TaskDoneMessageTemplate, result);
                        Console.WriteLine(message);
                        this.Sender.Tell(new Done(message));
                    });
        }

        private static string ApplyMethodToTemplate(string methodImplementation)
        {
            const string Prefix = @"using System;

            namespace AkkaCluster
            {
                public class ComplexCommand
                {
                    public static double Example() {";

            const string Suffix = @"}
                }
            }";

            var codeBuilder = new StringBuilder();
            codeBuilder.Append(Prefix);
            codeBuilder.Append(methodImplementation);
            codeBuilder.Append(Suffix);

            return codeBuilder.ToString();
        }

        private static double InvokeCode(string methodImplementation)
        {
            var provider = new CSharpCodeProvider();
            var results = provider.CompileAssemblyFromSource(new CompilerParameters(), ApplyMethodToTemplate(methodImplementation));
            var binaryFunction = results.CompiledAssembly.GetType("AkkaCluster.ComplexCommand");
            var function = binaryFunction.GetMethod("Example");

            var result = function.Invoke(null, new object[]{});
            

            return Convert.ToDouble(result);
        }
    }
}