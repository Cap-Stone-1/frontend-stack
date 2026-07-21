import { useState, useEffect } from "react";

import RadioButton from "./RadioButton";

export default function PollCards({ poll }) {
    const [flipped, setFlipped] = useState(false);
    const [allOptions, setAllOptions] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [description, setDescription] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState("");
    const [submitError, setSubmitError] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const submitHandler = async (e) => {
        e.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${apiUrl}/polls/${poll.id}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({optionId: selectedOptionId})
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
        if (!flipped) return;

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
    }, [flipped])


    if (loading) return <p>Loading...</p>

    if (error) return <p>{error}</p>


    return (
        <div onClick={cardFlipper}>
            {
                !flipped ? (
                    <h2>{poll.title}</h2>

                ) : (

                    <form onSubmit={submitHandler}>
                        <h3>{description}</h3>
                        <span>{totalVotes}</span>

                        {
                            allOptions.map((option) => {
                                return <RadioButton
                                    key={option.id}
                                    optionObj={option}
                                    selectedOptionId={selectedOptionId}
                                    onSelect={setSelectedOptionId}
                                />
                            })
                        }

                        {submitError && <p>{submitError}</p>}

                        <button type="submit" disabled={selectedOptionId === ""}>Vote</button>
                    </form>
                )
            }
        </div>
    )
}