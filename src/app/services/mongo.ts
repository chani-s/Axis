"use server";

import { MongoClient, ObjectId } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

export async function connectDatabase() {
  console.log(" inconnetDB");
  if (!client) {
    const dbConnectionString = process.env.PUBLIC_DB_CONNECTION;
    if (!dbConnectionString) {
      throw new Error("Database connection string is not defined");
    }
    client = new MongoClient(dbConnectionString);
    console.log(" after client");
  }
  clientPromise = client.connect();
  console.log(" after connect");

  return clientPromise;
}

export async function getAllDocuments(client: any, collection: string) {
  const db = client.db("Axis");
  const documents = await db.collection(collection).find().toArray();
  return documents;
}

export async function getById(client: any, collection: string, id: string) {
  const db = client.db("Axis");
  try {
    const document = await db.collection(collection).findOne({ _id: new ObjectId(id) });
    return document;
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    throw new Error("Failed to fetch user by ID");
  }
}

export async function insertDocument(
  client: MongoClient,
  collection: string,
  document: object
) {
  const db = client.db("Axis");
  const result = await db.collection(collection).insertOne(document);
  const insertedDocument = await db
    .collection(collection)
    .findOne({ _id: result.insertedId });
  return insertedDocument;
}

export async function updateDocument(
  client: MongoClient,
  collection: string,
  documentId: string,
  updateData: object
) {
  const db = client.db("Axis");
  const result = await db
    .collection(collection)
    .updateOne({ _id: new ObjectId(documentId) }, { $set: updateData });
  const updatedDocument = await db
    .collection(collection)
    .findOne({ _id: new ObjectId(documentId) });
  return updatedDocument;
}

export async function deleteDocument(
  client: MongoClient,
  collection: string,
  documentId: string
) {
  const db = client.db("Axis");
  const result = await db
    .collection(collection)
    .deleteOne({ _id: new ObjectId(documentId) });
  return { message: `Document with ID ${documentId} has been deleted.` };
}

export async function isExist(
  client: MongoClient,
  collection: string,
  filter: object
): Promise<boolean> {
  const db = client.db("Axis");
  const exists = await db.collection(collection).findOne(filter);
  return !!exists; // Returns true if the document exists, false otherwise
}

export async function isEqual(
  client: MongoClient,
  collection: string,
  filter: object,
  data: string
): Promise<boolean> {
  const db = client.db("Axis"); 
  const user = await db.collection(collection).findOne(filter); 
  if (!user) {
    return false; 
  }
  const isMatch = data==user.password;
  return isMatch; 
}

//await upsertDocument(client, "users", { name: "Jane Doe" }(<-מחפש שדה כזה), { age: 28 }(<-משנה את השדה הזה));
export async function upsertDocument(
  client: MongoClient,
  collection: string,
  filter: object,
  updateData: object
) {
  const db = client.db("Axis");
  const result = await db
    .collection(collection)
    .updateOne(filter, { $set: updateData }, { upsert: true });
  return result.upsertedId
    ? { upsertedId: result.upsertedId }
    : { modifiedCount: result.modifiedCount };
}

//await getSpecificFields(client, "users", { age: { $gte: 30 } }(<-מביא שדות אלו), { name: 1, age: 1 }(<-ממין לפי שדות אלו));
export async function getSpecificFields(
  client: MongoClient,
  collection: string,
  filter: object,
  fields: object
) {
  const db = client.db("Axis");
  const documents = await db
    .collection(collection)
    .find(filter, { projection: fields })
    .toArray();
  console.log(documents);
  return documents;
}
export async function getDocumentsByIds(
  client: MongoClient,
  collection: string,
  ids?: ObjectId[], // Array of ObjectId values
  include: boolean = true, // If true, fetch IDs in the list; if false, exclude them
  fields?: object // Optional projection for specific fields
) {
  const db = client.db("Axis");
  if (ids!=null){
    const query = { _id: { [include ? "$in" : "$nin"]: ids } }; // Use $in or $nin based on 'includ

    const options = fields ? { projection: fields } : {}; // Handle optional projection
    return await db.collection(collection).find(query, options).toArray();
  }
  else{
    const options = fields ? { projection: fields } : {}; // Handle optional projection
    return await db.collection(collection).find(options).toArray();

  }
 

}
