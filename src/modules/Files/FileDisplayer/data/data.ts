import { FileDetails } from "../types";

const filesData: FileDetails[] = [];

for (let i = 1; i <= 15; i++) {
  filesData.push({
    fileId: `${i}`,
    name: `Test Token ${i}`,
    weight: 100, // Assuming a fixed weight for simplicity
    fileParentId: `${i % 2 === 0 ? 0 : 1}`, // Alternating between 0 and 1 for demonstration
    cid: `test-cid-${i}`,
  });
}

export { filesData };
