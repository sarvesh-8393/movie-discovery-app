import { Client, Databases, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const databases = new Databases(client); 

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", searchTerm)]  // array of queries
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie ? movie.id : null,
        poster_url: movie ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : null,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error.message);
  }
};

export const trendingMovies=async()=>{
    try{

    const result =await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(10),
        Query.orderDesc("count")
      ]  // ✅ array of queries
    );
    return result.documents;
}
catch(error){
    console.log(error);
}

}