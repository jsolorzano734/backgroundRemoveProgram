// Define the source and save folders
var sourceFolderPath = "//";
var saveFolderPath = "//";

var sourceFolder = Folder(sourceFolderPath);
var saveFolder = new Folder(saveFolderPath);

var jpegQuality = 12;
var dpiQuality = 600;

// Define the RGB values for the background color you want to replace
var backgroundRed = 255;    // Red component of the background color
var backgroundGreen = 255;  // Green component of the background color
var backgroundBlue = 255;   // Blue component of the background color

// Check if the source folder exists
if (sourceFolder.exists) {
    // Get a list of all files in the source folder with specific extensions
    var fileList = sourceFolder.getFiles(/\.(jpg|jpeg|png|tif|psd)$/i);

    // Loop through each file in the list
    for (var a = 0; a < fileList.length; a++) {
        // Open the file
        app.open(fileList[a]);

        // Define the image quality for saving as JPG
        var jpgQuality = 12;

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

        // Create a color to be used with the fill command with the specified RGB values
        var colorRef = new SolidColor();
        colorRef.rgb.red = backgroundRed;
        colorRef.rgb.green = backgroundGreen;
        colorRef.rgb.blue = backgroundBlue;

        // Now apply fill to the current selection using the specified background color
        app.activeDocument.selection.fill(colorRef);

        // Get the filename of the current document without the file extension
        var fileName = app.activeDocument.name.replace(/\.[^\.]+$/, "");

        // Save the document as a JPG file with the specified quality and DPI
        saveJPG(new File(saveFolder + "/" + fileName + ".jpg"), jpegQuality, dpiQuality);

        // Close the document without saving changes
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
} else {
    alert("Source folder not found. Please check the path and try again.");
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
