/*
Script by: Marissa Morton, Robbie Lewis, and Alexander McNair

Documentation by: Jesse White

Last Updated: 11/30/2023

Purpose of the Script: This is the main application script that features the blob connection, handles the
UI updates dependant on what state the user is in (selecting files, uploading, deleting, and editing), and keeps track
of the user's recent file history.

JavaScript Documentation can be found here: https://www.w3schools.com/js/default.asp
HTML Documentation can be found here: https://www.w3schools.com/html/default.asp 
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
  //View Microsoft related file types in the viewer
  const handleViewDocument = async () => {
    fileInputRef.current.click();
  };

//-----------------------------------------------------------------------------------------------------------------
  //Displays Upload Popup UI element
  const handleUpload = () =>{
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
  //HTML webpage formatting code that determines the placement of elements
  //on the user's screen as well as determines the functionality of clickable buttons present.
  return(
    <div className="App">
      <div className="controls">
        <h1> Meeting Management System</h1>
        <button onClick={handleViewDocument}><strong>View Document</strong></button>
        <button onClick={handleUpload}><strong>Upload</strong></button>
        <Upload trigger ={UploadbuttonPopup} setTrigger={setButtonPopUpUpload}></Upload>
        <button onClick={handleDelete}><strong>Delete</strong></button>
        <Delete trigger ={DeletebuttonPopup} setTrigger={setButtonPopUpDelete}></Delete>
        <button onClick={handleEdit}><strong>Edit</strong></button>
        <Edit trigger ={EditbuttonPopup} setTrigger={setButtonPopUpEdit}></Edit>
       <input type ="file" ref={fileInputRef} style={{display: "none"}} onChange={handleFileChange}/>
        
        {fileHistory.length > 0 && (
          <div className="file-history">
          <h3>Recent Files:</h3>
          <select onChange={(e) => handleFileSelect(e.target.selectedIndex)} size = {fileHistory.length} >
          {fileHistory.map((file,index) => (
          <option key={index}><strong>{file.name}</strong></option>
            ))}
          </select>
          </div>
        )}
      </div>
      <div className="preview">
        {isPreviewOpen && (
          <div>
          <h2>Preview:</h2>
          {selectedFile && (
          <div className="selected-file">
          <h3>{selectedFile.name}</h3>
          </div>
        )}
          <DocViewer
          documents ={[{uri:URL.createObjectURL(selectedFile)}]} config={{pdfZoom: {
            defaultZoom: 2.5, // 1 as default,
            zoomJump: 0.2, // 0.1 as default,
          },}}
          page={currentPage}
          />
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