# 📄 Semantic Context Search Engine & RAG Pipeline

A production-ready **Retrieval-Augmented Generation (RAG)** backend orchestration engine engineered with **Node.js** and **Express**. This system implements document intelligence workflows, enabling users to upload raw multi-page PDF documents and execute highly contextual, low-latency semantic queries directly against their private data using cloud vector indexes and Generative AI.

---

## 🧱 System Architecture & Data Flow

Rather than parsing raw documents directly into a Large Language Model—which induces extreme context window inflation and escalating runtime costs—this application enforces a strict vector database ingestion pipeline:

```text
+-------------------------------------------------------------------------+
|                          1. CLIENT INTERFACE                            |
|        [ User Input / Client App ] ---> ( PDF File + Query String )       |
+-------------------------------------------------------------------------+
                                     |
                                     v [ HTTP Multipart Form-Data Request ]
+-------------------------------------------------------------------------+
|                          2. EXPRESS BACKEND                             |
|                                                                         |
|   +-----------------------+           +-----------------------------+   |
|   |   Multer Middleware   |           |      fs File System         |   |
|   |  (Disk Buffer Stage)  |           | (Temporary Storage Cleanup) |   |
|   +-----------------------+           +-----------------------------+   |
|               |                                      ^                  |
|               v                                      | (Unlink Task)    |
|   +-----------------------+                          |                  |
|   |       pdf-parse       | -------------------------+                  |
|   |  (Raw Text Extraction)|                                             |
|   +-----------------------+                                             |
|               |                                                         |
|               v [ Standard Text Chunking Strategy: \n\n ]                |
|   +-----------------------+                                             |
|   |   App Router Module   |                                             |
|   |  (RAG Orchestration)  |                                             |
|   +-----------------------+                                             |
+-------------------------------------------------------------------------+
         |                       ^                         |
         | (Text Payload)        | (768-Dim Vector)        | (Context + Query)
         v                       |                         v
+------------------+   +--------------------+   +-------------------------+
| 3. EMBEDDING API |   |  4. VECTOR STORE   |   |   5. GENERATION LLM     |
|                  |   |                    |   |                         |
|   Google GenAI   |   |    Qdrant Cloud    |   |    Gemini 2.5 Flash     |
|                  |   |  (Distance Metric: |   |     (Augmented LLM      |
| [gemini-embed-2] |   |      Cosine)       |   |       Synthesis)        |
+------------------+   +--------------------+   +-------------------------+
                                                             |
                                                             v
+-------------------------------------------------------------------------+
|                          6. APPLICATION OUTPUT                          |
|         [ Client Interface ] <--- ( Synthesized Context Answer )        |
+-------------------------------------------------------------------------+
🔄 The Execution Lifecycle:Binary Ingestion: multer interceptor pipelines incoming standard binary buffers onto a temporary disk array.Parsing: The pdf-parse processing architecture parses the structural layout, isolating unstructured raw text data.Segmentation: Structural string content is tokenized dynamically across standard block boundaries (\n\n).Vector Embeddings: Chunk segments pass to the gemini-embedding-2 layer to map dense 768-dimensional mathematical coordinates.Database Indexing: Coordinates are upserted into an active database collection on Qdrant Cloud optimized with high-performance Cosine metric distance sorting.Stateless Cleanup: Immediate processing of downstream synthesis triggers an unlinking task (fs.unlinkSync), leaving no localized memory footprints.🛠️ Technology Stack & Core ToolingRuntime Environment: Node.js (Asynchronous Runtime Architecture)API Development Layer: Express.js, Multer MiddlewareArtificial Intelligence Engine: Google Gemini AI Ecosystem (gemini-2.5-flash, gemini-embedding-2)Vector Vector Space Engine: Qdrant Cloud Storage Cluster (@qdrant/js-client-rest)Parsing Instrumentation: PDF-Parse Extension Library🔐 Environment ConfigurationThe application implements strict security barriers to manage credentials securely outside source tracking via .gitignore.1. Variables ArchitectureKey IdentifierDomain PurposeBase Value TemplatePORTLocal network binding port configuration3000GEMINI_API_KEYStructural token validating access to Google GenAI endpointsAIzaSyYourKeyHere...QDRANT_URLOperational URI endpoint for the cloud vector databasehttps://your-cluster.io:6333QDRANT_API_KEYPrivate authorization key guarding read/write cluster accessqdr_yourSecretKeyHere...2. Fast Setup StepsLocate the structured template file .env.example placed at the workspace root directory.Create your isolated local setup copy using your workspace terminal:Bashcp .env.example .env
Open your newly created .env file and replace the placeholder text with your real operational API credentials.⚙️ Installation & Local DevelopmentFollow these steps to deploy and instantiate the system locally on your environment:1. Download Workspace FilesBashgit clone [https://github.com/YOUR_GITHUB_USER/YOUR_REPO_NAME.git](https://github.com/YOUR_GITHUB_USER/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
2. Initialize Packages MatrixBashnpm install
3. Bootstrap Application NodeBashnode index.js
🔌 Core Endpoint Documentation🛡️ 1. Initialize DB Vector SpaceMethod & Target: GET /create-collectionPurpose: Sets up the remote document cluster instance layout on Qdrant Cloud (pdf-docs) with standardized 768-dimensional configurations utilizing Cosine matching.📥 2. Execute Document Query ProcessMethod & Target: POST /uploadForm-Data Parameter Payload:pdf : (Binary .pdf source file attachment target)question : (Raw text question querying document parameters)Example JSON Return Structure:JSON{
  "success": true,
  "answer": "According to the financial records in section four, net revenue metrics improved by exactly 18%.",
  "retrievedContext": "Section 4. Performance Margins: Year-over-year verification records show an 18% improvement across standard operational metrics."
}