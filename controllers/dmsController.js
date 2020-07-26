const filesModel = require("../models/filesModel");
const foldersModel = require("../models/foldersModel");
const { Error } = require("mongoose");
const { json } = require("body-parser");
const logger = require("../loaders/logger");

async function checkFolderExists(folderName, owner) {
  let folder = await foldersModel.findOne({
    folderName: folderName,
    owner: owner,
  });
  if (folder == null) {
    return false;
  } else {
    return true;
  }
}
async function checkFileExistsInFolder(fileName, folderName, owner) {
  let file = await filesModel.findOne({
    folderName: folderName,
    owner: owner,
    file: { $elemMatch: { fileName: fileName } },
  });
  if (file == null) {
    return false;
  } else {
    return true;
  }
}
async function checkFileExists(fileName, owner) {
  let file = await filesModel.findOne({
    fileName: fileName,
    owner: owner,
  });
  if (file == null) {
    return false;
  } else {
    return true;
  }
}

async function addOnlyFile(fileName, content, owner) {
  if (await checkFileExists(fileName, owner)) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "File already Exists",
          },
        ],
      })
    );
  }
  let file = new filesModel({
    fileName: fileName,
    owner: owner,
    content: content,
    createdOn: await new Date().getTime(),
  });
  await file.save();
  return "File '" + fileName + "' created";
}

async function addFileInFolder(folderName, fileName, content, owner) {
  if (!(await checkFolderExists(folderName, owner))) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "Folder does not Exists",
          },
        ],
      })
    );
  }
  if (await checkFileExistsInFolder(fileName, folderName, owner)) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "File already Exists in folder",
          },
        ],
      })
    );
  }
  await foldersModel.findOneAndUpdate(
    { folderName: folderName, owner: owner },
    {
      $addToSet: {
        files: {
          fileName: fileName,
          content: content,
          createdOn: await new Date().getTime(),
        },
      },
    },
    { new: true }
  );
  return fileName + " Added in " + folderName;
}

async function returnFromFile(fileName, owner) {
  let file = await filesModel
    .findOne({ fileName: fileName, owner: owner })
    .select({ _id: 0, __v: 0 });
  if (file == null) {
    throw new Error(
      JSON.stringify({
        code: 404,
        error: [
          {
            message: "File '" + fileName + "' does not exists ",
          },
        ],
      })
    );
  }
  return file;
}

async function returnFileInFolder(folderName, fileName, owner) {
  let files = await foldersModel
    .findOne({
      folderName: folderName,
      owner: owner,
      files: { $elemMatch: { fileName: fileName } },
    })
    .select({ files: 1 });
  if (files == null) {
    throw new Error(
      JSON.stringify({
        code: 404,
        error: [
          {
            message: "File '" + fileName + "' does not exists in " + folderName,
          },
        ],
      })
    );
  }
  return await files.files.filter((x) => x.fileName == fileName)[0];
}

