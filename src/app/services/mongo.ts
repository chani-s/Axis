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
    await clientPromise; // וודא שהחיבור נוצר
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }

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
    .findOne({ _id: result.insertedId});
  return insertedDocument;
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
  ids?: ObjectId[], 
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

// "use server";

// import mongoose, { Schema, Document, Model } from "mongoose";

// interface DefaultDocument extends Document {
//   name: string;
//   email: string;
//   user_id: string;
//   data?: any;
//   createdAt: Date;
//   updatedAt: Date;
// }

// // הגדרת הסכמה
// const DefaultSchema: Schema<DefaultDocument> = new Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     user_id: { type: String, required: true },
//     data: { type: Schema.Types.Mixed }, // שדה אופציונלי
//   },
//   { timestamps: true } // מוסיף createdAt ו-updatedAt אוטומטית
// );

// // התחברות למסד הנתונים באמצעות Mongoose
// export async function connectDatabase () {
//   try {
//     const dbConnectionString = process.env.PUBLIC_DB_CONNECTION;
//     if (!dbConnectionString) {
//       throw new Error("Database connection string is not defined");
//     }

//     await mongoose.connect(dbConnectionString); // אין צורך ב-useNewUrlParser
//     console.log("Connected to MongoDB successfully");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error;
//   }
// }


// const DefaultModel: Model<DefaultDocument> = mongoose.model(
//   "Default",
//   DefaultSchema
// );

// // פונקציות גישה לנתונים באמצעות Mongoose

// export async function getAllDocuments() {
//   return await DefaultModel.find();
// }

// export async function getById(id: string) {
//   try {
//     return await DefaultModel.findById(id);
//   } catch (error) {
//     console.error("Error fetching document by ID:", error);
//     throw new Error("Failed to fetch document by ID");
//   }
// }

// export async function insertDocument(document: Partial<DefaultDocument>) {
//   const newDocument = new DefaultModel(document);
//   return await newDocument.save();
// }

// export async function updateByUserId(userId: string, updateData: object) {
//   try {
//     return await DefaultModel.findOneAndUpdate(
//       { user_id: userId },
//       { $set: updateData },
//       { new: true }
//     );
//   } catch (error) {
//     console.error("Error updating document by user ID:", error);
//     throw error;
//   }
// }

// export async function updateByEmail(email: string, updateData: object) {
//   try {
//     return await DefaultModel.findOneAndUpdate(
//       { email },
//       { $set: updateData },
//       { new: true }
//     );
//   } catch (error) {
//     console.error("Error updating document by email:", error);
//     throw error;
//   }
// }

// export async function deleteDocument(id: string) {
//   try {
//     await DefaultModel.findByIdAndDelete(id);
//     return { message: `Document with ID ${id} has been deleted.` };
//   } catch (error) {
//     console.error("Error deleting document:", error);
//     throw error;
//   }
// }

// export async function deleteDocumentByEmail(email: string) {
//   try {
//     await DefaultModel.findOneAndDelete({ email });
//     return { message: `Document with email ${email} has been deleted.` };
//   } catch (error) {
//     console.error("Error deleting document by email:", error);
//     throw error;
//   }
// }

// export async function isExist(filter: object): Promise<boolean> {
//   const exists = await DefaultModel.exists(filter);
//   return !!exists;
// }

// export async function upsertDocument(filter: object, updateData: object) {
//   try {
//     const result = await DefaultModel.findOneAndUpdate(
//       filter,
//       { $set: updateData },
//       { new: true, upsert: true }
//     );
//     return result;
//   } catch (error) {
//     console.error("Error upserting document:", error);
//     throw error;
//   }
// }

// export async function getSpecificFields(filter: object, fields: object) {
//   try {
//     return await DefaultModel.find(filter, fields);
//   } catch (error) {
//     console.error("Error fetching specific fields:", error);
//     throw error;
//   }
// }

// export async function getDocumentsByIds(
//   ids?: string[],
//   include: boolean = true,
//   fields?: object
// ) {
//   try {
//     const query = ids
//       ? { _id: { [include ? "$in" : "$nin"]: ids } }
//       : {};
//     return await DefaultModel.find(query, fields);
//   } catch (error) {
//     console.error("Error fetching documents by IDs:", error);
//     throw error;
//   }
// }

