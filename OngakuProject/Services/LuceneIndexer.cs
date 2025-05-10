using OngakuProject.Models;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Store;
using Lucene.Net.Analysis.En;

namespace OngakuProject.Services
{
    public class LuceneIndexer
    {
        private readonly string? IndexPath;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public LuceneIndexer(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            IndexPath = _webHostEnvironment.WebRootPath + "/LuceneIndexes/";
        }

        public void BuildIndex(List<Playlist>? Playlists)
        {
            if(Playlists is not null)
            {
                Lucene.Net.Store.Directory Dir = FSDirectory.Open(IndexPath);
                EnglishAnalyzer Analyzer = new EnglishAnalyzer(Lucene.Net.Util.LuceneVersion.LUCENE_48);
                IndexWriterConfig Config = new IndexWriterConfig(Lucene.Net.Util.LuceneVersion.LUCENE_48, Analyzer);
                using (IndexWriter Writer = new IndexWriter(Dir, Config))
                {
                    foreach (Playlist item in Playlists)
                    {
                        Document Doc = new Document()
                        {
                            new StringField("Id", item.Id.ToString(), Field.Store.YES),
                            new TextField("Title", item.Name, Field.Store.YES),
                        };
                        Writer.AddDocument(Doc);
                    }
                    Writer.Flush(triggerMerge: false, applyAllDeletes: false);
                }
            }
        }
    }
}
