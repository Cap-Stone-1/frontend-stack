import { useState, useEffect } from "react";

const MIN_DESCRIPTION_LENGTH = 10;
const MIN_TITLE_LENGTH = 5;

const MAX_DESCRIPTION_LENGTH = 500;
const MAX_TITLE_LENGTH = 100;

const titleHelperTxt = "Title should have at least 5 characters";
const descriptionHelperTxt = "Description should have at least 10 characters";


function CreatePoll() {
    const [errorMessages, setErrorMessages] = useState({titleInpt: "", txtInpt:""});

    return (

        <form>
            <div>
                <label htmlFor="titleInpt">title</label>
                <input 
                    type="text" 
                    id="titleInpt" 
                    placeholder="Enter the title"
                    name="titleInpt"
                    minLength={MIN_TITLE_LENGTH}
                    maxLength={MAX_TITLE_LENGTH}
                />
            </div>

            <textarea 
                placeholder="Enter the description" 
                name="txtInpt"
                minLength={MIN_DESCRIPTION_LENGTH}
                maxLength={MAX_DESCRIPTION_LENGTH}
            ></textarea>

                
        </form>
    )
}