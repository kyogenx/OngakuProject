using Lucene.Net.Analysis;
using Lucene.Net.Analysis.En;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Lucene.Net.QueryParsers;
using Lucene.Net.QueryParsers.Classic;

namespace OngakuProject.Services
{
    public class LuceneSearcher
    {
        private readonly string? IndexPath;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public LuceneSearcher(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            IndexPath = _webHostEnvironment.WebRootPath + "/LuceneIndexes/";
        }

        public ScoreDoc[]? Search(string? QueryText)
        {
            if(!String.IsNullOrWhiteSpace(QueryText))
            {
                string?[] Fields = ["Id", "Title"];
                EnglishAnalyzer Analyzer = new EnglishAnalyzer(Lucene.Net.Util.LuceneVersion.LUCENE_48);
                Lucene.Net.Store.Directory Dir = FSDirectory.Open(IndexPath);
                using(DirectoryReader Reader = DirectoryReader.Open(Dir))
                {
                    IndexSearcher Searcher = new IndexSearcher(Reader);
                    MultiFieldQueryParser Parser = new MultiFieldQueryParser(Lucene.Net.Util.LuceneVersion.LUCENE_48, Fields, Analyzer);
                    Query? Query = Parser.Parse(QueryText);
                    ScoreDoc[]? Result = Searcher.Search(Query, 12).ScoreDocs;

                    if (Result != null) return Result;
                }
            }
            return null;
        }
    }
}
