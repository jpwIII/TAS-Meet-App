/*
Script by: Marissa Morton, Robbie Lewis, and Alexander McNair

Documentation by: Jesse White

Last Updated: 11/24/2023

Purpose of the Script: This file details the process of the Upload functionality featured in the app. It connects to the blob,
allows the user to select a file from their file explorer, and uploads that file to the blob.

JavaScript Documentation can be found here: https://www.w3schools.com/js/default.asp
HTML Documentation can be found here: https://www.w3schools.com/html/default.asp 
*/
import React, {useState} from "react";
import { BlobServiceClient, } from "@azure/storage-blob";

async function uploadImage(containerName, file){
    const blob_Service_Client = new BlobServiceClient(
      "https://seniorprojetblob.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-12-16T02:27:03Z&st=2023-10-18T17:27:03Z&spr=https&sig=omQSXh3VhDiu%2BQsjjkJ%2F%2FVSz0A9ZvyKQ%2BzMF6%2FBGWhQ%3D"
    );
    const containerClient = blob_Service_Client.getContainerClient(containerName)
    const blobClient = containerClient.getBlobClient(file.name)
    const blockBlobClient = blobClient.getBlockBlobClient()
    const result = await blockBlobClient.uploadBrowserData(file, {
      blockSize: 4 * 1024 * 1024,
      concurrency: 20,
      overwrite: true,
      onProgress: ev => console.log(ev)
    });
    alert('Upload of file completed');
  }
  
//-----------------------------------------------------------------------------------------------------------------
  //When triggered by the user, it displays the Upload specific UI to the screen
  function Upload(props){
    const [file, setfile] = useState(null);
  
    const handleFileChange = event => {
      setfile(event.target.files[0]);
    };
  
    const handleSubmit = event => {
      event.preventDefault();
      uploadImage("dobfiletest", file);
    };

//-----------------------------------------------------------------------------------------------------------------
    //HTML formatting code that displays the Upload subwindow information as well as determines the button functionality
    return(props.trigger) ? (
        <div className="upload">
            <div className="upload-inner">
            <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange}></input>
            <button type = "submit">
            <strong>Upload Image</strong>
            </button>
        </form>
            </div>
            <button className="close-btn" onClick={() => props.setTrigger(false)}>
              <strong>Close</strong>
            </button>
            {props.children}
        </div>
    ):"";
}

export default Upload