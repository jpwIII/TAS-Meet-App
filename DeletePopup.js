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
  
    alert(`deleted blob ${blobName}`);
  
  }

  async function connection(container_name,blobName){
    const connStr = "BlobEndpoint=https://seniorprojetblob.blob.core.windows.net/;QueueEndpoint=https://seniorprojetblob.queue.core.windows.net/;FileEndpoint=https://seniorprojetblob.file.core.windows.net/;TableEndpoint=https://seniorprojetblob.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-12-21T03:02:04Z&st=2023-10-27T18:02:04Z&spr=https&sig=2r2wGTSMIMZTvue5v0PGgBydGD4n8i9CImSfjZlBTYI%3D";
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const container_Client = blobServiceClient.getContainerClient(container_name)
    DeleteButton(container_Client,blobName)
  }



  
  
  function DeletePopup(props){
   
   const ref = useRef();
   const handleSubmit = (e) => {
    e.preventDefault();
    connection("dobfiletest",ref.current.value);
   };
   
    
    
   
  
    return(props.trigger) ? (
      <div className="Popup">
          <div className="popup-inner">
          </div>
          <form onSubmit= {handleSubmit}>
          <label>
          File_Name:
          <input type="text" ref ={ref} />
          </label>
          <button type = "Submit">
            Delete File
          </button>
          <p>
            To delete input a file exactly as so: File.txt should be inputted as File.txt
          </p>
          </form>
            <button className="close-btn" onClick={() => props.setTrigger(false)}>
                close
            </button>
            {props.children}
        </div>
    ):"";

}

export default DeletePopup