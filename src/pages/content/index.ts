function getCode(): string {
  const textarea = document.getElementById(
    "read-only-cursor-text-area"
  ) as HTMLTextAreaElement;
  if (textarea) {
    const textareaValue = textarea.value;
    return textareaValue;
  } else {
    console.log("Textarea element not found.");
  }
  return "";
}

// function to get file name from github page from element with id of file-name-id-wide
function getFileName(): string {
  const fileNameElement = document.getElementById("file-name-id-wide");
  if (fileNameElement) {
    const fileName = fileNameElement.innerText;
    return fileName;
  } else {
    console.log("File name element not found.");
  }
  return "";
}

// listener from chrome message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    if (request.action === "getCodeFromPage") {
      console.log("getCodeFromPage message received");

      const code = getCode();
      const fileName = getFileName();
      const message = {
        code: code,
        fileName: fileName,
        url: request.url,
      };
      sendResponse(message);
    }
  } catch (error) {
    console.error("Error in content script:", error);
  }
});
