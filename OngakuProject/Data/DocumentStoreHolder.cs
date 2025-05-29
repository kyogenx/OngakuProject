using Raven.Client.Documents;
using System.Security.Cryptography.X509Certificates;

namespace OngakuProject.Data
{
    public class DocumentStoreHolder
    {
        private static readonly Lazy<IDocumentStore> _store = new Lazy<IDocumentStore>(CreateDocumentStore);
        private static IDocumentStore CreateDocumentStore()
        {
            string? DbName = "OngakuNoSqlDb";
            //string? ServerURL = "https://a.ongaku.ravendb.community"; Cloud URL (certificate needed)
            string? ServerURL = "http://127.0.0.1:63160";

            IDocumentStore documentStore = new DocumentStore()
            {
                Urls = new[] { ServerURL },
                Database = DbName,
            };

            documentStore.Initialize();
            return documentStore;
        }

        public static IDocumentStore Store
        {
            get { return _store.Value; }
        }
    }
}
