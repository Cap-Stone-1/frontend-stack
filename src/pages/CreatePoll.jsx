import { useState } from "react";
import { useNavigate } from "react-router";

const MIN_DESCRIPTION_LENGTH = 20;
const MIN_TITLE_LENGTH = 10;
const MIN_OPTION_LENGTH = 2;

const MAX_DESCRIPTION_LENGTH = 500;
const MAX_TITLE_LENGTH = 100;
const MAX_OPTION_LENGTH = 60;

// ADDED: minimum/maximum number of options a poll can have (distinct from
// MIN_OPTION_LENGTH/MAX_OPTION_LENGTH, which limit each option's text length)
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;


const validatedInputs = (name, value) => {
    const trimmedVal = value.trim();

    if (name === "title") {

        if (!trimmedVal) {
            return "Title is required.";
        }

        if (Array.from(trimmedVal).length < MIN_TITLE_LENGTH) {
            return `Title must contain at least ${MIN_TITLE_LENGTH} characters.`;
        }

        if (Array.from(trimmedVal).length > MAX_TITLE_LENGTH) {
            return `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
        }
    }


    if (name === "txt") {

        if (Array.from(trimmedVal).length < MIN_DESCRIPTION_LENGTH && trimmedVal) {
            return `Description must contain at least ${MIN_DESCRIPTION_LENGTH} characters.`;
        }

        if (Array.from(trimmedVal).length > MAX_DESCRIPTION_LENGTH) {
            return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
        }
    }

    if (name.startsWith("option")) {

        if (!trimmedVal) {
            return "Option is required.";
        }

        if (Array.from(trimmedVal).length < MIN_OPTION_LENGTH) {
            return `Option must contain at least ${MIN_OPTION_LENGTH} characters`;
        }

        if (Array.from(trimmedVal).length > MAX_OPTION_LENGTH) {
            return `Option can not exceed ${MAX_OPTION_LENGTH} characters`;
        }
    }

    return "";
}


export default function CreatePoll() {
    const [formData, setFormData] = useState({ title: "", txt: "" })
    const [allOptions, setAllOptions] = useState(["", ""]);
    const [errorMessages, setErrorMessages] = useState({ title: "", txt: "" });
    const [isTouched, setIsTouched] = useState({ title: false, txt: false });

    const [fetchError, setFetchError] = useState("");
    const [fetchSuccess, setFetchSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, id } = e.target;
        const numberedId = id !== "" ? Number(id) : null;

        if (!Number.isNaN(numberedId) && Number.isFinite(numberedId)) {
            // FIX: use the updater-function form instead of reading `allOptions` directly,
            // consistent with setFormData/setIsTouched/setErrorMessages elsewhere in this file
            setAllOptions((prevOptions) => prevOptions.map((option, index) => {
                return index === numberedId ? value : option;
            }))

        } else {
            setFormData(
                (prevVals) => {
                    return {
                        ...prevVals,
                        [name]: value
                    }
                }
            )
        }

        if (isTouched[name]) {
            setErrorMessages((prevErrors) => {
                return {
                    ...prevErrors,
                    [name]: validatedInputs(name, value)
                }
            })
        }
    }


    const handleBlur = (e) => {
        const { name, value } = e.target;

        setIsTouched((prevTouched) => {
            return {
                ...prevTouched,
                [name]: true
            }
        })

        setErrorMessages((prevErrors) => {
            return {
                ...prevErrors,
                [name]: validatedInputs(name, value)
            }
        })
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setFetchSuccess("");
        setFetchError("")

        const newErrors = {
            title: validatedInputs("title", formData.title),
            txt: validatedInputs("txt", formData.txt),
        }

        allOptions.forEach((option, index) => {
            newErrors[`option${index}`] = validatedInputs(`option${index}`, option);
        })


        setErrorMessages(newErrors);

        const foundError = Object.values(newErrors).some((err) => {
            return err !== "";
        })

        if (foundError) return;

        // ADDED: safety net in case allOptions ever ends up below the minimum
        // (the Remove Option buttons already prevent this through the UI)
        if (allOptions.length < MIN_OPTIONS) {
            setFetchError(`A poll needs at least ${MIN_OPTIONS} options.`);
            return;
        }

        const resultObj = {
            title: formData.title.trim(),
            description: formData.txt.trim(),
            options: allOptions.map((eachOpt) => {
                return eachOpt.trim();
            })
        }

        const apiUrl = import.meta.env.VITE_API_URL;
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/polls`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(resultObj)
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => {
                    return null;
                })

                setFetchError(
                    errData?.error || `Could not create the Poll. Status: ${response.status}`
                )

                return;
            }

            const data = await response.json();

            setFetchSuccess("Poll was created successfully");

            setTimeout(() => {
               navigate('/'); 
            }, 2000);

        } catch (err) {

            setFetchError(err.message);
        
        } finally {
            setLoading(false)
        }
    }


    return (

        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="titleInpt">title</label>
                <input
                    type="text"
                    id="titleInpt"
                    placeholder="Enter the title"
                    name="title"
                    value={formData.title}
                    minLength={MIN_TITLE_LENGTH}
                    maxLength={MAX_TITLE_LENGTH}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <p>{errorMessages.title}</p>
            </div>

            <div>
                <label htmlFor="descriptionTxt">description</label>
                <textarea
                    id="descriptionTxt"
                    placeholder="Enter the description"
                    name="txt"
                    value={formData.txt}
                    minLength={MIN_DESCRIPTION_LENGTH}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={handleChange}
                    onBlur={handleBlur}
                ></textarea>
                <span>{Array.from(formData.txt).length}/{MAX_DESCRIPTION_LENGTH}</span>
                <p>{errorMessages.txt}</p>
            </div>

            <div>
                {
                    allOptions.map((option, index) => {
                        return (
                            // node to style as a group (e.g. flex layout with the upcoming remove button)
                            <div key={index}>
                                <label htmlFor={index}>Option {index + 1}:</label>
                                <input
                                    type="text"
                                    name={`option${index}`}
                                    id={index}
                                    value={option}
                                    maxLength={MAX_OPTION_LENGTH}
                                    minLength={MIN_OPTION_LENGTH}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <p>{errorMessages[`option${index}`]}</p>
                                <button
                                    type="button"
                                    // ADDED: disables every Remove button once only MIN_OPTIONS remain,
                                    // so the user can't delete their way below the minimum a poll needs
                                    disabled={allOptions.length <= MIN_OPTIONS}
                                    onClick={() => {
                                        setAllOptions((prevOptions) => {
                                            return prevOptions.filter((_, i) => {
                                                return i !== index;
                                            })
                                        })
                                    }}
                                >Remove Option</button>
                            </div>

                        )
                    })
                }
            </div>


            <button
                type="button"
                onClick={() => {
                    setAllOptions([...allOptions, ""]);
                }}
                disabled={allOptions.length >= MAX_OPTIONS}
            >+add Option</button>
            <button type="submit" disabled={loading || Object.values(errorMessages).some((eachObjErr) => eachObjErr !== "")}>Create Poll</button>

            {/* ADDED: surfaces the loading/error/success state that was already being tracked but never shown */}
            {loading && <p>Submitting...</p>}
            {fetchError && <p>{fetchError}</p>}
            {fetchSuccess && <p>{fetchSuccess}</p>}
        </form>
    )
}