export const handleSaveError = (error, doc, next) => {
  const { name, code } = error;
  console.log("Save Error:", error);
  console.log("Document:", doc);
  console.log("Error Name:", name);
  console.log("Error Code:", code);
  error.status = name === "MongoError" && code === 11000 ? 409 : 400;
  next();
};
