/*
Script by: Marissa Morton, Robbie Lewis, and Alexander McNair

Documentation by: Jesse White

Last Updated: 11/19/2023

Purpose of the Script: 


JavaScript Documentation can be found here: https://www.w3schools.com/js/default.asp
*/

import { useState,useRef,useEffect } from "react";
import DocViewer from "@cyntler/react-doc-viewer";
import { BlobServiceClient, } from "@azure/storage-blob";
import streamToBuffer from "stream-to-buffer";
import "./App.css";
import TASBackground from "./TAS_Background.jpeg";
import Delete from "./Delete";
import Upload from "./Upload";
import Edit from "./Edit";

function App(){
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setPreviewOpen] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const fileInputRef = useRef(null);
  const [fileHistory, setFileHistory] = useState([]);
  const [UploadbuttonPopup, setButtonPopUpUpload] = useState(false);
  const [DeletebuttonPopup, setButtonPopUpDelete] = useState(false);
  const [EditbuttonPopup, setButtonPopUpEdit] = useState(false);
  const totalPages = 10;

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Method that checks for possible user history, and displays it.
  useEffect(() => {
    const history = localStorage.getItem("fileHistory");
    if (history){
      setFileHistory(JSON.parse(history));
    }
  },[]);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Method that handles changing between and displaying files present in the Azure blob.
  //Also updates the recent file history display.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewOpen(true);
    localStorage.setItem("selectedFile",file.name);
    const newHistory = [file, ...fileHistory.slice(0,4)];
    setFileHistory(newHistory);
    localStorage.setItem("fileHistory",JSON.stringify(newHistory));
  };

//-----------------------------------------------------------------------------------------------------------------
  //Method that displays the currently selected file from the Azure blob.
  const handleFileSelect = (index) => {
    const selected = fileHistory[index];
    setSelectedFile(selected);
    setPreviewOpen(true);
    setCurrentPage(1);
  };

//-----------------------------------------------------------------------------------------------------------------
  
  const handleViewDocument = async () => {
    try {
      // Replace 'your-connection-string' and 'your-container-name' with your actual Azure Storage connection string and container name
      const connectionString = 'https://seniorprojetblob.blob.core.windows.net/;QueueEndpoint=https://seniorprojetblob.queue.core.windows.net/;FileEndpoint=https://seniorprojetblob.file.core.windows.net/;TableEndpoint=https://seniorprojetblob.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-12-21T03:02:04Z&st=2023-10-27T18:02:04Z&spr=https&sig=2r2wGTSMIMZTvue5v0PGgBydGD4n8i9CImSfjZlBTYI%3D';
      const containerName = 'dobfiletest';
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Replace 'your-blob-name' with the name of the blob you want to view
      const blobName = 'Test.txt';
      const blobClient = containerClient.getBlobClient(blobName);
      
      // Fetch the blob content
      const response = await blobClient.download(0);
      const blobContent = await streamToBuffer(response.readableStreamBody);

      // Create a Blob object and set it in the state
      const blob = new Blob([blobContent]);
      setSelectedFile(blob);
      setPreviewOpen(true);
      setCurrentPage(1);

    } catch (error) {
      console.error('Error fetching document from Azure Storage Blob:', error);
      alert('Error fetching document. Please try again.');
    }
  };

//-----------------------------------------------------------------------------------------------------------------
  //Returns to the previous page of the file display
  const handlePreviousPage = () =>{
    if (currentPage > 1){
      setCurrentPage(currentPage -1 );
    }
  };

//-----------------------------------------------------------------------------------------------------------------
  //Proceeds to the next page of the file display
  const handleNextPage = () => {
    if (currentPage < totalPages){
      setCurrentPage(currentPage + 1);
    }
  };

//-----------------------------------------------------------------------------------------------------------------
  //Displays Upload Popup UI element
  const handleUpload = () =>{
  //fileInputRef.current.click();
  setButtonPopUpUpload(true);
  };

//-----------------------------------------------------------------------------------------------------------------
  //Displays Delete Popup UI element
  const handleDelete = () =>{
  setButtonPopUpDelete(true);
  };

//-----------------------------------------------------------------------------------------------------------------
  //Displays Edit Popup UI element
  const handleEdit = () =>{
    setButtonPopUpEdit(true);
  };

//-----------------------------------------------------------------------------------------------------------------
  
  const handleViewPowerPoint = () =>{
    if (selectedFile && selectedFile.type ==="application/vnd.openxmlformats-officedocument.presentationml.presentation"){
      setPreviewOpen(true);
    } else{
      alert("Please select a valid PowerPoint presentation to view.");
    }
  };

//-----------------------------------------------------------------------------------------------------------------
  
  const handlePress =() =>{
    alert("Nugget");
  }

//-----------------------------------------------------------------------------------------------------------------
  
  return(
    <div className="App">
      <div className="controls">
        <h1> Meeting Management System</h1>
        <button onClick={handleViewDocument}> View Document</button>
        <button onClick={handleUpload}>Upload</button>
        <Upload trigger ={UploadbuttonPopup} setTrigger={setButtonPopUpUpload}></Upload>
        <button onClick={handleDelete}>Delete</button>
        <Delete trigger ={DeletebuttonPopup} setTrigger={setButtonPopUpDelete}></Delete>
        <button onClick={handleViewPowerPoint}>View Deck</button>
        <button onClick={handleEdit}>Edit</button>
        <Edit trigger ={EditbuttonPopup} setTrigger={setButtonPopUpEdit}></Edit>
       <input type ="file" ref={fileInputRef} style={{display: "none"}} onChange={handleFileChange}/>
        {selectedFile && (
          <div className="selected-file">
          <h3>Selected File: {selectedFile.name}</h3>
          <p>Page: {currentPage}</p>
          </div>
        )}
        {fileHistory.length > 0 && (
          <div className="file-history">
          <h3>Recent Files:</h3>
          <select onChange={(e) => handleFileSelect(e.target.selectedIndex)} size = {fileHistory.length} >
          {fileHistory.map((file,index) => (
          <option key={index}>{file.name}</option>
            ))}
          </select>
          </div>
        )}
      </div>
      <div className="preview">
        {isPreviewOpen && (
          <div>
          <h2>Preview:</h2>
          <DocViewer
          documents ={[{uri:URL.createObjectURL(selectedFile)}]}
          page={currentPage}
          />
          <button OnClick={handlePreviousPage}>← Previous Page</button>
          <button OnClick={handleNextPage}>Next Page →</button>
          </div>
        )}
      </div>
      </div>
  );

}

//-----------------------------------------------------------------------------------------------------------------

function AppWithBackground(){
  return(
    <div className="background" style={{backgroundImage:`url(${TASBackground})`}}>
    <App />
    </div>
  );
}

export default AppWithBackground