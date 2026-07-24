import { useState, useEffect } from "react";

import PollCards from "../components/PollCards";

function Home() {
    const [polls, setPolls] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchingPolls = async () => {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;

            try {
                const response = await fetch(`${apiUrl}/polls`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        return null;
                    })

                    setErrorMessage(
                        errorData?.error || `Could not retrieve existing Polls. Status: ${response.status}`
                    )

                    return;
                }

                const data = await response.json();

                setPolls(data);
                setErrorMessage("");

            } catch (err) {
                setErrorMessage(err.message);

            } finally {
                setLoading(false);
            }
        }

        fetchingPolls();
    }, [])


    if (loading) return <p>Loading...</p>

    if (errorMessage !== "") return <p>{errorMessage}</p>

    return (
        <section className="grid grid-cols-3 gap-6 justify-items-center p-8">
            {
                polls.length === 0 ? <p className="col-span-3 text-center text-slate-500">No polls yet to display... Be the first to add some</p> : (
                    polls.map((poll) => {
                        return <PollCards key={poll.id} poll={poll} />
                    })
                )
            }
        </section>
    )
}


export default Home;