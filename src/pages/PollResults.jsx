import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";


export default function PollResults() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const numberId = Number(id);

    const [options, setOptions] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const fetchingData = async () => {
            const apiUrl = import.meta.env.VITE_API_URL;
            setLoading(true);

            try {
                const response = await fetch(`${apiUrl}/polls/${numberId}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        return null;
                    })

                    setError(
                        errorData?.error || `Could not retrieve Poll results. Status: ${response.status}`
                    )

                    return;
                }

                const data = await response.json();

                const allVotes = data.options.reduce((acc, singOption) => {
                    acc += singOption.voteCount

                    return acc;
                }, 0);

                setOptions(data.options);
                setTotalVotes(allVotes);
                setDescription(data.description);

            } catch (err) {
                setError(err.message);

            } finally {
                setLoading(false);
            }
        }

        fetchingData();
    }, [])

    const leadingOptionCount = Math.max(...options.map((singOpt) => {
        return singOpt.voteCount
    }));


    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-8 rounded-[10px] bg-white px-10 py-10 shadow-lg shadow-black/20">
            <div className="flex items-baseline justify-between">
                <h2 className="text-3xl font-bold text-slate-900">{description}</h2>
                <span className="text-base text-slate-400">{totalVotes.toLocaleString()} votes</span>
            </div>

            <div className="flex flex-col gap-6">
                {
                    options.map((option) => {
                        const percentage = totalVotes !== 0 ? Number(((option.voteCount / totalVotes) * 100).toFixed(0)) : 0;

                        return (
                            <div key={option.id} className="flex flex-col gap-2">
                                <div className="flex items-baseline justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-semibold text-slate-800">{option.text}</span>
                                        {
                                            option.voteCount === leadingOptionCount && option.voteCount !== 0 ? <span className="text-sm font-normal text-slate-400">leading</span> : ""
                                        }
                                    </div>

                                    <div className="flex items-baseline gap-4">
                                        <span className="text-base text-slate-400">{option.voteCount.toLocaleString()}</span>
                                        <span className="text-lg font-bold text-slate-800">{percentage}%</span>
                                    </div>
                                </div>

                                <div className="h-3 w-full rounded-full bg-slate-200">
                                    {/* ADDED: leading option keeps the original bg-indigo-600, every other
                                        option now gets a lighter bg-indigo-300 fill so the leader stands out */}
                                    <div
                                        className={`h-3 rounded-full ${option.voteCount === leadingOptionCount ? "bg-indigo-600" : "bg-indigo-300"}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <button
                type="button"
                onClick={() => {
                    navigate('/')
                }}
                className="self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >Go Back</button>
        </div>
    )
}