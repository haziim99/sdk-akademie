

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const getCourses = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("courses").get();
    const courses: unknown[] = [];
    snapshot.forEach((doc) => courses.push(doc.data()));
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).send("Error getting courses: " + error);
  }
});
