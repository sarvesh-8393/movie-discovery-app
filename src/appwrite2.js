import { Client, Databases,Query, ID } from "appwrite";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_WATCHLIST_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const databases = new Databases(client);

export const addToWatchList = async (movie,  action) => {
  try {
console.log("i am inside")
    if (action === "add") {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
      
        ID.unique(),
        {
          movie_id: movie.id,
          movieName: movie? movie.original_title:null,
          image_url: movie ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}` : null,
        }
      );
    } else if (action === "remove") {
      const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal("movie_id", movie.id),
      ]);

      if (result.documents.length > 0) {
        const appwriteId = result.documents[0].$id;
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, appwriteId);
      } else {
        console.log("No document found to remove.");
      }
    }
  } catch (error) {
    console.error("Error updating search count:", error.message);
  }
};
export const deleteWatchList=async(movie_id)=>{
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal("movie_id", movie_id),
      ]);

      if (result.documents.length > 0) {
        const appwriteId = result.documents[0].$id;
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, appwriteId);
      } else {
        console.log("No document found to remove.");
      }

}

export const getWatchList = async () => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      []
    );
    console.log("Watchlist fetched successfully:", result.documents);
    return result.documents;
  } catch (error) {
    console.error("Error fetching watchlist:", error.message);
    return [];
  }
};
