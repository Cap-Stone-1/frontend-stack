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

        <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-6 rounded-[10px] bg-sky-100 px-8 py-8 shadow-lg shadow-black/20"
        >
            <h1 className="text-2xl font-semibold text-slate-800">Create a Poll</h1>

            <div className="flex flex-col gap-1">
                <label htmlFor="titleInpt" className="text-sm font-medium text-slate-700">title</label>
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
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                />
                <p className="text-sm text-red-500">{errorMessages.title}</p>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="descriptionTxt" className="text-sm font-medium text-slate-700">description</label>
                <textarea
                    id="descriptionTxt"
                    placeholder="Enter the description"
                    name="txt"
                    value={formData.txt}
                    minLength={MIN_DESCRIPTION_LENGTH}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="min-h-24 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                ></textarea>
                <span className="text-xs text-slate-400">{Array.from(formData.txt).length}/{MAX_DESCRIPTION_LENGTH}</span>
                <p className="text-sm text-red-500">{errorMessages.txt}</p>
            </div>

            <div className="flex flex-col gap-4">
                {
                    allOptions.map((option, index) => {
                        return (
                            // node to style as a group (e.g. flex layout with the upcoming remove button)
                            <div key={index} className="flex flex-col gap-1">
                                <label htmlFor={index} className="text-sm font-medium text-slate-700">Option {index + 1}:</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        name={`option${index}`}
                                        id={index}
                                        value={option}
                                        maxLength={MAX_OPTION_LENGTH}
                                        minLength={MIN_OPTION_LENGTH}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                                    />
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

                                            setErrorMessages((prevErrors) => {
                                                return {
                                                    ...prevErrors,
                                                    [`{option${index}}`]: ""
                                                }
                                            })
                                        }}
                                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-40"
                                    >Remove Option</button>
                                </div>
                                <p className="text-sm text-red-500">{errorMessages[`option${index}`]}</p>
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
                className="self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >+add Option</button>

            <button
                type="submit"
                disabled={loading || Object.values(errorMessages).some((eachObjErr) => eachObjErr !== "")}
                className="rounded-lg bg-slate-800 py-3 text-base font-medium text-white hover:bg-slate-700 disabled:opacity-40"
            >Create Poll</button>

            {/* ADDED: surfaces the loading/error/success state that was already being tracked but never shown */}
            {loading && <p className="text-sm text-slate-500">Submitting...</p>}
            {fetchError && <p className="text-sm text-red-500">{fetchError}</p>}
            {fetchSuccess && <p className="text-sm text-emerald-600">{fetchSuccess}</p>}
        </form>
    )
}