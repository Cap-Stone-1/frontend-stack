import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import RadioButton from "./RadioButton";

export default function PollCards({ poll }) {
    const [flipped, setFlipped] = useState(false);
    const [allOptions, setAllOptions] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [description, setDescription] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [voted, setVoted] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const submitHandler = async (e) => {
        e.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${apiUrl}/polls/${poll.id}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ optionId: selectedOptionId })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    return null;
                })

                setSubmitError(
                    errorData?.error || `Your vote was not counted. Status: ${response.status}`
                )

                return;
            }

            const vote = await response.json();

            setTotalVotes(totalVotes + 1)
            setVoted(true);
            setFlipped(false);

        } catch (err) {

            setSubmitError(err.message);
        }
    }


    const cardFlipper = () => {
        setFlipped((preval) => {
            return !preval;
        })
    }


    useEffect(() => {
        // if (flipped) return;

        const fetchPollDetails = async () => {
            const apiUrl = import.meta.env.VITE_API_URL;
            setLoading(true);

            try {
                const response = await fetch(`${apiUrl}/polls/${poll.id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        return null;
                    })

                    setError(
                        errorData?.error || `Could not retrieve Poll. Status: ${response.status}`
                    )

                    return;
                }

                const data = await response.json();

                const allVotes = data.options.reduce((acc, singOption) => {
                    acc += singOption.voteCount

                    return acc;
                }, 0);

                setAllOptions(data.options);
                setTotalVotes(allVotes);
                setDescription(data.description);

                setError("");
            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);
            }
        }

        fetchPollDetails();
    }, [])


    return (
        <div
            onClick={cardFlipper}
            className="h-112 w-96 flex flex-col cursor-pointer rounded-[10px] bg-sky-100 px-6 py-6 shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-2"
        >
            {
                !flipped ? (
                    <>
                        <h2 className="text-2xl font-semibold text-slate-800">{poll.title}</h2>

                        {
                            voted ? <p className="mt-2 text-base text-emerald-600">You have already voted</p> : ""
                        }
                    </>
                ) : loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <form onSubmit={submitHandler} className="flex h-full flex-col">
                        <h3 className="text-xl font-medium text-slate-700">{description}</h3>
                        <span className="mt-1 text-sm text-slate-400">{totalVotes} votes</span>

                        <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto">
                            {
                                allOptions.map((option) => {
                                    return <RadioButton
                                        key={option.id}
                                        optionObj={option}
                                        selectedOptionId={selectedOptionId}
                                        onSelect={setSelectedOptionId}
                                        disabled={voted}
                                    />
                                })
                            }
                        </div>

                        {submitError && <p className="mt-2 text-sm text-red-500">{submitError}</p>}

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`results/${poll.id}`)
                            }}
                            className="mt-2 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >See the Details</button>

                        <button
                            type="submit"
                            disabled={selectedOptionId === "" || voted}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 rounded-lg bg-slate-800 py-3 text-base font-medium text-white hover:bg-slate-700 disabled:opacity-40"
                        >
                            Vote
                        </button>
                    </form>
                )
            }
        </div>
    )
}