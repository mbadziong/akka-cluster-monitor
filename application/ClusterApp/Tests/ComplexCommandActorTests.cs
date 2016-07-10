namespace Tests
{
    using System;

    using Akka.Actor;
    using Akka.TestKit.VsTest;

    using ClusterExample.Actors;

    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Utils.CommonActors;
    using Utils.Messages;

    [TestClass]
    public class ComplexCommandActorTests : TestKit
    {
        [TestMethod]
        public void CanCompileSimpleCodeAndReturnsResult()
        {
            const string CodeToCompile = "return 5;";
            const string ExpectedResult = "Complex command result: 5";

            var complexCommandActor = this.Sys.ActorOf(Props.Create(() => new ComplexCommandActor()));
            complexCommandActor.Tell(CodeToCompile);
            var currentResult = this.ExpectMsg<Done>(TimeSpan.FromSeconds(1));
            Assert.AreEqual(ExpectedResult, currentResult.Message);
        }

        [TestMethod]
        public void CannotCompileInvalidCodeAndDoesntRespond()
        {
            const string CodeToCompile = "invalid_C#_code";

            var complexCommandActor = this.Sys.ActorOf(Props.Create(() => new ComplexCommandActor()));
            complexCommandActor.Tell(CodeToCompile);
            this.ExpectNoMsg();
        }
    }
}