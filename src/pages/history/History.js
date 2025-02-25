import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const History = () => {
    const location = useLocation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [service, setService] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const qry = queryParams.get("query");
        if (qry) {
            setQuery(qry);
        }
    }, [location]);

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/history/${service.toLowerCase()}?query=${query}`
            );
            const data = await response.json();
            if (data.results) {
                setResults(data.results);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error("Error fetching history", err);
        }
    };

    return (
        <div style={{ padding: "50px 0" }}>
            <div id="history">The Secrets Of The Past: </div>
            <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                id="select_service"
                style={{ marginLeft: "10px" }}
            >
                <option value="">Select a service</option>
                <option value="Shodan">Shodan</option>
                <option value="Nmap">Nmap</option>
            </select>
            <input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="IP/URL"
                style={{ marginLeft: "10px" }}
            />
            <button
                className="submitButtons1"
                onClick={() => {
                    document.getElementById("query").value = "";
                }}
                style={{ color: "red", marginLeft: "5px" }}
            >
                Cancel
            </button>
            <button
                onClick={handleSearch}
                className="submitButtons2"
                style={{ color: "green", marginLeft: "5px" }}
            >
                Send
            </button>
            <br />
            <br />
            <br />
            <div id="hist">
                {results.map((result) => (
                    <div>
                        <div>
                            <strong>Service:</strong> {result.service}
                        </div>
                        <div>
                            <strong>Time:</strong> {result.time}
                        </div>
                        <div>
                            <strong>Data:</strong> {result.data}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
