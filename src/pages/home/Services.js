import { useState, useEffect } from "react";
import { Output } from "../home/Output";
import { useLocation } from "react-router-dom";

export const ServiceButtons = ({ services }) => {
    const location = useLocation();
    const [ipAddress, setIpAddress] = useState(""); // State for IP address input
    const [serviceData, setServiceData] = useState(null); // State for service data
    const [activeService, setActiveService] = useState(null); // Track active service

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const ip = queryParams.get("ip");
        if (ip) {
            setIpAddress(ip);
        }
    }, [location]);

    const getIpFromUser = async (serviceName) => {
        try {
            const response = await fetch(
                `http://localhost:8000/${serviceName.toLowerCase()}?ip=${ipAddress}`
            );
            const data = await response.json();
            if (response.ok) {
                setServiceData({ data, serviceName }); // Include service name in state
            } else {
                setServiceData({ error: data.error, serviceName });
            }
        } catch (err) {
            setServiceData({ error: "Error connecting to backend", serviceName });
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                {services.map((service) => (
                    <div key={service.id}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <button
                                className="Button"
                                onClick={() =>
                                    setActiveService(
                                        service.id === activeService ? null : service.id
                                    )
                                }
                                style={{
                                    transition: "transform 0.3s ease",
                                    transform:
                                        activeService === service.id ? "translateX(-100px)" : "translateX(0)",
                                }}
                            >
                                {service.name}
                            </button>

                            {activeService === service.id && (
                                <>
                                    <input
                                        value={ipAddress}
                                        onChange={(e) => setIpAddress(e.target.value)}
                                        placeholder="IP/URL"
                                        style={{ marginLeft: "10px" }}
                                    />
                                    <button
                                        className="submitButtons1"
                                        onClick={() => setActiveService(null)}
                                        style={{ color: "red", marginLeft: "5px" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="submitButtons2"
                                        onClick={() => getIpFromUser(service.name)}
                                        style={{ color: "green", marginLeft: "5px" }}
                                    >
                                        Send
                                    </button>
                                </>
                            )}
                        </div>
                        <br />
                        <br />
                    </div>
                ))}
            </div>
            <Output data={serviceData?.data} serviceName={serviceData?.serviceName} />
        </div>
    );
};
