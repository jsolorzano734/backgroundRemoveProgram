// First, you need to create two folders:
// For path 1. Create a folder to store your images with the current background
var sourceFolder = Folder("paste Path 1 here");

// For path 2. Create a folder to store the images with the removed background
var saveFolder = new Folder("paste Path 2 here");

// Second, make sure you define the R, G, and B values for the background color

// Define the image quality for saving as JPG
var jpegQuality = 12;

// Define the DPI quality for saving
var dpiQuality = 600;

// Comment: Check if the source folder exists and retrieve the list of files in the folder
if (sourceFolder != null) {
  var fileList = sourceFolder.getFiles();
  // NOTE: Un-comment (remove the //) the below line with image type extensions and comment the above line (//var fileList = sourceFolder.getFiles();) to filter specific file types. 
  // The script will not work if you have any non-image file in the path 1 folder, so try filtering file types if the script fails.
  // var fileList = sourceFolder.getFiles(/\.(jpg|tif|psd|crw|cr2|nef|dcr|dc2|raw|heic)$/i);
}

for (var a = 0; a < fileList.length; a++) {
  // Open the file
  app.open(fileList[a]);

  // Select subject
  var idautoCutout = stringIDToTypeID("autoCutout");
  var desc01 = new ActionDescriptor();
  var idsampleAllLayers = stringIDToTypeID("sampleAllLayers");
  desc01.putBoolean(idsampleAllLayers, false);
  try {
    executeAction(idautoCutout, desc01, DialogModes.NO);
  } catch (err) {}

  // Invert the selection
  app.activeDocument.selection.invert();

  // Create a color to be used with the fill command set to blue with RGB values (16, 166, 255)
  // For white, use RGB values (255, 255, 255). For black, use RGB values (0, 0, 0)
  var colorRef = new SolidColor();
  colorRef.rgb.red = 255;
  colorRef.rgb.green = 255;
  colorRef.rgb.blue = 255;

  // Now apply fill to the current selection
  app.activeDocument.selection.fill(colorRef);

  // Get the filename of the current document without the file extension
  var fileName = app.activeDocument.name.replace(/\.[^\.]+$/, "");

  // Save the document as a JPG file with the specified quality and DPI
  saveJPG(new File(saveFolder + "/" + fileName + ".jpg"), jpegQuality, dpiQuality);

  // Close the document without saving changes
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

// Function to save a document as a JPG file with the specified quality and DPI
function saveJPG(saveFile, jpegQuality, dpiQuality) {
  saveFile = saveFile instanceof File ? saveFile : new File(saveFile);
  var jpgSaveOptions = new JPEGSaveOptions();
  jpgSaveOptions.embedColorProfile = true;
  jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
  jpgSaveOptions.matte = MatteType.NONE;
  jpgSaveOptions.quality = jpegQuality;
  activeDocument.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE, dpiQuality);
}
