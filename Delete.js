/*
Script by: Marissa Morton, Robbie Lewis, and Alexander McNair

Documentation by: Jesse White

Last Updated: 11/30/2023

Purpose of the Script: This file details the process of the Delete functionality featured in the app. It connects to the blob, finds
the files held in the blob, and then removes them after the user inputs the correct file name.

JavaScript Documentation can be found here: https://www.w3schools.com/js/default.asp
HTML Documentation can be found here: https://www.w3schools.com/html/default.asp 
*/
import React, {useRef} from "react";
import { BlobServiceClient,} from "@azure/storage-blob";
  
  async function DeleteButton(containerClient, blobName){
    // include: Delete the base blob and all of its snapshots.
    // only: Delete only the blob's snapshots and not the blob itself.
    const options = {
      deleteSnapshots: 'include' // or 'only'
    }
    // Create blob client from container client
    const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists(options);
    alert(`Deleted file: ${blobName}`);
  }

//-----------------------------------------------------------------------------------------------------------------
  //Connects to the blob and finds the file name input by the user, then calls the delete functionality
  async function connection(container_name,blobName){
    const connStr = "BlobEndpoint=https://seniorprojetblob.blob.core.windows.net/;QueueEndpoint=https://seniorprojetblob.queue.core.windows.net/;FileEndpoint=https://seniorprojetblob.file.core.windows.net/;TableEndpoint=https://seniorprojetblob.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-12-21T03:02:04Z&st=2023-10-27T18:02:04Z&spr=https&sig=2r2wGTSMIMZTvue5v0PGgBydGD4n8i9CImSfjZlBTYI%3D";
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const container_Client = blobServiceClient.getContainerClient(container_name)
    DeleteButton(container_Client,blobName)
  }
  
//-----------------------------------------------------------------------------------------------------------------
  //Connects to the blob to gather file name information, then calls the function to display the file names
  async function connectionList(container_name){
    const connStr = "BlobEndpoint=https://seniorprojetblob.blob.core.windows.net/;QueueEndpoint=https://seniorprojetblob.queue.core.windows.net/;FileEndpoint=https://seniorprojetblob.file.core.windows.net/;TableEndpoint=https://seniorprojetblob.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-12-21T03:02:04Z&st=2023-10-27T18:02:04Z&spr=https&sig=2r2wGTSMIMZTvue5v0PGgBydGD4n8i9CImSfjZlBTYI%3D";
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const container_Client = blobServiceClient.getContainerClient(container_name)
    listBlobHierarchical(container_Client,"")
  }

//-----------------------------------------------------------------------------------------------------------------
  //Displays the names of the files stored in the blob onto the UI
  async function listBlobHierarchical(containerClient, prefixStr) {

    // page size - artificially low as example
    const maxPageSize = 2;
    const files = [];
    var count  = 0;
  
    // some options for filtering list
    const listOptions = {
      includeMetadata: false,
      includeSnapshots: false,
      includeTags: false,
      includeVersions: false,
      prefix: prefixStr
    };
  
    let delimiter = '/';
    let i = 1;
    //document.getElementById("Test").innerHTML=(`Folder ${delimiter}${prefixStr}`);
  
    for await (const response of containerClient
      .listBlobsByHierarchy(delimiter, listOptions)
      .byPage({ maxPageSize })) {
  
      //document.getElementById("Test").innerHTML= (`   Page ${i++}`);
      const segment = response.segment;
  
      if (segment.blobPrefixes) {
  
        // Do something with each virtual folder
        for await (const prefix of segment.blobPrefixes) {
          // build new prefix from current virtual folder
          await listBlobHierarchical(containerClient, prefix.name);
        }
      }
  
      for (const blob of response.segment.blobItems) {
        // Do something with each blob
        //document.getElementById("Test").innerHTML=(`\tBlobItem: name - ${blob.name}`);
        files[count] = (` ${blob.name}`);
        count++;
      }
    }
    document.getElementById("Test").innerHTML = ('File List:' + files.toString());
  }

//-----------------------------------------------------------------------------------------------------------------
  //When triggered by the user, it displays the Delete specific UI to the screen
  function Delete(props){
   
   const ref = useRef();
   const handleSubmit = (e) => {
    e.preventDefault();
    connection("dobfiletest",ref.current.value);
   };

//-----------------------------------------------------------------------------------------------------------------
    //HTML formatting code that displays the Delete subwindow information as well as determines the button functionality
    return(props.trigger) ? (
      <div className="Delete">
          <form onSubmit= {handleSubmit}>
          <label>
          File_Name:
          <input type="text" ref ={ref} />
          </label>
          <button type = "Submit">
          <stong>Delete File</stong>
          </button>
          <p onLoad={connectionList("dobfiletest","")}>
            Please input the file name with its type. Example: Text.txt, image.png, Photo1.jpeg
          </p>
          <p id ="Test"></p>
          </form>
            <button className="close-btn" onClick={() => props.setTrigger(false)}>
            <strong>Close</strong>
            </button>
            {props.children}
        </div>
    ):"";

}

export default Delete