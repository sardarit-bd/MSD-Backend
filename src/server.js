
import app from "./app/app.js";
import connectDB from "./config/db.js";
import environment from "./config/environment.js";

connectDB();

app.listen(environment.port, () => {
  console.log(`🚀 Server running on port ${environment.port}`);
});