import * as Blockly from 'blockly/core'

//Saves the workspace out to a JSON file and downloads it
//Creates and destroys a link element to a blob URL referencing the serialized workspace
export const saveWorkspace = (ws) => {

    const wsJSON = Blockly.serialization.workspaces.save(ws)
    const asString = JSON.stringify(wsJSON)

    const jsonBlob = new Blob( [asString], {
        type: "application/json",
    });

    const blobURL = URL.createObjectURL(jsonBlob)
    var link = document.createElement("a");
    link.href = blobURL;
    link.download = "workspace";

    link.click()
    link.remove()
}

//Loads a workspace encapsulated within a JSON file
//Creates then destroys an input element to read in the file
export const loadWorkspace = (ws) => {
    var input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.addEventListener("change", (event) => fileSelect(event, ws))
    
    input.click()
    input.remove()
}

//Helper function since opening a file select dialog is somewhat involved
//Largely from the MDN docs
function fileSelect(event, ws){
    const file = event.target.files[0]

    if(file){
        const fileReader = new FileReader();

        fileReader.onload = () => {
            try{
                const wsJSON = JSON.parse(fileReader.result);
                Blockly.serialization.workspaces.load(wsJSON, ws)
            }
            catch(error){
                console.log("Couldn't parse JSON.");
                console.log(error)
                return
            }
        }

        fileReader.onerror = () => {
            console.log("Something went wrong with the file upload.")
            return
        }

        fileReader.readAsText(file);
    }
}
