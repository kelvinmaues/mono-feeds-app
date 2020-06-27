import mongoose from "mongoose";

const mongoURI =
  "mongodb+srv://konoha_ninja:0CEsTnINuRC2JS8s@boruton-kan-sbr93.mongodb.net/feeds?retryWrites=true&w=majority";

export default mongoose.connect(mongoURI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
