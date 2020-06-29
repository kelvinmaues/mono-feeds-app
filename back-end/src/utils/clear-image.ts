import fs from "fs";
import path from "path";

export default (filePath: string) => {
  fs.unlink(filePath, (err) => {
    console.log("Unlin image", filePath);
  });
};