async function moveFileToFolder(owner, srcFile, destFolder) {
  if (!(await checkFolderExists(destFolder, owner))) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "Folder '" + destFolder + "' does not Exists",
          },
        ],
      })
    );
  }
  let file = await filesModel.findOne({
    fileName: srcFile,
    owner: owner,
  });
  if (file == null) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "File '" + srcFile + "' does not Exists",
          },
        ],
      })
    );
  }
  await foldersModel.findOneAndUpdate(
    {
      folderName: destFolder,
      owner: owner,
    },
    {
      $addToSet: {
        files: {
          fileName: file.fileName,
          content: file.content,
          createdOn: file.createdOn,
        },
      },
    }
  );
  await filesModel.deleteOne({ fileName: srcFile, owner: owner });
  return srcFile + " moved into folder '" + destFolder + "'";
}
async function moveFileFromFolderToFolder(
  owner,
  srcFile,
  srcFolder,
  destFolder
) {
  if (!(await checkFolderExists(destFolder, owner))) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "Destination Folder '" + destFolder + "' does not Exists",
          },
        ],
      })
    );
  }
  if (!(await checkFolderExists(srcFolder, owner))) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "Source Folder '" + srcFolder + "' does not Exists",
          },
        ],
      })
    );
  }

  let files = await foldersModel
    .findOne({
      folderName: srcFolder,
      owner: owner,
      files: { $elemMatch: { fileName: srcFile } },
    })
    .select({ files: 1 });
  if (files == null) {
    throw new Error(
      JSON.stringify({
        code: 404,
        error: [
          {
            message: "File '" + srcFile + "' does not exists in " + srcFolder,
          },
        ],
      })
    );
  }
  let file = await files.files.filter((x) => x.fileName == srcFile)[0];
  await foldersModel.findOneAndUpdate(
    {
      folderName: destFolder,
      owner: owner,
    },
    {
      $addToSet: {
        files: {
          fileName: file.fileName,
          content: file.content,
          createdOn: file.createdOn,
        },
      },
    }
  );
  await foldersModel.findOneAndUpdate(
    {
      folderName: srcFolder,
      owner: owner,
    },
    { $pull: { files: { fileName: file.fileName } } }
  );
  return (
    srcFile + " moved from folder '" + srcFolder + "' to '" + destFolder + "'"
  );
}
async function moveFileFromFolderToFile(owner, srcFolder, srcFile) {
  let files = await foldersModel
    .findOne({
      folderName: srcFolder,
      owner: owner,
      files: { $elemMatch: { fileName: srcFile } },
    })
    .select({ files: 1 });
  if (files == null) {
    throw new Error(
      JSON.stringify({
        code: 404,
        error: [
          {
            message: "File '" + srcFile + "' does not exists in " + srcFolder,
          },
        ],
      })
    );
  }
  let file = await files.files.filter((x) => x.fileName == srcFile)[0];
  let newFile = new filesModel({
    fileName: file.fileName,
    content: file.content,
    owner: owner,
    createdOn: file.createdOn,
  });
  await newFile.save();
  await foldersModel.findOneAndUpdate(
    {
      folderName: srcFolder,
      owner: owner,
    },
    { $pull: { files: { fileName: file.fileName } } }
  );
  return srcFile + " has been Moved out of " + srcFolder;
}

exports.createFolder = async (folderName, owner) => {
  logger.info(folderName + " " + owner);
  if (await checkFolderExists(folderName, owner)) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "Folder already Exists",
          },
        ],
      })
    );
  }
  let newFolder = new foldersModel({
    folderName: folderName,
    owner: owner,
  });
  await newFolder.save();
  return folderName + " has been created";
};

exports.addFile = async (file, owner, folderName) => {
  let content = await new Buffer.from(file.data, "binary").toString("base64");
  if (folderName != undefined && folderName != "") {
    return await addFileInFolder(folderName, file.name, content, owner);
  }
  return await addOnlyFile(file.name, content, owner);
};

exports.moveFile = async (owner, srcFile, srcFolder, destFolder, op) => {
  switch (op) {
    case "F-2-F":
      return moveFileFromFolderToFolder(owner, srcFile, srcFolder, destFolder);
    case "f-F":
      return moveFileToFolder(owner, srcFile, destFolder);
    case "F-f":
      return moveFileFromFolderToFile(owner, srcFolder, srcFile);
  }
};

exports.filesInFolder = async (folderName, owner) => {
  if (!(await checkFolderExists(folderName, owner))) {
    throw new Error(
      JSON.stringify({
        code: 403,
        errors: [
          {
            message: "Folder '" + folderName + "' does not Exists",
          },
        ],
      })
    );
  }
  let fileNames = await foldersModel
    .findOne({ folderName: folderName, owner: owner })
    .select({ "files.fileName": 1 });
  console.log(fileNames);
  return await fileNames.files.map((x) => x.fileName);
};

exports.list = async (owner) => {
  let folders = await foldersModel
    .find({ owner: owner })
    .select({ folderName: 1 });
  let files = await filesModel.find({ owner: owner }).select({ fileName: 1 });
  return await {
    folders: await folders.map((x) => x.folderName),
    files: await files.map((x) => x.fileName),
  };
};

exports.file = async (fileName, owner, folderName) => {
  if (folderName != undefined && folderName != "") {
    return await returnFileInFolder(folderName, fileName, owner);
  }
  return await returnFromFile(fileName, owner);
};
