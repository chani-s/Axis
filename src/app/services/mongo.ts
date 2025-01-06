"use server";
import { MongoClient, ObjectId } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

export async function connectDatabase() {
  try {
    if (!client) {
      const dbConnectionString = process.env.PUBLIC_DB_CONNECTION;
      if (!dbConnectionString) {
        throw new Error("Database connection string is not defined");
      }
      client = new MongoClient(dbConnectionString);
    }
    clientPromise = client.connect();
    await clientPromise; 
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }

  return clientPromise;
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
    .findOne({ _id: result.insertedId});
  return insertedDocument;
}


export async function updateById(
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

export async function updateByEmail(
  client: MongoClient,
  collection: string,
  documentEmail: string,
  updateData: object
) {
  const db = client.db("Axis");
  const result = await db
    .collection(collection)
    .updateOne({ email: documentEmail }, { $set: updateData });
  const updatedDocument = await db
    .collection(collection)
    .findOne({ email: documentEmail });
  return updatedDocument;
}

export async function getDocumentsByIds(
  client: MongoClient,
  collection: string,
  ids?: ObjectId[], 
  include: boolean = true, 
  fields?: object 
) {
  const db = client.db("Axis");
  if (ids!=null){
    const query = { _id: { [include ? "$in" : "$nin"]: ids } }; 
    const options = fields ? { projection: fields } : {};
    return await db.collection(collection).find(query, options).toArray();
  }
  else{
    const options = fields ? { projection: fields } : {}; 
    return await db.collection(collection).find(options).toArray();
  }
}

export async function updateByUserId(
  client: MongoClient,
  collection: string,
  documentId: string,
  updateData: object
) {
  const db = client.db("Axis");
  const result = await db
    .collection(collection)
    .updateOne({ user_id: documentId }, { $set: updateData });
  const updatedDocument = await db
    .collection(collection)
    .findOne({ user_id: documentId});
  return updatedDocument;
}

export async function deleteDocumentByEmail(
  client: MongoClient,
  collection: string,
  documentEmail: string
) {
  const db = client.db("Axis");
  const result = await db
    .collection(collection)
    .deleteOne({ email: documentEmail});
  return { message: `Document with ID ${documentEmail} has been deleted.` };
}


export async function isExist(
  client: MongoClient,
  collection: string,
  filter: object
): Promise<boolean> {
  const db = client.db("Axis");
  const exists = await db.collection(collection).findOne(filter);
  return !!exists; 
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



 

